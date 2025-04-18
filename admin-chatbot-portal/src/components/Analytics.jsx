import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import {
  Box, Grid, Paper, Typography, List, ListItem, ListItemText, Divider, useTheme, Container, Stack
} from '@mui/material';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const Analytics = ({ queries }) => {
  const theme = useTheme();

  // Generate mock data for demonstration
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

  // Calculate confidence metrics from actual queries
  const confidenceData = {
    high: queries.filter(q => q.confidence >= 70).length,
    medium: queries.filter(q => q.confidence >= 50 && q.confidence < 70).length,
    low: queries.filter(q => q.confidence < 50).length,
    total: queries.length + mockData.dailyQueries.reduce((acc, val) => acc + val, 0) - (queries.length)
  };

  const barData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Queries per Day',
        data: mockData.dailyQueries,
        backgroundColor: theme.palette.primary.light,
        borderColor: theme.palette.primary.main,
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
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.light,
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
        theme.palette.error.light,
        theme.palette.primary.light,
        theme.palette.warning.light,
        theme.palette.success.light,
        theme.palette.info.light
      ],
      borderWidth: 1
    }]
  };

  // Chart options with increased padding and spacing
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 10 },
    plugins: {
      legend: { position: 'bottom', labels: { padding: 20 } }
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8ede3', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 4 }} />

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#e0c3fc' }}>
              <Typography variant="caption" color="text.secondary">Total Queries</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{confidenceData.total}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#b5ead7' }}>
              <Typography variant="caption" color="text.secondary">High Confidence</Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main" sx={{ mt: 1 }}>{confidenceData.high}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#f9f7d9' }}>
              <Typography variant="caption" color="text.secondary">Medium Confidence</Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main" sx={{ mt: 1 }}>{confidenceData.medium}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#ffb3ba' }}>
              <Typography variant="caption" color="text.secondary">Low Confidence</Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main" sx={{ mt: 1 }}>{confidenceData.low}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* Charts Section */}
        <Stack spacing={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 0,
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#e0f7fa',
                  borderRadius: 3,
                  overflow: 'hidden'
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
                    borderBottom: `1px solid ${theme.palette.divider}`
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
                      mr: 2
                    }}
                  >
                    <span role="img" aria-label="bar-chart">
                      📈
                    </span>
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    Queries per Day
                  </Typography>
                </Box>
                {/* Chart */}
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
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#fff1e6',
                  borderRadius: 3,
                  overflow: 'hidden'
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
                    borderBottom: `1px solid ${theme.palette.divider}`
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
                      mr: 2
                    }}
                  >
                    <span role="img" aria-label="line-chart">
                      ⏱️
                    </span>
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    Avg. Response Time
                  </Typography>
                </Box>
                {/* Chart */}
                <Box sx={{ flex: 1, px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Line data={lineData} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={4}
                sx={{
                  p: 0,
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#f9f7d9',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    bgcolor: 'info.light',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'info.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <span role="img" aria-label="category">
                      📊
                    </span>
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    Query Categories
                  </Typography>
                </Box>
                {/* Chart and List */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', px: 2, py: 2 }}>
                  <Box sx={{ width: '60%', maxWidth: 180, mx: 2 }}>
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
                  <Box sx={{ flex: 1, ml: 2, overflowY: 'auto', maxHeight: 300 }}>
                    <List dense>
                      {Object.entries(mockData.categories).map(([cat, count], idx) => (
                        <ListItem key={cat} sx={{ py: 0.5 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: doughnutData.datasets[0].backgroundColor[idx],
                              mr: 1.5,
                              border: '1.5px solid #fff',
                              boxShadow: 1
                            }}
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {cat}
                          </Typography>
                          <Box
                            sx={{
                              bgcolor: doughnutData.datasets[0].backgroundColor[idx],
                              color: '#222',
                              px: 1.5,
                              borderRadius: 1,
                              fontWeight: 600,
                              fontSize: 13,
                              minWidth: 32,
                              textAlign: 'center'
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
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#b5ead7',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    bgcolor: 'success.light',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <span role="img" aria-label="improvement">
                      🚀
                    </span>
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    Recent Improvements
                  </Typography>
                </Box>
                {/* List */}
                <Box sx={{ flex: 1, px: 2, py: 2, overflowY: 'auto' }}>
                  <List dense>
                    <ListItem
                      sx={{
                        mb: 2,
                        pl: 2,
                        borderLeft: `4px solid ${theme.palette.success.main}`,
                        bgcolor: theme.palette.success.light + '20',
                        borderRadius: 1
                      }}
                    >
                      <ListItemText
                        primary={<Typography fontWeight="medium">Course Registration Process</Typography>}
                        secondary="Confidence improved from 48% to 92%"
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        mb: 2,
                        pl: 2,
                        borderLeft: `4px solid ${theme.palette.success.main}`,
                        bgcolor: theme.palette.success.light + '20',
                        borderRadius: 1
                      }}
                    >
                      <ListItemText
                        primary={<Typography fontWeight="medium">Financial Aid Requirements</Typography>}
                        secondary="Confidence improved from 53% to 88%"
                      />
                    </ListItem>
                    <ListItem
                      sx={{
                        pl: 2,
                        borderLeft: `4px solid ${theme.palette.warning.main}`,
                        bgcolor: theme.palette.warning.light + '20',
                        borderRadius: 1
                      }}
                    >
                      <ListItemText
                        primary={<Typography fontWeight="medium">Campus Housing Options</Typography>}
                        secondary="In progress - Current confidence 67%"
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