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
  alpha
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
  MenuRounded 
} from '@mui/icons-material';
import { useThemeMode } from './Accessibility';
import { gsap } from 'gsap';

const Header = ({ activeTab, isMobile, setMobileSidebarOpen }) => {
  const { mode, setMode } = useThemeMode();
  const theme = useTheme();
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
  
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
  
  // Open/close notifications menu
  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
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
            // Navigate to dashboard logic here
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
      ref={headerRef}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: alpha('#1F1F2C', 0.95),
        backgroundImage: 'linear-gradient(to right, #1F1F2C, #262637)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        width: '100%', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        left: 0,
        height: 72, // Match the height of the sidebar header
      }}
    >
      <Toolbar 
        sx={{ 
          height: 72, // Set toolbar height to match sidebar header
          px: { xs: 2, md: 3 },
          minHeight: '72px !important', // Override MUI's default minHeight
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // This ensures the left and right sections are pushed to opposite ends
        }}
      >
        {/* Left Section: Page Title/Breadcrumbs */}
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {isMobile && (
            <IconButton 
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setMobileSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuRounded />
            </IconButton>
          )}
          
          <Box ref={titleRef} sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobileSize && getPageIcon()}
            {!isMobileSize ? (
              getBreadcrumbs()
            ) : (
              <Typography 
                variant="h6" 
                noWrap 
                sx={{ 
                  color: '#f0f0f0',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {getPageTitle()}
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* Right Section: Controls */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 }, 
          height: '100%',
          ml: 'auto' // This ensures the right section is pushed to the right
        }}>
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton 
              ref={el => iconsRef.current[0] = el}
              onClick={toggleTheme}
              sx={{ 
                color: '#e0e0e0',
                '&:hover': {
                  color: '#7C3AED',
                  bgcolor: alpha('#7C3AED', 0.1),
                },
              }}
            >
              {mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              ref={el => iconsRef.current[1] = el}
              onClick={handleNotificationClick}
              sx={{ 
                color: '#e0e0e0',
                '&:hover': {
                  color: '#7C3AED',
                  bgcolor: alpha('#7C3AED', 0.1),
                },
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsRounded />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Settings - Hidden on mobile */}
          {!isMobileSize && (
            <Tooltip title="Settings">
              <IconButton 
                ref={el => iconsRef.current[2] = el}
                sx={{ 
                  color: '#e0e0e0',
                  '&:hover': {
                    color: '#7C3AED',
                    bgcolor: alpha('#7C3AED', 0.1),
                  },
                }}
              >
                <SettingsRounded />
              </IconButton>
            </Tooltip>
          )}
          
          {/* Admin Avatar */}
          <Box 
            ref={el => iconsRef.current[3] = el}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileClick}
                sx={{
                  p: 0,
                  ml: { xs: 0, sm: 1 },
                  '& .MuiAvatar-root:hover': {
                    boxShadow: '0 0 0 2px #7C3AED',
                  }
                }}
              >
                <Avatar 
                  alt="Admin" 
                  sx={{ 
                    bgcolor: '#7C3AED',
                    width: 36,
                    height: 36,
                  }}
                >
                  AD
                </Avatar>
              </IconButton>
            </Tooltip>
            
            {/* Status indicator */}
            <Box
              sx={{
                position: 'absolute',
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#4caf50',
                border: '1.5px solid #1F1F2C',
                bottom: 3,
                right: 3,
              }}
            />
          </Box>
          
          {/* AI Model Status - Visible on larger screens */}
          {!isTablet && (
            <Box 
              sx={{ 
                ml: 2, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#a0a0a0',
                  fontSize: '0.65rem',
                }}
              >
                AI MODEL
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#e0e0e0',
                  fontWeight: 500,
                  fontSize: '0.8rem'
                }}
              >
                Gemini API
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          onClick={handleProfileClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 180,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              '& .MuiMenu-list': {
                p: 1,
              },
            },
          }}
        >
          <MenuItem sx={{ borderRadius: 1 }}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleLogout} sx={{ borderRadius: 1 }}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
        
        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 280,
              maxWidth: 320,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              '& .MuiMenu-list': {
                p: 0,
              },
            },
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.dark' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
          </Box>
          <MenuItem sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                New low confidence query
              </Typography>
              <Typography variant="caption" color="text.secondary">
                "How do I get my alumni certificate?" - 2 min ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                AI model updated
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Successfully deployed new model - 1 hour ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Document upload completed
              </Typography>
              <Typography variant="caption" color="text.secondary">
                3 new documents processed - 3 hours ago
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ 
                fontWeight: 'medium',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={handleNotificationClose}
            >
              View all notifications
            </Typography>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
