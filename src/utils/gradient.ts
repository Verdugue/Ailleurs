// Dégradés de secours pour les villes découvertes dynamiquement :
// choix stable (même ville => même dégradé) basé sur le nom.

const PALETTE = [
  'linear-gradient(135deg,#3E5C76,#748CAB 55%,#C9A66B)',
  'linear-gradient(135deg,#7A3B2E,#C96F4A 55%,#E0B487)',
  'linear-gradient(135deg,#2E5E7A,#4A8AA8 55%,#E8C56B)',
  'linear-gradient(135deg,#5B2A4B,#B4426A 55%,#E8A06B)',
  'linear-gradient(135deg,#2F6E63,#6FA98C 55%,#E0C068)',
  'linear-gradient(135deg,#4A3A5C,#8A6E96 55%,#E8C56B)',
  'linear-gradient(135deg,#8E3C24,#C4663C 55%,#E8B87E)',
  'linear-gradient(135deg,#2E4A5C,#4A7A96 55%,#E0B487)',
]

export function gradientFor(name: string): string {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 100000
  return PALETTE[hash % PALETTE.length]
}
