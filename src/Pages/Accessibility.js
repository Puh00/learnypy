import React from 'react';

import Header from '../Components/Header';

import styles from './About.module.css';

const Accessibility = () => {
  const navItems = [
    {
      name: 'home',
      link: '/'
    },
    {
      name: 'about',
      link: '/about'
    }
  ];

  const appName = 'The Dynamic Memory Model';

  return (
    <div className={styles.Page}>
      <Header navItems={navItems} />
      <div className={styles.Content}>
        <h2 className={styles.heading_title}>Accessibility of {appName}</h2>
        <p>
          We want as many people as possible to be able to use it, and this document describes how
          python-chutor.netlify.app/ complies with the accessibility regulations, any known
          accessibility issues, and how you can report problems so that we can fix them.
        </p>
        <h3 className={styles.Title}>How accessible is the website?</h3>
        <p>
          We know some parts of this website are not fully accessible. See the section on
          non-accessible content below for more information.
        </p>
        <h3 className={styles.Title}>What to do if you can not access parts of this website?</h3>
        <p>
          Since this is a closed project, it is unfortunately not possible to report any
          accessibility problems or contact us for further help.
        </p>
        <h3 className={styles.Title}>Reporting accessibility problems with this website</h3>
        <p>
          Since this is a closed project, it is unfortunately not possible to report any
          accessibility problems or contact us for further help.
        </p>
        <h3 className={styles.Title}>Enforcement procedure</h3>
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
        <h3 className={styles.Title}>
          Technical information about this website&apos;s accessibility
        </h3>
        <p>
          This website is partially compliant with level AA in the standard{' '}
          <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noreferrer">
            Web Content Accessibility Guidelines version 2.1
          </a>
          , due to the non-compliances listed below.
        </p>
        <h3 className={styles.Title}>Non-accessible content</h3>
        <p>The content described below is, in one way or another, not fully accessible.</p>
        <ul>
          <li>TODO</li>
          <li>...</li>
          <li>...</li>
        </ul>
        <h3 className={styles.Title}>How we tested this website</h3>
        <p>
          We have performed a self-assessment (internal testing) of some parts of {appName}. The
          test included screen readers, navigating the page without mouse or keypad and testing
          color contrast with [TODO].
        </p>
        <p>The website was published on TODO</p>
        <p>The statement was last updated on TODO</p>
      </div>
    </div>
  );
};

export default Accessibility;
