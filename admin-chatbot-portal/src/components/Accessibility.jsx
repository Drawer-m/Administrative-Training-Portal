import React, { useState, useContext, createContext, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define our theme configurations
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8ede3',
      paper: '#ffffff',
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
  },
});

const highContrastTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212',
    },
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#ffff00',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffff00',
    },
  },
  typography: {
    allVariants: {
      fontWeight: 'bold',
    },
  },
});

const ThemeContext = createContext({
  mode: 'light',
  setMode: () => {},
  currentTheme: lightTheme,
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Check local storage for saved theme preference
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Select the appropriate theme based on mode
  const currentTheme = 
    mode === 'dark' ? darkTheme : 
    mode === 'high-contrast' ? highContrastTheme : 
    lightTheme;

  // Apply theme changes and save to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    
    // Clear any custom background colors
    document.body.style.background = '';
    
    // Remove all theme classes first
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
    
    // Add the appropriate theme class
    document.body.classList.add(`theme-${mode}`);
    
    // Set specific colors for high contrast mode
    if (mode === 'high-contrast') {
      document.body.style.setProperty('--focus-color', '#ffff00');
    } else {
      document.body.style.setProperty('--focus-color', '#2563eb');
    }
    
    // If there was a custom background set, remove it when changing themes
    document.body.classList.remove('using-custom-bg');
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, currentTheme }}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
