import type { City, Coords } from '../types'
import { hasTicketmasterKey, tmEventById, tmSearchEvents } from './ticketmaster'
import { qfapEventById, qfapUpcomingEvents } from './parisevents'
import { hasOpenAgendaKey, oaEventById, oaSearchEvents } from './openagenda'

/**
 * Couche unifiée « événements réels » :
 *  - Ticketmaster Discovery (mondial, clé gratuite requise)
 *  - OpenAgenda (agendas culturels français, clé gratuite requise)
 *  - Open Data Ville de Paris « Que faire à Paris ? » (sans clé)
 * Les identifiants sont préfixés par leur source : tm_XXX / oa_XXX / paris_XXX.
 */

export type EventSort = 'date' | 'relevance'
export type EventPeriod = 'all' | 'today' | 'week' | 'month'

export interface RealEvent {
  id: string
  source: 'Ticketmaster' | 'OpenAgenda' | 'Que faire à Paris ?'
  name: string
  /** Page officielle de réservation / d'information */
  url?: string
  image?: string
  images: string[]
  /** Date AAAA-MM-JJ pour le tri */
  iso?: string
  day: string
  month: string
  dateText: string
  time?: string
  category?: string
  venue?: string
  venueAddress?: string
  venueCity?: string
  venueCountry?: string
  venueCoords?: Coords
  priceText?: string
  info?: string
  note?: string
  promoter?: string
}

export { hasTicketmasterKey, hasOpenAgendaKey }

/** Le site peut-il afficher des événements pour cette ville ? */
export function cityHasEventSource(city: City): boolean {
  return (
    hasTicketmasterKey ||
    city.id === 'paris' ||
    (hasOpenAgendaKey && city.country === 'France')
  )
}

/** Clé de dédoublonnage : les séries type « Harry Potter … Wed 14:00 » ne comptent qu'une fois. */
function dedupeKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 32)
}

/**
 * Même événement écrit différemment selon la source (« Concert X » vs
 * « Concert X / Festival Y ») : vrai si un titre est le préfixe de l'autre.
 * Seuil de 16 caractères pour ne pas fusionner des débuts génériques.
 */
function titlesOverlap(a: string, b: string): boolean {
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a]
  return shorter.length >= 16 && longer.startsWith(shorter)
}

/** Événements réels à venir autour d'une ville, toutes sources confondues. */
export async function fetchCityEvents(city: City, sort: EventSort = 'date'): Promise<RealEvent[]> {
  const jobs: Promise<RealEvent[]>[] = []
  if (hasTicketmasterKey) {
    // le pool « pertinence » s'étale naturellement sur les semaines à venir ;
    // en mode « par date » on y ajoute les événements les plus proches
    jobs.push(tmSearchEvents(city.coords, 'relevance'))
    if (sort === 'date') jobs.push(tmSearchEvents(city.coords, 'date'))
  }
  if (hasOpenAgendaKey && city.country === 'France') jobs.push(oaSearchEvents(city))
  if (city.id === 'paris') jobs.push(qfapUpcomingEvents())
  if (jobs.length === 0) return []

  const settled = await Promise.allSettled(jobs)
  const merged = settled
    .filter((s): s is PromiseFulfilledResult<RealEvent[]> => s.status === 'fulfilled')
    .flatMap((s) => s.value)

  // toutes les sources ont échoué -> on remonte l'erreur
  if (merged.length === 0 && settled.every((s) => s.status === 'rejected')) {
    throw new Error('Aucune source événements disponible')
  }

  // dédoublonnage inter-sources : même clé de titre (toutes dates, gère les
  // séries) ou même jour avec un titre qui prolonge l'autre (TM d'abord dans
  // la fusion => sa version, avec billetterie, gagne)
  const seen: { key: string; iso?: string }[] = []
  const events = merged.filter((e) => {
    const key = dedupeKey(e.name)
    const duplicate = seen.some(
      (s) => s.key === key || (s.iso !== undefined && s.iso === e.iso && titlesOverlap(s.key, key)),
    )
    if (duplicate) return false
    seen.push({ key, iso: e.iso })
    return true
  })

  // en mode « à la une », on préserve l'ordre de pertinence renvoyé par l'API
  if (sort === 'date') {
    events.sort((a, b) => (a.iso ?? '9999').localeCompare(b.iso ?? '9999'))
  }
  return events.slice(0, 80)
}

const DAY_MS = 24 * 60 * 60 * 1000

function daysFromToday(iso: string): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const d = new Date(`${iso}T12:00:00`)
  return Math.floor((d.getTime() - today.getTime()) / DAY_MS)
}

function withinPeriod(iso: string | undefined, period: EventPeriod): boolean {
  if (period === 'all') return true
  if (!iso) return false
  const diff = daysFromToday(iso)
  if (period === 'today') return diff === 0
  if (period === 'week') return diff >= 0 && diff < 7
  return diff >= 0 && diff < 31
}

/**
 * Prépare la liste affichée : filtre par période puis limite le nombre
 * d'événements par jour (2 max) pour étaler la sélection sur les prochaines
 * dates au lieu de montrer 12 fois le même jour.
 */
export function curateEvents(
  events: RealEvent[],
  period: EventPeriod,
  sort: EventSort,
  limit = 12,
): RealEvent[] {
  const inPeriod = events.filter((e) => withinPeriod(e.iso, period))
  const maxPerDay = period === 'today' ? Number.POSITIVE_INFINITY : 2

  const byDay = new Map<string, number>()
  const kept: RealEvent[] = []
  const skipped: RealEvent[] = []
  for (const e of inPeriod) {
    const day = e.iso ?? '?'
    const count = byDay.get(day) ?? 0
    if (count < maxPerDay) {
      kept.push(e)
      byDay.set(day, count + 1)
    } else {
      skipped.push(e)
    }
  }

  // la sélection diversifiée d'abord (triée par date si demandé)…
  const diverse = kept.slice(0, limit)
  if (sort === 'date') {
    diverse.sort((a, b) => (a.iso ?? '9999').localeCompare(b.iso ?? '9999'))
  }

  // …et seulement si elle est trop courte, on complète en fin de liste
  // (sans re-trier, pour ne pas re-remplir le haut avec le même jour)
  for (const e of skipped) {
    if (diverse.length >= limit) break
    diverse.push(e)
  }
  return diverse
}

/** Détail d'un événement à partir de son identifiant préfixé. */
export async function fetchEventById(id: string | undefined): Promise<RealEvent> {
  if (!id) throw new Error('Identifiant manquant')
  if (id.startsWith('tm_')) return tmEventById(id.slice(3))
  if (id.startsWith('oa_')) return oaEventById(id.slice(3))
  if (id.startsWith('paris_')) return qfapEventById(id.slice(6))
  throw new Error(`Identifiant inconnu : ${id}`)
}
