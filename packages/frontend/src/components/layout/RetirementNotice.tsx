import styles from './RetirementNotice.module.css';

export const RetirementNotice = () => {
  return (
    <aside className={styles.notice} role="note">
      <span className={styles.tag}>New Home</span>
      <p className={styles.text}>
        This tracker is now hosted independently. Huge thanks to MikeRoni and{' '}
        <a className={styles.link} href="https://eve-incursions.de" target="_blank" rel="noopener noreferrer">eve&#8209;incursions.de</a>{' '}
        for building and open&#8209;sourcing the original. The source remains available on{' '}
        <a className={styles.link} href="https://github.com/random9-io/eve-incursions-node" target="_blank" rel="noopener noreferrer">GitHub</a>.{' '}
        <span className={styles.salute}>o7</span>
      </p>
    </aside>
  );
};
