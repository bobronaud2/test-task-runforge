import type { Run } from '../types/run'

export const testRuns: Run[] = [
  {
    id: 'run_1',
    name: 'Fix login bug',
    repository: 'acme/web',
    branch: 'fix/login',
    status: 'succeeded',
    createdAt: '2026-10-20T10:00:00Z',
    durationSeconds: 125,
    logs: ['Cloning acme/web', 'Tests passed'],
    result: 'Opened PR #1',
  },
  {
    id: 'run_2',
    name: 'Upgrade dependencies',
    repository: 'acme/api',
    branch: 'chore/deps',
    status: 'running',
    createdAt: '2026-10-22T10:00:00Z',
    logs: ['Cloning acme/api', 'Installing dependencies'],
  },
  {
    id: 'run_3',
    name: 'Add metrics endpoint',
    repository: 'acme/api',
    branch: 'feat/metrics',
    status: 'failed',
    createdAt: '2026-10-21T10:00:00Z',
    durationSeconds: 3700,
    logs: ['Cloning acme/api', 'Build failed'],
    result: 'Compilation error in metrics.go',
  },
  {
    id: 'run_4',
    name: 'Write release notes',
    repository: 'acme/docs',
    branch: 'main',
    status: 'queued',
    createdAt: '2026-10-23T10:00:00Z',
    logs: ['Run created'],
  },
]
