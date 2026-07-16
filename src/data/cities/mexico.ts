import type { City } from '../../types'
import { IMG } from '../images'

export const mexico: City = {
  id: 'mexico',
  name: 'Mexico',
  country: 'Mexique',
  region: 'Amériques',
  gradient: 'linear-gradient(135deg,#7A2E3A,#B44A5C 55%,#E8A06B)',
  image: IMG['mexico-hero'],
  coords: { lat: 19.4326, lon: -99.1332 },
  tagline: "Mégapole aztèque, coloniale et follement créative.",
  intro:
    "CDMX empile les civilisations : pyramides sous les églises, fresques de Rivera, cantinas centenaires et la scène food la plus excitante des Amériques.",
  places: [
    {
      name: 'Zócalo', cat: 'touristique',
      blurb: "L'une des plus grandes places du monde, cœur battant du pays.",
      image: IMG['mexico-zocalo'],
    },
    {
      name: 'Musée Frida Kahlo', cat: 'artistique',
      blurb: "La Casa Azul, intime et bouleversante, à Coyoacán.",
      image: IMG['mexico-frida'],
    },
    {
      name: 'Teotihuacán', cat: 'touristique',
      blurb: "Les pyramides du Soleil et de la Lune, à une heure de la ville.",
      image: IMG['mexico-teotihuacan'],
    },
    {
      name: 'Pujol', cat: 'restaurant',
      blurb: "Le mole madre légendaire d'Enrique Olvera.",
      image: IMG['amb-tacos'],
    },
    {
      name: 'Coyoacán', cat: 'activite',
      blurb: "Places ombragées, marchés d'artisanat et churros chauds.",
      image: IMG['mexico-coyoacan'],
    },
    {
      name: "Musée d'anthropologie", cat: 'artistique',
      blurb: "La pierre du Soleil et les trésors des civilisations mexicaines.",
      image: IMG['mexico-anthro'],
    },
  ],
}
