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

  return (
    <div>
      <Header navItems={navItems} />
      <div>About page</div>
    </div>
  );
};

export default About;
