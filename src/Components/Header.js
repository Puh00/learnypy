import React from 'react';
import { Link } from 'react-router-dom';

function Header({ navItems }) {
  return (
    <header className="App-header">
      <div className="Home-logo">
        <Link to="/">The Dynamic Memory Model</Link>
      </div>

      <div className="Nav-menu">
        {navItems.map((item, index) => {
          return (
            <div key={index}>
              <Link to={item.link}>{item.name}</Link>
            </div>
          );
        })}
      </div>
    </header>
  );
}

export default Header;
