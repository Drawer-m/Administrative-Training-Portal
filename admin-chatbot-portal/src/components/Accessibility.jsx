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
      default: '#0F1017', // Darker background for better theme matching
      paper: '#1A1B23', // Darker paper color
    },
    primary: {
      main: '#7C3AED', // Purple accent
    },
    secondary: {
      main: '#4EADEA', // Blue accent
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

// Single Context for the theme
const AccessibilityContext = createContext({
  mode: 'dark',
  setMode: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  isHighContrast: false,
  setIsHighContrast: () => {},
  currentTheme: darkTheme,
});

// Create a single hook to access the context
export const useThemeMode = () => useContext(AccessibilityContext);

// Combined Provider that handles both Theme and Accessibility settings
export const AccessibilityProvider = ({ children, defaultMode = 'dark' }) => {
  const [mode, setMode] = useState(localStorage.getItem('theme-mode') || defaultMode);
  const [fontSize, setFontSize] = useState(localStorage.getItem('font-size') || 'medium');
  const [isHighContrast, setIsHighContrast] = useState(localStorage.getItem('high-contrast') === 'true');
  
  // Select the appropriate theme based on mode
  const currentTheme = 
    mode === 'dark' ? darkTheme : 
    mode === 'high-contrast' ? highContrastTheme : 
    lightTheme;
  
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
    
    // Apply class to body for additional styling
    if (mode === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light', 'theme-high-contrast');
    } else if (mode === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark', 'theme-high-contrast');
    } else if (mode === 'high-contrast') {
      document.body.classList.add('theme-high-contrast');
      document.body.classList.remove('theme-dark', 'theme-light');
    }
    
    // Set specific colors for high contrast mode
    if (mode === 'high-contrast') {
      document.body.style.setProperty('--focus-color', '#ffff00');
    } else {
      document.body.style.setProperty('--focus-color', '#2563eb');
    }
  }, [mode]);
  
  useEffect(() => {
    localStorage.setItem('font-size', fontSize);
    
    const fontSizeClass = `font-size-${fontSize}`;
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.body.classList.add(fontSizeClass);
  }, [fontSize]);
  
  useEffect(() => {
    localStorage.setItem('high-contrast', isHighContrast);
    
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
      setMode('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
      if (mode === 'high-contrast') {
        setMode('dark');
      }
    }
  }, [isHighContrast]);
  
  return (
    <AccessibilityContext.Provider 
      value={{ 
        mode, 
        setMode, 
        fontSize, 
        setFontSize, 
        isHighContrast, 
        setIsHighContrast,
        currentTheme
      }}
    >
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AccessibilityContext.Provider>
  );
};
