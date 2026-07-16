import { useState } from 'react'
import { CITIES } from '../data/destinations'
import { EventExplorer } from '../components/EventExplorer'

export function EventsPage() {
  const [selectedId, setSelectedId] = useState(CITIES[0].id)
  const city = CITIES.find((c) => c.id === selectedId) ?? CITIES[0]

  return (
    <div className="view">
      <section className="page-hero">
        <span className="kicker">Agenda</span>
        <h1>Événements à venir</h1>
        <p>
          Concerts, spectacles, expositions et matchs en temps réel — choisissez une ville pour
          voir ce qui s'y passe vraiment.
        </p>
      </section>

      <div className="filter-bar">
        <div className="filter-row">
          {CITIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`filter-pill${selectedId === c.id ? ' is-active' : ''}`}
              onClick={() => setSelectedId(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <section className="city-section city-section--last">
        <EventExplorer city={city} />
      </section>
    </div>
  )
}
