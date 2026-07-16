import type { Coords } from '../types'

/**
 * Découverte d'une ville quelconque via l'API Wikipédia (sans clé) :
 * présentation de la ville et lieux notables autour du centre, catégorisés.
 */

const API = 'https://fr.wikipedia.org/w/api.php'
const CACHE_TTL_MS = 30 * 60 * 1000

export interface CityIntro {
  intro?: string
  image?: string
}

export type WikiCat = 'musee' | 'patrimoine' | 'nature' | 'quartier' | 'culture' | 'autre'

export const WIKI_CAT_LABEL: Record<WikiCat, string> = {
  musee: 'Musées & art',
  patrimoine: 'Patrimoine',
  nature: 'Nature',
  quartier: 'Places & rues',
  culture: 'Culture',
  autre: 'À voir',
}

export interface WikiPlace {
  title: string
  description?: string
  image?: string
  /** Article Wikipédia */
  url: string
  /** Site officiel du lieu (propriété P856 de Wikidata), s'il existe */
  website?: string
  cat: WikiCat
}

// bâtiments administratifs, judiciaires, scolaires… sans intérêt touristique
const BLACKLIST =
  /(canton|arrondissement|circonscription|commune fran|communaut|division administrative|intercommunal|liste|académie|élection|district|siège de|unité urbaine|aire d'attraction|évènement annuel|événement annuel|gare de triage|gare routière|station (du|de) métro|\(métro de|ligne \d|station de la ligne|échangeur|autoroute|cour d'appel|palais de justice|tribunal|préfecture|sous-préfecture|hôtel de police|commissariat|caserne|gendarmerie|hôpital|clinique|centre hospitalier|université|faculté|campus|lycée|collège|école|prison|centre pénitentiaire|rectorat|chambre de commerce|conseil (départemental|régional)|archives départementales|pôle emploi|zone d'activité|zone industrielle|centre commercial|rond-point|direction régionale|caisse (primaire|d'allocations)|maison d'arrêt)/i

const CAT_RULES: { cat: WikiCat; pattern: RegExp }[] = [
  { cat: 'musee', pattern: /(musée|muséum|galerie d'art|fondation|centre d'art|pinacothèque)/i },
  {
    cat: 'nature',
    pattern: /(parc|jardin|forêt|lac|étang|montagne|colline|calanque|plage|rivière|sentier|réserve naturelle|belvédère)/i,
  },
  {
    cat: 'culture',
    pattern: /(théâtre|opéra|conservatoire|salle de (spectacle|concert)|cinéma|médiathèque|bibliothèque|auditorium|zénith|arena|philharmonie)/i,
  },
  {
    cat: 'patrimoine',
    pattern:
      /(cathédrale|église|basilique|chapelle|abbaye|cloître|couvent|monastère|château|palais|beffroi|remparts|porte |tour |fontaine|monument|hôtel particulier|hôtel de |statue|obélisque|aqueduc|arc de|amphithéâtre|arènes|temple|mosquée|synagogue|oratoire|bastide|mausolée|site archéologique|citadelle|fort |donjon|calvaire|lavoir|moulin)/i,
  },
  {
    cat: 'quartier',
    pattern: /\b(place|placette|cours|rue|ruelle|boulevard|avenue|esplanade|quartier|halles|marché|pont|passage|allées)\b/i,
  },
]

const CAT_WEIGHT: Record<WikiCat, number> = {
  musee: 0,
  patrimoine: 1,
  nature: 2,
  quartier: 3,
  culture: 4,
  autre: 5,
}

function categorize(title: string, description: string): WikiCat {
  const text = `${title} ${description}`
  for (const rule of CAT_RULES) {
    if (rule.pattern.test(text)) return rule.cat
  }
  return 'autre'
}

interface WikiPage {
  ns?: number
  title?: string
  index?: number
  description?: string
  extract?: string
  thumbnail?: { source?: string }
  pageprops?: { wikibase_item?: string }
}

