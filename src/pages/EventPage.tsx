import { Link, useParams } from 'react-router-dom'
import { EVENT_GRADIENT, HOTEL_PHOTOS, LODGING_GRADIENT, LODGING_TAG } from '../data/destinations'
import { fetchEventById, type RealEvent } from '../services/events'
import {
  estimateNightlyPrice,
  fetchNearbyLodging,
  formatDistance,
  osmUrl,
  priceTier,
  type NearbyLodging,
  type PriceTier,
} from '../services/overpass'
import { fetchLodgingPhoto, hasGooglePlacesKey } from '../services/places'
import { useAsync } from '../hooks/useAsync'
import { CoverImage } from '../components/CoverImage'
import {
  CalendarIcon,
  ChevronLeftIcon,
  ClockIcon,
  PinIcon,
} from '../components/icons'

const LODGING_TIERS: { key: PriceTier; label: string; hint: string }[] = [
  { key: 'budget', label: 'Petits budgets', hint: 'moins de 80 €' },
  { key: 'confort', label: 'Confort', hint: '80 – 170 €' },
  { key: 'premium', label: 'Premium', hint: 'plus de 170 €' },
]

function LodgingCard({
  item: l,
  index,
  price,
}: {
  item: NearbyLodging
  index: number
  price: number
}) {
  // vraie photo de l'établissement (Google Places) quand elle existe, sinon illustration
  const photo = useAsync(
    () => fetchLodgingPhoto(l.name, { lat: l.lat, lon: l.lon }),
    [l.osmType, l.osmId],
  )
  const real = photo.status === 'ready' ? photo.data : null
  const src = photo.status === 'loading' ? undefined : real ?? HOTEL_PHOTOS[index % HOTEL_PHOTOS.length]

  return (
    <article className="lodging-card">
      <div className="lodging-img" style={{ background: LODGING_GRADIENT }}>
        <CoverImage key={src} src={src} />
      </div>
      <div className="lodging-body">
        <span
          className="lodging-tag"
          style={{ background: LODGING_TAG[l.type].bg, color: LODGING_TAG[l.type].color }}
        >
          {l.type}
        </span>
        <h3>{l.name}</h3>
        <div className="lodging-rating">
          <PinIcon size={13} />
          <span>{formatDistance(l.distanceM)} de l'événement</span>
          {l.stars && <span>· {l.stars} étoile{l.stars === '1' ? '' : 's'}</span>}
        </div>
        {l.address && <div className="lodging-address">{l.address}</div>}
        <div className="lodging-price">
          <strong>{price} €</strong>
          <span>/ nuit · estim.</span>
        </div>
        <a className="lodging-link" href={l.website ?? osmUrl(l)} target="_blank" rel="noreferrer">
          {l.website ? 'Site web ↗' : 'Voir sur OpenStreetMap ↗'}
        </a>
      </div>
    </article>
  )
}

