import type { Coords } from '../types'

/**
 * Photos réelles des hébergements via Google Places (New).
 * Facultatif : sans clé, les cartes gardent leurs photos d'illustration.
 * L'API accepte les appels directs du navigateur (CORS) — la clé étant visible
 * côté client, la restreindre par référent HTTP dans la console Google Cloud.
 */

const KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY?.trim()

/** true si une clé Google Places est configurée dans .env */
export const hasGooglePlacesKey = Boolean(KEY && KEY !== 'COLLE_TA_CLE_ICI')

// Cache persistant (localStorage) : un lieu déjà résolu ne reconsomme pas de quota.
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** url === null : lieu déjà cherché, sans photo côté Google (inutile de repayer l'appel) */
function readCache(key: string): string | null | undefined {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return undefined
    const { at, url } = JSON.parse(raw) as { at: number; url: string | null }
    return Date.now() - at < CACHE_TTL_MS ? url : undefined
  } catch {
    return undefined
  }
}

function writeCache(key: string, url: string | null): void {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), url }))
  } catch {
    // stockage plein ou indisponible : on ignore, le cache est optionnel
  }
}

interface SearchTextResponse {
  places?: { photos?: { name?: string }[] }[]
}

/**
 * Photo réelle d'un hébergement : on retrouve le lieu par son nom autour de
 * ses coordonnées OSM (Text Search), puis on renvoie l'URL du média de sa
 * première photo. null si le lieu est introuvable ou sans photo.
 */
export async function fetchLodgingPhoto(name: string, coords: Coords): Promise<string | null> {
  if (!hasGooglePlacesKey || !KEY) return null

  const cacheKey = `ailleurs:place-photo:${coords.lat.toFixed(4)},${coords.lon.toFixed(4)}:${name}`
  const cached = readCache(cacheKey)
  if (cached !== undefined) return cached

  let url: string | null
  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': KEY,
        // photos uniquement : reste dans le palier de facturation minimal pour ce besoin
        'X-Goog-FieldMask': 'places.photos',
      },
      body: JSON.stringify({
        textQuery: name,
        pageSize: 1,
        locationBias: {
          circle: { center: { latitude: coords.lat, longitude: coords.lon }, radius: 300 },
        },
      }),
    })
    if (!res.ok) throw new Error(`Places HTTP ${res.status}`)
    const json = (await res.json()) as SearchTextResponse
    const photo = json.places?.[0]?.photos?.[0]?.name
    url = photo ? `https://places.googleapis.com/v1/${photo}/media?maxWidthPx=640&key=${KEY}` : null
  } catch {
    return null // erreur réseau ou quota : repli sur l'illustration, sans mise en cache
  }

  writeCache(cacheKey, url)
  return url
}
