/* eslint-disable prettier/prettier */
import React from 'react';

import Header from '../Components/Header';
import styles from './About.module.css';

const About = () => {
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
    <div>
      <Header navItems={navItems} />
      <div className={styles.Content}>
        <h2 className={styles.Title}>About {appName}</h2>
        <p>
          {appName} is a free site of{' '}
          <a href="https://www.python.org/" target="_blank" rel="noreferrer">
            Python
          </a>{' '}
          visualisation tool with the aim to help novice programmers to understand the underlying
          structure of Python&apos;s memory model. {appName} is a project made as a Bachelor project
          by six students from{' '}
          <a href="https://www.chalmers.se" target="_blank" rel="noreferrer">
            Chalmers University of Technology
          </a>
        </p>
        <p>
          The source code of this project can be found at{' '}
          <a
            href="https://github.com/Puh00/DynamicMemModelWebsite"
            target="_blank"
            rel="noreferrer">
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
        <h1 className={styles.SubTitle}> Caused by the app </h1>
        <ul>
          <li>Only Python is supported</li>

          <li>Too many variables will make the visualisation unreadable</li>
          <li>Turtle graphics are not supported</li>
          <li>
            The only supported datatypes (for visualisation) are: integers, floats, doubles, strings, characters,
            booleans, tuples, user-defined classes, lists and dictionaries.
          </li>
        </ul>
        <h1 className={styles.SubTitle}> Caused by Skulpt </h1>
        <ul>
          <li>Too many iterations will make the website very slow</li>
          <li>Only supports Python 3.7.3 grammar</li>
          <li>
            Very few Python libraries are supported. See the{' '}
            <a href="https://github.com/skulpt/skulpt" target="_blank" rel="noreferrer">
              Skulpt repo
            </a>
            {' '}for more information.
          </li>
        </ul>

        <h2 className={styles.Title}>Special Thanks</h2>
        <dl>
          <dt>
            <a href="https://skulpt.org/" target="_blank" rel="noreferrer">
              Skulpt
            </a>
          </dt>
          <dd>
            - For providing us with this amazing framework that allows us to execute Python code
            directly in the browser.
          </dd>
          <dt>
            <a href="http://www.cse.chalmers.se/~krasimir/" target="_blank" rel="noreferrer">
              Krasimir Angelov
            </a>
          </dt>
          <dd>- For being our supervisor during this project and giving us great support.</dd>
        </dl>
      </div>
    </div>
  );
};

export default About;
