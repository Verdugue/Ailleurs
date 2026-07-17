import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Region } from '../types'
import { CITIES } from '../data/destinations'
import { searchCities, stripAccents, type GeoCity } from '../services/geocoding'
import { gradientFor } from '../utils/gradient'
import { CoverImage } from '../components/CoverImage'
import { SearchIcon } from '../components/icons'

const REGIONS: Region[] = ['Europe', 'Amériques', 'Asie', 'Afrique']

// Fond vidéo du hero : côte aérienne (Pexels, libre). 720p ≈ 6 Mo pour rester léger.
// Le poster est la 1re image du même clip (compressée) → transition invisible.
const HERO_VIDEO = 'https://videos.pexels.com/video-files/1409899/1409899-hd_1280_720_25fps.mp4'
const HERO_POSTER =
  'https://images.pexels.com/videos/1409899/free-video-1409899.jpg?auto=compress&cs=tinysrgb&w=1600'

// comparaison tolérante : ignore accents, casse, tirets/espaces (« aix en provence » ~ « Aix-en-Provence »)
const normalize = (s: string) =>
  stripAccents(s)
    .toLowerCase()
    .replace(/[\s-]+/g, ' ')
    .trim()

function geoUrl(g: GeoCity): string {
  const params = new URLSearchParams({
    nom: g.name,
    pays: g.country,
    lat: String(g.lat),
    lon: String(g.lon),
  })
  return `/decouvrir?${params}`
}

function SearchBar() {
  const [query, setQuery] = useState('')
  const [geoResults, setGeoResults] = useState<GeoCity[]>([])
  const navigate = useNavigate()

  const q = query.trim().toLowerCase()
  const nq = normalize(query)
  const curated = nq
    ? CITIES.filter((c) => normalize(c.name).includes(nq) || normalize(c.country).includes(nq))
    : []

  // recherche mondiale (géocodage Open-Meteo) avec anti-rebond
  useEffect(() => {
    if (q.length < 2) {
      setGeoResults([])
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      searchCities(q)
        .then((results) => {
          if (!cancelled) setGeoResults(results)
        })
        .catch(() => {
          if (!cancelled) setGeoResults([])
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [q])

  // évite les doublons avec nos destinations éditoriales
  const curatedNames = new Set(CITIES.map((c) => normalize(c.name)))
  const world = geoResults.filter((g) => !curatedNames.has(normalize(g.name))).slice(0, 6)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (curated.length > 0) navigate(`/ville/${curated[0].id}`)
    else if (world.length > 0) navigate(geoUrl(world[0]))
  }

  return (
    <div className="search">
      <form className="search-box" onSubmit={handleSubmit}>
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une ville : Montpellier, Séoul, Dakar…"
          aria-label="Rechercher une ville"
        />
        <button type="submit">Explorer</button>
      </form>

      {(curated.length > 0 || world.length > 0) && (
        <div className="search-results">
          {curated.length > 0 && (
            <>
              <div className="search-group-label">Nos destinations</div>
              {curated.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="search-result"
                  onClick={() => navigate(`/ville/${c.id}`)}
                >
                  <span className="search-thumb" style={{ background: c.gradient }}>
                    <CoverImage src={c.image} />
                  </span>
                  <span className="search-result-text">
                    <span className="search-result-name">{c.name}</span>
                    <span className="search-result-country">{c.country}</span>
                  </span>
                </button>
              ))}
            </>
          )}
          {world.length > 0 && (
            <>
              <div className="search-group-label">Villes du monde</div>
              {world.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className="search-result"
                  onClick={() => navigate(geoUrl(g))}
                >
                  <span
                    className="search-thumb search-thumb--letter"
                    style={{ background: gradientFor(g.name) }}
                  >
                    {g.name.charAt(0)}
                  </span>
                  <span className="search-result-text">
                    <span className="search-result-name">{g.name}</span>
                    <span className="search-result-country">
                      {[g.admin, g.country].filter(Boolean).join(', ')}
                    </span>
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function HomePage() {
  return (
    <div className="view">
      <section className="hero hero--video">
        <div
          className="hero-media"
          aria-hidden="true"
          style={{ backgroundImage: `url(${HERO_POSTER})` }}
        >
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          <div className="hero-scrim" />
        </div>
        <div className="hero-inner">
          <span className="kicker">Le monde, à portée de curiosité</span>
          <h1 className="hero-title">
            Où partez-vous
            <br />
            <em>aujourd'hui</em> ?
          </h1>
          <p className="hero-lead">
            Cherchez n'importe quelle ville du monde : lieux incontournables, météo, événements en
            temps réel et où poser vos valises.
          </p>
          <SearchBar />
        </div>
      </section>

      <section className="destinations">
        <div className="section-head">
          <h2>Nos destinations</h2>
          <span className="section-note">{CITIES.length} villes à explorer</span>
        </div>
        {REGIONS.map((region) => {
          const regionCities = CITIES.filter((c) => c.region === region)
          if (regionCities.length === 0) return null
          return (
            <div key={region} className="region-block">
              <h3 className="region-title">{region}</h3>
              <div className="destination-grid">
                {regionCities.map((c) => (
                  <Link key={c.id} to={`/ville/${c.id}`} className="destination-card">
                    <div className="destination-img" style={{ background: c.gradient }}>
                      <CoverImage src={c.image} alt={c.name} />
                      <div className="destination-shade" />
                      <div className="destination-label">
                        <div className="destination-name">{c.name}</div>
                        <div className="destination-country">{c.country}</div>
                      </div>
                    </div>
                    <div className="destination-body">
                      <p>{c.tagline}</p>
                      <span className="destination-meta">
                        {c.places.length} lieux · événements en temps réel
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
