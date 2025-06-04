import React from 'react';
import styles from './ConformanceBlock.module.css';

export const NonApplicable = ({ children }) => (
  <div className={`${styles.base} ${styles.na}`} data-status="not-applicable">
    <span className={styles.label}>Not Applicable</span>
    {children}
  </div>
);
