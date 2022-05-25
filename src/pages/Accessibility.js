import React from 'react';

import { ReactComponent as Home_logo } from 'src/assets/home.svg';
import { ReactComponent as Info_logo } from 'src/assets/info.svg';
import Header from 'src/components/Header';
import styles from 'src/pages/About.module.css';

const Accessibility = () => {
  const navItems = [
    {
      name: 'home',
      icon: <Home_logo />,
      link: '/'
    },
    { name: 'about', icon: <Info_logo />, link: '/about' }
  ];

  const appName = 'LearnyPy';
  let title = 'Accessibility | ';
  title = title.concat(appName);
  document.title = title;

  return (
    <div className={styles.Page}>
      <Header navItems={navItems} />
      <div className={styles.Content}>
        <h1 className={styles.heading_title}>Accessibility of {appName}</h1>
        <p>
          We want as many people as possible to be able to use it, and this document describes how{' '}
          <a href="learnypy.netlify.app/" target="_blank" rel="noreferrer">
            learnypy.netlify.app/
          </a>{' '}
          complies with the accessibility regulations, any known accessibility issues, and how you
          can report problems so that we can fix them.
        </p>
        <h2 className={styles.Title}>How accessible is the website?</h2>
        <p>
          We know some parts of this website are not fully accessible. See the section on
          non-accessible content below for more information.
        </p>
        <h2 className={styles.Title}>What to do if you can not access parts of this website?</h2>
        <p>
          If you need content from this website that is not accessible for you, but is not within
          the scope of the accessibility regulations as described below, please report it to the{' '}
          <a href="https://github.com/Puh00/learnypy/issues" target="_blank" rel="noreferrer">
            issues page
          </a>
          .
        </p>
        <h2 className={styles.Title}>Reporting accessibility problems with this website</h2>
        <p>
          We’re always looking to improve the accessibility of this website. If you find any
          problems that aren’t listed on this page or if we’re not meeting the requirements of the
          accessibility regulations, let us know about the problem by reporting it to the{' '}
          <a href="https://github.com/Puh00/learnypy/issues" target="_blank" rel="noreferrer">
            issues page
          </a>
          .
        </p>
        <h2 className={styles.Title}>Enforcement procedure</h2>
        <p>
          The Agency for Digital Government is responsible for enforcing the accessibility
          regulations. If you are not happy with how we respond to your complaint about web
          accessibility or your request to make content accessible,{' '}
          <a
            href="https://www.digg.se/digital-tillganglighet/anmal-bristande-tillganglighet"
            target="_blank"
            rel="noreferrer">
            submit a complaint to the Agency for Digital Government.
          </a>
        </p>
        <h2 className={styles.Title}>
          Technical information about this website&apos;s accessibility
        </h2>
        <p>
          This website is partially compliant with level AA in the standard{' '}
          <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noreferrer">
            Web Content Accessibility Guidelines version 2.1
          </a>
          , due to the non-compliances listed below.
        </p>
        <h2 className={styles.Title}>Non-accessible content</h2>
        <p>The content described below is either not tested or deemed not fully accessible.</p>
        <ul>
          <li>
            Color is sometimes used as the only way of conveying information (WCAG 2.1, criteria
            1.4.1)
          </li>
          <li>
            We can not ensure that there will be no loss of content or functionality after modifying
            text properties (WCAG 2.1, criteria 1.4.12)
          </li>
          <li>Some functionality are not available from a keyboard (WCAG 2.1, criteria 2.1.1)</li>
          <li>
            There is currently only one way to locate to the accessibility page (WCAG 2.1, criteria
            2.4.5)
          </li>
        </ul>
        <h2 className={styles.Title}>How we tested this website</h2>
        <p>
          We have performed a self-assessment (internal testing) of some parts of {appName}. It
          should be noted that we did not test on all internet browsers nor operating systems. As
          such there might be undiscovered problems from the environments that we have not covered
          in our testing.
        </p>
        <p>The website was published on 2022-05-24.</p>
        <p>The statement was last updated on 2022-05-24.</p>
      </div>
    </div>
  );
};

export default Accessibility;
