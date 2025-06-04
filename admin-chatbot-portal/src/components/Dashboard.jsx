import { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, useMediaQuery, useTheme, Grid, Paper, Divider, 
  Card, CardContent, CardHeader, IconButton, Button, Avatar, 
  LinearProgress, Stack, Tooltip, CircularProgress, alpha
} from '@mui/material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, 
  Tooltip as ChartTooltip, Legend, PointElement, LineElement, ArcElement
} from 'chart.js';
import { 
  TrendingUp as TrendingUpIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ReportGmailerrorred as ReportIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  SmartToy as SmartToyIcon,
  WarningAmber as WarningIcon,
  AddCircle as AddCircleIcon,
  Tune as TuneIcon,
  Chat as ChatIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { FaBars } from 'react-icons/fa';
import Chatbot from './Chatbot';
import LowConfidence from './LowConfidence';
import Analytics from './Analytics';
import Sidebar from './Sidebar';
import AccessibilityPanel from './AccessibilityPanel';
import DocumentManager from './DocumentManager';
import ChatbotBuilder from './ChatbotBuilder'; // Import the new component
import Header from './Header';
import SubscriptionManagement from './SubscriptionManagement'; // Import Subscription component
import { gsap } from 'gsap';
import { useThemeMode } from './Accessibility';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, ChartTooltip, 
  Legend, PointElement, LineElement, ArcElement
);

const MOBILE_BREAKPOINT = 768;

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 72;
const DASHBOARD_MAIN_GAP = 24; 

