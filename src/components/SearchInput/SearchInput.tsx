import styles from './SearchInput.module.css'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <label className={styles.field}>
      <span className="visually-hidden">Поиск по названию или репозиторию</span>
      <input
        className={styles.input}
        type="search"
        placeholder="Поиск по названию или репозиторию"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
