import type { City } from '../types'
import type { RealEvent } from './events'

/**
 * Fournisseur OpenAgenda — la plateforme des agendas culturels français
 * (villes, métropoles, offices de tourisme, salles…). Clé gratuite requise :
 * https://openagenda.com -> compte -> paramètres -> clé API.
 *
 * La clé publique ne donne pas accès à la recherche globale : on cherche
 * d'abord les agendas de la ville, puis leurs événements (filtrés par zone).
 * Les requêtes passent par le proxy Vite (/api/oa).
 */

const KEY = import.meta.env.VITE_OPENAGENDA_KEY?.trim()

/** true si une clé OpenAgenda est configurée dans .env */
export const hasOpenAgendaKey = Boolean(KEY && KEY !== 'COLLE_TA_CLE_ICI')

const BASE = '/api/oa/v2'
const CACHE_TTL_MS = 15 * 60 * 1000
const AGENDA_CACHE_TTL_MS = 60 * 60 * 1000

interface OaText {
  fr?: string
  en?: string
  [lang: string]: string | undefined
}

// événements administratifs / professionnels sans intérêt pour un voyageur
const OA_BLACKLIST =
  /(emploi|recrutement|recrute|job|tous ?mobilisés|aide à la personne|mission locale|france travail|alternance|insertion professionnelle|atelier cv|\bcv\b|permanence|conseil municipal|conseil communautaire|démarches|orientation scolaire|réunion publique|enquête publique|inscription scolaire|don du sang|dépistage|vaccination|formation professionnelle|webinaire|visioconférence)/i

interface OaAgenda {
  uid: number
  slug?: string
  title?: string
  official?: boolean
}

interface OaEvent {
  uid?: number | string
  slug?: string
  title?: OaText | string
  description?: OaText | string
  dateRange?: OaText | string
  keywords?: { fr?: string[] } | string[]
  image?: { base?: string; filename?: string } | string | null
  conditions?: OaText | string
  nextTiming?: { begin?: string; end?: string }
  firstTiming?: { begin?: string; end?: string }
  timings?: { begin?: string; end?: string }[]
  location?: {
    name?: string
    address?: string
    city?: string
    latitude?: number
    longitude?: number
  }
  originAgenda?: { uid?: number | string; title?: string }
}

function text(v: OaText | string | undefined): string | undefined {
  if (!v) return undefined
  if (typeof v === 'string') return v.trim() || undefined
  const first = v.fr ?? v.en ?? Object.values(v).find(Boolean)
  return first?.trim() || undefined
}

function stripHtml(html?: string): string | undefined {
  if (!html) return undefined
  const t = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  return t || undefined
}

function imageUrl(img: OaEvent['image']): string | undefined {
  if (!img) return undefined
  if (typeof img === 'string') return img
  if (img.filename) return `${img.base ?? 'https://cdn.openagenda.com/main/'}${img.filename}`
  return undefined
}

function firstKeyword(k: OaEvent['keywords']): string | undefined {
  if (Array.isArray(k)) return k[0]
  return k?.fr?.[0]
}

function toRealEvent(e: OaEvent, queriedAgenda?: OaAgenda): RealEvent {
  const beginIso = e.nextTiming?.begin ?? e.firstTiming?.begin ?? e.timings?.[0]?.begin
  const begin = beginIso ? new Date(beginIso) : undefined
  const timePart = beginIso?.slice(11, 16)
  const conditions = stripHtml(text(e.conditions))
  const detailAgendaUid = e.originAgenda?.uid ?? queriedAgenda?.uid
  const img = imageUrl(e.image)

  return {
    id: `oa_${detailAgendaUid}_${e.uid}`,
    source: 'OpenAgenda',
    name: text(e.title) ?? 'Événement',
    url:
      queriedAgenda?.slug && e.slug
        ? `https://openagenda.com/fr/${queriedAgenda.slug}/events/${e.slug}`
        : undefined,
    image: img,
    images: img ? [img] : [],
    iso: beginIso?.slice(0, 10),
    day: begin ? String(begin.getDate()).padStart(2, '0') : '–',
    month: begin ? begin.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') : '',
    dateText: begin
      ? begin.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : (text(e.dateRange) ?? 'Date à confirmer'),
    time: timePart && timePart !== '00:00' ? timePart.replace(':', 'h') : undefined,
    category: firstKeyword(e.keywords) ?? 'Culture',
    venue: e.location?.name,
    venueAddress: e.location?.address,
    venueCity: e.location?.city,
    venueCountry: 'France',
    venueCoords:
      e.location?.latitude !== undefined && e.location?.longitude !== undefined
        ? { lat: e.location.latitude, lon: e.location.longitude }
        : undefined,
    priceText: conditions && conditions.length <= 30 ? conditions : undefined,
    info: stripHtml(text(e.description)),
    note: text(e.dateRange),
    promoter: e.originAgenda?.title ?? queriedAgenda?.title,
  }
}

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { at, data, ttl } = JSON.parse(raw) as { at: number; data: T; ttl?: number }
    return Date.now() - at < (ttl ?? CACHE_TTL_MS) ? data : null
  } catch {
    return null
  }
}

