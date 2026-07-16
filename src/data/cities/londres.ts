import type { City } from '../../types'
import { IMG } from '../images'

export const londres: City = {
  id: 'londres',
  name: 'Londres',
  country: 'Royaume-Uni',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#2E3A5C,#5C6E96 55%,#C9A66B)',
  image: IMG['londres-hero'],
  coords: { lat: 51.5074, lon: -0.1278 },
  tagline: 'Pubs centenaires, musées géants et quartiers-mondes.',
  intro:
    "Londres est mille villes en une : marchés bigarrés, galeries gratuites, parcs royaux et scènes musicales qui ont changé l'histoire. Prévoyez de bonnes chaussures.",
  places: [
    {
      name: 'British Museum', cat: 'artistique',
      blurb: "L'histoire du monde entier sous une verrière spectaculaire.",
      image: IMG['londres-british'],
    },
    {
      name: 'Tower Bridge', cat: 'touristique',
      blurb: 'Le pont levant victorien, symbole de la Tamise.',
      image: IMG['londres-towerbridge'],
    },
    {
      name: 'Camden Market', cat: 'activite',
      blurb: 'Contre-culture, vintage et street-food le long du canal.',
      image: IMG['londres-camden'],
    },
    {
      name: 'Dishoom', cat: 'restaurant',
      blurb: 'Cantine bombayite culte — le black daal vaut la file.',
      image: IMG['amb-curry'],
    },
    {
      name: 'Tate Modern', cat: 'artistique',
      blurb: "Art moderne dans une centrale électrique face à St Paul.",
      image: IMG['londres-tate'],
    },
    {
      name: 'Notting Hill', cat: 'touristique',
      blurb: "Façades pastel, antiquaires et l'esprit de Portobello Road.",
      image: IMG['londres-notting'],
    },
  ],
}
