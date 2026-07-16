import type { City } from '../../types'
import { IMG } from '../images'

export const lecap: City = {
  id: 'le-cap',
  name: 'Le Cap',
  country: 'Afrique du Sud',
  region: 'Afrique',
  gradient: 'linear-gradient(135deg,#2E5C7A,#4A8AA8 55%,#E0B487)',
  image: IMG['lecap-hero'],
  coords: { lat: -33.9249, lon: 18.4241 },
  tagline: "Une montagne plate, deux océans et mille couleurs.",
  intro:
    "Coincée entre la montagne de la Table et l'Atlantique, Cape Town aligne plages sauvages, vignobles centenaires et une scène créative qui bouillonne.",
  places: [
    {
      name: 'Montagne de la Table', cat: 'touristique',
      blurb: "Le plateau mythique, en téléphérique ou à pied pour les braves.",
      image: IMG['lecap-table'],
    },
    {
      name: 'V&A Waterfront', cat: 'activite',
      blurb: "Docks victoriens, grande roue et otaries dans le port.",
      image: IMG['lecap-waterfront'],
    },
    {
      name: 'Zeitz MOCAA', cat: 'artistique',
      blurb: "L'art africain contemporain dans un silo à grains sculpté.",
      image: IMG['lecap-zeitz'],
    },
    {
      name: 'La Colombe', cat: 'restaurant',
      blurb: "Gastronomie sud-africaine au sommet d'un vignoble de Constantia.",
      image: IMG['amb-restaurant'],
    },
    {
      name: 'Bo-Kaap', cat: 'touristique',
      blurb: "Façades fuchsia, lime et turquoise du quartier malais.",
      image: IMG['lecap-bokaap'],
    },
    {
      name: 'Kirstenbosch', cat: 'activite',
      blurb: "Jardin botanique légendaire adossé à la montagne.",
      image: IMG['lecap-kirstenbosch'],
    },
  ],
}
