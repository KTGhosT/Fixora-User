// src/components/LoadingSpinner.jsx
import React from "react";
import styles from "./SimpleSpinner.module.css";

const LoadingSpinner = ({ size = "medium", className = "" }) => {
  return (
    <div className={`${styles.spinnerContainer} ${className}`}>
      <div 
        className={`${styles.spinner} ${styles[size]}`}
        aria-label="Loading"
        role="status"
      />
    </div>
  );
};

export default LoadingSpinner;