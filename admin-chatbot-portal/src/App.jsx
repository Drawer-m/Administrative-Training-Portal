import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { AccessibilityProvider, useThemeMode } from './components/Accessibility';
import { darkTheme, lightTheme } from './theme';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  // Wrap the app content with theme provider
  const AppContent = () => {
    const { mode } = useThemeMode();
    const theme = mode === 'dark' ? darkTheme : lightTheme;
    
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: '100vh',
            bgcolor: 'background.default',
            transition: 'background-color 0.3s ease'
          }}
        >
          <Routes>
            <Route 
              path="/login" 
              element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="*" 
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </Box>
      </ThemeProvider>
    );
  };

  return (
    <Router>
      <AccessibilityProvider defaultMode="dark">
        <AppContent />
      </AccessibilityProvider>
    </Router>
  );
}

export default App;
