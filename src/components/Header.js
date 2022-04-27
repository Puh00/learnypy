import React from 'react';
import { Link } from 'react-router-dom';

import styles from 'src/components/Header.module.css';

const Header = ({ navItems }) => {
  return (
    <header className={styles.Header}>
      <Link className={styles['Home-logo']} to="/">
        LearnPy
      </Link>

      <div className={styles['Nav-menu']}>
        {navItems.map((item, index) => {
          let link;
          link = (
            <Link
              className={styles['Nav-item']}
              to={item.link}
              data-toggle="tooltip"
              title={item.tooltip}
              onClick={item.onclick}>
              {item.icon}
            </Link>
          );
          return (
            <div className={styles['Nav-button']} key={index}>
              {link}
            </div>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
