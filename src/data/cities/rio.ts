import type { City } from '../../types'
import { IMG } from '../images'

export const rio: City = {
  id: 'rio',
  name: 'Rio de Janeiro',
  country: 'Brésil',
  region: 'Amériques',
  gradient: 'linear-gradient(135deg,#2E7A5C,#4AA87A 55%,#E8C56B)',
  image: IMG['rio-hero'],
  coords: { lat: -22.9068, lon: -43.1729 },
  tagline: "La ville merveilleuse, entre pains de granit et samba.",
  intro:
    "Rio coule entre mer et montagne : plages mythiques, forêt tropicale en pleine ville et une joie de vivre contagieuse qui culmine au carnaval.",
  places: [
    {
      name: 'Christ Rédempteur', cat: 'touristique',
      blurb: "Les bras ouverts sur la baie, au sommet du Corcovado.",
      image: IMG['rio-christ'],
    },
    {
      name: 'Pain de Sucre', cat: 'touristique',
      blurb: "Le téléphérique mythique et le coucher de soleil sur Niterói.",
      image: IMG['rio-sugarloaf'],
    },
    {
      name: 'Escalier Selarón', cat: 'artistique',
      blurb: "215 marches couvertes de céramiques du monde entier.",
      image: IMG['rio-selaron'],
    },
    {
      name: 'Confeitaria Colombo', cat: 'restaurant',
      blurb: "Pâtisseries et miroirs Belle Époque au cœur du centre.",
      image: IMG['rio-colombo'],
    },
    {
      name: 'Copacabana', cat: 'activite',
      blurb: "Quatre kilomètres de sable, de footvolley et de caipirinhas.",
      image: IMG['rio-copacabana'],
    },
    {
      name: 'Musée de Demain', cat: 'artistique',
      blurb: "Vaisseau futuriste de Calatrava posé sur la baie de Guanabara.",
      image: IMG['rio-tomorrow'],
    },
  ],
}
