import { createTheme } from '@mui/material/styles';

// Create a dark theme base for the application none of it seems to be working 
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
      light: '#9F6FFF',
      dark: '#5B21B6',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#4EADEA',
      light: '#7BC6F0',
      dark: '#1A91D9',
      contrastText: '#ffffff'
    },
    background: {
      default: '#0F1017',
      paper: '#1A1B23',
    },
    text: {
      primary: '#F0F0F0',
      secondary: '#B0B0B0',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0F1017',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1B23',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #1F1F2C, #262637)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
        },
      },
    },
  },
});

// Create a light theme version
export const lightTheme = createTheme({
  ...darkTheme,
  palette: {
    mode: 'light',
    primary: darkTheme.palette.primary,
    secondary: darkTheme.palette.secondary,
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  components: {
    ...darkTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F7FA',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #FFFFFF, #F5F7FA)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default darkTheme;
