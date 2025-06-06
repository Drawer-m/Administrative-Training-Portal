import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Stack
} from '@mui/material';

function Login({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulate a brief loading state for visual feedback
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('onboardingComplete', 'false');
      setIsLoading(false);
      if (onLogin) onLogin(); // Notify App to update login state
      navigate('/dashboard', { replace: true });
    }, 800);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdf6fd 0%, #e0c3fc 50%, #a1c4fd 100%)',
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 420,
          width: '100%',
          p: 5,
          borderRadius: 5,
          boxShadow: 10,
          bgcolor: '#f8ede3', 
          border: '1px solid #e0c3fc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Welcome to AdminBot
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Access the <span style={{ color: '#7b2ff2', fontWeight: 700 }}>Admin Portal</span> with a single click
        </Typography>
        
        <Stack spacing={3} alignItems="center" width="100%">
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleLogin}
            disabled={isLoading}
            sx={{
              fontWeight: 'bold',
              py: 2,
              fontSize: '1.1rem',
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-2px)' },
              transition: 'all 0.3s ease',
              boxShadow: 3,
              maxWidth: '80%'
            }}
            startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <FaSignInAlt size={20} />}
          >
            {isLoading ? 'Logging in...' : 'Enter Admin Portal'}
          </Button>
          
          <Typography variant="body2" align="center" color="text.secondary" mt={2}>
            Click the button above to continue
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;