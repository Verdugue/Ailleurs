import type { City } from '../../types'
import { IMG } from '../images'

export const montreal: City = {
  id: 'montreal',
  name: 'Montréal',
  country: 'Canada',
  region: 'Amériques',
  gradient: 'linear-gradient(135deg,#2E4A6E,#5C7AA0 55%,#E0C068)',
  image: IMG['montreal-hero'],
  coords: { lat: 45.5019, lon: -73.5674 },
  tagline: "L'Amérique qui parle français, chaleureuse même à -20°.",
  intro:
    "Entre le fleuve et la montagne, Montréal cultive ses festivals, ses murales géantes et ses bagels tièdes. Une ville créative qui sait rire de son hiver.",
  places: [
    {
      name: 'Vieux-Montréal', cat: 'touristique',
      blurb: "Pavés, basilique Notre-Dame et l'écho de la Nouvelle-France.",
      image: IMG['montreal-vieux'],
    },
    {
      name: 'Mont Royal', cat: 'activite',
      blurb: "La « montagne » de la ville : belvédères, raquettes et tam-tams.",
      image: IMG['montreal-mont'],
    },
    {
      name: 'Musée des beaux-arts', cat: 'artistique',
      blurb: "Le grand musée du Québec, de Riopelle aux maîtres anciens.",
      image: IMG['montreal-mbam'],
    },
    {
      name: 'Marché Jean-Talon', cat: 'restaurant',
      blurb: "Sirop d'érable, fromages québécois et produits du terroir.",
      image: IMG['montreal-jeantalon'],
    },
    {
      name: 'Plateau Mont-Royal', cat: 'touristique',
      blurb: "Escaliers en colimaçon, murales et cafés de quartier.",
      image: IMG['montreal-plateau'],
    },
    {
      name: 'Place des Arts', cat: 'artistique',
      blurb: "Le cœur culturel de la ville et son quartier des spectacles.",
      image: IMG['montreal-placedesarts'],
    },
  ],
}
