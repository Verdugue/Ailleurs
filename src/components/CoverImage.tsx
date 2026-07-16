interface CoverImageProps {
  src?: string
  alt?: string
  /** true pour les images de héros (chargées immédiatement, pas en lazy) */
  eager?: boolean
}

/** Photo en couverture d'un bloc ; si elle ne charge pas, le dégradé du parent reste visible. */
export function CoverImage({ src, alt = '', eager = false }: CoverImageProps) {
  if (!src) return null
  return (
    <img
      className="cover-img"
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
