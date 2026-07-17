import type { Coords } from '../types'

/**
 * Recherche de villes dans le monde entier via l'API de géocodage Open-Meteo.
 * Gratuit, sans clé API.
 */

export interface GeoCity {
  id: string
  name: string
  country: string
  admin?: string
  lat: number
  lon: number
  population?: number
}

interface GeoResult {
  name?: string
  country?: string
  admin1?: string
  latitude?: number
  longitude?: number
  population?: number
}

/** Retire les accents pour une comparaison tolérante (Montréal ~ montreal). */
export function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

async function fetchGeo(name: string): Promise<GeoCity[]> {
  const params = new URLSearchParams({
    name,
    count: '8',
    language: 'fr',
    format: 'json',
  })
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`)
  if (!res.ok) throw new Error(`Géocodage HTTP ${res.status}`)
  const json = (await res.json()) as { results?: GeoResult[] }
  return (json.results ?? [])
    .filter((r) => r.name && r.latitude !== undefined && r.longitude !== undefined)
    .map((r) => ({
      id: `${r.latitude},${r.longitude}`,
      name: r.name as string,
      country: r.country ?? '',
      admin: r.admin1,
      lat: r.latitude as number,
      lon: r.longitude as number,
      population: r.population,
    }))
}

/** Position et adresse réelles d'un lieu précis (monument, quartier, marché…). */
export interface GeoPlace {
  lat: number
  lon: number
  /** Adresse complète telle que renvoyée par Nominatim */
  address: string
  osmType?: string
  osmId?: number
}

const PLACE_CACHE_TTL_MS = 24 * 60 * 60 * 1000

/**
 * Géocode un lieu nommé (ex. « Fushimi Inari ») dans une ville donnée via
 * Nominatim (OpenStreetMap). Gratuit, sans clé. On borne la recherche autour
 * de la ville pour lever l'ambiguïté des noms génériques (« Gion », « Nishiki »).
 * Résultat mis en cache 24 h. Renvoie null si le lieu est introuvable.
 */
export async function geocodePlace(
  name: string,
  cityName: string,
  cityCoords: Coords,
): Promise<GeoPlace | null> {
  const cacheKey = `ailleurs:geoplace:${cityName}:${name}`
  try {
    const raw = sessionStorage.getItem(cacheKey)
    if (raw) {
      const { at, data } = JSON.parse(raw) as { at: number; data: GeoPlace | null }
      if (Date.now() - at < PLACE_CACHE_TTL_MS) return data
    }
  } catch {
    // cache optionnel
  }

  // viewbox ~110 km autour de la ville : biais (sans bounded, pour ne pas
  // exclure un lieu légèrement excentré) qui aide à choisir le bon « Gion ».
  const d = 0.5
  const viewbox = [cityCoords.lon - d, cityCoords.lat + d, cityCoords.lon + d, cityCoords.lat - d].join(',')
  const params = new URLSearchParams({
    q: `${name}, ${cityName}`,
    format: 'jsonv2',
    limit: '1',
    'accept-language': 'fr',
    viewbox,
  })

  let result: GeoPlace | null = null
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`)
    if (res.ok) {
      const hits = (await res.json()) as {
        lat?: string
        lon?: string
        display_name?: string
        osm_type?: string
        osm_id?: number
      }[]
      const h = hits[0]
      if (h?.lat && h?.lon) {
        result = {
          lat: Number(h.lat),
          lon: Number(h.lon),
          address: h.display_name ?? `${name}, ${cityName}`,
          osmType: h.osm_type,
          osmId: h.osm_id,
        }
      }
    }
  } catch {
    result = null
  }

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data: result }))
  } catch {
    // cache optionnel
  }
  return result
}

export async function searchCities(query: string): Promise<GeoCity[]> {
  const q = query.trim()
  if (!q) return []

  // Open-Meteo est sensible aux séparateurs : « aix en provence » ne trouve rien
  // alors que « aix-en-provence » trouve Aix-en-Provence. On interroge donc plusieurs
  // variantes (tel quel, espaces→tirets, accents retirés) puis on fusionne.
  const variants = Array.from(
    new Set([q, q.replace(/\s+/g, '-'), stripAccents(q), stripAccents(q).replace(/\s+/g, '-')]),
  )

  const settled = await Promise.allSettled(variants.map(fetchGeo))
  const seen = new Set<string>()
  const merged: GeoCity[] = []
  for (const result of settled) {
    if (result.status !== 'fulfilled') continue
    for (const city of result.value) {
      if (seen.has(city.id)) continue
      seen.add(city.id)
      merged.push(city)
    }
  }

  // à défaut de population, on garde l'ordre de pertinence de l'API
  merged.sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
  return merged.slice(0, 8)
}
