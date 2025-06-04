import React from 'react';
import styles from './Project.module.css';
import Adslogo from '../../static/img/ads-logo.svg';
import Scixlogo from '../../static/img/scix-logo.svg';

function normalizeName(name) {
  return name.trim().toLowerCase();
}

export function Project({ name, children }) {
  const key = normalizeName(name);

  const getDisplayName = () => {
    switch (key) {
      case 'ads': return 'ADS';
      case 'scix': return 'SciX';
      default: return '';
    }
  }

  const displayName = getDisplayName();

  const getLogo = () => {
    const commonProps = { alt: `${displayName} logo`, className: styles.projectLogo }
    switch (key) {
      case 'ads': return <Adslogo {...commonProps} />;
      case 'scix': return <Scixlogo {...commonProps} style={{ width: '35px' }} />
      default: return null;
    }
  }

  return (
    <div className={styles.projectBlock} data-project-name={key}>
      <div className={styles.projectHeader}>
        <div className={styles.projectLogoWrapper}>
          {getLogo()}
        </div>
        <h3 className={styles.projectTitle}>{displayName}</h3>
      </div>
      <div className={styles.projectBody}>
        {children}
      </div>
    </div>
  );
}

