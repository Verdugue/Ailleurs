import type { City } from '../../types'
import { IMG } from '../images'

export const lisbonne: City = {
  id: 'lisbonne',
  name: 'Lisbonne',
  country: 'Portugal',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#2E5E7A,#4A8AA8 55%,#E8C56B)',
  image: IMG['lisbonne-hero'],
  coords: { lat: 38.7223, lon: -9.1393 },
  tagline: 'Sept collines, des azulejos et une lumière qui rend nostalgique.',
  intro:
    "Lisbonne grimpe et descend entre tramways jaunes, façades carrelées et miradouros face au Tage. On s'y perd volontiers, un pastel de nata à la main.",
  places: [
    {
      name: 'Tour de Belém', cat: 'touristique',
      blurb: 'La sentinelle manuéline qui veillait sur les navigateurs.',
      image: IMG['lisbonne-belem'],
    },
    {
      name: 'MAAT', cat: 'artistique',
      blurb: "Vague de céramique blanche posée sur le Tage, art et architecture.",
      image: IMG['lisbonne-maat'],
    },
    {
      name: 'Alfama', cat: 'activite',
      blurb: 'Le plus vieux quartier, ruelles escarpées et fado au coin des rues.',
      image: IMG['lisbonne-alfama'],
    },
    {
      name: 'Time Out Market', cat: 'restaurant',
      blurb: 'Les meilleures tables de la ville sous une seule halle.',
      image: IMG['lisbonne-timeout'],
    },
    {
      name: 'Tramway 28', cat: 'touristique',
      blurb: 'Le tram jaune mythique qui traverse tous les quartiers historiques.',
      image: IMG['lisbonne-tram'],
    },
    {
      name: 'LX Factory', cat: 'artistique',
      blurb: 'Friche industrielle devenue repaire créatif sous le pont.',
      image: IMG['lisbonne-lx'],
    },
  ],
}
