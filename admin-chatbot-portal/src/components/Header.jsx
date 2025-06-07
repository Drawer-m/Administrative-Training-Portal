import { useState, useEffect, useRef } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Avatar, 
  Tooltip, 
  useMediaQuery, 
  useTheme, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Badge, 
  Breadcrumbs, 
  Link,
  Divider,
  alpha,
  Button
} from '@mui/material';
import { 
  DarkModeRounded, 
  LightModeRounded, 
  NotificationsRounded, 
  SettingsRounded, 
  Logout, 
  AccountCircle, 
  FolderOpenRounded, 
  HomeRounded,
  MenuRounded,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { useThemeMode } from './Accessibility';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Header = ({ activeTab, isMobile, setMobileSidebarOpen, onLogout }) => {
  const { mode, setMode } = useThemeMode();
  const theme = useTheme();
  const navigate = useNavigate();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileSize = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Refs for GSAP animations
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const iconsRef = useRef([]);
  
  // States for menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3); // Mock notification count
  
  // Page titles based on active tab
  const pageTitles = {
    '': 'Dashboard',
    'chatbot': 'Chatbot Tester',
    'low-confidence': 'Low Confidence Monitor',
    'analytics': 'Analytics Dashboard',
    'documents': 'Document Manager',
    'accessibility': 'Accessibility Settings'
  };
  
  // Get page title from active tab
  const getPageTitle = () => {
    return pageTitles[activeTab] || 'Dashboard';
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };
  
  // Open/close profile menu
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Call the parent's onLogout function
    if (onLogout) {
      onLogout();
    }
    // Clear auth state
    authService.logout();
    // Navigate to login
    navigate('/login', { replace: true });
  };
  
  // Close profile menu
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
  
  // Open/close notifications menu
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };
  
  // Close notifications menu
  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };
  
  // Initial animations with GSAP
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
    
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.2 }
      );
    }
    
    if (iconsRef.current.length) {
      gsap.fromTo(
        iconsRef.current,
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.3, 
          stagger: 0.1,
          ease: "back.out(1.7)", 
          delay: 0.3 
        }
      );
    }
  }, []);
  
  // Animation for page title change
  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeTab]);
  
  // Get page icon based on active tab
  const getPageIcon = () => {
    switch(activeTab) {
      case 'documents':
        return <FolderOpenRounded sx={{ mr: 1, color: '#e0e0e0' }} />;
      case 'subscription':
        return <MonetizationOnIcon sx={{ mr: 1, color: '#e0e0e0' }} />;
      default:
        return null;
    }
  };
  
  // Get breadcrumbs based on active tab
  const getBreadcrumbs = () => {
    if (!activeTab) {
      return (
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ color: '#e0e0e0' }}>
          <Typography color="#e0e0e0" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeRounded sx={{ mr: 0.5, fontSize: 18 }} />
            Dashboard
          </Typography>
        </Breadcrumbs>
      );
    }
    
    return (
      <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ color: '#e0e0e0' }}>
        <Link 
          sx={{ 
            color: '#c0c0c0', 
            display: 'flex', 
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              color: '#fff'
            }
          }} 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
        >
          <HomeRounded sx={{ mr: 0.5, fontSize: 18 }} />
          Dashboard
        </Link>
        <Typography color="#e0e0e0">{getPageTitle()}</Typography>
      </Breadcrumbs>
    );
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        bgcolor: mode === 'dark' ? 'rgba(26, 27, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuRounded />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {getBreadcrumbs()}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsRounded />
              </Badge>
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              ml: 2,
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              '&:hover': {
                borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
