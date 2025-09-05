import React from 'react';
import styles from './Banner.module.css';

function FixoraBanner() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.subText}>WELCOME TO MY FIXORA APP</p>
        <h1 className={styles.title}>
          We Are <span className={styles.highlight}>Fixora</span><br />Workforce Experts
        </h1>
      </div>
      <button className={styles.button}>GET STARTED</button>
    </div>
  );
}

export default FixoraBanner;