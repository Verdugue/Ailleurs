import type { City } from '../../types'
import { unsplash } from '../images'

const wm = 'https://upload.wikimedia.org/wikipedia/commons'

export const paris: City = {
  id: 'paris',
  name: 'Paris',
  country: 'France',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#3E5C76,#748CAB 55%,#C9A66B)',
  image: unsplash('photo-1502602898657-3e91760cbb34', 1600),
  coords: { lat: 48.8566, lon: 2.3522 },
  tagline: "Lumière, art de vivre et rues qui racontent des siècles.",
  intro:
    "La Ville Lumière mêle grands musées, bistrots de quartier et scènes créatives émergentes. Flânez, levez les yeux, laissez-vous surprendre.",
  places: [
    {
      name: "Musée d'Orsay", cat: 'artistique',
      blurb: "Chefs-d'œuvre impressionnistes dans une ancienne gare majestueuse.",
      image: unsplash('photo-1518998053901-5348d3961a04'),
    },
    {
      name: 'Tour Eiffel', cat: 'touristique',
      blurb: "L'icône de fer, spectaculaire au coucher du soleil.",
      image: `${wm}/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/960px-Tour_Eiffel_Wikimedia_Commons.jpg`,
    },
    {
      name: 'Le Marais', cat: 'activite',
      blurb: 'Ruelles médiévales, galeries et boutiques de créateurs.',
      image: `${wm}/thumb/d/d3/Paris_Hotel_de_Sens_dsc04028.jpg/960px-Paris_Hotel_de_Sens_dsc04028.jpg`,
    },
    {
      name: 'Septime', cat: 'restaurant',
      blurb: 'Cuisine de saison inventive, une table parmi les plus courues.',
      image: unsplash('photo-1414235077428-338989a2e8c0'),
    },
    {
      name: 'Montmartre', cat: 'touristique',
      blurb: "Village perché, ateliers d'artistes et vues sur la ville.",
      image: `${wm}/thumb/1/10/View_from_Notre-Dame_de_Paris%2C_24_June_2014_004.jpg/960px-View_from_Notre-Dame_de_Paris%2C_24_June_2014_004.jpg`,
    },
    {
      name: 'Fondation Louis Vuitton', cat: 'artistique',
      blurb: 'Art contemporain sous une voile de verre signée Gehry.',
      image: `https://upload.wikimedia.org/wikipedia/fr/thumb/1/14/2014-10-26_Fondation_d%27entreprise_Louis_Vuitton_week-end_inaugural_%28vue_du_jardin_d%27acclimatation%29.JPG/960px-2014-10-26_Fondation_d%27entreprise_Louis_Vuitton_week-end_inaugural_%28vue_du_jardin_d%27acclimatation%29.JPG`,
    },
  ],
}
