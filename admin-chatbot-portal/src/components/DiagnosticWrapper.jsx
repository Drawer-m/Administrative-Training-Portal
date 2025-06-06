import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const DiagnosticWrapper = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    // Add global error handler
    const originalConsoleError = console.error;
    console.error = (...args) => {
      setHasError(true);
      setErrorInfo(args.join(' '));
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  if (hasError) {
    return (
      <Paper 
        sx={{ 
          p: 3, 
          m: 2, 
          maxWidth: 800, 
          mx: 'auto', 
          bgcolor: '#fff',
          color: '#333' 
        }}
      >
        <Typography variant="h5" sx={{ color: 'error.main', mb: 2 }}>
          Something went wrong rendering the component
        </Typography>
        
        <Typography variant="body1" paragraph>
          There was an error in the OnboardingBot component. Check the console for more details.
        </Typography>
        
        {errorInfo && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1, 
              overflowX: 'auto',
              mb: 3,
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          >
            {errorInfo}
          </Box>
        )}
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </Paper>
    );
  }

  try {
    return children;
  } catch (error) {
    console.error("Caught error:", error);
    setHasError(true);
    setErrorInfo(error.toString());
    return null;
  }
};

export default DiagnosticWrapper;
