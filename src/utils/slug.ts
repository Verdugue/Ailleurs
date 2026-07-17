// Transforme un nom de lieu en identifiant d'URL stable et lisible.
// « Kinkaku-ji » -> « kinkaku-ji », « Marché Nishiki » -> « marche-nishiki ».
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // tout séparateur -> tiret
    .replace(/^-+|-+$/g, '') // pas de tiret en début/fin
}
