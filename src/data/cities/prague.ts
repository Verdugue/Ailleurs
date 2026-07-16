import type { City } from '../../types'
import { IMG } from '../images'

export const prague: City = {
  id: 'prague',
  name: 'Prague',
  country: 'Tchéquie',
  region: 'Europe',
  gradient: 'linear-gradient(135deg,#4A3A5C,#8A6E96 55%,#E8C56B)',
  image: IMG['prague-hero'],
  coords: { lat: 50.0755, lon: 14.4378 },
  tagline: 'La ville aux cent clochers, dorée au soleil couchant.',
  intro:
    "Prague semble sortie d'un conte : ponts gothiques, façades baroques et tavernes voûtées. L'hiver, sous la neige et les lampadaires, la magie opère encore plus fort.",
  places: [
    {
      name: 'Pont Charles', cat: 'touristique',
      blurb: "Trente statues baroques au-dessus de la Vltava, magique à l'aube.",
      image: IMG['prague-charles'],
    },
    {
      name: 'Château de Prague', cat: 'touristique',
      blurb: 'La plus grande forteresse ancienne du monde domine la ville.',
      image: IMG['prague-chateau'],
    },
    {
      name: 'DOX', cat: 'artistique',
      blurb: "Art contemporain audacieux et zeppelin posé sur le toit.",
      image: IMG['prague-dox'],
    },
    {
      name: 'Lokál', cat: 'restaurant',
      blurb: 'Cuisine tchèque du jour et pilsner non filtrée à la tireuse.',
      image: IMG['amb-beer'],
    },
    {
      name: 'Place de la Vieille-Ville', cat: 'activite',
      blurb: "L'horloge astronomique, les flèches de Týn et les ruelles autour.",
      image: IMG['prague-oldtown'],
    },
    {
      name: 'Galerie nationale', cat: 'artistique',
      blurb: "Sept siècles d'art tchèque et européen au palais des Foires.",
      image: IMG['prague-galerie'],
    },
  ],
}
