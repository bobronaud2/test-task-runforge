import { testRuns } from '../test/runFixtures'
import { filterRuns, sortRuns } from './runs'

const ids = (runs: { id: string }[]) => runs.map((run) => run.id)

describe('filterRuns', () => {
  it('returns all runs for the "all" status and empty query', () => {
    expect(filterRuns(testRuns, { status: 'all', query: '' })).toHaveLength(
      testRuns.length,
    )
  })

  it('filters by status', () => {
    expect(ids(filterRuns(testRuns, { status: 'failed', query: '' }))).toEqual([
      'run_3',
    ])
  })

  it('searches by name and repository ignoring case and surrounding spaces', () => {
    expect(
      ids(filterRuns(testRuns, { status: 'all', query: '  LOGIN ' })),
    ).toEqual(['run_1'])
    expect(
      ids(filterRuns(testRuns, { status: 'all', query: 'acme/api' })),
    ).toEqual(['run_2', 'run_3'])
  })

  it('combines status and search', () => {
    expect(
      ids(filterRuns(testRuns, { status: 'running', query: 'api' })),
    ).toEqual(['run_2'])
    expect(filterRuns(testRuns, { status: 'queued', query: 'api' })).toEqual([])
  })
})

describe('sortRuns', () => {
  it('sorts by creation date', () => {
    expect(ids(sortRuns(testRuns, 'created-desc'))).toEqual([
      'run_4',
      'run_2',
      'run_3',
      'run_1',
    ])
    expect(ids(sortRuns(testRuns, 'created-asc'))).toEqual([
      'run_1',
      'run_3',
      'run_2',
      'run_4',
    ])
  })

  it('sorts by duration keeping runs without duration last', () => {
    expect(ids(sortRuns(testRuns, 'duration-desc')).slice(0, 2)).toEqual([
      'run_3',
      'run_1',
    ])
    expect(ids(sortRuns(testRuns, 'duration-asc')).slice(0, 2)).toEqual([
      'run_1',
      'run_3',
    ])
  })

  it('does not mutate the source array', () => {
    const source = [...testRuns]
    sortRuns(source, 'created-asc')
    expect(source).toEqual(testRuns)
  })
})
