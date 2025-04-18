import React, { useState, useContext, createContext } from 'react';

// Theme context for the whole app
const ThemeContext = createContext({
  mode: 'light',
  setMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
