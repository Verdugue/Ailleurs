import type { City } from '../../types'
import { unsplash } from '../images'

const wm = 'https://upload.wikimedia.org/wikipedia/commons'

export const tokyo: City = {
  id: 'tokyo',
  name: 'Tokyo',
  country: 'Japon',
  region: 'Asie',
  gradient: 'linear-gradient(135deg,#5B2A4B,#B4426A 55%,#E8A06B)',
  image: unsplash('photo-1540959733332-eab4deabeeaf', 1600),
  coords: { lat: 35.6895, lon: 139.6917 },
  tagline: 'Néons, temples silencieux et une gastronomie sans fin.',
  intro:
    "Tokyo change de visage à chaque quartier : sanctuaires paisibles, ruelles d'izakaya et gratte-ciels futuristes cohabitent dans une énergie unique.",
  places: [
    {
      name: 'Senso-ji', cat: 'touristique',
      blurb: 'Le plus ancien temple de la ville, à Asakusa.',
      image: `${wm}/thumb/4/43/Sensoji_2023.jpg/960px-Sensoji_2023.jpg`,
    },
    {
      name: 'teamLab Planets', cat: 'artistique',
      blurb: 'Installations numériques immersives, une expérience sensorielle.',
      image: unsplash('photo-1550684376-efcbd6e3f031'),
    },
    {
      name: 'Shibuya Crossing', cat: 'touristique',
      blurb: 'Le carrefour le plus animé du monde, hypnotique.',
      image: `${wm}/thumb/8/88/Shibuya_Crossing%2C_Aerial.jpg/960px-Shibuya_Crossing%2C_Aerial.jpg`,
    },
    {
      name: 'Sushi Saito', cat: 'restaurant',
      blurb: "Omakase d'exception, une des grandes tables de sushi.",
      image: unsplash('photo-1579871494447-9811cf80d66c'),
    },
    {
      name: 'Golden Gai', cat: 'activite',
      blurb: 'Micro-bars et ambiance nocturne dans Shinjuku.',
      image: `${wm}/thumb/8/8d/G2_Street_20090626_2.jpg/960px-G2_Street_20090626_2.jpg`,
    },
    {
      name: 'Mori Art Museum', cat: 'artistique',
      blurb: 'Art contemporain perché au sommet de Roppongi Hills.',
      image: `${wm}/thumb/6/69/Roppongi_Hills_2013-12-01.jpg/960px-Roppongi_Hills_2013-12-01.jpg`,
    },
  ],
}
