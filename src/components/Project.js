import React from 'react';
import styles from './Project.module.css';
import Adslogo from '../../static/img/ads-logo.svg';
import Scixlogo from '../../static/img/scix-logo.svg';

function normalizeName(name) {
  return name.trim().toLowerCase();
}

export function Project({ name, children }) {
  const key = normalizeName(name);
  const displayName = name.toUpperCase();

  const getLogo = () => {
    const commonProps = { alt: `${displayName} logo`, className: styles.projectLogo }
    switch (key) {
      case 'ads': return <Adslogo {...commonProps} />;
      case 'scix': return <Scixlogo {...commonProps} />
    }
  }

  return (
    <div className={styles.projectBlock}>
      <div className={styles.projectHeader}>
        {getLogo()}
        <h3 className={styles.projectTitle}>{displayName}</h3>
      </div>
      <div className={styles.projectBody}>
        {children}
      </div>
    </div>
  );
}

