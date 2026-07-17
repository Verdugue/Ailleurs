import { useMemo, useState } from 'react'
import { StarIcon } from './icons'

export interface Review {
  author: string
  rating: number
  text: string
  ts: number
}

/** Rangée d'étoiles pleines/vides pour une note donnée. */
function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'star-on' : 'star-off'}>
          <StarIcon size={size} />
        </span>
      ))}
    </span>
  )
}

/** Sélecteur d'étoiles cliquable pour le formulaire. */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <span className="star-picker" role="radiogroup" aria-label="Votre note">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'star-on' : 'star-off'}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          aria-checked={n === value}
          role="radio"
          onClick={() => onChange(n)}
        >
          <StarIcon size={22} />
        </button>
      ))}
    </span>
  )
}

function load(storageKey: string): Review[] {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return []
    const data = JSON.parse(raw) as Review[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Avis des visiteurs, enregistrés localement (localStorage) faute de serveur.
 * Chaque appareil garde ses propres avis — c'est indiqué clairement.
 */
export function PlaceReviews({ storageKey, placeName }: { storageKey: string; placeName: string }) {
  const [reviews, setReviews] = useState<Review[]>(() => load(storageKey))
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  const average = useMemo(
    () => (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0),
    [reviews],
  )

  function persist(next: Review[]) {
    setReviews(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // stockage indisponible : l'avis reste au moins affiché pour la session
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const review: Review = {
      author: author.trim() || 'Voyageur·se anonyme',
      rating,
      text: trimmed,
      ts: Date.now(),
    }
    persist([review, ...reviews])
    setAuthor('')
    setText('')
    setRating(5)
  }

  return (
    <div className="reviews">
      <div className="reviews-head">
        <div>
          <h2>Avis des voyageurs</h2>
          <p className="reviews-sub">Enregistrés sur cet appareil · partagez votre ressenti</p>
        </div>
        {reviews.length > 0 && (
          <div className="reviews-score">
            <strong>{average.toFixed(1)}</strong>
            <Stars value={Math.round(average)} />
            <span>
              {reviews.length} avis{reviews.length > 1 ? '' : ''}
            </span>
          </div>
        )}
      </div>

      <form className="review-form" onSubmit={submit}>
        <div className="review-form-row">
          <input
            className="review-input"
            type="text"
            placeholder="Votre prénom (facultatif)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={40}
          />
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <textarea
          className="review-textarea"
          placeholder={`Qu'avez-vous pensé de ${placeName} ?`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={600}
        />
        <div className="review-form-foot">
          <button type="submit" className="btn-primary review-submit" disabled={!text.trim()}>
            Publier mon avis
          </button>
        </div>
      </form>

      {reviews.length === 0 ? (
        <p className="empty-note">
          Aucun avis pour l'instant — soyez le premier à raconter votre expérience.
        </p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.ts} className="review-item">
              <div className="review-item-head">
                <span className="review-author">{r.author}</span>
                <Stars value={r.rating} />
                <span className="review-date">{formatDate(r.ts)}</span>
              </div>
              <p className="review-text">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
