import type { City } from '../../types'
import { IMG } from '../images'

export const amsterdam: City = {
  id: 'amsterdam',
  name: 'Amsterdam',
  country: 'Pays-Bas',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#5C2E24,#A85A3C 55%,#E0A66B)',
  image: IMG['amsterdam-hero'],
  coords: { lat: 52.3676, lon: 4.9041 },
  tagline: 'Canaux paisibles, vélos partout et maîtres flamands.',
  intro:
    "Amsterdam se vit au fil de l'eau : façades penchées, ponts fleuris et musées d'exception. Louez un vélo, laissez-vous porter d'un quartier à l'autre.",
  places: [
    {
      name: 'Rijksmuseum', cat: 'artistique',
      blurb: "Rembrandt, Vermeer et le Siècle d'or sous une nef grandiose.",
      image: IMG['amsterdam-rijks'],
    },
    {
      name: 'Ceinture des canaux', cat: 'touristique',
      blurb: "Le Grachtengordel, classé UNESCO, à pied ou en bateau.",
      image: IMG['amsterdam-canaux'],
    },
    {
      name: 'Jordaan', cat: 'activite',
      blurb: 'Ancien quartier populaire devenu le plus charmant des dédales.',
      image: IMG['amsterdam-jordaan'],
    },
    {
      name: 'De Kas', cat: 'restaurant',
      blurb: "Table gastronomique dans une serre, du potager à l'assiette.",
      image: IMG['amb-restaurant'],
    },
    {
      name: 'Musée Van Gogh', cat: 'artistique',
      blurb: 'La plus grande collection au monde du maître tourmenté.',
      image: IMG['amsterdam-vangogh'],
    },
    {
      name: 'Vondelpark', cat: 'touristique',
      blurb: 'Le poumon vert où toute la ville pique-nique aux beaux jours.',
      image: IMG['amsterdam-vondel'],
    },
  ],
}
