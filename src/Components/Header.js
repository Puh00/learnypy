import React from 'react';
import { Link } from 'react-router-dom';

function Header({ navItems }) {
  return (
    <header className="App-header">
      <Link className="Home-logo" to="/">
        The Dynamic Memory Model
      </Link>

      <div className="Nav-menu">
        {navItems.map((item, index, arr) => {
          let link;
          // determine when to add a '|' to separate the navigation items,
          // yes this just copies from CodingBat...
          if (index === arr.length - 1) {
            link = (
              <Link className="Nav-item" to={item.link}>
                {item.name}
              </Link>
            );
          } else {
            link = (
              <>
                <Link className="Nav-item" to={item.link}>
                  {item.name}
                </Link>
                |
              </>
            );
          }

          return <div key={index}>{link}</div>;
        })}
      </div>
    </header>
  );
}

export default Header;
