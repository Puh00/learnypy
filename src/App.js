import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import About from 'src/pages/About';
import Accessibility from 'src/pages/Accessibility';
import Home from 'src/pages/Home';

import 'src/App.css';
import 'src/Scrollbar.css';

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