function NearbyLodgingGrid({ items }: { items: NearbyLodging[] }) {
  // on garde l'index d'origine (photo stable) et on trie par prix estimé
  const priced = items
    .map((l, index) => ({ l, index, price: estimateNightlyPrice(l) }))
    .sort((a, b) => a.price - b.price)

  const groups = LODGING_TIERS.map((tier) => ({
    ...tier,
    entries: priced.filter((p) => priceTier(p.price) === tier.key),
  })).filter((g) => g.entries.length > 0)

  return (
    <>
      {groups.map((g) => (
        <div key={g.key} className="lodging-tier">
          <div className="lodging-tier-head">
            <h3>{g.label}</h3>
            <span className="lodging-tier-hint">
              {g.hint} / nuit · {g.entries.length} adresse{g.entries.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="lodging-grid">
            {g.entries.map((p) => (
              <LodgingCard
                key={`${p.l.osmType}-${p.l.osmId}`}
                item={p.l}
                index={p.index}
                price={p.price}
              />
            ))}
          </div>
        </div>
      ))}
      <p className="lodging-note">
        Hébergements réels · données © contributeurs OpenStreetMap ·{' '}
        {hasGooglePlacesKey
          ? 'photos des établissements via Google Maps (illustration à défaut)'
          : "photos d'illustration"}{' '}
        · prix indicatifs estimés (non contractuels)
      </p>
    </>
  )
}

function LodgingSkeleton() {
  return (
    <div className="lodging-grid">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  )
}

function EventBody({ event }: { event: RealEvent }) {
  const venueCoords = event.venueCoords
  const lodging = useAsync(
    () => (venueCoords ? fetchNearbyLodging(venueCoords) : Promise.resolve([])),
    [event.id],
  )

  const facts = [event.info, event.note].filter(Boolean) as string[]
  const venueLine = [event.venue, event.venueCity, event.venueCountry].filter(Boolean).join(', ')

  return (
    <>
      <section className="event-hero" style={{ background: EVENT_GRADIENT }}>
        <CoverImage src={event.image} alt={event.name} eager />
        <div className="event-hero-shade" />
        <div className="event-hero-content">
          <div>
            <Link to="/evenements" className="back-link">
              <ChevronLeftIcon /> Tous les événements
            </Link>
          </div>
          <span className="event-chip">{event.category ?? 'Événement'}</span>
          <h1 className="event-title-hero">{event.name}</h1>
          <div className="event-facts">
            <span className="event-fact">
              <CalendarIcon /> {event.dateText}
            </span>
            {event.venue && (
              <span className="event-fact">
                <PinIcon /> {event.venue}
              </span>
            )}
            {event.time && (
              <span className="event-fact">
                <ClockIcon /> {event.time}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="event-body">
        <div className="event-about">
          <h2>À propos de l'événement</h2>
          {facts.length > 0 ? (
            facts.map((text, i) => <p key={i}>{text}</p>)
          ) : (
            <p>
              Rendez-vous {event.dateText}
              {event.venue ? ` à ${event.venue}` : ''}
              {event.venueCity ? ` (${event.venueCity})` : ''}. Tous les détails et la billetterie
              sont disponibles sur la page officielle de l'événement.
            </p>
          )}
          {event.venueAddress && (
            <p className="event-address">
              <PinIcon size={14} /> {event.venueAddress}
              {event.venueCity ? `, ${event.venueCity}` : ''}
            </p>
          )}

          {event.images.length > 1 && (
            <>
              <h3>Galerie</h3>
              <div className="gallery">
                <div className="gallery-main" style={{ background: EVENT_GRADIENT }}>
                  <CoverImage src={event.images[0]} />
                </div>
                <div style={{ background: EVENT_GRADIENT }}>
                  <CoverImage src={event.images[1]} />
                </div>
                <div style={{ background: EVENT_GRADIENT }}>
                  <CoverImage src={event.images[2] ?? event.images[1]} />
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="booking-card">
          <div className="booking-from">{event.priceText ? 'À partir de' : 'Tarifs'}</div>
          <div className="booking-price">{event.priceText ?? 'Sur la billetterie'}</div>
          {event.url && (
            <a className="btn-primary" href={event.url} target="_blank" rel="noreferrer">
              {event.source === 'Ticketmaster' ? 'Réserver sur Ticketmaster' : 'Voir'}
            </a>
          )}
          <div className="booking-info">
            {event.promoter && (
              <div className="booking-row">
                <span>Organisé par</span>
                <span>{event.promoter}</span>
              </div>
            )}
            {venueLine && (
              <div className="booking-row">
                <span>Lieu</span>
                <span>{venueLine}</span>
              </div>
            )}
            <div className="booking-row">
              <span>Source</span>
              <span>{event.source}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="lodging-section">
        <div className="lodging-inner">
          <h2>Où dormir à proximité</h2>
          <p className="lodging-sub">
            Hôtels, maisons d'hôtes, locations et auberges
            {event.venue ? ` près de ${event.venue}` : ' à proximité'}, classés par tranche de prix.
          </p>
          {!venueCoords && (
            <p className="empty-note">
              La position exacte du lieu n'est pas fournie pour cet événement.
            </p>
          )}
          {venueCoords && lodging.status === 'loading' && <LodgingSkeleton />}
          {venueCoords && lodging.status === 'error' && (
            <p className="empty-note">Impossible de charger les hébergements pour le moment.</p>
          )}
          {venueCoords && lodging.status === 'ready' && lodging.data.length === 0 && (
            <p className="empty-note">
              Aucun hébergement référencé sur OpenStreetMap dans un rayon de 1,5 km.
            </p>
          )}
          {venueCoords && lodging.status === 'ready' && lodging.data.length > 0 && (
            <NearbyLodgingGrid items={lodging.data} />
          )}
        </div>
      </section>
    </>
  )
}

export function EventPage() {
  const { eventId } = useParams()
  const event = useAsync(() => fetchEventById(eventId), [eventId])

  return (
    <div className="view">
      {event.status === 'loading' && (
        <>
          <div className="skeleton-hero" />
          <section className="event-body">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </section>
        </>
      )}
      {event.status === 'error' && (
        <section className="page-hero">
          <h1>Événement introuvable</h1>
          <p>
            Cet événement n'est plus disponible, ou la source d'événements n'est pas configurée.
          </p>
          <p>
            <Link to="/evenements" className="lodging-link">
              ← Retour aux événements
            </Link>
          </p>
        </section>
      )}
      {event.status === 'ready' && <EventBody event={event.data} />}
    </div>
  )
}
