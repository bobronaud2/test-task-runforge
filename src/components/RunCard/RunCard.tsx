import { formatDate, formatDuration } from '../../lib/format'
import type { Run } from '../../types/run'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import styles from './RunCard.module.css'

type RunCardProps = {
  run: Run
  onSelect: (runId: string) => void
}

export function RunCard({ run, onSelect }: RunCardProps) {
  return (
    <button
      type="button"
      className={styles.card}
      aria-haspopup="dialog"
      onClick={() => onSelect(run.id)}
    >
      <span className={styles.main}>
        <span className={styles.name}>{run.name}</span>
        <span className={styles.source}>
          {run.repository}
          <span className={styles.branch}>{run.branch}</span>
        </span>
      </span>
      <span className={styles.status}>
        <StatusBadge status={run.status} />
      </span>
      <span className={styles.meta}>
        <span className={styles.metaLabel}>Создан</span>
        <time dateTime={run.createdAt}>{formatDate(run.createdAt)}</time>
      </span>
      <span className={styles.meta}>
        <span className={styles.metaLabel}>Длительность</span>
        {formatDuration(run.durationSeconds)}
      </span>
    </button>
  )
}
