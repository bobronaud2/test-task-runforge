import styles from './AppHeader.module.css'

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.logo}>
          <span className={styles.mark} aria-hidden="true" />
          Runforge
        </span>
        <nav aria-label="Основная навигация">
          <a className={styles.link} href="/" aria-current="page">
            Runs
          </a>
        </nav>
      </div>
    </header>
  )
}
