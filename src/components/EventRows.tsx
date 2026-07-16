import { Link } from 'react-router-dom'
import type { RealEvent } from '../services/events'
import { EVENT_GRADIENT } from '../data/destinations'
import { CoverImage } from './CoverImage'
import { ArrowRightIcon } from './icons'

/** Liste d'événements réels (utilisée par la page ville et la page agenda). */
export function EventRows({ events }: { events: RealEvent[] }) {
  return (
    <div className="event-list">
      {events.map((e) => (
        <Link key={e.id} to={`/evenement/${e.id}`} className="event-row">
          <div className="event-img" style={{ background: EVENT_GRADIENT }}>
            <CoverImage src={e.image} alt={e.name} />
            <div className="date-chip">
              <div className="date-day">{e.day}</div>
              <div className="date-month">{e.month}</div>
            </div>
          </div>
          <div className="event-info">
            <span className="event-cat">{e.category ?? 'Événement'}</span>
            <h3>{e.name}</h3>
            <p>
              {[e.venue, e.dateText, e.time].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="event-cta-wrap">
            <span className="event-cta">
              Voir l'événement <ArrowRightIcon />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function EventRowsSkeleton() {
  return (
    <div className="event-list">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  )
}
