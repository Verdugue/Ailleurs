import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORY_META, CITIES } from '../data/destinations'
import { CategoryFilter, type CategoryFilterValue } from '../components/CategoryFilter'
import { CoverImage } from '../components/CoverImage'

const ALL_EXPERIENCES = CITIES.flatMap((city) => city.places.map((place) => ({ city, place })))

export function ExperiencesPage() {
  const [filter, setFilter] = useState<CategoryFilterValue>('all')

  const shown =
    filter === 'all' ? ALL_EXPERIENCES : ALL_EXPERIENCES.filter((x) => x.place.cat === filter)

  return (
    <div className="view">
      <section className="page-hero">
        <span className="kicker">Inspiration</span>
        <h1>Expériences</h1>
        <p>
          Monuments, musées, tables et quartiers : toutes les expériences de nos destinations,
          réunies au même endroit. Filtrez par envie, cliquez pour explorer la ville.
        </p>
      </section>

      <div className="filter-bar">
        <CategoryFilter value={filter} onChange={setFilter} />
      </div>

      <section className="city-section city-section--last">
        <div className="place-grid">
          {shown.map(({ city, place }) => (
            <Link
              key={`${city.id}-${place.name}`}
              to={`/ville/${city.id}`}
              className="place-card place-card--link"
            >
              <div className="place-img" style={{ background: CATEGORY_META[place.cat].gradient }}>
                <CoverImage src={place.image} alt={place.name} />
                <span className="place-badge">{CATEGORY_META[place.cat].label}</span>
              </div>
              <div className="place-body">
                <h3>{place.name}</h3>
                <p>{place.blurb}</p>
                <span className="place-city">
                  {city.name} · {city.country}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
