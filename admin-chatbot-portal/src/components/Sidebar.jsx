import { useEffect, useRef, useState } from 'react';
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton,
  Divider, Box, Typography, Tooltip, useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SmartToy as ChatbotIcon,
  WarningAmber as WarningIcon,
  BarChart as AnalyticsIcon,
  FolderSpecial as DocumentIcon,
  AccessibilityNew as AccessibilityIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import { useThemeMode } from './Accessibility';
import { gsap } from 'gsap';
import AdminLogo from '../assets/admin-logo.svg';

// Ensure this array contains the subscription item with exact key name
const navItems = [
  { key: '', icon: <DashboardIcon />, label: 'Dashboard' },
  { key: 'chatbot', icon: <ChatbotIcon />, label: 'Chatbot Tester' },
  { key: 'low-confidence', icon: <WarningIcon />, label: 'Low Confidence' },
  { key: 'analytics', icon: <AnalyticsIcon />, label: 'Analytics' },
  { key: 'documents', icon: <DocumentIcon />, label: 'Document Manager' },
  { key: 'chatbot-builder', icon: <SettingsIcon />, label: 'Chatbot Builder' },
  { key: 'subscription', icon: <MonetizationOnIcon />, label: 'Subscription' },
  { key: 'accessibility', icon: <AccessibilityIcon />, label: 'Accessibility' },
];

// Updated dark theme colors for consistency
const SIDEBAR_BG_COLOR = '#1A1B23';
const SIDEBAR_ACCENT_COLOR = '#7C3AED';
const SIDEBAR_TEXT_COLOR = '#F5F5F5';
const SIDEBAR_HOVER_BG = 'rgba(124, 58, 237, 0.12)';
const SIDEBAR_ACTIVE_BG = 'rgba(124, 58, 237, 0.08)';

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 240;

