import { useCallback, useEffect, useState } from 'react'
import { fetchRuns, isErrorSimulationEnabled } from '../api/runsApi'
import type { Run } from '../types/run'

type RunsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; runs: Run[] }

export function useRuns() {
  const [state, setState] = useState<RunsState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isCurrent = true

    fetchRuns({
      simulateError: attempt === 0 && isErrorSimulationEnabled(),
    }).then(
      (runs) => {
        if (isCurrent) setState({ status: 'success', runs })
      },
      (error: unknown) => {
        if (!isCurrent) return
        const message =
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        setState({ status: 'error', message })
      },
    )

    return () => {
      isCurrent = false
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((current) => current + 1)
  }, [])

  return { state, retry }
}
