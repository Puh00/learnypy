import { React, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

import { ReactComponent as LearnyPy } from 'src/assets/LearnyPy_dark2.svg';
import { ReactComponent as DarkMode_logo } from 'src/assets/moon.svg';
import { ReactComponent as LightMode_logo } from 'src/assets/sun.svg';
import styles from 'src/components/Header.module.css';

const Header = ({
  navItems,
  toggle = () => {
    //Possible to provide custom function if needed
  }
}) => {
  const [cookies, setCookie] = useCookies(['darktheme']);

  const handleToggle = () => {
    // Standard toggle dark/light mode
    document.body.classList.toggle('dark');
    // set a cookie for the darktheme that expires after 1 day
    setCookie(
      'darktheme',
      { checked: document.body.classList.contains('dark') },
      {
        maxAge: 60 * 60 * 24,
        sameSite: 'lax'
      }
    );
    //Provided custom toggle function
    toggle();
  };

  useEffect(() => {
    if (cookies?.darktheme?.checked && !document.body.classList.contains('dark')) {
      handleToggle();
    }
  }, []);

  return (
    <header className={styles.Header}>
      <Link className={styles['Home-logo']} to="/">
        <LearnyPy className={styles['LearnyPy-logo']} />
      </Link>

      <div className={styles['Right']}>
        <div className={styles['Nav-menu']}>
          <input
            type="checkbox"
            className={styles['Toggle']}
            id="checkbox"
            onClick={handleToggle}
            checked={cookies?.darktheme?.checked}
            onKeyDown={(e) => {
              // Possible to toggle with Enter (Space is standard)
              if (e.key == 'Enter') handleToggle();
            }}
          />
          <label htmlFor="checkbox" className={styles['Toggle-label']}>
            <DarkMode_logo className={styles['Moon']} />
            <LightMode_logo className={styles['Sun']} />
            <div
              className={styles['Toggle-ball']}
              data-toggle="tooltip"
              title={cookies?.darktheme?.checked ? 'Toggle to light mode' : 'Toggle to dark mode'}
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
