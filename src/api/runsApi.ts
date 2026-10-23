import type { Run } from '../types/run'
import { mockRuns } from './mockRuns'

const MOCK_DELAY_MS = 800

export function isErrorSimulationEnabled() {
  return new URLSearchParams(window.location.search).has('fail')
}

export function fetchRuns({ simulateError = false } = {}): Promise<Run[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject(new Error('Сервер не ответил. Попробуйте ещё раз.'))
      } else {
        resolve(structuredClone(mockRuns))
      }
    }, MOCK_DELAY_MS)
  })
}
