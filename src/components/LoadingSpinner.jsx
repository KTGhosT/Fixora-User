import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <div className={styles.spannerIcon}>
            <div className={styles.spannerHandle}></div>
          </div>
        </div>
      </div>

      <div className={styles.spannerText}>FIXORA</div>
      <div className={styles.subText}>Connecting skilled workers...</div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill}></div>
      </div>

      <div className={styles.dots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
