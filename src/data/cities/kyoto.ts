import type { City } from '../../types'
import { IMG } from '../images'

export const kyoto: City = {
  id: 'kyoto',
  name: 'Kyoto',
  country: 'Japon',
  region: 'Asie',
  gradient: 'linear-gradient(135deg,#8E2424,#C4443C 55%,#E8A06B)',
  image: IMG['kyoto-hero'],
  coords: { lat: 35.0116, lon: 135.7681 },
  tagline: "Mille temples, des geishas pressées et le Japon éternel.",
  intro:
    "L'ancienne capitale impériale cultive la beauté à chaque saison : torii vermillon, jardins de mousse, machiya de bois sombre et kaiseki d'orfèvre.",
  places: [
    {
      name: 'Fushimi Inari', cat: 'touristique',
      blurb: "Dix mille torii vermillon grimpent la montagne sacrée.",
      image: IMG['kyoto-fushimi'],
    },
    {
      name: 'Kinkaku-ji', cat: 'touristique',
      blurb: "Le Pavillon d'or et son reflet parfait sur l'étang.",
      image: IMG['kyoto-kinkaku'],
    },
    {
      name: 'Arashiyama', cat: 'activite',
      blurb: "La bambouseraie, le pont Togetsukyo et les singes de la montagne.",
      image: IMG['kyoto-arashiyama'],
    },
    {
      name: 'Marché Nishiki', cat: 'restaurant',
      blurb: "La « cuisine de Kyoto » : tsukemono, tofu soyeux et thé matcha.",
      image: IMG['kyoto-nishiki'],
    },
    {
      name: 'Gion', cat: 'activite',
      blurb: "Le quartier des geishas, lanternes et maisons de thé centenaires.",
      image: IMG['kyoto-gion'],
    },
    {
      name: 'Musée du manga', cat: 'artistique',
      blurb: "300 000 volumes dans une ancienne école — lecture sur la pelouse.",
      image: IMG['kyoto-manga'],
    },
  ],
}
