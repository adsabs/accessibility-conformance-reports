import React from 'react';
import styles from './ConformanceBlock.module.css';

export const NotApplicable = ({ children }) => (
  <div className={`${styles.base} ${styles.na}`} data-status="not-applicable">
    <span className={styles.label}>Not Applicable</span>
    {children}
  </div>
);
