import type { City } from '../../types'

const wm = 'https://upload.wikimedia.org/wikipedia/commons'

export const marseille: City = {
  id: 'marseille',
  name: 'Marseille',
  country: 'France',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#1F6E8C,#2E8A9C 50%,#E0C068)',
  image: `${wm}/thumb/7/74/Marseille_Old_Port.jpg/1920px-Marseille_Old_Port.jpg`,
  coords: { lat: 43.2965, lon: 5.3698 },
  tagline: 'La Méditerranée brute, solaire et joyeusement indomptée.',
  intro:
    "Entre calanques turquoise et Vieux-Port vivant, Marseille cultive un caractère franc, une scène artistique bouillonnante et une cuisine iodée.",
  places: [
    {
      name: 'Le Vieux-Port', cat: 'touristique',
      blurb: 'Le cœur battant de la ville, entre pêcheurs et cafés.',
      image: `${wm}/thumb/7/74/Marseille_Old_Port.jpg/960px-Marseille_Old_Port.jpg`,
    },
    {
      name: 'MuCEM', cat: 'artistique',
      blurb: "Architecture spectaculaire au bord de l'eau, civilisations méditerranéennes.",
      image: `${wm}/thumb/2/2c/%22Beeindruckende_Architektur%22._5.jpg/960px-%22Beeindruckende_Architektur%22._5.jpg`,
    },
    {
      name: 'Calanques', cat: 'activite',
      blurb: 'Randonnée et baignade dans des criques turquoise.',
      image: `${wm}/thumb/7/7a/En-Vau_calanque_4.jpg/960px-En-Vau_calanque_4.jpg`,
    },
    {
      name: 'Chez Fonfon', cat: 'restaurant',
      blurb: 'La bouillabaisse dans un vallon de pêcheurs.',
      image: `${wm}/2/24/Bullabessa.jpg`,
    },
    {
      name: 'Le Panier', cat: 'touristique',
      blurb: 'Le plus vieux quartier, ruelles colorées et street-art.',
      image: `${wm}/thumb/c/c8/Rue_Panier_Marseille.jpg/960px-Rue_Panier_Marseille.jpg`,
    },
    {
      name: 'La Friche Belle de Mai', cat: 'artistique',
      blurb: 'Ancienne usine devenue fabrique culturelle foisonnante.',
      image: `${wm}/thumb/a/a5/Friche_Belle_de_Mai.JPG/960px-Friche_Belle_de_Mai.JPG`,
    },
  ],
}
