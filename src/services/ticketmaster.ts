import type { Coords } from '../types'
import type { EventSort, RealEvent } from './events'

/**
 * Fournisseur Ticketmaster Discovery (clé gratuite requise, voir .env.example).
 * Les requêtes passent par le proxy Vite (/api/tm) pour éviter les soucis de CORS.
 */

const KEY = import.meta.env.VITE_TICKETMASTER_KEY?.trim()

/** true si une clé API est configurée dans .env */
export const hasTicketmasterKey = Boolean(KEY && KEY !== 'COLLE_TA_CLE_ICI')

const BASE = '/api/tm/discovery/v2'
const CACHE_TTL_MS = 15 * 60 * 1000

// --- Géohash (le paramètre `geoPoint` de l'API attend un geohash) ---
const B32 = '0123456789bcdefghjkmnpqrstuvwxyz'
function geohash(lat: number, lon: number, precision = 9): string {
  let latMin = -90
  let latMax = 90
  let lonMin = -180
  let lonMax = 180
  let hash = ''
  let bit = 0
  let ch = 0
  let even = true
  while (hash.length < precision) {
    if (even) {
      const mid = (lonMin + lonMax) / 2
      if (lon >= mid) {
        ch |= 1 << (4 - bit)
        lonMin = mid
      } else lonMax = mid
    } else {
      const mid = (latMin + latMax) / 2
      if (lat >= mid) {
        ch |= 1 << (4 - bit)
        latMin = mid
      } else latMax = mid
    }
    even = !even
    if (bit < 4) bit++
    else {
      hash += B32[ch]
      bit = 0
      ch = 0
    }
  }
  return hash
}

interface TmImage {
  url?: string
  width?: number
  height?: number
  ratio?: string
}

interface TmEvent {
  id: string
  name: string
  url?: string
  images?: TmImage[]
  dates?: { start?: { localDate?: string; localTime?: string } }
  classifications?: { segment?: { name?: string }; genre?: { name?: string } }[]
  priceRanges?: { min?: number; max?: number; currency?: string }[]
  info?: string
  pleaseNote?: string
  promoter?: { name?: string }
  _embedded?: {
    venues?: {
      name?: string
      city?: { name?: string }
      country?: { name?: string }
      address?: { line1?: string }
      location?: { latitude?: string; longitude?: string }
    }[]
  }
}

const SEGMENT_FR: Record<string, string> = {
  'Music': 'Musique',
  'Sports': 'Sport',
  'Arts & Theatre': 'Arts & Théâtre',
  'Film': 'Cinéma',
  'Miscellaneous': 'Divers',
}

const CURRENCY: Record<string, string> = { EUR: '€', USD: '$', GBP: '£', CAD: '$ CA', MXN: '$ MX', ZAR: 'R', BRL: 'R$', CZK: 'Kč', TRY: '₺' }

function formatDate(localDate?: string): { iso?: string; day: string; month: string; dateText: string } {
  if (!localDate) return { day: '–', month: '', dateText: 'Date à confirmer' }
  const d = new Date(`${localDate}T12:00:00`)
  return {
    iso: localDate,
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
    dateText: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

function formatTime(localTime?: string): string | undefined {
  if (!localTime) return undefined
  const [h, m] = localTime.split(':')
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`
}

function formatPrice(ranges?: TmEvent['priceRanges']): string | undefined {
  const r = ranges?.[0]
  if (!r || r.min === undefined) return undefined
  const cur = CURRENCY[r.currency ?? ''] ?? r.currency ?? ''
  const min = Math.round(r.min)
  return min === 0 ? 'Gratuit' : `${min} ${cur}`
}

function pickImages(images?: TmImage[]): { main?: string; all: string[] } {
  const usable = (images ?? []).filter((i) => i.url && (i.width ?? 0) >= 400)
  const sorted = [...usable].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))
  const main = sorted.find((i) => i.ratio === '16_9')?.url ?? sorted[0]?.url
  const all = [...new Set(sorted.map((i) => i.url as string))].slice(0, 3)
  return { main, all }
}

function toRealEvent(e: TmEvent): RealEvent {
  const venue = e._embedded?.venues?.[0]
  const lat = venue?.location?.latitude
  const lon = venue?.location?.longitude
  const cls = e.classifications?.[0]
  const segment = cls?.segment?.name
  const genre = cls?.genre?.name
  const { main, all } = pickImages(e.images)

  return {
    id: `tm_${e.id}`,
    source: 'Ticketmaster',
    name: e.name,
    url: e.url,
    image: main,
    images: all,
    ...formatDate(e.dates?.start?.localDate),
    time: formatTime(e.dates?.start?.localTime),
    category: [SEGMENT_FR[segment ?? ''] ?? segment, genre].filter(Boolean).join(' · '),
    venue: venue?.name,
    venueAddress: venue?.address?.line1,
    venueCity: venue?.city?.name,
    venueCountry: venue?.country?.name,
    venueCoords: lat && lon ? { lat: Number(lat), lon: Number(lon) } : undefined,
    priceText: formatPrice(e.priceRanges),
    info: e.info,
    note: e.pleaseNote,
    promoter: e.promoter?.name,
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

/** Événements Ticketmaster autour d'un point (par date ou par pertinence). */
export async function tmSearchEvents(
  center: Coords,
  sort: EventSort = 'date',
  radiusKm = 50,
): Promise<RealEvent[]> {
  if (!hasTicketmasterKey) throw new Error('Clé API Ticketmaster manquante')

  const cacheKey = `ailleurs:tm3:${sort}:${center.lat},${center.lon}`
  const cached = readCache<RealEvent[]>(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({
    apikey: KEY as string,
    geoPoint: geohash(center.lat, center.lon),
    radius: String(radiusKm),
    unit: 'km',
    sort: sort === 'relevance' ? 'relevance,desc' : 'date,asc',
    size: '100',
    // uniquement les événements à venir
    startDateTime: `${new Date().toISOString().slice(0, 19)}Z`,
  })
  const res = await fetch(`${BASE}/events.json?${params}`)
  if (!res.ok) throw new Error(`Ticketmaster HTTP ${res.status}`)

  const json = (await res.json()) as { _embedded?: { events?: TmEvent[] } }
  const events = (json._embedded?.events ?? []).map(toRealEvent).slice(0, 60)

  writeCache(cacheKey, events)
  return events
}

/** Détail d'un événement Ticketmaster (identifiant brut, sans préfixe). */
export async function tmEventById(rawId: string): Promise<RealEvent> {
  if (!hasTicketmasterKey) throw new Error('Clé API Ticketmaster manquante')

  const cacheKey = `ailleurs:tm:ev:${rawId}`
  const cached = readCache<RealEvent>(cacheKey)
  if (cached) return cached

  const res = await fetch(`${BASE}/events/${encodeURIComponent(rawId)}.json?apikey=${KEY}`)
  if (!res.ok) throw new Error(`Ticketmaster HTTP ${res.status}`)

  const event = toRealEvent((await res.json()) as TmEvent)
  writeCache(cacheKey, event)
  return event
}
