import { PinIcon } from './icons'

interface PlaceMapProps {
  lat: number
  lon: number
  name: string
  address?: string
  /** true si la position vient du lieu lui-même, false si repli sur le centre-ville */
  precise?: boolean
}

/**
 * Carte réelle centrée sur le lieu, via l'embed OpenStreetMap (aucune clé, aucune
 * dépendance). Un marqueur pointe l'adresse ; deux liens ouvrent l'itinéraire.
 */
export function PlaceMap({ lat, lon, name, address, precise = true }: PlaceMapProps) {
  // petite emprise autour du point pour un zoom « quartier »
  const dLon = 0.006
  const dLat = 0.004
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join('%2C')
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lon}`
  const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`

  return (
    <div className="place-map">
      <div className="place-map-frame">
        <iframe
          title={`Carte de ${name}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="place-map-foot">
        <span className="place-map-addr">
          <PinIcon size={14} />
          {address ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`}
          {!precise && <em> · position approximative (centre-ville)</em>}
        </span>
        <span className="place-map-links">
          <a className="lodging-link" href={gmaps} target="_blank" rel="noreferrer">
            Itinéraire ↗
          </a>
          <a className="lodging-link lodging-link--muted" href={osm} target="_blank" rel="noreferrer">
            OpenStreetMap ↗
          </a>
        </span>
      </div>
    </div>
  )
}
