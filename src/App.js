import './App.css';

import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import About from './Pages/About';
import Accessibility from './Pages/Accessibility';
import Home from './Pages/Home';

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
