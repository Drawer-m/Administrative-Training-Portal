import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { authService } from '../services/authService';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          throw new Error(error);
        }

        if (!token) {
          throw new Error('No token received');
        }

        await authService.handleGoogleCallback(token);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Google callback error:', error);
        navigate('/login', { 
          replace: true,
          state: { error: error.message }
        });
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      }}
    >
      <CircularProgress size={60} sx={{ color: '#00c6ff' }} />
    </Box>
  );
}

export default GoogleCallback; 