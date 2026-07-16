import type { City } from '../../types'
import { IMG } from '../images'

export const istanbul: City = {
  id: 'istanbul',
  name: 'Istanbul',
  country: 'Turquie',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#2E4A5C,#4A7A96 55%,#E0B487)',
  image: IMG['istanbul-hero'],
  coords: { lat: 41.0082, lon: 28.9784 },
  tagline: 'Deux continents, mille minarets et le thé qui coule à flots.',
  intro:
    "À cheval sur le Bosphore, Istanbul empile Byzance, Constantinople et la mégapole moderne. Appels à la prière, bazars vibrants et ferries entre deux mondes.",
  places: [
    {
      name: 'Sainte-Sophie', cat: 'touristique',
      blurb: "Quinze siècles d'histoire sous la plus célèbre des coupoles.",
      image: IMG['istanbul-hagia'],
    },
    {
      name: 'Mosquée Bleue', cat: 'touristique',
      blurb: "Six minarets et vingt mille carreaux d'Iznik.",
      image: IMG['istanbul-bleue'],
    },
    {
      name: 'Istanbul Modern', cat: 'artistique',
      blurb: "L'art contemporain turc face au Bosphore, signé Renzo Piano.",
      image: IMG['istanbul-modern'],
    },
    {
      name: 'Çiya Sofrası', cat: 'restaurant',
      blurb: "Les cuisines oubliées d'Anatolie, côté asiatique.",
      image: IMG['amb-restaurant'],
    },
    {
      name: 'Grand Bazar', cat: 'activite',
      blurb: 'Quatre mille boutiques sous les voûtes peintes, depuis 1461.',
      image: IMG['istanbul-bazar'],
    },
    {
      name: 'Musée Pera', cat: 'artistique',
      blurb: 'Orientalistes et art moderne dans un palace 1900.',
      image: IMG['istanbul-pera'],
    },
  ],
}
