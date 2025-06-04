import React from 'react';
import styles from './ConformanceBlock.module.css';

export const Unknown = ({ children }) => (
  <div className={`${styles.base} ${styles.unknown}`} data-status="unknown">
    <span className={styles.label}>UNKNOWN</span>
    {children}
  </div>
);

