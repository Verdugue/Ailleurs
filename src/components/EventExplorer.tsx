import { useState } from 'react'
import type { City } from '../types'
import {
  cityHasEventSource,
  curateEvents,
  fetchCityEvents,
  hasTicketmasterKey,
  type EventPeriod,
  type EventSort,
} from '../services/events'
import { localTicketingFor } from '../data/localTicketing'
import { useAsync } from '../hooks/useAsync'
import { ApiKeyNotice } from './ApiKeyNotice'
import { EventRows, EventRowsSkeleton } from './EventRows'

const PERIODS: { key: EventPeriod; label: string }[] = [
  { key: 'all', label: 'À venir' },
  { key: 'today', label: "Aujourd'hui" },
  { key: 'week', label: '7 jours' },
  { key: 'month', label: '30 jours' },
]

const SORTS: { key: EventSort; label: string }[] = [
  { key: 'date', label: 'Par date' },
  { key: 'relevance', label: 'À la une' },
]

const PERIOD_EMPTY: Record<EventPeriod, string> = {
  all: 'à venir',
  today: "aujourd'hui",
  week: 'sur les 7 prochains jours',
  month: 'sur les 30 prochains jours',
}

/** Explorateur d'événements réels : période + tri + liste, avec tous les états. */
export function EventExplorer({ city }: { city: City }) {
  const [period, setPeriod] = useState<EventPeriod>('all')
  const [sort, setSort] = useState<EventSort>('date')
  const hasSource = cityHasEventSource(city)
  const events = useAsync(
    () => (hasSource ? fetchCityEvents(city, sort) : Promise.resolve([])),
    [city.id, sort, hasSource],
  )

  if (!hasSource) return <ApiKeyNotice />

  const shown = events.status === 'ready' ? curateEvents(events.data, period, sort) : []

  return (
    <>
      <div className="event-toolbar">
        <div className="pill-group">
          <span className="pill-group-label">Période</span>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              className={`filter-pill filter-pill--sm${period === p.key ? ' is-active' : ''}`}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {hasTicketmasterKey && (
          <div className="pill-group">
            <span className="pill-group-label">Tri</span>
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`filter-pill filter-pill--sm${sort === s.key ? ' is-active' : ''}`}
                onClick={() => setSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {events.status === 'loading' && <EventRowsSkeleton />}
      {events.status === 'error' && (
        <p className="empty-note">
          Impossible de charger les événements pour le moment. Réessaie dans quelques instants.
        </p>
      )}
      {events.status === 'ready' && events.data.length === 0 && (
        <p className="empty-note">
          Ticketmaster, notre source mondiale, n'opère pas (ou très peu)
          {city.country ? ` en ${city.country}` : ' dans ce pays'} — aucun événement datable ou
          réservable n'y est donc référencé.
          {(() => {
            const local = localTicketingFor(city.country)
            return local ? (
              <>
                {' '}Pour les concerts et spectacles à {city.name}, la billetterie de référence
                est{' '}
                <a className="lodging-link" href={local.url} target="_blank" rel="noreferrer">
                  {local.name} ↗
                </a>
                .
              </>
            ) : null
          })()}
          {' '}Côté Ailleurs, la couverture est excellente à Londres, New York, Sydney, Barcelone,
          Montréal, Berlin…
        </p>
      )}
      {events.status === 'ready' && events.data.length > 0 && shown.length === 0 && (
        <p className="empty-note">
          Aucun événement {PERIOD_EMPTY[period]} autour de {city.name}. Élargis la période pour en
          voir davantage.
        </p>
      )}
      {shown.length > 0 && <EventRows events={shown} />}
    </>
  )
}
