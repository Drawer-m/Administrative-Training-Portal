import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, useMediaQuery, useTheme, Grid, Paper, Divider } from '@mui/material';
import { FaBars } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement
} from 'chart.js';
import Chatbot from './Chatbot';
import LowConfidence from './LowConfidence';
import Analytics from './Analytics';
import Sidebar from './Sidebar';
import AccessibilityPanel from './AccessibilityPanel';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const MOBILE_BREAKPOINT = 768;

const DASHBOARD_SIDEBAR_WIDTH_EXPANDED = 40;
const DASHBOARD_SIDEBAR_WIDTH_COLLAPSED = 40;
const DASHBOARD_MAIN_GAP = 24; 

const Dashboard = () => {
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

  
  const confidenceTrend = [80, 78, 82, 75, 85, 90, 88];
  const avgConfidence = Math.round(confidenceTrend.reduce((a, b) => a + b, 0) / confidenceTrend.length);
  const unresolvedLowConfidence = lowConfidenceQueries.length;

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  
  const sidebarWidth = isMobile
    ? 0
    : isSidebarExpanded
      ? DASHBOARD_SIDEBAR_WIDTH_EXPANDED
      : DASHBOARD_SIDEBAR_WIDTH_COLLAPSED;

  
  const mainMarginLeft = isMobile ? 0 : `${sidebarWidth + DASHBOARD_MAIN_GAP}px`;

 
  const mockPerformance = {
    responseTimes: [1.2, 1.0, 0.9, 1.1, 0.8, 1.3, 1.0],
    confidenceTrend: [80, 78, 82, 75, 85, 90, 88],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    totalQueries: 350,
    avgConfidence: 85,
  };

  const lineData = {
    labels: mockPerformance.days,
    datasets: [
      {
        label: 'Avg. Confidence (%)',
        data: mockPerformance.confidenceTrend,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      }
    ]
  };

  const barData = {
    labels: mockPerformance.days,
    datasets: [
      {
        label: 'Avg. Response Time (s)',
        data: mockPerformance.responseTimes,
        backgroundColor: '#43a047',
        borderRadius: 6,
        barThickness: 24,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
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

      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <FaBars />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Portal
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 2 : 2.5,
          width: { sm: `calc(100% - ${sidebarWidth}px)` },
          ml: mainMarginLeft,
          mt: isMobile ? 8 : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          bgcolor: 'transparent', // changed from '#f8ede3'
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 0 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Training Portal
          </Typography>
          {activeTab === '' && (
            <section>
              {/* Metrics Cards */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={2} sx={{ p: 3, textAlign: 'center', bgcolor: '#e0c3fc' }}>
                    <Typography variant="caption" color="text.secondary">Total Queries</Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{mockPerformance.totalQueries}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={2} sx={{ p: 3, textAlign: 'center', bgcolor: '#b5ead7' }}>
                    <Typography variant="caption" color="text.secondary">Avg. Confidence</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mt: 1 }}>{mockPerformance.avgConfidence}%</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={2} sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f7d9' }}>
                    <Typography variant="caption" color="text.secondary">Unresolved Low Confidence</Typography>
                    <Typography variant="h5" fontWeight="bold" color="error" sx={{ mt: 1 }}>
                      {lowConfidenceQueries.length}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <Divider sx={{ mb: 3 }} />
              {/* Analytics Charts */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 0,
                      height: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: '#e0f7fa', // match Queries per Day in Analytics
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: '0 4px 16px 0 rgba(25,118,210,0.08)'
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        bgcolor: 'primary.light',
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        boxShadow: 1
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          fontSize: 22,
                          boxShadow: 2
                        }}
                      >
                        <span role="img" aria-label="trend">📈</span>
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="medium"
                        sx={{
                          color: '#222', // black text
                          letterSpacing: 1
                        }}
                      >
                        Confidence Trend
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Line data={lineData} options={chartOptions} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 0,
                      height: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: '#fff1e6', // match Avg. Response Time in Analytics
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: '0 4px 16px 0 rgba(251,192,45,0.08)'
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        bgcolor: 'secondary.light',
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        boxShadow: 1
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: 'secondary.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          fontSize: 22,
                          boxShadow: 2
                        }}
                      >
                        <span role="img" aria-label="timer">⏱️</span>
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="medium"
                        sx={{
                          color: '#222', // black text
                          letterSpacing: 1
                        }}
                      >
                        Avg. Response Time
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bar data={barData} options={chartOptions} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </section>
          )}
          {activeTab === 'chatbot' && (
            <section>
              <Typography variant="h6" component="h2" gutterBottom>
                Chatbot Testing
              </Typography>
              <Chatbot onLowConfidence={handleLowConfidence} />
            </section>
          )}
          {activeTab === 'low-confidence' && (
            <section>
              <Typography variant="h6" component="h2" gutterBottom>
                Low Confidence Queries
              </Typography>
              <LowConfidence 
                queries={lowConfidenceQueries} 
                onResolve={handleResolveQuery}
                onAddTraining={handleAddTrainingData}
              />
            </section>
          )}
          {activeTab === 'analytics' && (
            <section>
              <Typography variant="h6" component="h2" gutterBottom>
                Analytics Dashboard
              </Typography>
              <Analytics queries={lowConfidenceQueries} />
            </section>
          )}
          {activeTab === 'accessibility' && (
            <section>
              <Typography variant="h6" component="h2" gutterBottom>
                Accessibility Settings
              </Typography>
              <AccessibilityPanel />
            </section>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
