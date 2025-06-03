import React from 'react';
import styles from './ConformanceBlock.module.css';

export const NonApplicable = ({ children }) => (
  <div className={`${styles.base} ${styles.na}`}>
    <span className={styles.label}>Not Applicable</span>
    {children}
  </div>
);
