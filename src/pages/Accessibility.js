import React from 'react';

import Header from 'src/components/Header';
import styles from 'src/pages/About.module.css';

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

  const appName = 'LearnPy';
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
          <a href="python-chutor.netlify.app/" target="_blank" rel="noreferrer">
            python-chutor.netlify.app/
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
          <a href="https://github.com/Puh00/python-chutor/issues" target="_blank" rel="noreferrer">
            issues page
          </a>
          .
        </p>
        <h2 className={styles.Title}>Reporting accessibility problems with this website</h2>
        <p>
          We’re always looking to improve the accessibility of this website. If you find any
          problems that aren’t listed on this page or if we’re not meeting the requirements of the
          accessibility regulations, let us know about the problem by reporting it to the{' '}
          <a href="https://github.com/Puh00/python-chutor/issues" target="_blank" rel="noreferrer">
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
        <p>The content described below is, in one way or another, not fully accessible.</p>
        <ul>
          <li>TODO</li>
          <li>...</li>
          <li>...</li>
        </ul>
        <h2 className={styles.Title}>How we tested this website</h2>
        <p>
          We have performed a self-assessment (internal testing) of some parts of {appName}. The
          test included using screen readers, navigating the page without mouse or keypad and color
          contrast analyze.
        </p>
        <p>The website was published on TODO</p>
        <p>The statement was last updated on TODO</p>
      </div>
    </div>
  );
};

export default Accessibility;
