import type { RunSort } from '../../lib/runs'
import styles from './SortSelect.module.css'

const SORT_OPTIONS: { value: RunSort; label: string }[] = [
  { value: 'created-desc', label: 'Сначала новые' },
  { value: 'created-asc', label: 'Сначала старые' },
  { value: 'duration-desc', label: 'Сначала долгие' },
  { value: 'duration-asc', label: 'Сначала быстрые' },
]

type SortSelectProps = {
  value: RunSort
  onChange: (value: RunSort) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>Сортировка</span>
      <select
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value as RunSort)}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
