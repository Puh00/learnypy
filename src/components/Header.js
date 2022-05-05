import { React, useState } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as DarkMode_logo } from 'src/assets/moon.svg';
import { ReactComponent as LightMode_logo } from 'src/assets/sun.svg';
import styles from 'src/components/Header.module.css';

const Header = ({ navItems, toggle }) => {
  const [checked, setChecked] = useState(document.body.classList.contains('dark'));

  return (
    <header className={styles.Header}>
      <Link className={styles['Home-logo']} to="/">
        LearnPy
      </Link>

      <div className={styles['Right']}>
        <div className={styles['Nav-menu']}>
          <input
            type="checkbox"
            className={styles['Toggle']}
            id="checkbox"
            onChange={() => {
              toggle();
              // force rerender to update state
              setChecked(document.body.classList.contains('dark'));
            }}
            checked={checked}
            onKeyDown={(e) => {
              // Possible to toggle with Enter (Space is standard)
              if (e.key == 'Enter') toggle();
            }}
          />
          <label htmlFor="checkbox" className={styles['Toggle-label']}>
            <DarkMode_logo className={styles['Moon']} />
            <LightMode_logo className={styles['Sun']} />
            <div
              className={styles['Toggle-ball']}
              data-toggle="tooltip"
              title={checked ? 'Toggle to light mode' : 'Toggle to dark mode'}
            />
          </label>
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
      </div>
    </header>
  );
};

export default Header;
