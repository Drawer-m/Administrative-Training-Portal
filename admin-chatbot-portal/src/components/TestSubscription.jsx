import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const TestSubscription = () => {
  return (
    <Paper 
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        textAlign: 'center',
        borderRadius: 2
      }}
    >
      <Typography variant="h4" gutterBottom color="primary">
        Subscription Page Test
      </Typography>
      <Typography variant="body1" paragraph>
        If you can see this message, the routing to the subscription page is working!
      </Typography>
      <Button variant="contained">Test Button</Button>
    </Paper>
  );
};

export default TestSubscription;
