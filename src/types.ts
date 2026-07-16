export type PlaceCategory = 'touristique' | 'artistique' | 'restaurant' | 'activite'

export type Region = 'Europe' | 'Amériques' | 'Asie' | 'Afrique'

export interface Coords {
  lat: number
  lon: number
}

export interface Place {
  name: string
  cat: PlaceCategory
  blurb: string
  image?: string
}

/** Types d'hébergement (issus des tags OpenStreetMap) */
export type LodgingType = 'Hôtel' | "Maison d'hôtes" | 'Airbnb' | 'Auberge'

export interface City {
  id: string
  name: string
  country: string
  region: Region
  gradient: string
  image?: string
  coords: Coords
  tagline: string
  intro: string
  places: Place[]
}
