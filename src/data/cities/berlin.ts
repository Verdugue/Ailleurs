import type { City } from '../../types'
import { IMG } from '../images'

export const berlin: City = {
  id: 'berlin',
  name: 'Berlin',
  country: 'Allemagne',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#37474F,#607D8B 55%,#C9A66B)',
  image: IMG['berlin-hero'],
  coords: { lat: 52.52, lon: 13.405 },
  tagline: "L'histoire à vif et la nuit la plus libre d'Europe.",
  intro:
    "Berlin ne ressemble à aucune autre capitale : friches devenues clubs, mémoire omniprésente, galeries sauvages et kebabs à toute heure. Rude, vaste et magnétique.",
  places: [
    {
      name: 'Porte de Brandebourg', cat: 'touristique',
      blurb: "Le symbole de la ville réunifiée, majestueux de nuit.",
      image: IMG['berlin-brandebourg'],
    },
    {
      name: 'East Side Gallery', cat: 'artistique',
      blurb: 'Le plus long tronçon du Mur, couvert de fresques.',
      image: IMG['berlin-eastside'],
    },
    {
      name: 'Île aux Musées', cat: 'artistique',
      blurb: "Cinq musées majeurs sur une île de la Spree, dont Pergame.",
      image: IMG['berlin-museumsinsel'],
    },
    {
      name: 'Markthalle Neun', cat: 'restaurant',
      blurb: 'Halle 1900 ressuscitée par les artisans du goût.',
      image: IMG['berlin-markthalle'],
    },
    {
      name: 'Kreuzberg', cat: 'activite',
      blurb: 'Street-art, canaux et la scène alternative historique.',
      image: IMG['berlin-kreuzberg'],
    },
    {
      name: 'Tiergarten', cat: 'touristique',
      blurb: 'Immense forêt urbaine entre la Porte et la colonne de la Victoire.',
      image: IMG['berlin-tiergarten'],
    },
  ],
}
