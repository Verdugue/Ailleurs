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
