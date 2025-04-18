import { useEffect, useRef, useState } from 'react';
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton,
  Divider, Box, Typography, Tooltip, useTheme
} from '@mui/material';
import {
  FaHome, FaRobot, FaExclamationTriangle, FaChartBar, FaSignOutAlt, FaBars
} from 'react-icons/fa';
import { Brightness4, Brightness7, Contrast, AccessibilityNew } from '@mui/icons-material';
import { useThemeMode } from './Accesibility';

const navItems = [
  { key: '', icon: <FaHome />, label: 'Dashboard' },
  { key: 'chatbot', icon: <FaRobot />, label: 'Chatbot Tester' },
  { key: 'low-confidence', icon: <FaExclamationTriangle />, label: 'Low Confidence' },
  { key: 'analytics', icon: <FaChartBar />, label: 'Analytics' },
  { key: 'accessibility', icon: <AccessibilityNew />, label: 'Accessibility' },
];

const COLLAPSED_WIDTH = 65;
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
  const { mode, setMode } = useThemeMode();

  // Close sidebar on outside click (mobile)
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

  // Keyboard navigation: ESC to close mobile drawer
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMobile, mobileOpen, setMobileOpen]);

  // Drawer content
  const drawerContent = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <IconButton onClick={isMobile ? () => setMobileOpen(false) : toggleSidebar} color="inherit">
          <FaBars />
        </IconButton>
        {isExpanded && (
          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
            Admin Portal
          </Typography>
        )}
      </Box>
      
      <Divider />
      
      <List>
        {navItems.map((item) => (
          <Tooltip 
            key={item.key}
            title={!isExpanded ? item.label : ""}
            placement="right"
            arrow
            disableHoverListener={isExpanded}
          >
            <ListItem
              button
              selected={activeTab === item.key}
              onClick={() => {
                setActiveTab(item.key);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: isExpanded ? 'initial' : 'center',
                borderRadius: '8px',
                mx: 1,
                mb: 0.5,
                bgcolor: activeTab === item.key ? '#fce4ec' : 'transparent',
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
                '&:hover': {
                  bgcolor: '#f3e5f5',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isExpanded ? 2 : 'auto',
                  justifyContent: 'center',
                  color: activeTab === item.key ? theme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isExpanded && (
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontSize: 14, 
                    fontWeight: activeTab === item.key ? 'bold' : 'medium'
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider />
      
      <List>
        <Tooltip 
          title={!isExpanded ? "Logout" : ""}
          placement="right"
          arrow
          disableHoverListener={isExpanded}
        >
          <ListItem
            button
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              window.location.reload();
            }}
            sx={{
              minHeight: 48,
              px: 2.5,
              justifyContent: isExpanded ? 'initial' : 'center',
              borderRadius: '8px',
              mx: 1,
              mb: 0.5,
              color: theme.palette.error.main,
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: '#ffebee',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isExpanded ? 2 : 'auto',
                justifyContent: 'center',
                color: 'inherit',
              }}
            >
              <FaSignOutAlt />
            </ListItemIcon>
            {isExpanded && (
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14 }} />
            )}
          </ListItem>
        </Tooltip>
      </List>
    </>
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
              bgcolor: '#e3f2fd',
              boxShadow: 3
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
              bgcolor: '#e3f2fd',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxShadow: 2
            },
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