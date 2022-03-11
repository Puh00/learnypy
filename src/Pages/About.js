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
          {appName} is a free site of <a href="https://www.python.org/">Python</a> visualisation
          tool with the aim to help novice programmers to understand the underlying structure of
          Python&apos;s memory model. {appName} is a project made as a Bachelor project by six
          students from <a href="https://www.chalmers.se">Chalmers University of Technology</a>
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
      </div>
    </div>
  );
};

export default About;
