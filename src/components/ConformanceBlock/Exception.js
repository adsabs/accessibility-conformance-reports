import React from 'react';
import styles from './ConformanceBlock.module.css';

export const Exception = ({ children }) => (
  <div className={`${styles.base} ${styles.exception}`} data-status="exception">
    <span className={styles.label}>⚠️ EXCEPTION</span>
    {children}
  </div>
);

