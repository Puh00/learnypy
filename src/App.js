import React, { createContext, useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import About from 'src/pages/About';
import Accessibility from 'src/pages/Accessibility';
import Home from 'src/pages/Home';

import 'src/App.css';
import 'src/Scrollbar.css';

export const AppContext = createContext();

export const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/accessibility" element={<Accessibility />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};
