import type { City } from '../../types'
import { IMG } from '../images'

export const newyork: City = {
  id: 'new-york',
  name: 'New York',
  country: 'États-Unis',
  region: 'Amériques',
  gradient: 'linear-gradient(135deg,#1F2E3E,#3E5C76 55%,#E8A06B)',
  image: IMG['newyork-hero'],
  coords: { lat: 40.7128, lon: -74.006 },
  tagline: "La ville-monde qui ne s'excuse jamais d'être trop.",
  intro:
    "Gratte-ciels, delis ouverts la nuit, musées démesurés et quartiers qui changent de langue à chaque bloc : New York épuise et électrise, souvent dans la même heure.",
  places: [
    {
      name: 'Central Park', cat: 'touristique',
      blurb: "340 hectares de nature encadrés par les tours de Manhattan.",
      image: IMG['newyork-central'],
    },
    {
      name: 'MoMA', cat: 'artistique',
      blurb: "Van Gogh, Warhol et tout l'art moderne sur six étages.",
      image: IMG['newyork-moma'],
    },
    {
      name: 'Brooklyn Bridge', cat: 'touristique',
      blurb: "La traversée piétonne mythique, au lever du jour de préférence.",
      image: IMG['newyork-brooklyn'],
    },
    {
      name: "Katz's Delicatessen", cat: 'restaurant',
      blurb: "Le pastrami on rye légendaire, depuis 1888.",
      image: IMG['newyork-katz'],
    },
    {
      name: 'High Line', cat: 'activite',
      blurb: "Promenade suspendue sur une ancienne voie ferrée fleurie.",
      image: IMG['newyork-highline'],
    },
    {
      name: 'Whitney Museum', cat: 'artistique',
      blurb: "L'art américain face à l'Hudson, terrasses comprises.",
      image: IMG['newyork-whitney'],
    },
  ],
}
