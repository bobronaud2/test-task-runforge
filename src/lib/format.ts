const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const EMPTY_VALUE = '—'

export function formatDate(isoDate: string) {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? EMPTY_VALUE : dateFormatter.format(date)
}

export function formatDuration(totalSeconds?: number) {
  if (totalSeconds === undefined || totalSeconds < 0) return EMPTY_VALUE

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  if (hours > 0) return `${hours} ч ${minutes} мин`
  if (minutes > 0) return `${minutes} мин ${seconds} с`
  return `${seconds} с`
}
