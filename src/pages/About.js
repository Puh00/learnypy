import React from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as Home_logo } from 'src/assets/home.svg';
import Header from 'src/components/Header';
import styles from 'src/pages/About.module.css';

const About = () => {
  const navItems = [
    {
      name: 'home',
      icon: <Home_logo />,
      link: '/'
    }
  ];

  const appName = 'LearnyPy';
  let title = 'About | ';
  title = title.concat(appName);
  document.title = title;

  return (
    <div className={styles.Page}>
      <Header navItems={navItems} />
      <div className={styles.Content}>
        <h1 className={styles.heading_title}>About {appName}</h1>
        <p>
          {appName} is a free site of{' '}
          <a href="https://www.python.org/" target="_blank" rel="noreferrer">
            Python
          </a>{' '}
          visualisation tool with the aim to help novice programmers to understand the concept of
          references in Python. It offers simple graph visualisation of the relations between
          objects and variables. The solution is based on JavaScript, which means no server is used,
          and is thereby offering a user experience with less risk for lag and no server-side
          errors. {appName} is a project made as a Bachelor project by six students from{' '}
          <a href="https://www.chalmers.se" target="_blank" rel="noreferrer">
            Chalmers University of Technology
          </a>
          .
        </p>
        <p>
          The source code of this project can be found at{' '}
          <a href="https://github.com/Puh00/learnypy" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
        <h2 className={styles.Title}>The Team</h2>
        <ul>
          <li>Moa Berglund</li>
          <li>Saga Hassellöf</li>
          <li>Simon Johansson</li>
          <li>Alex Phu</li>
          <li>Vera Svensson</li>
          <li>Yenan Wang</li>
        </ul>
        <h2 className={styles.Title}>Known limitations</h2>
        <h3 className={styles.SubTitle}> Caused by the app </h3>
        <ul>
          <li>Only Python is supported.</li>
          <li>Python libraries with visualision (other than prints) are not supported.</li>
          <li>
            The supported datatypes (for visualisation) are: integers, floats, doubles, strings,
            characters, booleans, tuples, user-defined classes, lists, sets and dictionaries.
          </li>
        </ul>
        <h3 className={styles.SubTitle}> Caused by Skulpt </h3>
        <ul>
          <li>Many iterations will make the website slow.</li>
          <li>Only Python 3.7.3 grammar is supported.</li>
          <li>A few Python libraries are supported.</li>
          <li>Debugger is unable to suspend correctly when importing Python modules.</li>
        </ul>
        <h2 className={styles.Title}>Special Thanks</h2>
        <h3 className={styles.SubTitle}> Skulpt </h3>
        <p>
          - For providing us with this amazing framework that allows us to execute Python code
          directly in the browser. Visit Skulpts webpage here{' '}
          <a href="https://skulpt.org/" target="_blank" rel="noreferrer">
            https://skulpt.org/
          </a>
          .
        </p>
        <h3 className={styles.SubTitle}> Krasimir Angelov </h3>
        <p>- For being our supervisor during this project and giving us great support.</p>
        <h2 className={styles.Title}>Accessibility of {appName} </h2>
        <p>
          Read more at our <Link to="/Accessibility"> accessibility page</Link>.
        </p>
      </div>
    </div>
  );
};

export default About;
