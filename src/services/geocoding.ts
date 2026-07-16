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

export async function searchCities(query: string): Promise<GeoCity[]> {
  const params = new URLSearchParams({
    name: query,
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
