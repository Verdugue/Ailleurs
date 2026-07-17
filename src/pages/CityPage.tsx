import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CATEGORY_META, getCity, placeSlug } from '../data/destinations'
import { fetchWeather } from '../services/weather'
import { useAsync } from '../hooks/useAsync'
import { CategoryFilter, type CategoryFilterValue } from '../components/CategoryFilter'
import { CoverImage } from '../components/CoverImage'
import { EventExplorer } from '../components/EventExplorer'
import { ChevronLeftIcon } from '../components/icons'

export function CityPage() {
  const { cityId } = useParams()
  const city = getCity(cityId)
  const [filter, setFilter] = useState<CategoryFilterValue>('all')
  const weather = useAsync(
    () => (city ? fetchWeather(city.coords) : Promise.reject(new Error('ville inconnue'))),
    [cityId],
  )

  if (!city) return <Navigate to="/" replace />

  const places = filter === 'all' ? city.places : city.places.filter((p) => p.cat === filter)

  return (
    <div className="view">
      <section className="city-hero" style={{ background: city.gradient }}>
        <CoverImage src={city.image} alt={city.name} eager />
        <div className="city-hero-shade" />
        <div className="city-hero-content">
          <Link to="/" className="back-link">
            <ChevronLeftIcon /> Toutes les destinations
          </Link>
          <div className="city-country">{city.country}</div>
          <h1 className="city-title">{city.name}</h1>
          <p className="city-intro">{city.intro}</p>
          {weather.status === 'ready' && (
            <div className="weather-chip" title="Météo actuelle (Open-Meteo)">
              <span aria-hidden="true">{weather.data.emoji}</span>
              {weather.data.temperature}° · {weather.data.label}
            </div>
          )}
        </div>
      </section>

      <div className="filter-bar">
        <CategoryFilter value={filter} onChange={setFilter} />
      </div>

      <section className="city-section">
        <h2>À faire à {city.name}</h2>
        <div className="place-grid">
          {places.map((p) => (
            <Link
              key={p.name}
              to={`/ville/${city.id}/${placeSlug(p)}`}
              className="place-card place-card--link"
            >
              <div className="place-img" style={{ background: CATEGORY_META[p.cat].gradient }}>
                <CoverImage src={p.image} alt={p.name} />
                <span className="place-badge">{CATEGORY_META[p.cat].label}</span>
              </div>
              <div className="place-body">
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <span className="place-city">Carte, tables & avis →</span>
              </div>
            </Link>
          ))}
        </div>
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
