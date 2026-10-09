import styles from './StitchLoader.module.css';

/** Decorative, self-contained motion: no player, remote scene or image request. */
export function StitchMark({ compact = false }: { compact?: boolean }) {
  if (compact) return <span className={styles.compact} aria-hidden="true">
    <svg viewBox="0 0 40 24" fill="none" focusable="false">
      <path className={styles.miniSeam} d="M3 18h5m4 0h5m4 0h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <g className={styles.miniNeedle}>
        <path d="m24 18 7-15c.7-1.5 2.8-.5 2.1 1L24 18Z" fill="currentColor" />
        <path d="M32 5c5-6 9 5 2 6-4 .6-6-2-8-1" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" />
      </g>
    </svg>
  </span>;

  return <span className={styles.scene} aria-hidden="true">
    <svg className={styles.cloth} viewBox="0 0 320 144" fill="none" focusable="false">
      <path d="M22 63c55-6 92-5 139-1 45 4 84 4 137-1v62c-53 5-91 4-137 0-47-4-84-5-139 1V63Z" fill="currentColor" fillOpacity=".035" />
      <path d="M22 63c55-6 92-5 139-1 45 4 84 4 137-1M22 123c55-6 92-5 139-1 45 4 84 4 137 1" stroke="currentColor" strokeOpacity=".14" strokeWidth=".7" />
      <path d="M33 86h254M33 107h254" stroke="currentColor" strokeOpacity=".15" strokeWidth=".7" strokeDasharray="2 5" />
      <path d="M42 96h234" stroke="currentColor" strokeOpacity=".13" strokeWidth=".7" />
    </svg>
    <span className={styles.seam}>
      <svg viewBox="0 0 320 144" fill="none" focusable="false">
        <path d="m44 96 10-1m12 1 10 1m12-1 10-1m12 1 10 1m12-1 10-1m12 1 10 1m12-1 10-1m12 1 10 1m12-1 10-1m12 1 10 1m12-1 10-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
    <span className={styles.needleTravel}>
      <span className={styles.needleDip}>
        <svg viewBox="0 0 56 92" fill="none" focusable="false">
          <path d="M13 76 34 16c1.6-4.3 6.5-2.6 5 1.7L13 76Z" fill="currentColor" />
          <path d="m36 17-1 3" stroke="var(--stitch-ground)" strokeWidth="1" strokeLinecap="round" />
          <path d="M36 18C56-11 61 39 39 36 22 34 28 14 8 12" stroke="var(--stitch-thread)" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      </span>
    </span>
  </span>;
}

export function StitchLoader({
  label = 'Preparing your experience…',
  variant = 'page',
  tone = 'light',
}: {
  label?: string;
  variant?: 'page' | 'workspace' | 'stage';
  tone?: 'light' | 'dark';
}) {
  return <div className={`${styles.loader} ${styles[variant]} ${styles[tone]}`} role="status" aria-live="polite" aria-atomic="true">
    <span className={styles.wordmark} aria-hidden="true">DARZI</span>
    <StitchMark />
    <p className={styles.title} aria-hidden="true">Every stitch matters.</p>
    <p className={styles.label}>{label}</p>
  </div>;
}
