import type { Run, RunStatus } from '../types/run'

export type StatusFilter = RunStatus | 'all'

export type RunSort =
  'created-desc' | 'created-asc' | 'duration-desc' | 'duration-asc'

type RunFilters = {
  status: StatusFilter
  query: string
}

export const RUN_STATUS_LABELS: Record<RunStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
}

export function filterRuns(runs: Run[], { status, query }: RunFilters): Run[] {
  const normalizedQuery = query.trim().toLowerCase()

  return runs.filter((run) => {
    const matchesStatus = status === 'all' || run.status === status
    const matchesQuery =
      normalizedQuery === '' ||
      run.name.toLowerCase().includes(normalizedQuery) ||
      run.repository.toLowerCase().includes(normalizedQuery)
    return matchesStatus && matchesQuery
  })
}

function compareDurations(a: Run, b: Run, direction: 1 | -1) {
  if (a.durationSeconds === undefined)
    return b.durationSeconds === undefined ? 0 : 1
  if (b.durationSeconds === undefined) return -1
  return (a.durationSeconds - b.durationSeconds) * direction
}

function compareCreatedAt(a: Run, b: Run, direction: 1 | -1) {
  return (Date.parse(a.createdAt) - Date.parse(b.createdAt)) * direction
}

export function sortRuns(runs: Run[], sort: RunSort): Run[] {
  return [...runs].sort((a, b) => {
    switch (sort) {
      case 'created-asc':
        return compareCreatedAt(a, b, 1)
      case 'created-desc':
        return compareCreatedAt(a, b, -1)
      case 'duration-asc':
        return compareDurations(a, b, 1)
      case 'duration-desc':
        return compareDurations(a, b, -1)
    }
  })
}
