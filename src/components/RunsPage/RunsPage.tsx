import { useMemo } from 'react'
import { useRuns } from '../../hooks/useRuns'
import { useRunsSearchParams } from '../../hooks/useRunsSearchParams'
import { filterRuns, sortRuns } from '../../lib/runs'
import { EmptyState, ErrorState, LoadingState } from '../DataStates/DataStates'
import { RunDetails } from '../RunDetails/RunDetails'
import { RunList } from '../RunList/RunList'
import { RunsToolbar } from '../RunsToolbar/RunsToolbar'
import styles from './RunsPage.module.css'

export function RunsPage() {
  const { state, retry } = useRuns()
  const {
    status,
    query,
    sort,
    selectedRunId,
    setStatus,
    setQuery,
    setSort,
    resetFilters,
    openRun,
    closeRun,
  } = useRunsSearchParams()

  const runs = useMemo(
    () => (state.status === 'success' ? state.runs : []),
    [state],
  )
  const visibleRuns = useMemo(
    () => sortRuns(filterRuns(runs, { status, query }), sort),
    [runs, status, query, sort],
  )
  const selectedRun = runs.find((run) => run.id === selectedRunId)

  return (
    <main className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Runs</h1>
        <p className={styles.subtitle}>
          {state.status === 'success'
            ? `Показано ${visibleRuns.length} из ${runs.length}`
            : 'Запуски AI-агентов в ваших репозиториях'}
        </p>
      </div>

      <RunsToolbar
        query={query}
        status={status}
        sort={sort}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      {state.status === 'loading' && <LoadingState />}
      {state.status === 'error' && (
        <ErrorState message={state.message} onRetry={retry} />
      )}
      {state.status === 'success' &&
        (visibleRuns.length > 0 ? (
          <RunList runs={visibleRuns} onSelect={openRun} />
        ) : (
          <EmptyState onReset={resetFilters} />
        ))}

      {selectedRun && <RunDetails run={selectedRun} onClose={closeRun} />}
    </main>
  )
}
