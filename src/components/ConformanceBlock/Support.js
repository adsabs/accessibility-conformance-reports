import React from 'react';
import styles from './ConformanceBlock.module.css';

export const Support = ({ children }) => (
  <div className={`${styles.base} ${styles.support}`} data-status="support">
    <span className={styles.label}>✅ SUPPORTS</span>
    {children}
  </div>
);

