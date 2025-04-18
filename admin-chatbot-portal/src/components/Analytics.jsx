import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import {
  Box, Grid, Paper, Typography, List, ListItem, ListItemText, Divider, useTheme, Container, Stack, alpha
} from '@mui/material';
import { useThemeMode } from './Accessibility';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const Analytics = ({ queries }) => {
  const theme = useTheme();
  const { mode } = useThemeMode();

  const generateMockData = () => {
    return {
      dailyQueries: [45, 52, 38, 60, 55, 78, 42],
      responseTime: [0.8, 0.7, 0.9, 0.6, 0.8, 0.7, 0.5],
      categories: {
        'Student Services': 35,
        'Course Information': 28,
        'Technical Support': 18,
        'Faculty Questions': 12,
        'Other': 7
      }
    };
  };

  const mockData = generateMockData();

  const confidenceData = {
    high: queries.filter(q => q.confidence >= 70).length,
    medium: queries.filter(q => q.confidence >= 50 && q.confidence < 70).length,
    low: queries.filter(q => q.confidence < 50).length,
    total: queries.length + mockData.dailyQueries.reduce((acc, val) => acc + val, 0) - (queries.length)
  };

  const getChartColors = () => {
    const isHighContrast = mode === 'high-contrast';
    const isDark = mode === 'dark';

    return {
      primary: {
        main: isHighContrast ? '#ffffff' : theme.palette.primary.main,
        light: isHighContrast ? '#aaaaaa' : isDark ? alpha(theme.palette.primary.main, 0.7) : theme.palette.primary.light,
      },
      secondary: {
        main: isHighContrast ? '#ffff00' : theme.palette.secondary.main,
        light: isHighContrast ? '#aaaa00' : isDark ? alpha(theme.palette.secondary.main, 0.7) : theme.palette.secondary.light,
      },
      error: {
        main: isHighContrast ? '#ff6666' : theme.palette.error.main,
        light: isHighContrast ? '#aa4444' : isDark ? alpha(theme.palette.error.main, 0.7) : theme.palette.error.light,
      },
      warning: {
        main: isHighContrast ? '#ffaa00' : theme.palette.warning.main,
        light: isHighContrast ? '#aa7700' : isDark ? alpha(theme.palette.warning.main, 0.7) : theme.palette.warning.light,
      },
      success: {
        main: isHighContrast ? '#66ff66' : theme.palette.success.main,
        light: isHighContrast ? '#44aa44' : isDark ? alpha(theme.palette.success.main, 0.7) : theme.palette.success.light,
      },
      info: {
        main: isHighContrast ? '#66ffff' : theme.palette.info.main,
        light: isHighContrast ? '#44aaaa' : isDark ? alpha(theme.palette.info.main, 0.7) : theme.palette.info.light,
      },
      text: isHighContrast ? '#ffffff' : isDark ? '#e0e0e0' : '#333333',
      grid: isHighContrast ? '#ffffff' : isDark ? '#555555' : '#e0e0e0',
    };
  };

  const chartColors = getChartColors();

  const barData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Queries per Day',
        data: mockData.dailyQueries,
        backgroundColor: chartColors.primary.light,
        borderColor: chartColors.primary.main,
        borderWidth: 1,
      }
    ]
  };

  const lineData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Avg. Response Time (s)',
        data: mockData.responseTime,
        borderColor: chartColors.secondary.main,
        backgroundColor: chartColors.secondary.light,
        tension: 0.1,
        fill: false
      }
    ]
  };

  const doughnutData = {
    labels: Object.keys(mockData.categories),
    datasets: [{
      data: Object.values(mockData.categories),
      backgroundColor: [
        chartColors.error.light,
        chartColors.primary.light,
        chartColors.warning.light,
        chartColors.success.light,
        chartColors.info.light
      ],
      borderWidth: mode === 'high-contrast' ? 2 : 1,
      borderColor: mode === 'high-contrast' ? '#ffffff' : 'transparent'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 10 },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          color: chartColors.text
        }
      },
      tooltip: {
        backgroundColor: mode === 'dark' ? '#333' : mode === 'high-contrast' ? '#000' : '#fff',
        titleColor: mode === 'dark' || mode === 'high-contrast' ? '#fff' : '#333',
        bodyColor: mode === 'dark' || mode === 'high-contrast' ? '#eee' : '#555',
        borderColor: chartColors.grid,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: alpha(chartColors.grid, 0.2)
        },
        ticks: {
          color: chartColors.text
        }
      },
      y: {
        grid: {
          color: alpha(chartColors.grid, 0.2)
        },
        ticks: {
          color: chartColors.text
        }
      }
    }
  };

  const getSurfaceColor = (colorName) => {
    if (mode === 'high-contrast') {
      return 'var(--surface-color)';
    } else if (mode === 'dark') {
      return alpha(theme.palette[colorName].main, 0.15);
    } else {
      return theme.palette[colorName].light;
    }
  };

  const getHeadingStyle = () => {
    if (mode === 'high-contrast') {
      return {
        color: '#ffff00',
        textShadow: '0 0 5px rgba(255,255,255,0.5)',
        borderBottom: '2px solid #ffff00',
        pb: 1,
        mb: 2
      };
    } else if (mode === 'dark') {
      return {
        background: 'linear-gradient(90deg, #90caf9 0%, #ce93d8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        pb: 1,
        mb: 2
      };
    } else {
      return {
        background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        borderBottom: '2px solid #1976d2',
        pb: 1,
        mb: 2
      };
    }
  };

  const getSectionHeadingStyle = (color) => {
    const baseStyles = {
      fontSize: '1.5rem',
      fontWeight: 700,
      display: 'inline-block',
      position: 'relative',
      mb: 2,
      pl: 2,
      '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        height: '80%',
        width: '4px',
        borderRadius: '4px',
      }
    };
    
    if (mode === 'high-contrast') {
      return {
        ...baseStyles,
        color: '#ffffff',
        '&:before': {
          ...baseStyles['&:before'],
          backgroundColor: '#ffff00',
        }
      };
    }
    
    return {
      ...baseStyles,
      '&:before': {
        ...baseStyles['&:before'],
        backgroundColor: theme.palette[color].main,
      }
    };
  };

  return (
    <Box sx={{ 
      bgcolor: 'transparent', 
      py: 2, 
      px: { xs: 1, md: 2 } 
    }}>
      <Container 
        maxWidth="xl" 
        sx={{ px: { xs: 1, sm: 2, md: 3 } }} 
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center"
          sx={{
            ...getHeadingStyle(),
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 800,
            letterSpacing: '0.5px',
            mb: 3
          }}
        >
          Analytics Dashboard
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                bgcolor: getSurfaceColor('primary'),
                border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 6
                }
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 500, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Total Queries
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  mt: 1,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }, 
                  color: mode === 'high-contrast' ? '#ffffff' : theme.palette.primary.main  
                }}
              >
                {confidenceData.total}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                bgcolor: getSurfaceColor('success'),
                border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 6
                }
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 500, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                High Confidence
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="success.main" 
                sx={{ 
                  mt: 1,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                {confidenceData.high}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                bgcolor: getSurfaceColor('warning'),
                border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 6
                }
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 500, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Medium Confidence
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="warning.main" 
                sx={{ 
                  mt: 1,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                {confidenceData.medium}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                bgcolor: getSurfaceColor('error'),
                border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 6
                }
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 500, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Low Confidence
              </Typography>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color="error.main" 
                sx={{ 
                  mt: 1,
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                {confidenceData.low}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography sx={getSectionHeadingStyle('primary')}>
          Performance Analytics
        </Typography>

        <Stack spacing={2.5}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 0,
                  height: { xs: 350, md: 380 },
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'var(--surface-color)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
                  boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Box
                  sx={{
                    bgcolor: mode === 'dark' ? 'primary.dark' : 'primary.light',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid var(--border-color)`
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span role="img" aria-label="bar-chart" style={{ fontSize: '1.3rem' }}>
                      📈
                    </span>
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="var(--text-color)"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    Queries per Day
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bar data={barData} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 0,
                  height: { xs: 350, md: 380 },
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'var(--surface-color)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
                  boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Box
                  sx={{
                    bgcolor: mode === 'dark' ? 'secondary.dark' : 'secondary.light',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid var(--border-color)`
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span role="img" aria-label="line-chart" style={{ fontSize: '1.3rem' }}>
                      ⏱️
                    </span>
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="var(--text-color)"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    Avg. Response Time
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Line data={lineData} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Typography sx={getSectionHeadingStyle('info')} mt={2}>
            Data Insights
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 0,
                  height: { xs: 350, md: 380 },
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'var(--surface-color)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
                  boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Box
                  sx={{
                    bgcolor: mode === 'dark' ? 'info.dark' : 'info.light',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid var(--border-color)`
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'info.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span role="img" aria-label="category" style={{ fontSize: '1.3rem' }}>
                      📊
                    </span>
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="var(--text-color)"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    Query Categories
                  </Typography>
                </Box>
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center', 
                  px: 2, 
                  py: 2 
                }}>
                  <Box sx={{ 
                    width: { xs: '100%', sm: '50%' }, 
                    height: { xs: '45%', sm: 'auto' }, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Doughnut
                      data={doughnutData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: { display: false }
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ 
                    flex: 1, 
                    width: { xs: '100%', sm: '50%' },
                    ml: { xs: 0, sm: 2 }, 
                    mt: { xs: 2, sm: 0 },
                    overflowY: 'auto', 
                    maxHeight: { xs: '55%', sm: 300 } 
                  }}>
                    <List dense>
                      {Object.entries(mockData.categories).map(([cat, count], idx) => (
                        <ListItem key={cat} sx={{ py: 0.5 }}>
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              bgcolor: doughnutData.datasets[0].backgroundColor[idx],
                              mr: 1.5,
                              border: mode === 'high-contrast' ? '2px solid var(--border-color)' : '1.5px solid #fff',
                              boxShadow: mode === 'high-contrast' ? 0 : 1
                            }}
                          />
                          <Typography variant="body2" sx={{ flex: 1, color: 'var(--text-color)', fontWeight: 500 }}>
                            {cat}
                          </Typography>
                          <Box
                            sx={{
                              bgcolor: mode === 'high-contrast'
                                ? 'transparent'
                                : doughnutData.datasets[0].backgroundColor[idx],
                              color: mode === 'high-contrast'
                                ? doughnutData.datasets[0].backgroundColor[idx]
                                : mode === 'dark' ? '#222' : '#222',
                              px: 1.5,
                              borderRadius: 1,
                              fontWeight: 600,
                              fontSize: 13,
                              minWidth: 32,
                              textAlign: 'center',
                              border: mode === 'high-contrast'
                                ? `1px solid ${doughnutData.datasets[0].backgroundColor[idx]}`
                                : 'none'
                            }}
                          >
                            {count}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 0,
                  height: { xs: 350, md: 380 },
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'var(--surface-color)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
                  boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <Box
                  sx={{
                    bgcolor: mode === 'dark' ? 'success.dark' : 'success.light',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid var(--border-color)`
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span role="img" aria-label="improvement" style={{ fontSize: '1.3rem' }}>
                      🚀
                    </span>
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="var(--text-color)"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '1.1rem'
                    }}
                  >
                    Recent Improvements
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
                  <List sx={{ p: 0 }}>
                    <ListItem
                      sx={{
                        mb: 2,
                        p: 2,
                        borderLeft: `4px solid ${theme.palette.success.main}`,
                        bgcolor: mode === 'dark'
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.success.light, 0.5),
                        borderRadius: 1,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(3px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography 
                            fontWeight="bold" 
                            color="var(--text-color)"
                            sx={{ fontSize: '1rem' }}
                          >
                            Course Registration Process
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Box component="span" 
                              sx={{ 
                                bgcolor: alpha(theme.palette.success.main, 0.2),
                                color: theme.palette.success.main,
                                px: 1,
                                py: 0.2,
                                borderRadius: 1,
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                mr: 1
                              }}
                            >
                              +44%
                            </Box>
                            <Typography 
                              color={mode === 'high-contrast' ? 'secondary.main' : 'text.secondary'}
                              variant="body2"
                            >
                              Confidence improved from 48% to 92%
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        mb: 2,
                        p: 2,
                        borderLeft: `4px solid ${theme.palette.success.main}`,
                        bgcolor: mode === 'dark'
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.success.light, 0.5),
                        borderRadius: 1,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(3px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography 
                            fontWeight="bold" 
                            color="var(--text-color)"
                            sx={{ fontSize: '1rem' }}
                          >
                            Financial Aid Requirements
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Box component="span" 
                              sx={{ 
                                bgcolor: alpha(theme.palette.success.main, 0.2),
                                color: theme.palette.success.main,
                                px: 1,
                                py: 0.2,
                                borderRadius: 1,
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                mr: 1
                              }}
                            >
                              +35%
                            </Box>
                            <Typography 
                              color={mode === 'high-contrast' ? 'secondary.main' : 'text.secondary'}
                              variant="body2"
                            >
                              Confidence improved from 53% to 88%
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        p: 2,
                        borderLeft: `4px solid ${theme.palette.warning.main}`,
                        bgcolor: mode === 'dark'
                          ? alpha(theme.palette.warning.main, 0.1)
                          : alpha(theme.palette.warning.light, 0.5),
                        borderRadius: 1,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(3px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography 
                            fontWeight="bold" 
                            color="var(--text-color)"
                            sx={{ fontSize: '1rem' }}
                          >
                            Campus Housing Options
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Box component="span" 
                              sx={{ 
                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                                color: theme.palette.warning.main,
                                px: 1,
                                py: 0.2,
                                borderRadius: 1,
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                mr: 1
                              }}
                            >
                              In Progress
                            </Box>
                            <Typography 
                              color={mode === 'high-contrast' ? 'secondary.main' : 'text.secondary'}
                              variant="body2"
                            >
                              Current confidence 67%
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default Analytics;