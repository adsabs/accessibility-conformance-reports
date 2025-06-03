import React from 'react';
import styles from './ConformanceBlock.module.css';

export const NoSupport = ({ children }) => (
  <div className={`${styles.base} ${styles.noSupport}`}>
    <span className={styles.label}>❌ NO SUPPORT</span>
    {children}
  </div>
);

