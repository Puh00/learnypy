import React from 'react';
import Header from '../Components/Header';

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
      <div className="About-content">
        <h2 className="About-title">About {appName}</h2>
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

        <h2 className="About-title">The Team</h2>
        <ul className="About-team">
          <li>Moa Berglund</li>
          <li>Saga Hassellöf</li>
          <li>Simon Johansson</li>
          <li>Alex Phu</li>
          <li>Vera Svensson</li>
          <li>Yenan Wang</li>
        </ul>

        <h2 className="About-title">Special Thanks</h2>
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
        </dl>
      </div>
    </div>
  );
};

export default About;
