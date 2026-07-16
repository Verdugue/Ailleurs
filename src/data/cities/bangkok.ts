import type { City } from '../../types'
import { IMG } from '../images'

export const bangkok: City = {
  id: 'bangkok',
  name: 'Bangkok',
  country: 'Thaïlande',
  region: 'Asie',
  gradient: 'linear-gradient(135deg,#7A5A2E,#C49A3C 55%,#E8C56B)',
  image: IMG['bangkok-hero'],
  coords: { lat: 13.7563, lon: 100.5018 },
  tagline: "Temples d'or, klongs et la meilleure street-food du monde.",
  intro:
    "Bangkok ne s'arrête jamais : marchés flottants à l'aube, temples étincelants à midi, rooftops au crépuscule et woks fumants toute la nuit.",
  places: [
    {
      name: 'Grand Palais', cat: 'touristique',
      blurb: "Flèches dorées et Bouddha d'émeraude, l'éblouissement royal.",
      image: IMG['bangkok-palais'],
    },
    {
      name: 'Wat Arun', cat: 'touristique',
      blurb: "Le temple de l'Aube, mosaïques de porcelaine sur la rivière.",
      image: IMG['bangkok-watarun'],
    },
    {
      name: 'Jim Thompson House', cat: 'artistique',
      blurb: "Maisons de teck et trésors d'Asie du roi de la soie.",
      image: IMG['bangkok-jimthompson'],
    },
    {
      name: 'Jay Fai', cat: 'restaurant',
      blurb: "L'omelette au crabe étoilée, cuisinée en lunettes de ski.",
      image: IMG['amb-padthai'],
    },
    {
      name: 'Marché de Chatuchak', cat: 'activite',
      blurb: "15 000 échoppes le week-end : le plus grand marché d'Asie.",
      image: IMG['bangkok-chatuchak'],
    },
    {
      name: 'BACC', cat: 'artistique',
      blurb: "L'art contemporain thaï dans une spirale de béton blanc.",
      image: IMG['bangkok-bacc'],
    },
  ],
}
