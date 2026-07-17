import type { Coords, LodgingType } from '../types'

/**
 * Hébergements réels autour d'un point, via l'API Overpass (OpenStreetMap).
 * Gratuit, sans clé API. Données © contributeurs OpenStreetMap (ODbL).
 */

export interface NearbyLodging {
  osmType: string
  osmId: number
  name: string
  type: LodgingType
  lat: number
  lon: number
  distanceM: number
  stars?: string
  website?: string
  address?: string
}

interface OverpassElement {
  type: string
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

const TYPE_MAP: Record<string, LodgingType> = {
  hotel: 'Hôtel',
  guest_house: "Maison d'hôtes",
  apartment: 'Airbnb',
  hostel: 'Auberge',
}

const CACHE_TTL_MS = 30 * 60 * 1000

function haversineM(a: Coords, b: Coords): number {
  const R = 6371000
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function readCache(key: string): NearbyLodging[] | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw) as { at: number; data: NearbyLodging[] }
    return Date.now() - at < CACHE_TTL_MS ? data : null
  } catch {
    return null
  }
}

function writeCache(key: string, data: NearbyLodging[]): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // stockage plein ou indisponible : on ignore, le cache est optionnel
  }
}

export async function fetchNearbyLodging(center: Coords, radiusM = 1500): Promise<NearbyLodging[]> {
  const cacheKey = `ailleurs:lodging:${center.lat},${center.lon}:${radiusM}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const query =
    `[out:json][timeout:8];` +
    `nwr["tourism"~"^(hotel|guest_house|hostel|apartment)$"]["name"](around:${radiusM},${center.lat},${center.lon});` +
    `out center tags 60;`

  // plusieurs serveurs publics GLOBAUX : au lieu d'attendre le premier (souvent
  // surchargé, ~15 s), on les interroge TOUS en parallèle et on garde la 1re réponse
  // valide. (On évite les miroirs régionaux type overpass.osm.ch qui répondraient
  // vite mais VIDE hors de leur zone, et gagneraient la course à tort.)
  const endpoints = [
    'https://overpass.openstreetmap.fr/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://overpass-api.de/api/interpreter',
  ]
  const body = `data=${encodeURIComponent(query)}`
  const controllers = endpoints.map(() => new AbortController())
  const DEADLINE_MS = 8000
  const timers = controllers.map((c) => setTimeout(() => c.abort(), DEADLINE_MS))

  const attempts = endpoints.map((endpoint, i) =>
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controllers[i].signal,
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`)
      return (await res.json()) as { elements?: OverpassElement[] }
    }),
  )

  let json: { elements?: OverpassElement[] }
  try {
    json = await Promise.any(attempts)
  } catch {
    throw new Error('Overpass indisponible')
  } finally {
    controllers.forEach((c) => c.abort()) // annule les requêtes encore en vol
    timers.forEach((t) => clearTimeout(t))
  }

  const seen = new Set<string>()

  const results = (json.elements ?? [])
    .flatMap((el): NearbyLodging[] => {
      const lat = el.lat ?? el.center?.lat
      const lon = el.lon ?? el.center?.lon
      const tags = el.tags ?? {}
      const type = TYPE_MAP[tags.tourism]
      const name = tags.name
      if (lat === undefined || lon === undefined || !type || !name) return []
      if (seen.has(name)) return []
      seen.add(name)

      const street = tags['addr:street']
      const num = tags['addr:housenumber']
      return [
        {
          osmType: el.type,
          osmId: el.id,
          name,
          type,
          lat,
          lon,
          distanceM: haversineM(center, { lat, lon }),
          stars: tags.stars,
          website: tags.website ?? tags['contact:website'],
          address: street ? [num, street].filter(Boolean).join(' ') : undefined,
        },
      ]
    })
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, 8)

  writeCache(cacheKey, results)
  return results
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`
}

export function osmUrl(l: NearbyLodging): string {
  return `https://www.openstreetmap.org/${l.osmType}/${l.osmId}`
}

export type PriceTier = 'budget' | 'confort' | 'premium'

// pseudo-aléatoire déterministe à partir de l'id OSM (prix stable entre les rendus)
function priceSeed(id: number): number {
  const x = Math.sin(id) * 10000
  return x - Math.floor(x)
}

/**
 * Estimation *indicative* du prix/nuit. OpenStreetMap ne fournit pas de tarif ;
 * on en déduit un ordre de grandeur à partir du type d'hébergement et du classement,
 * de façon déterministe pour que le prix reste stable. À afficher comme une estimation.
 */
export function estimateNightlyPrice(l: NearbyLodging): number {
  const stars = l.stars ? parseInt(l.stars, 10) : 0
  let base: number
  switch (l.type) {
    case 'Auberge':
      base = 34
      break
    case "Maison d'hôtes":
      base = 82
      break
    case 'Airbnb':
      base = 98
      break
    default: // Hôtel : selon le nombre d'étoiles
      base =
        stars >= 5 ? 320 : stars === 4 ? 195 : stars === 3 ? 125 : stars === 2 ? 85 : stars === 1 ? 62 : 135
  }
  const variation = 0.82 + priceSeed(l.osmId) * 0.5 // 0,82 – 1,32
  return Math.max(20, Math.round((base * variation) / 5) * 5)
}

export function priceTier(price: number): PriceTier {
  if (price < 80) return 'budget'
  if (price <= 170) return 'confort'
  return 'premium'
}
