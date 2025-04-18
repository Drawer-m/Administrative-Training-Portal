import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    console.log('Attempting login with:', username, password); // Debug log

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoading(false);
        if (onLogin) onLogin(); // Notify App to update login state
        // navigate('/dashboard', { replace: true }); // Not needed, App will redirect
      } else {
        setError('Invalid username or password. Try admin/admin123.');
        setIsLoading(false);
        console.log('Login failed'); // Debug log
      }
    }, 1000);
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
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Welcome to AdminBot
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to access the <span style={{ color: '#7b2ff2', fontWeight: 700 }}>Admin Portal</span>
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaUser />
                  </InputAdornment>
                ),
              }}
              autoFocus
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock />
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Alert severity="error" variant="filled">
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isLoading}
              sx={{
                fontWeight: 'bold',
                py: 1.5,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
              startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
              Demo credentials: <span style={{ fontWeight: 700 }}>admin / admin123</span>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;