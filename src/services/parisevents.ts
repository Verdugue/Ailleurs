import type { RealEvent } from './events'

/**
 * Fournisseur « Que faire à Paris ? » — open data officiel de la Ville de Paris.
 * Gratuit, sans clé API. https://opendata.paris.fr
 */

const BASE = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records'
const CACHE_TTL_MS = 15 * 60 * 1000

interface QfapRecord {
  id?: string | number
  url?: string
  title?: string
  lead_text?: string
  description?: string
  date_start?: string
  date_end?: string
  cover_url?: string
  address_name?: string
  address_street?: string
  address_zipcode?: string
  lat_lon?: { lat?: number; lon?: number }
  price_type?: string
  price_detail?: string
  access_link?: string
  contact_organisation_name?: string
  qfap_tags?: string | string[]
}

function stripHtml(html?: string): string | undefined {
  if (!html) return undefined
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > 0 ? text : undefined
}

function firstTag(tags?: string | string[]): string | undefined {
  if (Array.isArray(tags)) return tags[0]
  if (typeof tags === 'string') return tags.split(';')[0]?.trim()
  return undefined
}

function formatPrice(r: QfapRecord): string | undefined {
  if (r.price_type === 'gratuit') return 'Gratuit'
  const detail = stripHtml(r.price_detail)
  if (detail && detail.length <= 30) return detail
  return r.price_type ? 'Payant' : undefined
}

function toRealEvent(r: QfapRecord): RealEvent {
  const start = r.date_start ? new Date(r.date_start) : undefined
  const timePart = r.date_start?.slice(11, 16)
  const desc = stripHtml(r.description)

  return {
    id: `paris_${r.id}`,
    source: 'Que faire à Paris ?',
    name: r.title ?? 'Événement',
    url: r.access_link ?? r.url,
    image: r.cover_url,
    images: r.cover_url ? [r.cover_url] : [],
    iso: r.date_start?.slice(0, 10),
    day: start ? String(start.getDate()).padStart(2, '0') : '–',
    month: start ? start.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') : '',
    dateText: start
      ? start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Date à confirmer',
    time: timePart && timePart !== '00:00' ? timePart.replace(':', 'h') : undefined,
    category: firstTag(r.qfap_tags) ?? 'Événement',
    venue: r.address_name,
    venueAddress: [r.address_street, r.address_zipcode].filter(Boolean).join(', '),
    venueCity: 'Paris',
    venueCountry: 'France',
    venueCoords:
      r.lat_lon?.lat !== undefined && r.lat_lon?.lon !== undefined
        ? { lat: r.lat_lon.lat, lon: r.lat_lon.lon }
        : undefined,
    priceText: formatPrice(r),
    info: stripHtml(r.lead_text),
    note: desc ? `${desc.slice(0, 300)}${desc.length > 300 ? '…' : ''}` : undefined,
    promoter: r.contact_organisation_name,
  }
}

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw) as { at: number; data: T }
    return Date.now() - at < CACHE_TTL_MS ? data : null
  } catch {
    return null
  }
}

function writeCache(key: string, data: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // cache optionnel
  }
}

/** Événements parisiens à venir (open data Ville de Paris). */
export async function qfapUpcomingEvents(): Promise<RealEvent[]> {
  const cacheKey = 'ailleurs:qfap2:list'
  const cached = readCache<RealEvent[]>(cacheKey)
  if (cached) return cached

  const today = new Date().toISOString().slice(0, 10)
  const params = new URLSearchParams({
    where: `date_start>=date'${today}'`,
    order_by: 'date_start',
    limit: '60',
  })
  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error(`Open Data Paris HTTP ${res.status}`)

  const json = (await res.json()) as { results?: QfapRecord[] }
  const events = (json.results ?? []).map(toRealEvent)

  writeCache(cacheKey, events)
  return events
}

/** Détail d'un événement parisien (identifiant brut, sans préfixe). */
export async function qfapEventById(rawId: string): Promise<RealEvent> {
  const cacheKey = `ailleurs:qfap:ev:${rawId}`
  const cached = readCache<RealEvent>(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({ where: `id="${rawId}"`, limit: '1' })
  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error(`Open Data Paris HTTP ${res.status}`)

  const json = (await res.json()) as { results?: QfapRecord[] }
  const record = json.results?.[0]
  if (!record) throw new Error('Événement introuvable')

  const event = toRealEvent(record)
  writeCache(cacheKey, event)
  return event
}
