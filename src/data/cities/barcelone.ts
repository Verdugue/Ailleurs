import type { City } from '../../types'
import { IMG } from '../images'

export const barcelone: City = {
  id: 'barcelone',
  name: 'Barcelone',
  country: 'Espagne',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#7A2E4A,#C4485F 55%,#E8A06B)',
  image: IMG['barcelone-hero'],
  coords: { lat: 41.3874, lon: 2.1686 },
  tagline: 'Gaudí, tapas et Méditerranée dans une ville qui ne dort jamais.',
  intro:
    "Barcelone déroule ses avenues modernistes entre mer et collines. Architecture délirante, marchés gourmands et quartiers qui vivent tard : la capitale catalane est une fête permanente.",
  places: [
    {
      name: 'Sagrada Família', cat: 'touristique',
      blurb: "Le chef-d'œuvre inachevé de Gaudí, forêt de pierre et de lumière.",
      image: IMG['barcelone-sagrada'],
    },
    {
      name: 'Parc Güell', cat: 'touristique',
      blurb: 'Mosaïques ondulantes et vues sur toute la ville.',
      image: IMG['barcelone-guell'],
    },
    {
      name: 'Musée Picasso', cat: 'artistique',
      blurb: 'Les années de formation du maître dans cinq palais gothiques.',
      image: IMG['barcelone-picasso'],
    },
    {
      name: 'El Xampanyet', cat: 'restaurant',
      blurb: 'Tapas et cava dans un comptoir centenaire du Born.',
      image: IMG['amb-paella'],
    },
    {
      name: 'Barri Gòtic', cat: 'activite',
      blurb: 'Labyrinthe médiéval entre placettes cachées et échoppes.',
      image: IMG['barcelone-gotic'],
    },
    {
      name: 'Fondation Joan Miró', cat: 'artistique',
      blurb: 'Couleurs et poésie sur les hauteurs de Montjuïc.',
      image: IMG['barcelone-miro'],
    },
  ],
}
