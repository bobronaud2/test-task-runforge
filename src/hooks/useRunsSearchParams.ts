import { useCallback, useEffect, useMemo, useState } from 'react'
import type { RunSort, StatusFilter } from '../lib/runs'
import { RUN_STATUSES } from '../types/run'

const DEFAULT_STATUS: StatusFilter = 'all'
const DEFAULT_SORT: RunSort = 'created-desc'
const SORT_VALUES: RunSort[] = [
  'created-desc',
  'created-asc',
  'duration-desc',
  'duration-asc',
]
const DETAILS_HISTORY_STATE = { runDetails: true }

function parseStatus(value: string | null): StatusFilter {
  return RUN_STATUSES.find((status) => status === value) ?? DEFAULT_STATUS
}

function parseSort(value: string | null): RunSort {
  return SORT_VALUES.find((sort) => sort === value) ?? DEFAULT_SORT
}

function readParams() {
  return new URLSearchParams(window.location.search)
}

function isDetailsHistoryEntry() {
  return window.history.state?.runDetails === true
}

export function useRunsSearchParams() {
  const [params, setParams] = useState(readParams)

  useEffect(() => {
    const syncWithHistory = () => setParams(readParams())
    window.addEventListener('popstate', syncWithHistory)
    return () => window.removeEventListener('popstate', syncWithHistory)
  }, [])

  const updateParams = useCallback(
    (
      changes: Record<string, string | null>,
      historyMode: 'push' | 'replace' = 'replace',
    ) => {
      const next = readParams()
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }

      const search = next.toString()
      const url = search
        ? `${window.location.pathname}?${search}`
        : window.location.pathname
      if (historyMode === 'push') {
        window.history.pushState(DETAILS_HISTORY_STATE, '', url)
      } else {
        window.history.replaceState(window.history.state, '', url)
      }
      setParams(next)
    },
    [],
  )

  const status = parseStatus(params.get('status'))
  const query = params.get('q') ?? ''
  const sort = parseSort(params.get('sort'))
  const selectedRunId = params.get('run')

  const actions = useMemo(
    () => ({
      setStatus: (value: StatusFilter) =>
        updateParams({ status: value === DEFAULT_STATUS ? null : value }),
      setQuery: (value: string) => updateParams({ q: value }),
      setSort: (value: RunSort) =>
        updateParams({ sort: value === DEFAULT_SORT ? null : value }),
      resetFilters: () => updateParams({ status: null, q: null }),
      openRun: (runId: string) => updateParams({ run: runId }, 'push'),
      closeRun: () => {
        if (isDetailsHistoryEntry()) window.history.back()
        else updateParams({ run: null })
      },
    }),
    [updateParams],
  )

  return { status, query, sort, selectedRunId, ...actions }
}
