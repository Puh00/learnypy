import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Pages/Home';
import About from './Pages/About';
import Accessibility from './Pages/Accessibility';

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