const Sidebar = ({
  activeTab,
  setActiveTab,
  isExpanded,
  toggleSidebar,
  isMobile = false,
  mobileOpen = false,
  setMobileOpen = () => {},
}) => {
  const theme = useTheme();
  const sidebarRef = useRef();
  const sidebarContentRef = useRef();
  const logoTextRef = useRef();
  const itemsRef = useRef([]);
  const collapseButtonRef = useRef();
  const { mode } = useThemeMode();

  // Animation timeline for sidebar collapse/expand
  const timelineRef = useRef();
  
  // Track hover state for micro-interactions
  const [hoveredItem, setHoveredItem] = useState(null);

  // Initialize GSAP timeline
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, navItems.length);
    
    // Create a timeline for animations, but don't play it automatically
    timelineRef.current = gsap.timeline({ paused: true });
    
    return () => {
      // Clean up the timeline on unmount
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // Handle the sidebar toggle - separated from the animation effect
  const handleToggleSidebar = () => {
    // Call the provided toggle function from parent
    toggleSidebar();
  };

  // Update animations when expanded/collapsed state changes
  useEffect(() => {
    if (!sidebarContentRef.current || !logoTextRef.current) return;
    
    // Reset timeline
    if (timelineRef.current) {
      timelineRef.current.clear();
      
      if (!isExpanded) {
        // Animation for collapsing
        timelineRef.current
          .to(logoTextRef.current, { 
            opacity: 0, 
            duration: 0.3,
            ease: "power2.out" 
          }, 0)
          .to(itemsRef.current.map(ref => ref?.querySelector('.MuiListItemText-root')), { 
            opacity: 0, 
            duration: 0.3,
            ease: "power2.out" 
          }, 0);
      } else {
        // Animation for expanding
        timelineRef.current
          .to(logoTextRef.current, { 
            opacity: 1, 
            duration: 0.5,
            ease: "power2.out" 
          }, 0.3)
          .to(itemsRef.current.map(ref => ref?.querySelector('.MuiListItemText-root')), { 
            opacity: 1, 
            duration: 0.5,
            ease: "power2.out" 
          }, 0.3);
      }
      
      // Play the timeline
      timelineRef.current.play();
    }
  }, [isExpanded]);

  // Handle outside clicks for mobile drawer
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMobile, mobileOpen, setMobileOpen]);

  // Handle Escape key for mobile drawer
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMobile, mobileOpen, setMobileOpen]);

  // Active item animation
  useEffect(() => {
    if (!itemsRef.current.length) return;
    
    // Find the active item
    const activeIndex = navItems.findIndex(item => item.key === activeTab);
    if (activeIndex >= 0 && itemsRef.current[activeIndex]) {
      const activeIcon = itemsRef.current[activeIndex].querySelector('.MuiListItemIcon-root svg');
      
      if (activeIcon) {
        // Pulse animation for active icon
        gsap.to(activeIcon, {
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(activeIcon, {
              scale: 1,
              duration: 0.2,
              ease: "power2.out"
            });
          }
        });
      }
    }
  }, [activeTab]);

  // Handle item hover
  const handleItemHover = (index, isEnter) => {
    setHoveredItem(isEnter ? index : null);
    
    // Item hover animation
    if (itemsRef.current[index]) {
      const item = itemsRef.current[index];
      
      gsap.to(item, {
        backgroundColor: isEnter ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
        scale: isEnter ? 1.01 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Handle collapse button hover
  const handleCollapseButtonHover = (isEnter) => {
    if (collapseButtonRef.current) {
      gsap.to(collapseButtonRef.current, {
        scale: isEnter ? 1.1 : 1,
        backgroundColor: isEnter ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.12)',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const drawerContent = (
    <Box 
      ref={sidebarContentRef} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Logo and Title Area with Collapse Button */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          height: 72
        }}
      >
        {isExpanded ? (
          // Show logo and title when expanded
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component="img"
              src={AdminLogo} 
              alt="Admin Logo"
              sx={{ 
                height: 32, 
                width: 32,
                filter: "brightness(0) invert(1)",
                mr: 2,
                transition: 'margin 0.3s ease'
              }}
            />
            <Typography 
              ref={logoTextRef}
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1rem',
                letterSpacing: '0.02em',
                color: '#F5F5F5',
                opacity: 1,
                whiteSpace: 'nowrap'
              }}
            >
              Admin Portal
            </Typography>
          </Box>
        ) : (
          // Show only hamburger menu icon when collapsed
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <IconButton
              ref={collapseButtonRef}
              onClick={handleToggleSidebar}
              onMouseEnter={() => handleCollapseButtonHover(true)}
              onMouseLeave={() => handleCollapseButtonHover(false)}
              aria-label="Expand sidebar"
              sx={{
                width: 32,
                height: 32,
                color: '#F5F5F5',
                '&:hover': {
                  backgroundColor: 'rgba(124, 58, 237, 0.2)',
                },
                transition: 'background-color 0.3s ease, transform 0.3s ease',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        
        {/* Collapse Button - Only show when expanded */}
        {isExpanded && (
          <IconButton
            ref={collapseButtonRef}
            onClick={handleToggleSidebar}
            onMouseEnter={() => handleCollapseButtonHover(true)}
            onMouseLeave={() => handleCollapseButtonHover(false)}
            aria-label="Collapse sidebar"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(124, 58, 237, 0.12)',
              color: '#F5F5F5',
              '&:hover': {
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
              },
              transition: 'background-color 0.3s ease, transform 0.3s ease',
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
      
      {/* Navigation Items */}
      <List sx={{ py: 2, flexGrow: 1 }}>
        {navItems.map((item, index) => (
          <Tooltip 
            key={item.key}
            title={!isExpanded ? item.label : ""}
            placement="right"
            arrow
            disableHoverListener={isExpanded}
            TransitionProps={{ timeout: 600 }}
          >
            <ListItem
              ref={el => itemsRef.current[index] = el}
              button
              selected={activeTab === item.key}
              onClick={() => {
                setActiveTab(item.key);
                if (isMobile) setMobileOpen(false);
              }}
              onMouseEnter={() => handleItemHover(index, true)}
              onMouseLeave={() => handleItemHover(index, false)}
              sx={{
                minHeight: 52,
                px: 2.5,
                justifyContent: isExpanded ? 'flex-start' : 'center',
                borderRadius: '8px',
                mx: 1,
                mb: 0.8,
                position: 'relative',
                overflow: 'hidden',
                '&::before': activeTab === item.key ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '15%',
                  height: '70%',
                  width: '4px',
                  borderRadius: '0 4px 4px 0',
                  backgroundColor: '#7C3AED',
                  boxShadow: '0 0 8px #7C3AED',
                } : {},
                '&.Mui-selected': {
                  backgroundColor: 'rgba(124, 58, 237, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(124, 58, 237, 0.15)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(124, 58, 237, 0.12)',
                },
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isExpanded ? 2 : 'auto',
                  justifyContent: 'center',
                  color: activeTab === item.key ? '#7C3AED' : 'rgba(255, 255, 255, 0.8)',
                  transition: 'margin-right 0.3s ease', // Smooth transition for margin
                }}
              >
                {item.icon}
              </ListItemIcon>
              
              {/* Completely hide text when collapsed */}
              {isExpanded && (
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    color: '#F5F5F5',
                    opacity: activeTab === item.key ? 1 : 0.9
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
      
      <Divider sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        opacity: isExpanded ? 1 : 0,
        transition: 'opacity 0.3s ease',
        mx: 2
      }} />
      
      {/* Logout Button */}
      <List sx={{ py: 1 }}>
        <ListItem
          button
          onClick={() => {
            localStorage.removeItem('isLoggedIn');
            window.location.reload();
          }}
          sx={{
            minHeight: 48,
            px: 2.5,
            justifyContent: isExpanded ? 'flex-start' : 'center',
            borderRadius: '8px',
            mx: 1,
            mb: 1,
            color: '#E5E5E5',
            '&:hover': {
              backgroundColor: 'rgba(255, 73, 73, 0.12)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isExpanded ? 2 : 'auto',
              justifyContent: 'center',
              color: '#E5E5E5',
              transition: 'margin-right 0.3s ease', // Smooth transition for margin
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          
          {/* Only render logout text when expanded */}
          {isExpanded && (
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            />
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: 'block',
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: EXPANDED_WIDTH,
              bgcolor: SIDEBAR_BG_COLOR,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              zIndex: (theme) => theme.zIndex.drawer + 2,
            },
          }}
        >
          <Box ref={sidebarRef}>
            {drawerContent}
          </Box>
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
              boxSizing: 'border-box',
              overflowX: 'hidden',
              bgcolor: SIDEBAR_BG_COLOR,
              borderRight: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
              zIndex: (theme) => theme.zIndex.drawer,
              position: 'fixed',
              height: '100%',
            },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          }}
          open={true}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;