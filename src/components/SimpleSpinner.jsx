import React from 'react';
import styles from './SimpleSpinner.module.css';

const SimpleSpinner = ({ 
  size = 'medium', // small, medium, large
  color = 'primary', // primary, white, gray
  text = null,
  inline = false,
  className = ''
}) => {
  const spinnerClasses = `${styles.spinner} ${styles[size]} ${styles[color]} ${className}`;
  
  if (inline) {
    return (
      <span className={styles.inlineContainer}>
        <span className={spinnerClasses}></span>
        {text && <span className={styles.inlineText}>{text}</span>}
      </span>
    );
  }

  return (
    <div className={styles.container}>
      <div className={spinnerClasses}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default SimpleSpinner;