import type { City } from '../../types'
import { unsplash } from '../images'

const wm = 'https://upload.wikimedia.org/wikipedia/commons'

export const miami: City = {
  id: 'miami',
  name: 'Miami',
  country: 'États-Unis',
  region: 'Amériques',
  gradient: 'linear-gradient(135deg,#F06B78,#F4A26B 55%,#63C6C2)',
  image: unsplash('photo-1506966953602-c20cc11f75e3', 1600),
  coords: { lat: 25.7617, lon: -80.1918 },
  tagline: 'Art déco, plages infinies et énergie latino-tropicale.',
  intro:
    "Miami vibre au rythme des palmiers et du néon : façades pastel, art urbain à Wynwood, sable blanc et nuits qui n'en finissent pas.",
  places: [
    {
      name: 'South Beach', cat: 'touristique',
      blurb: 'Sable blanc, cabanes de sauveteurs colorées et Art déco.',
      image: `${wm}/thumb/b/bf/Ocean_drive_day_2009j.JPG/960px-Ocean_drive_day_2009j.JPG`,
    },
    {
      name: 'Wynwood Walls', cat: 'artistique',
      blurb: 'Musée à ciel ouvert du street-art mondial.',
      image: `${wm}/thumb/9/90/Wynwood_Walls_%289969056203%29.jpg/960px-Wynwood_Walls_%289969056203%29.jpg`,
    },
    {
      name: 'Little Havana', cat: 'activite',
      blurb: 'Cafecito, cigares et salsa sur Calle Ocho.',
      image: `${wm}/thumb/f/f3/Little_Havana_Dominos_Park.JPG/960px-Little_Havana_Dominos_Park.JPG`,
    },
    {
      name: "Joe's Stone Crab", cat: 'restaurant',
      blurb: 'Institution locale du crabe de pierre depuis 1913.',
      image: `${wm}/thumb/f/f7/Joe%27s_Stone_Crab_2019.jpg/960px-Joe%27s_Stone_Crab_2019.jpg`,
    },
    {
      name: 'Vizcaya', cat: 'touristique',
      blurb: 'Villa italienne et jardins luxuriants au bord de la baie.',
      image: `${wm}/thumb/2/25/Villa_Vizcaya_20110228.jpg/960px-Villa_Vizcaya_20110228.jpg`,
    },
    {
      name: 'Pérez Art Museum', cat: 'artistique',
      blurb: 'Art contemporain les pieds dans la baie de Biscayne.',
      image: `${wm}/thumb/b/bd/PAMM_MRD_27.jpg/960px-PAMM_MRD_27.jpg`,
    },
  ],
}
