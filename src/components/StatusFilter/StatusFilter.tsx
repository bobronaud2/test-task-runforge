import {
  RUN_STATUS_LABELS,
  type StatusFilter as StatusFilterValue,
} from '../../lib/runs'
import { RUN_STATUSES } from '../../types/run'
import styles from './StatusFilter.module.css'

const FILTER_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  ...RUN_STATUSES.map((status) => ({
    value: status,
    label: RUN_STATUS_LABELS[status],
  })),
]

type StatusFilterProps = {
  value: StatusFilterValue
  onChange: (value: StatusFilterValue) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className={styles.group} role="group" aria-label="Фильтр по статусу">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
