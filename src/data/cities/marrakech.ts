import type { City } from '../../types'
import { IMG } from '../images'

export const marrakech: City = {
  id: 'marrakech',
  name: 'Marrakech',
  country: 'Maroc',
  region: 'Afrique',
  gradient: 'linear-gradient(135deg,#8E3C24,#C4663C 55%,#E8B87E)',
  image: IMG['marrakech-hero'],
  coords: { lat: 31.6295, lon: -7.9811 },
  tagline: "La ville rouge, entre souks labyrinthiques et jardins secrets.",
  intro:
    "Marrakech étourdit : appels des muezzins, parfums d'épices, riads cachés derrière des portes anonymes et l'Atlas enneigé à l'horizon.",
  places: [
    {
      name: 'Jemaa el-Fna', cat: 'touristique',
      blurb: "La place-spectacle : conteurs, charmeurs de serpents et fumées de grillades.",
      image: IMG['marrakech-jemaa'],
    },
    {
      name: 'Jardin Majorelle', cat: 'touristique',
      blurb: "Le bleu électrique d'Yves Saint Laurent au milieu des cactus.",
      image: IMG['marrakech-majorelle'],
    },
    {
      name: 'Musée YSL', cat: 'artistique',
      blurb: "Quarante ans de haute couture dans un écrin de terre cuite.",
      image: IMG['marrakech-ysl'],
    },
    {
      name: 'Nomad', cat: 'restaurant',
      blurb: "Cuisine marocaine moderne sur les toits de la médina.",
      image: IMG['amb-restaurant'],
    },
    {
      name: 'Médina & souks', cat: 'activite',
      blurb: "Tanneurs, dinandiers et tapis : le grand labyrinthe marchand.",
      image: IMG['marrakech-medina'],
    },
    {
      name: 'Palais de la Bahia', cat: 'artistique',
      blurb: "Zelliges, cèdre peint et patios : le faste du XIXe marocain.",
      image: IMG['marrakech-bahia'],
    },
  ],
}
