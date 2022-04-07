import './App.css';

import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import About from './Pages/About';
import Home from './Pages/Home';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
