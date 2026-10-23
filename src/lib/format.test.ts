import { formatDate, formatDuration } from './format'

describe('formatDuration', () => {
  it.each([
    [0, '0 с'],
    [45, '45 с'],
    [125, '2 мин 5 с'],
    [3725, '1 ч 2 мин'],
  ])('formats %i seconds as "%s"', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected)
  })

  it('returns a placeholder when duration is unknown', () => {
    expect(formatDuration(undefined)).toBe('—')
  })
})

describe('formatDate', () => {
  it('formats an ISO date', () => {
    expect(formatDate('2026-10-21T12:00:00Z')).toMatch(/21 окт\.? 2026/)
  })

  it('returns a placeholder for an invalid date', () => {
    expect(formatDate('not a date')).toBe('—')
  })
})
