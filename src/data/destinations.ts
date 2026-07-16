import type { City, LodgingType, PlaceCategory } from '../types'
import { unsplash } from './images'
import { paris } from './cities/paris'
import { rome } from './cities/rome'
import { barcelone } from './cities/barcelone'
import { lisbonne } from './cities/lisbonne'
import { londres } from './cities/londres'
import { amsterdam } from './cities/amsterdam'
import { berlin } from './cities/berlin'
import { prague } from './cities/prague'
import { istanbul } from './cities/istanbul'
import { marseille } from './cities/marseille'
import { newyork } from './cities/newyork'
import { montreal } from './cities/montreal'
import { miami } from './cities/miami'
import { mexico } from './cities/mexico'
import { rio } from './cities/rio'
import { tokyo } from './cities/tokyo'
import { kyoto } from './cities/kyoto'
import { bangkok } from './cities/bangkok'
import { marrakech } from './cities/marrakech'
import { lecap } from './cities/lecap'

export const EVENT_GRADIENT = 'linear-gradient(135deg,#8E3C24,#C25436 55%,#E8A06B)'
export const LODGING_GRADIENT = 'linear-gradient(135deg,#8A7B66,#C6B79A)'

export const HOTEL_PHOTOS = [
  unsplash('photo-1566665797739-1674de7a421a', 600),
  unsplash('photo-1611892440504-42a792e24d32', 600),
  unsplash('photo-1590490360182-c33d57733427', 600),
  unsplash('photo-1618773928121-c32242e63f39', 600),
]

export const CATEGORY_META: Record<PlaceCategory, { label: string; gradient: string }> = {
  touristique: { label: 'Tourisme', gradient: 'linear-gradient(135deg,#4B6C8A,#8FA9C4)' },
  artistique: { label: 'Art & Culture', gradient: 'linear-gradient(135deg,#6E3B63,#B4708F)' },
  restaurant: { label: 'Gastronomie', gradient: 'linear-gradient(135deg,#B5623A,#E0A66B)' },
  activite: { label: 'Expérience', gradient: 'linear-gradient(135deg,#2F6E63,#6FA98C)' },
}

export const LODGING_TAG: Record<LodgingType, { bg: string; color: string }> = {
  'Hôtel': { bg: 'rgba(75,108,138,.14)', color: '#3E5C76' },
  "Maison d'hôtes": { bg: 'rgba(110,59,99,.14)', color: '#6E3B63' },
  'Airbnb': { bg: 'rgba(194,84,54,.14)', color: '#B5623A' },
  'Auberge': { bg: 'rgba(47,110,99,.14)', color: '#2F6E63' },
}

// L'ordre définit l'affichage à l'intérieur de chaque continent sur la page d'accueil.
export const CITIES: City[] = [
  paris, rome, barcelone, lisbonne, londres, amsterdam, berlin, prague, istanbul, marseille,
  newyork, montreal, miami, mexico, rio,
  tokyo, kyoto, bangkok,
  marrakech, lecap,
]

export function getCity(cityId: string | undefined): City | undefined {
  return CITIES.find((c) => c.id === cityId)
}
