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
    `[out:json][timeout:15];` +
    `nwr["tourism"~"^(hotel|guest_house|hostel|apartment)$"]["name"](around:${radiusM},${center.lat},${center.lon});` +
    `out center tags 60;`

  // plusieurs serveurs publics : on bascule sur le suivant si l'un est surchargé
  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
  ]

  let json: { elements?: OverpassElement[] } | undefined
  let lastError: Error = new Error('Overpass indisponible')
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      })
      if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`)
      json = (await res.json()) as { elements?: OverpassElement[] }
      break
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e))
    }
  }
  if (!json) throw lastError
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
