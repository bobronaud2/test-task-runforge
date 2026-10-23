import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { formatDate, formatDuration } from '../../lib/format'
import type { Run } from '../../types/run'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import styles from './RunDetails.module.css'

type RunDetailsProps = {
  run: Run
  onClose: () => void
}

function getMissingResultMessage(run: Run) {
  return run.status === 'queued' || run.status === 'running'
    ? 'Результат появится после завершения запуска.'
    : 'Агент не оставил результата.'
}

export function RunDetails({ run, onClose }: RunDetailsProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const appRoot = document.getElementById('root')
    appRoot?.setAttribute('inert', '')
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      appRoot?.removeAttribute('inert')
      previouslyFocused?.focus()
    }
  }, [onClose])

  const titleId = `run-details-${run.id}`

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.back}
            onClick={onClose}
          >
            ← К списку запусков
          </button>
          <h2 id={titleId} className={styles.title}>
            {run.name}
          </h2>
          <StatusBadge status={run.status} />
        </header>

        <dl className={styles.facts}>
          <div>
            <dt>Репозиторий</dt>
            <dd>{run.repository}</dd>
          </div>
          <div>
            <dt>Ветка</dt>
            <dd className={styles.mono}>{run.branch}</dd>
          </div>
          <div>
            <dt>Создан</dt>
            <dd>
              <time dateTime={run.createdAt}>{formatDate(run.createdAt)}</time>
            </dd>
          </div>
          <div>
            <dt>Длительность</dt>
            <dd>{formatDuration(run.durationSeconds)}</dd>
          </div>
          <div>
            <dt>ID</dt>
            <dd className={styles.mono}>{run.id}</dd>
          </div>
        </dl>

        <section
          className={styles.section}
          aria-labelledby={`${titleId}-result`}
        >
          <h3 id={`${titleId}-result`} className={styles.sectionTitle}>
            Результат
          </h3>
          {run.result ? (
            <p className={styles.result}>{run.result}</p>
          ) : (
            <p className={styles.placeholder}>{getMissingResultMessage(run)}</p>
          )}
        </section>

        <section className={styles.section} aria-labelledby={`${titleId}-logs`}>
          <h3 id={`${titleId}-logs`} className={styles.sectionTitle}>
            Логи
          </h3>
          {run.logs.length > 0 ? (
            <pre className={styles.logs}>{run.logs.join('\n')}</pre>
          ) : (
            <p className={styles.placeholder}>Логов пока нет.</p>
          )}
        </section>
      </aside>
    </div>,
    document.body,
  )
}
