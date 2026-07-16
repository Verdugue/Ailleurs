import { useMemo, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import type { City } from '../types'
import { fetchWeather } from '../services/weather'
import {
  fetchCityIntro,
  fetchNearbyPlaces,
  sortByInterest,
  WIKI_CAT_LABEL,
  type CityIntro,
  type WikiCat,
} from '../services/wikipedia'
import { useAsync } from '../hooks/useAsync'
import { gradientFor } from '../utils/gradient'
import { CoverImage } from '../components/CoverImage'
import { EventExplorer } from '../components/EventExplorer'
import { ChevronLeftIcon } from '../components/icons'

const PLACE_FILTERS: { key: WikiCat | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'musee', label: WIKI_CAT_LABEL.musee },
  { key: 'patrimoine', label: WIKI_CAT_LABEL.patrimoine },
  { key: 'quartier', label: WIKI_CAT_LABEL.quartier },
  { key: 'nature', label: WIKI_CAT_LABEL.nature },
  { key: 'culture', label: WIKI_CAT_LABEL.culture },
]

/** Page « découverte » d'une ville quelconque trouvée via la recherche mondiale. */
export function DiscoverPage() {
  const [params] = useSearchParams()
  const name = params.get('nom') ?? ''
  const country = params.get('pays') ?? ''
  const lat = Number(params.get('lat'))
  const lon = Number(params.get('lon'))
  const valid = Boolean(name) && Number.isFinite(lat) && Number.isFinite(lon)
  const [placeFilter, setPlaceFilter] = useState<WikiCat | 'all'>('all')

  const city: City = useMemo(
    () => ({
      id: `geo-${lat}-${lon}`,
      name,
      country,
      region: 'Europe',
      gradient: gradientFor(name),
      coords: { lat, lon },
      tagline: '',
      intro: '',
      places: [],
    }),
    [name, country, lat, lon],
  )

  const wiki = useAsync<CityIntro>(
    () => (valid ? fetchCityIntro(name) : Promise.resolve({})),
    [name, valid],
  )
  const places = useAsync(
    () => (valid ? fetchNearbyPlaces({ lat, lon }, name) : Promise.resolve([])),
    [lat, lon, valid],
  )
  const weather = useAsync(
    () => (valid ? fetchWeather({ lat, lon }) : Promise.reject(new Error('coordonnées manquantes'))),
    [lat, lon, valid],
  )

  if (!valid) return <Navigate to="/" replace />

  const heroImage = wiki.status === 'ready' ? wiki.data.image : undefined
  const intro =
    (wiki.status === 'ready' && wiki.data.intro) ||
    'Découverte en direct : lieux notables, météo et événements en temps réel.'

  return (
    <div className="view">
      <section className="city-hero" style={{ background: city.gradient }}>
        <CoverImage src={heroImage} alt={name} eager />
        <div className="city-hero-shade" />
        <div className="city-hero-content">
          <Link to="/" className="back-link">
            <ChevronLeftIcon /> Toutes les destinations
          </Link>
          <div className="city-country">{country || 'Monde'}</div>
          <h1 className="city-title">{name}</h1>
          <p className="city-intro">{intro}</p>
          {weather.status === 'ready' && (
            <div className="weather-chip" title="Météo actuelle (Open-Meteo)">
              <span aria-hidden="true">{weather.data.emoji}</span>
              {weather.data.temperature}° · {weather.data.label}
            </div>
          )}
        </div>
      </section>

      <section className="city-section">
        <div className="section-head">
          <h2>À découvrir à {name}</h2>
          <span className="section-note">Lieux issus de Wikipédia</span>
        </div>
        {places.status === 'loading' && (
          <div className="place-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}
        {places.status === 'error' && (
          <p className="empty-note">Impossible de charger les lieux pour le moment.</p>
        )}
        {places.status === 'ready' && places.data.length === 0 && (
          <p className="empty-note">
            Aucun lieu illustré trouvé sur Wikipédia autour de {name}.
          </p>
        )}
        {places.status === 'ready' && places.data.length > 0 && (
          <>
            <div className="event-toolbar">
              <div className="pill-group">
                <span className="pill-group-label">Catégorie</span>
                {PLACE_FILTERS.filter(
                  (f) => f.key === 'all' || places.data.some((p) => p.cat === f.key),
                ).map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`filter-pill filter-pill--sm${placeFilter === f.key ? ' is-active' : ''}`}
                    onClick={() => setPlaceFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {(() => {
              const shown =
                placeFilter === 'all'
                  ? sortByInterest(places.data).slice(0, 12)
                  : places.data.filter((p) => p.cat === placeFilter).slice(0, 12)
              return (
                <div className="place-grid">
                  {shown.map((p) => (
                    <article key={p.title} className="place-card">
                      <a
                        href={p.website ?? p.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={p.title}
                      >
                        <div className="place-img" style={{ background: city.gradient }}>
                          <CoverImage src={p.image} alt={p.title} />
                          <span className="place-badge">{WIKI_CAT_LABEL[p.cat]}</span>
                        </div>
                      </a>
                      <div className="place-body">
                        <h3>{p.title}</h3>
                        <p>{p.description ?? "Lire l'article pour en savoir plus."}</p>
                        <div className="place-links">
                          {p.website && (
                            <a
                              className="lodging-link"
                              href={p.website}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Site officiel ↗
                            </a>
                          )}
                          <a
                            className="lodging-link lodging-link--muted"
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Wikipédia ↗
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )
            })()}
            <p className="lodging-note">
              Lieux notables dans un rayon de 10 km · textes et photos © contributeurs Wikipédia
            </p>
          </>
        )}
      </section>

      <section className="city-section city-section--last">
        <div className="section-head">
          <h2>Événements à venir</h2>
          <span className="section-note">Données réelles en temps réel</span>
        </div>
        <EventExplorer city={city} />
      </section>
    </div>
  )
}
