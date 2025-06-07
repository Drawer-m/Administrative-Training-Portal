import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
  Stack,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import { authService } from '../services/authService';

function Login({ onLogin }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login(username, password);
      setIsLoading(false);
      if (onLogin) onLogin();
      // Redirect to the page they tried to visit or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.signup(username, email, password);
      setIsLoading(false);
      if (onLogin) onLogin();
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.message || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          animation: 'pulse 15s infinite',
        },
        '@keyframes pulse': {
          '0%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.2)' },
          '100%': { transform: 'translate(-50%, -50%) scale(1)' },
        },
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 420,
          width: '100%',
          p: 5,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Welcome to AdminBot
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 4,
            fontSize: '1.1rem',
          }}
        >
          {activeTab === 0 ? 'Sign in to access the' : 'Create an account to access the'}{' '}
          <span style={{ color: '#00c6ff', fontWeight: 700 }}>Admin Portal</span>
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 4,
            '& .MuiTabs-indicator': {
              backgroundColor: '#00c6ff',
            },
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#00c6ff',
              },
            },
          }}
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        <form onSubmit={activeTab === 0 ? handleLogin : handleSignup}>
          <Stack spacing={3}>
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
                    <FaUser style={{ color: '#00c6ff' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 198, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00c6ff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#00c6ff',
                  },
                },
              }}
              autoFocus
            />
            {activeTab === 1 && (
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope style={{ color: '#00c6ff' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 198, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00c6ff',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#00c6ff',
                    },
                  },
                }}
              />
            )}
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
                    <FaLock style={{ color: '#00c6ff' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0, 198, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00c6ff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#00c6ff',
                  },
                },
              }}
            />
            {error && (
              <Alert
                severity="error"
                variant="filled"
                sx={{
                  bgcolor: 'rgba(211, 47, 47, 0.9)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
              sx={{
                background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 14px 0 rgba(0, 198, 255, 0.39)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #00b3ff 0%, #0066ff 100%)',
                  boxShadow: '0 6px 20px 0 rgba(0, 198, 255, 0.49)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
              startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
            >
              {isLoading ? 'Processing...' : activeTab === 0 ? 'Sign in' : 'Sign up'}
            </Button>

            <Divider sx={{ my: 2, color: 'rgba(255, 255, 255, 0.5)' }}>OR</Divider>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
              startIcon={<FcGoogle size={24} />}
            >
              Continue with Google
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;