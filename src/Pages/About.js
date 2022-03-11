import React from 'react';
import Header from '../Components/Header';

const About = () => {
  const navItems = [
    {
      name: 'Home',
      link: '/'
    },
    {
      name: 'About',
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
