import type { City } from '../../types'
import { IMG } from '../images'

export const rome: City = {
  id: 'rome',
  name: 'Rome',
  country: 'Italie',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#7A3B2E,#C96F4A 55%,#E0B487)',
  image: IMG['rome-hero'],
  coords: { lat: 41.8933, lon: 12.4829 },
  tagline: 'Un musée à ciel ouvert où chaque pierre a deux mille ans.',
  intro:
    "La Ville éternelle superpose empires, fontaines baroques et trattorias familiales. On y marche beaucoup, on y mange mieux encore, et on lève les yeux à chaque coin de rue.",
  places: [
    {
      name: 'Colisée', cat: 'touristique',
      blurb: "L'amphithéâtre le plus célèbre du monde, vertigineux d'histoire.",
      image: IMG['rome-colisee'],
    },
    {
      name: 'Musées du Vatican', cat: 'artistique',
      blurb: "De la chapelle Sixtine aux galeries infinies de chefs-d'œuvre.",
      image: IMG['rome-vatican'],
    },
    {
      name: 'Trastevere', cat: 'activite',
      blurb: 'Ruelles pavées, linge aux fenêtres et soirées animées.',
      image: IMG['rome-trastevere'],
    },
    {
      name: 'Roscioli', cat: 'restaurant',
      blurb: 'Carbonara culte et cave à vins dans une épicerie historique.',
      image: IMG['amb-pasta'],
    },
    {
      name: 'Panthéon', cat: 'touristique',
      blurb: "Coupole antique parfaite, ouverte sur le ciel depuis 2000 ans.",
      image: IMG['rome-pantheon'],
    },
    {
      name: 'Galerie Borghèse', cat: 'artistique',
      blurb: "Le Bernin et le Caravage dans une villa au cœur d'un parc.",
      image: IMG['rome-borghese'],
    },
  ],
}