function writeCache(key: string, data: unknown, ttl?: number): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data, ttl }))
  } catch {
    // cache optionnel
  }
}

/** Les agendas OpenAgenda les plus pertinents pour une ville (officiels d'abord). */
async function searchAgendas(cityName: string): Promise<OaAgenda[]> {
  const cacheKey = `ailleurs:oa:agendas:${cityName.toLowerCase()}`
  const cached = readCache<OaAgenda[]>(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({ key: KEY as string, search: cityName, size: '5' })
  const res = await fetch(`${BASE}/agendas?${params}`)
  if (!res.ok) throw new Error(`OpenAgenda HTTP ${res.status}`)

  const json = (await res.json()) as { agendas?: OaAgenda[] }
  const agendas = (json.agendas ?? [])
    .filter((a) => a.uid)
    .sort((a, b) => Number(b.official ?? false) - Number(a.official ?? false))
    .slice(0, 2)

  writeCache(cacheKey, agendas, AGENDA_CACHE_TTL_MS)
  return agendas
}

/** Événements à venir d'un agenda, limités à une zone (~15 km) autour du centre. */
async function agendaEvents(agenda: OaAgenda, city: City): Promise<RealEvent[]> {
  const dLat = 0.15
  const dLon = 0.15 / Math.max(0.2, Math.cos((city.coords.lat * Math.PI) / 180))
  const params = new URLSearchParams({ key: KEY as string, size: '50' })
  params.append('relative[]', 'upcoming')
  params.append('relative[]', 'current')
  params.set('geo[northEast][lat]', String(city.coords.lat + dLat))
  params.set('geo[northEast][lng]', String(city.coords.lon + dLon))
  params.set('geo[southWest][lat]', String(city.coords.lat - dLat))
  params.set('geo[southWest][lng]', String(city.coords.lon - dLon))

  const res = await fetch(`${BASE}/agendas/${agenda.uid}/events?${params}`)
  if (!res.ok) throw new Error(`OpenAgenda HTTP ${res.status}`)

  const json = (await res.json()) as { events?: OaEvent[] }
  return (json.events ?? []).map((e) => toRealEvent(e, agenda))
}

/** Événements OpenAgenda réels autour d'une ville française. */
export async function oaSearchEvents(city: City): Promise<RealEvent[]> {
  if (!hasOpenAgendaKey) throw new Error('Clé API OpenAgenda manquante')

  const cacheKey = `ailleurs:oa:list2:${city.name.toLowerCase()},${city.coords.lat}`
  const cached = readCache<RealEvent[]>(cacheKey)
  if (cached) return cached

  const agendas = await searchAgendas(city.name)
  if (agendas.length === 0) return []

  const settled = await Promise.allSettled(agendas.map((a) => agendaEvents(a, city)))
  const seen = new Set<string>()
  const events = settled
    .filter((s): s is PromiseFulfilledResult<RealEvent[]> => s.status === 'fulfilled')
    .flatMap((s) => s.value)
    .filter((e) => {
      if (!e.iso || seen.has(e.id)) return false
      if (OA_BLACKLIST.test(`${e.name} ${e.category ?? ''} ${e.promoter ?? ''}`)) return false
      seen.add(e.id)
      return true
    })
    .sort((a, b) => (a.iso ?? '9999').localeCompare(b.iso ?? '9999'))
    .slice(0, 40)

  // pré-remplit le cache des pages détail (elles gardent ainsi le lien de réservation)
  for (const e of events) writeCache(`ailleurs:oa:ev:${e.id.slice(3)}`, e)

  writeCache(cacheKey, events)
  return events
}

/** Détail d'un événement OpenAgenda (identifiant brut « agendaUid_eventUid »). */
export async function oaEventById(rawId: string): Promise<RealEvent> {
  if (!hasOpenAgendaKey) throw new Error('Clé API OpenAgenda manquante')

  const cacheKey = `ailleurs:oa:ev:${rawId}`
  const cached = readCache<RealEvent>(cacheKey)
  if (cached) return cached

  const [agendaUid, eventUid] = rawId.split('_')
  if (!agendaUid || !eventUid) throw new Error('Identifiant OpenAgenda invalide')

  const res = await fetch(`${BASE}/agendas/${agendaUid}/events/${eventUid}?key=${KEY}`)
  if (!res.ok) throw new Error(`OpenAgenda HTTP ${res.status}`)

  const json = (await res.json()) as { event?: OaEvent }
  if (!json.event) throw new Error('Événement introuvable')

  const event = toRealEvent(json.event)
  writeCache(cacheKey, event)
  return event
}
