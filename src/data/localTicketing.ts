/**
 * Billetteries de référence dans les pays où Ticketmaster n'opère pas (ou peu).
 * Liens réels vers les leaders locaux, affichés quand notre source mondiale ne
 * référence aucun événement.
 */

export interface LocalTicketing {
  name: string
  url: string
}

const BY_COUNTRY: Record<string, LocalTicketing> = {
  'corée du sud': { name: 'Interpark Ticket', url: 'https://www.globalinterpark.com' },
  'japon': { name: 'e+ (eplus)', url: 'https://eplus.jp' },
  'france': { name: 'Fnac Spectacles', url: 'https://www.fnacspectacles.com' },
  'thaïlande': { name: 'Thai Ticket Major', url: 'https://www.thaiticketmajor.com' },
  'portugal': { name: 'BOL', url: 'https://www.bol.pt' },
  'maroc': { name: 'Guichet.ma', url: 'https://guichet.ma' },
  'taïwan': { name: 'KKTIX', url: 'https://kktix.com' },
  'singapour': { name: 'SISTIC', url: 'https://www.sistic.com.sg' },
  'hong kong': { name: 'URBTIX', url: 'https://www.urbtix.hk' },
  'chine': { name: 'Damai', url: 'https://www.damai.cn' },
  'inde': { name: 'BookMyShow', url: 'https://in.bookmyshow.com' },
  'indonésie': { name: 'Loket', url: 'https://www.loket.com' },
  'viêt nam': { name: 'Ticketbox', url: 'https://ticketbox.vn' },
}

export function localTicketingFor(country: string | undefined): LocalTicketing | undefined {
  if (!country) return undefined
  return BY_COUNTRY[country.trim().toLowerCase()]
}
