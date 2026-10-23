import styles from './DataStates.module.css'

const SKELETON_ROWS = 5

export function LoadingState() {
  return (
    <div className={styles.skeleton} aria-busy="true">
      <span className="visually-hidden" role="status">
        Загружаем запуски…
      </span>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div key={index} className={styles.skeletonRow} aria-hidden="true" />
      ))}
    </div>
  )
}

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.message} role="alert">
      <h2 className={styles.title}>Не удалось загрузить запуски</h2>
      <p className={styles.text}>{message}</p>
      <button type="button" className={styles.action} onClick={onRetry}>
        Повторить
      </button>
    </div>
  )
}

type EmptyStateProps = {
  onReset: () => void
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className={styles.message} role="status">
      <h2 className={styles.title}>Ничего не найдено</h2>
      <p className={styles.text}>
        Попробуйте изменить запрос или выбрать другой статус.
      </p>
      <button type="button" className={styles.action} onClick={onReset}>
        Сбросить фильтры
      </button>
    </div>
  )
}
