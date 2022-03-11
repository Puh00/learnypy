import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="App-header">
      <Link to="/" className="Home-logo">
        The Dynamic Memory Model
      </Link>

      <div className="Nav-menu"></div>
    </header>
  );
}

export default Header;
