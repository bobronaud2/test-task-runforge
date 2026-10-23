import type { Run } from '../../types/run'
import { RunCard } from '../RunCard/RunCard'
import styles from './RunList.module.css'

type RunListProps = {
  runs: Run[]
  onSelect: (runId: string) => void
}

export function RunList({ runs, onSelect }: RunListProps) {
  return (
    <div>
      <div className={styles.header} aria-hidden="true">
        <span>Запуск</span>
        <span>Статус</span>
        <span>Создан</span>
        <span>Длительность</span>
      </div>
      <ul className={styles.list} aria-label="Запуски">
        {runs.map((run) => (
          <li key={run.id}>
            <RunCard run={run} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </div>
  )
}