const Dashboard = () => {
  const { mode } = useThemeMode();
  const [lowConfidenceQueries, setLowConfidenceQueries] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [recentQueries] = useState([
    { question: "How do I reset my password?", response: "You can reset your password via the portal.", confidence: 92, time: "2 min ago" },
    { question: "When is the last date for registration?", response: "Registration closes on June 30.", confidence: 75, time: "10 min ago" },
    { question: "Where is the admin office?", response: "The admin office is in Block A.", confidence: 60, time: "20 min ago" },
    { question: "How to apply for hostel?", response: "You can apply for hostel in the student portal.", confidence: 48, time: "30 min ago" },
    { question: "What is the fee structure?", response: "The fee structure is available on the website.", confidence: 85, time: "1 hour ago" },
  ]);
  const [systemStatus] = useState({
    version: "v1.2.3",
    lastTraining: "2024-06-01",
    uptime: "99.98%",
  });

  // Refs for animations
  const welcomeRef = useRef(null);
  const metricsRefs = useRef([]);
  const graphRef = useRef(null);
  const actionsRef = useRef(null);
  const feedbackRef = useRef(null);

  // Ref for the spinning robot icon
  const robotIconRef = useRef(null);

  // Additional mock data for dashboard
  const [dailyStats] = useState({
    confidenceAvg: 82,
    totalQueries: 247,
    lowConfidenceCount: 18,
    resolvedQueries: 192,
    apiResponseTime: 0.8, // seconds
  });

  const [commonQueries] = useState([
    "How do I reset my student password?",
    "When is the registration deadline?",
    "Where can I find my class schedule?",
    "How do I apply for financial aid?",
    "What are the library opening hours?"
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      if (window.innerWidth >= MOBILE_BREAKPOINT) setMobileSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLowConfidence = (query) => setLowConfidenceQueries((prev) => [...prev, query]);
  const handleResolveQuery = (index) => setLowConfidenceQueries((prev) => prev.filter((_, idx) => idx !== index));
  const handleAddTrainingData = (query, response) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleResolveQuery(lowConfidenceQueries.findIndex((q) => q.question === query));
    }, 1000);
  };

  // Animation for dashboard elements
  useEffect(() => {
    if (activeTab === '') { // Only run animations on dashboard view
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      // Welcome banner animation
      if (welcomeRef.current) {
        timeline.fromTo(
          welcomeRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        );
      }
      
      // Metrics cards animation
      if (metricsRefs.current.length) {
        timeline.fromTo(
          metricsRefs.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.4" // Overlap with previous animation
        );
      }
      
      // Graph animation
      if (graphRef.current) {
        timeline.fromTo(
          graphRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.2"
        );
      }
      
      // Actions animation
      if (actionsRef.current) {
        timeline.fromTo(
          actionsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.4"
        );
      }
      
      // Feedback animation
      if (feedbackRef.current) {
        timeline.fromTo(
          feedbackRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.4"
        );
      }
    }
  }, [activeTab]);

  // Line chart data
  const confidenceData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Confidence Score (%)',
        data: [80, 78, 82, 75, 85, 90, 88],
        fill: true,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderColor: '#7C3AED',
        tension: 0.4,
        pointBackgroundColor: '#7C3AED',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#7C3AED',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: {
          display: true,
          color: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          callback: (value) => value + '%',
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    },
  };

  // Quick action handlers
  const handleTestChatbot = () => setActiveTab('chatbot');
  const handleViewLowConfidence = () => setActiveTab('low-confidence');
  const handleAddTraining = () => setActiveTab('documents');
  const handleAdjustThreshold = () => {
    // For demo, just display a notification or alert
    alert("Confidence threshold adjustment would appear here");
  };

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  const isDarkMode = mode === 'dark';
  const bgColor = isDarkMode ? '#1A1B23' : '#F5F7FA';
  const textColor = isDarkMode ? '#EEE' : '#333';
  const accentColor = '#7C3AED'; // Purple accent

  const sidebarWidth = isMobile
    ? 0
    : isSidebarExpanded
      ? EXPANDED_WIDTH
      : COLLAPSED_WIDTH;

  // Add useEffect for spinning the robot icon
  useEffect(() => {
    if (robotIconRef.current) {
      gsap.to(robotIconRef.current, {
        rotation: 360,
        duration: 4,
        repeat: -1,
        ease: "linear",
        transformOrigin: "50% 50%",
      });
    }
    // Cleanup on unmount
    return () => {
      if (robotIconRef.current) {
        gsap.killTweensOf(robotIconRef.current);
        gsap.set(robotIconRef.current, { rotation: 0 });
      }
    };
  }, []);

  // Add to the pageTitles object (if you have such an object for the header)
  const pageTitles = {
    '': 'Dashboard',
    'chatbot': 'Chatbot Tester',
    'low-confidence': 'Low Confidence Monitor',
    'analytics': 'Analytics Dashboard',
    'documents': 'Document Manager',
    'chatbot-builder': 'Chatbot Builder',
    'subscription': 'Subscription Management', // Add this line
    'accessibility': 'Accessibility Settings'
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded((v) => !v)}
        isMobile={isMobile}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          bgcolor: bgColor,
          background: isDarkMode 
            ? 'linear-gradient(to bottom, #1A1B23, #24252E)'
            : 'linear-gradient(to bottom, #F5F7FA, #FFFFFF)',
          overflowX: 'hidden',
        }}
      >
        {/* Header Component */}
        <Header 
          activeTab={activeTab} 
          isMobile={isMobile} 
          setMobileSidebarOpen={setMobileSidebarOpen} 
        />
        
        {/* Main Content with proper padding */}
        <Box 
          sx={{ 
            p: 3, 
            maxWidth: 1400, 
            width: '100%',
            mx: 'auto',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeTab === '' && (
            <Box>
              {/* Section 1: Welcome Banner */}
              <Paper
                ref={welcomeRef}
                elevation={3}
                sx={{
                  mb: 4,
                  p: { xs: 3, md: 4 },
                  background: `linear-gradient(135deg, ${accentColor} 0%, #5B21B6 100%)`,
                  borderRadius: 3,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ zIndex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome back, Admin!
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.9, fontWeight: 400 }}>
                    Monitor your assistant's performance and fine-tune with confidence.
                  </Typography>
                  <Box 
                    sx={{
                      display: 'inline-block',
                      px: 2, 
                      py: 0.5, 
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderRadius: 4,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography variant="body2">
                      Model: Gemini API • Confidence Threshold: 70%
                    </Typography>
                  </Box>
                </Box>
                <Box 
                  sx={{ 
                    display: { xs: 'none', md: 'flex' },
                    height: 140,
                    width: 140,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  {/* Attach the ref to the icon for spinning */}
                  <SmartToyIcon ref={robotIconRef} sx={{ fontSize: 70, opacity: 0.9 }} />
                </Box>
                {/* Abstract background elements */}
                <Box 
                  sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    zIndex: 0,
                  }}
                />
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '5%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    zIndex: 0,
                  }}
                />
              </Paper>

              {/* Section 2: Key Metrics */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Confidence Average */}
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    ref={el => metricsRefs.current[0] = el}
                    elevation={2}
                    sx={{
                      p: 2,
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 1.5 }}>
                        <TrendingUpIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="medium">
                        Confidence Avg
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.primary.main }}>
                      {dailyStats.confidenceAvg}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={dailyStats.confidenceAvg} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        '.MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: 4,
                        }
                      }} 
                    />
                  </Paper>
                </Grid>
                
                {/* Total Queries */}
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    ref={el => metricsRefs.current[1] = el}
                    elevation={2}
                    sx={{
                      p: 2,
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.light, mr: 1.5 }}>
                        <QuestionAnswerIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="medium">
                        Total Queries
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.secondary.main }}>
                        {dailyStats.totalQueries}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Today
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      +12.5% from yesterday
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Low Confidence Queries */}
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    ref={el => metricsRefs.current[2] = el}
                    elevation={2}
                    sx={{
                      p: 2,
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.error.light, mr: 1.5 }}>
                        <ReportIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="medium">
                        Low Confidence
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: theme.palette.error.main }}>
                        {dailyStats.lowConfidenceCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unresolved
                      </Typography>
                    </Box>
                    <Typography variant="body2" color={theme.palette.error.main} sx={{ fontWeight: 500 }}>
                      Needs attention
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Resolved Queries */}
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    ref={el => metricsRefs.current[3] = el}
                    elevation={2}
                    sx={{
                      p: 2,
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.success.light, mr: 1.5 }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight="medium">
                        Resolved Queries
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={(dailyStats.resolvedQueries / dailyStats.totalQueries) * 100}
                          size={60}
                          thickness={6}
                          sx={{ color: theme.palette.success.main }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" component="div" color="text.secondary">
                            {Math.round((dailyStats.resolvedQueries / dailyStats.totalQueries) * 100)}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.success.main }}>
                        {dailyStats.resolvedQueries}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Section 3 & 4: Line Graph and AI Feedback + Quick Actions side by side */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Chart */}
                <Grid item xs={12} md={8}>
                  <Paper
                    ref={graphRef}
                    elevation={2}
                    sx={{
                      p: 3,
                      height: '100%',
                      minHeight: 400,
                      borderRadius: 2,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Confidence Trend (Last 7 Days)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      View daily confidence scores to track AI performance
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line data={confidenceData} options={chartOptions} />
                    </Box>
                  </Paper>
                </Grid>
                
                {/* AI Feedback Summary + Quick Actions */}
                <Grid item xs={12} md={4}>
                  <Stack spacing={3}>
                    <Paper
                      ref={feedbackRef}
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.info.light, mr: 2 }}>
                          <ChatIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          Top Queries This Week
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                        {commonQueries.map((query, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              py: 1.5, 
                              borderBottom: index < commonQueries.length - 1 ? '1px solid' : 'none', 
                              borderColor: 'divider'
                            }}
                          >
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box component="span" sx={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 24,
                                height: 24,
                                mr: 1,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                borderRadius: '50%',
                                fontSize: 14,
                              }}>
                                {index + 1}
                              </Box>
                              {query}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                    {/* Quick Actions moved here */}
                    <Paper
                      ref={actionsRef}
                      elevation={2}
                      sx={{ p: 3, borderRadius: 2 }}
                    >
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Quick Actions
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SmartToyIcon />}
                            onClick={handleTestChatbot}
                            fullWidth
                            sx={{ 
                              py: 1.5,
                              textTransform: 'none',
                              borderRadius: 2,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                              }
                            }}
                          >
                            Test Chatbot
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<WarningIcon />}
                            onClick={handleViewLowConfidence}
                            fullWidth
                            sx={{ 
                              py: 1.5,
                              textTransform: 'none',
                              borderRadius: 2,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                              }
                            }}
                          >
                            View Low Confidence
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddCircleIcon />}
                            onClick={handleAddTraining}
                            fullWidth
                            sx={{ 
                              py: 1.5,
                              textTransform: 'none',
                              borderRadius: 2,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                              }
                            }}
                          >
                            Add Training Data
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<TuneIcon />}
                            onClick={handleAdjustThreshold}
                            fullWidth
                            sx={{ 
                              py: 1.5,
                              textTransform: 'none',
                              borderRadius: 2,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                              }
                            }}
                          >
                            Adjust Threshold
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}
          {activeTab === 'chatbot' && (
            <section>
              <Chatbot onLowConfidence={handleLowConfidence} />
            </section>
          )}
          {activeTab === 'low-confidence' && (
            <section>
              <LowConfidence 
                queries={lowConfidenceQueries} 
                onResolve={handleResolveQuery}
                onAddTraining={handleAddTrainingData}
              />
            </section>
          )}
          {activeTab === 'analytics' && (
            <section>
              <Analytics queries={lowConfidenceQueries} />
            </section>
          )}
          {activeTab === 'documents' && (
            <section>
              <DocumentManager />
            </section>
          )}
          {activeTab === 'chatbot-builder' && (
            <section>
              <ChatbotBuilder />
            </section>
          )}
          {activeTab === 'accessibility' && (
            <section>
              <AccessibilityPanel />
            </section>
          )}
          {activeTab === 'subscription' && (
            <>
              {console.log('Rendering subscription tab')}
              <SubscriptionManagement />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
