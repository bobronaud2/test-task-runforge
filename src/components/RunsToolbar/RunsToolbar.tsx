import type { RunSort, StatusFilter as StatusFilterValue } from '../../lib/runs'
import { SearchInput } from '../SearchInput/SearchInput'
import { SortSelect } from '../SortSelect/SortSelect'
import { StatusFilter } from '../StatusFilter/StatusFilter'
import styles from './RunsToolbar.module.css'

type RunsToolbarProps = {
  query: string
  status: StatusFilterValue
  sort: RunSort
  onQueryChange: (value: string) => void
  onStatusChange: (value: StatusFilterValue) => void
  onSortChange: (value: RunSort) => void
}

export function RunsToolbar({
  query,
  status,
  sort,
  onQueryChange,
  onStatusChange,
  onSortChange,
}: RunsToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <SearchInput value={query} onChange={onQueryChange} />
        <SortSelect value={sort} onChange={onSortChange} />
      </div>
      <StatusFilter value={status} onChange={onStatusChange} />
    </div>
  )
}
