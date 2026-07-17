import { Link, Navigate, useParams } from 'react-router-dom'
import type { Coords } from '../types'
import { CATEGORY_META, getPlace, placeSlug } from '../data/destinations'
import { geocodePlace } from '../services/geocoding'
import {
  fetchNearbyRestaurants,
  formatDistance,
  osmUrlFor,
  type Restaurant,
} from '../services/overpass'
import { fetchWeather } from '../services/weather'
import { useAsync } from '../hooks/useAsync'
import { CoverImage } from '../components/CoverImage'
import { PlaceMap } from '../components/PlaceMap'
import { PlaceReviews } from '../components/PlaceReviews'
import { ChevronLeftIcon, PinIcon, StarIcon } from '../components/icons'

interface ResolvedLocation {
  coords: Coords
  address?: string
  precise: boolean
}

const KIND_EMOJI: Record<Restaurant['kind'], string> = {
  Restaurant: '🍽️',
  Café: '☕',
  Bar: '🍸',
}

function RestaurantCard({ r }: { r: Restaurant }) {
  const meta = [r.cuisine, formatDistance(r.distanceM)].filter(Boolean).join(' · ')
  return (
    <article className="resto-card">
      <div className="resto-emoji" aria-hidden="true">
        {KIND_EMOJI[r.kind]}
      </div>
      <div className="resto-body">
        <div className="resto-top">
          <h3>{r.name}</h3>
          <span className="resto-rating">
            <StarIcon size={13} />
            {r.rating.toFixed(1)}
          </span>
        </div>
        <div className="resto-meta">{meta || r.kind}</div>
        {r.award && <span className="resto-award">★ {r.award}</span>}
        <div className="resto-links">
          {r.website && (
            <a className="lodging-link" href={r.website} target="_blank" rel="noreferrer">
              Site web ↗
            </a>
          )}
          <a
            className="lodging-link lodging-link--muted"
            href={osmUrlFor(r.osmType, r.osmId)}
            target="_blank"
            rel="noreferrer"
          >
            Voir sur la carte ↗
          </a>
        </div>
      </div>
    </article>
  )
}

function RestoSkeleton() {
  return (
    <div className="resto-grid">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  )
}

export function PlacePage() {
  const { cityId, placeSlug: slug } = useParams()
  const found = getPlace(cityId, slug)

  // Un seul flux : géocode le lieu (une seule requête Nominatim), puis récupère
  // les tables autour. Regrouper évite un flash « aucune table » entre les deux.
  const page = useAsync<{ loc: ResolvedLocation; restaurants: Restaurant[] | null }>(async () => {
    if (!found) throw new Error('lieu inconnu')
    const geo = await geocodePlace(found.place.name, found.city.name, found.city.coords)
    const loc: ResolvedLocation = geo
      ? { coords: { lat: geo.lat, lon: geo.lon }, address: geo.address, precise: true }
      : { coords: found.city.coords, precise: false }
    let restaurants: Restaurant[] | null
    try {
      restaurants = await fetchNearbyRestaurants(loc.coords)
    } catch {
      restaurants = null // les restos ont échoué, mais la carte reste affichable
    }
    return { loc, restaurants }
  }, [cityId, slug])

  const weather = useAsync(
    () => (found ? fetchWeather(found.city.coords) : Promise.reject(new Error('lieu inconnu'))),
    [cityId, slug],
  )

  if (!found) return <Navigate to={cityId ? `/ville/${cityId}` : '/'} replace />

  const { city, place } = found
  const cat = CATEGORY_META[place.cat]
  const loc = page.status === 'ready' ? page.data.loc : null
  const restaurants = page.status === 'ready' ? page.data.restaurants : undefined

  return (
    <div className="view">
      <section className="event-hero" style={{ background: cat.gradient }}>
        <CoverImage src={place.image} alt={place.name} eager />
        <div className="event-hero-shade" />
        <div className="event-hero-content">
          <div>
            <Link to={`/ville/${city.id}`} className="back-link">
              <ChevronLeftIcon /> {city.name}
            </Link>
          </div>
          <span className="event-chip">{cat.label}</span>
          <h1 className="event-title-hero">{place.name}</h1>
          <div className="event-facts">
            <span className="event-fact">
              <PinIcon /> {city.name}, {city.country}
            </span>
            {weather.status === 'ready' && (
              <span className="event-fact">
                <span aria-hidden="true">{weather.data.emoji}</span> {weather.data.temperature}° ·{' '}
                {weather.data.label}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="event-body">
        <div className="event-about">
          <h2>À propos</h2>
          <p>{place.blurb}</p>
          <p>
            {place.name} fait partie des expériences incontournables à {city.name}. Repérez le lieu
            sur la carte, découvrez les bonnes tables tout autour, et laissez votre avis pour aider
            les prochains voyageurs.
          </p>

          <h3>Où se trouve {place.name}</h3>
          {page.status === 'loading' && <div className="place-map-skeleton" />}
          {page.status === 'error' && (
            <p className="empty-note">Impossible de localiser ce lieu pour le moment.</p>
          )}
          {loc && (
            <PlaceMap
              lat={loc.coords.lat}
              lon={loc.coords.lon}
              name={place.name}
              address={loc.address}
              precise={loc.precise}
            />
          )}
        </div>

        <aside className="booking-card">
          <div className="booking-from">Catégorie</div>
          <div className="place-info-cat">{cat.label}</div>
          <div className="booking-info" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
            <div className="booking-row">
              <span>Ville</span>
              <span>{city.name}</span>
            </div>
            <div className="booking-row">
              <span>Pays</span>
              <span>{city.country}</span>
            </div>
            {loc && (
              <div className="booking-row">
                <span>Position</span>
                <span>
                  {loc.coords.lat.toFixed(3)}, {loc.coords.lon.toFixed(3)}
                </span>
              </div>
            )}
          </div>
          {loc && (
            <a
              className="btn-primary place-itinerary"
              href={`https://www.google.com/maps/search/?api=1&query=${loc.coords.lat}%2C${loc.coords.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              Voir l'itinéraire
            </a>
          )}
        </aside>
      </section>

      <section className="lodging-section">
        <div className="lodging-inner">
          <h2>Bonnes tables à proximité</h2>
          <p className="lodging-sub">
            Restaurants, cafés et bars réels autour de {place.name}, les mieux notés d'abord.
          </p>
          {page.status === 'loading' && <RestoSkeleton />}
          {(page.status === 'error' || restaurants === null) && (
            <p className="empty-note">Impossible de charger les adresses pour le moment.</p>
          )}
          {restaurants !== undefined && restaurants !== null && restaurants.length === 0 && (
            <p className="empty-note">
              Aucune table référencée sur OpenStreetMap dans un rayon de 1 km.
            </p>
          )}
          {restaurants !== undefined && restaurants !== null && restaurants.length > 0 && (
            <>
              <div className="resto-grid">
                {restaurants.map((r) => (
                  <RestaurantCard key={`${r.osmType}-${r.osmId}`} r={r} />
                ))}
              </div>
              <p className="lodging-note">
                Adresses réelles © contributeurs OpenStreetMap · notes indicatives (OSM n'héberge
                pas d'avis vérifiés)
              </p>
            </>
          )}
        </div>
      </section>

      <section className="lodging-section reviews-section">
        <div className="lodging-inner">
          <PlaceReviews storageKey={`ailleurs:reviews:${city.id}:${placeSlug(place)}`} placeName={place.name} />
        </div>
      </section>
    </div>
  )
}
