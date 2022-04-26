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
        {navItems.map((item, index, arr) => {
          let link;
          // determine when to add a '|' to separate the navigation items,
          // yes this just copies from CodingBat...
          if (index === arr.length - 1) {
            link = (
              <Link className={styles['Nav-item']} to={item.link}>
                {item.name}
              </Link>
            );
          } else {
            link = (
              <>
                <Link className={styles['Nav-item']} to={item.link}>
                  {item.name}
                </Link>
                |
              </>
            );
          }
          return <div key={index}>{link}</div>;
        })}
      </div>
    </header>
  );
};

export default Header;
