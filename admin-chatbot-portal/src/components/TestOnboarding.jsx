import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const TestOnboarding = ({ onStartOnboarding }) => {
  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Onboarding
      </Typography>
      <Typography variant="body1" paragraph>
        This is a simplified test component to verify that rendering works correctly.
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => onStartOnboarding && onStartOnboarding()}
      >
        Start Onboarding
      </Button>
    </Box>
  );
};

export default TestOnboarding;