/** Sites officiels (P856) d'un lot d'entités Wikidata, en un seul appel. */
async function fetchOfficialWebsites(qids: string[]): Promise<Record<string, string>> {
  if (qids.length === 0) return {}
  const params = new URLSearchParams({
    action: 'wbgetentities',
    format: 'json',
    origin: '*',
    ids: qids.slice(0, 50).join('|'),
    props: 'claims',
  })
  const res = await fetch(`https://www.wikidata.org/w/api.php?${params}`)
  if (!res.ok) throw new Error(`Wikidata HTTP ${res.status}`)

  const json = (await res.json()) as {
    entities?: Record<
      string,
      { claims?: { P856?: { mainsnak?: { datavalue?: { value?: unknown } } }[] } }
    >
  }
  const sites: Record<string, string> = {}
  for (const [qid, entity] of Object.entries(json.entities ?? {})) {
    const value = entity.claims?.P856?.[0]?.mainsnak?.datavalue?.value
    if (typeof value === 'string' && value.startsWith('http')) sites[qid] = value
  }
  return sites
}

function readCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw) as { at: number; data: T }
    return Date.now() - at < CACHE_TTL_MS ? data : null
  } catch {
    return null
  }
}

function writeCache(key: string, data: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // cache optionnel
  }
}

/** Résumé + photo principale de l'article Wikipédia d'une ville. */
export async function fetchCityIntro(name: string): Promise<CityIntro> {
  const cacheKey = `ailleurs:wiki:intro:${name}`
  const cached = readCache<CityIntro>(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    titles: name,
    redirects: '1',
    prop: 'extracts|pageimages',
    exintro: '1',
    explaintext: '1',
    exsentences: '3',
    piprop: 'thumbnail',
    pithumbsize: '1600',
  })
  const res = await fetch(`${API}?${params}`)
  if (!res.ok) throw new Error(`Wikipédia HTTP ${res.status}`)

  const json = (await res.json()) as { query?: { pages?: Record<string, WikiPage> } }
  const page = Object.values(json.query?.pages ?? {})[0]
  // retire les notations phonétiques ([mɔ̃.pø.lje]) et mentions « prononcé … »
  const intro = page?.extract
    ?.replace(/\s*[—–]\s*prononcé[^—–]*[—–]/gi, '')
    .replace(/\[[^\]]{1,60}\]/g, '')
    .replace(/\(\s*[,;]?\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  const result: CityIntro = {
    intro: intro || undefined,
    image: page?.thumbnail?.source,
  }
  writeCache(cacheKey, result)
  return result
}

/** Lieux notables (avec photo) autour d'un point, catégorisés et filtrés. */
export async function fetchNearbyPlaces(center: Coords, cityName = ''): Promise<WikiPlace[]> {
  const cacheKey = `ailleurs:wiki:places4:${center.lat},${center.lon}`
  const cached = readCache<WikiPlace[]>(cacheKey)
  if (cached) return cached

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'geosearch',
    ggscoord: `${center.lat}|${center.lon}`,
    ggsradius: '10000',
    ggslimit: '50',
    prop: 'pageimages|description|pageprops',
    ppprop: 'wikibase_item',
    piprop: 'thumbnail',
    pithumbsize: '640',
  })
  const res = await fetch(`${API}?${params}`)
  if (!res.ok) throw new Error(`Wikipédia HTTP ${res.status}`)

  const json = (await res.json()) as { query?: { pages?: Record<string, WikiPage> } }
  const pages = Object.values(json.query?.pages ?? {})
    .filter(
      (p): p is WikiPage & { title: string } =>
        Boolean(p.title) &&
        (p.ns ?? 0) === 0 &&
        Boolean(p.thumbnail?.source) &&
        p.title!.toLowerCase() !== cityName.toLowerCase() &&
        !BLACKLIST.test(p.title!) &&
        !BLACKLIST.test(p.description ?? ''),
    )
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99))
    .slice(0, 24)

  // sites officiels via Wikidata (optionnel : les lieux restent affichés si ça échoue)
  let websites: Record<string, string> = {}
  try {
    const qids = pages
      .map((p) => p.pageprops?.wikibase_item)
      .filter((q): q is string => Boolean(q))
    websites = await fetchOfficialWebsites(qids)
  } catch {
    websites = {}
  }

  const places = pages.map((p) => ({
    title: p.title,
    description: p.description,
    image: p.thumbnail?.source,
    url: `https://fr.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, '_'))}`,
    website: p.pageprops?.wikibase_item ? websites[p.pageprops.wikibase_item] : undefined,
    cat: categorize(p.title, p.description ?? ''),
  }))

  writeCache(cacheKey, places)
  return places
}

/** Tri « Tout » : les catégories les plus touristiques d'abord, à proximité égale. */
export function sortByInterest(places: WikiPlace[]): WikiPlace[] {
  return [...places].sort((a, b) => CAT_WEIGHT[a.cat] - CAT_WEIGHT[b.cat])
}
