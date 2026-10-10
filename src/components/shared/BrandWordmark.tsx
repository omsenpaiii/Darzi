import styles from './BrandWordmark.module.css';

/** The house wordmark, with a needle standing in for its final I. */
export function BrandWordmark() {
  return <span className={styles.mark} role="img" aria-label="DARZI">
    <span className={styles.letters} aria-hidden="true">DARZ</span>
    <svg className={styles.needle} viewBox="0 0 12 100" aria-hidden="true" focusable="false">
      <path fill="currentColor" fillRule="evenodd" d="M6 1C3.4 1 2 3.8 2.2 8.2L4.1 57 6 99l1.9-42L9.8 8.2C10 3.8 8.6 1 6 1Zm0 3.4c-1.2 0-1.7 1.4-1.6 3.8l.4 9.5c.1 2.4.4 3.5 1.2 3.5s1.1-1.1 1.2-3.5l.4-9.5C7.7 5.8 7.2 4.4 6 4.4Z" clipRule="evenodd" />
    </svg>
  </span>;
}
