import type { PlaceCategory } from '../types'

export type CategoryFilterValue = PlaceCategory | 'all'

const FILTERS: { key: CategoryFilterValue; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'touristique', label: 'Tourisme' },
  { key: 'artistique', label: 'Art & Culture' },
  { key: 'restaurant', label: 'Gastronomie' },
  { key: 'activite', label: 'Expériences' },
]

interface CategoryFilterProps {
  value: CategoryFilterValue
  onChange: (value: CategoryFilterValue) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="filter-row">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          className={`filter-pill${value === f.key ? ' is-active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
