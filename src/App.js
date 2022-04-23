import './App.css';

import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import About from './pages/About';
import Accessibility from './pages/Accessibility';
import Home from './pages/Home';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/accessibility" element={<Accessibility />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
