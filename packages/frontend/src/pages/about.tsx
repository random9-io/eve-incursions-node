import styles from '../styles/prose.module.css';

export default function About() {
  return (
    <div className={styles.prose}>
      <h1>About</h1>
      <p>This EVE Online incursion tracker is hosted independently. Originally built by MikeRoni at{' '}
        <a href="https://eve-incursions.de" target="_blank" rel="noopener noreferrer">eve-incursions.de</a>,
        who generously open&#8209;sourced the project.</p>
      <p>If you have any feedback, bugs, or questions, you can reach us through the following channels.</p>
      <dl className={styles.contact}>
        <dt>In&#8209;game</dt>
        <dd>Lost Ai</dd>

        <dt>Source</dt>
        <dd><a href="https://github.com/random9-io/eve-incursions-node" target="_blank" rel="noopener noreferrer">random9-io/eve-incursions-node</a></dd>
      </dl>
    </div>
  );
}
