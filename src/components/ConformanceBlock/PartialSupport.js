import React from 'react';
import styles from './ConformanceBlock.module.css';

export const PartialSupport = ({ children }) => (
  <div className={`${styles.base} ${styles.partial}`}>
    <span className={styles.label}>🟡 Conformance: PARTIAL SUPPORT</span>
    {children}
  </div>
);

