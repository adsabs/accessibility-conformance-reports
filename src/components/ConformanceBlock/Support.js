import React from 'react';
import styles from './ConformanceBlock.module.css';

export const Support = ({ children }) => (
  <div className={`${styles.base} ${styles.support}`}>
    <span className={styles.label}>✅ Conformance: SUPPORTS</span>
    {children}
  </div>
);

