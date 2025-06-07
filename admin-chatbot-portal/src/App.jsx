import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import GoogleCallback from './components/GoogleCallback';
import { AccessibilityProvider, useThemeMode } from './components/Accessibility';
import { darkTheme, lightTheme } from './theme';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount and when auth state changes
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

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
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/auth/google/callback" 
              element={<GoogleCallback />} 
            />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </Box>
      </ThemeProvider>
    );
  };

  return (
    <Router>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </Router>
  );
}

export default App;
