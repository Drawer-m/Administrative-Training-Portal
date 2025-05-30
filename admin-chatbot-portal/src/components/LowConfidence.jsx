import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Chip, Grid, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, useTheme, alpha, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, Drawer, Divider,
  FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import {
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  School as TrainingIcon
} from '@mui/icons-material';
import { useThemeMode } from './Accessibility';

// Simpler mock data 
const MOCK_QUERIES = [
  { 
    id: 1,
    question: "How do I get my alumni certificate?", 
    response: "I'm not sure about the alumni certificate process. Please contact the registrar's office for more information.",
    confidence: 28,
    timestamp: new Date(2023, 10, 15),
    status: 'pending' 
  },
  { 
    id: 2,
    question: "Can I change my branch after first year?", 
    response: "Branch change might be possible based on your academic performance, but I don't have the specific criteria.",
    confidence: 45,
    timestamp: new Date(2023, 10, 14),
    status: 'flagged'
  },
  { 
    id: 3,
    question: "What is the process for fee refund?", 
    response: "I don't have specific details about the fee refund process.",
    confidence: 32,
    timestamp: new Date(2023, 10, 12),
    status: 'resolved'
  },
];

const LowConfidence = ({ queries = [], onResolve, onAddTraining }) => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  
  // Simplified state
  const [allQueries, setAllQueries] = useState([]);
  
  // State for viewing details
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // State for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: '',
    queryId: null
  });
  
  // Add state for status filter
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Add state for training dialog
  const [trainingDialog, setTrainingDialog] = useState({
    open: false,
    query: null
  });
  
  // Add state for training response input
  const [trainingResponse, setTrainingResponse] = useState('');
  
  // Initialize with mock data if no queries provided
  useEffect(() => {
    const initialData = queries.length > 0 ? queries : MOCK_QUERIES;
    setAllQueries(initialData);
  }, [queries]);
  
  // Get filtered queries based on status filter
  const filteredQueries = statusFilter === 'all' 
    ? allQueries 
    : allQueries.filter(q => q.status === statusFilter);
  
  // Calculate summary statistics
  const totalQueries = allQueries.length || 0;
  const pendingQueries = allQueries.filter(q => q.status === 'pending').length || 0;
  const resolvedQueries = allQueries.filter(q => q.status === 'resolved').length || 0;
  const flaggedQueries = allQueries.filter(q => q.status === 'flagged').length || 0;

  // Get status chip style based on status
  const getStatusChip = (status) => {
    switch(status) {
      case 'pending':
        return {
          label: 'Pending',
          color: 'warning'
        };
      case 'resolved':
        return {
          label: 'Resolved',
          color: 'success'
        };
      case 'flagged':
        return {
          label: 'Flagged',
          color: 'error'
        };
      default:
        return {
          label: 'Unknown',
          color: 'default'
        };
    }
  };
  
  // Get color based on confidence score
  const getConfidenceColor = (score) => {
    if (score < 40) return theme.palette.error.main;
    if (score < 60) return theme.palette.warning.main;
    return theme.palette.success.main;
  };
  
  // Get confidence level label
  const getConfidenceLabel = (score) => {
    if (score < 40) return { text: 'Very Low Confidence', color: theme.palette.error.main };
    if (score < 60) return { text: 'Low Confidence', color: theme.palette.warning.main };
    return { text: 'Moderate Confidence', color: theme.palette.success.main };
  };
  
  // Simple date format
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Handle View Details action
  const handleViewDetails = (query) => {
    setSelectedQuery(query);
    setDrawerOpen(true);
  };
  
  // Handle Mark as Resolved action
  const handleResolve = (id) => {
    // Update the status locally
    setAllQueries(prevQueries => 
      prevQueries.map(q => 
        q.id === id ? { ...q, status: 'resolved' } : q
      )
    );
    
    // Close dialog if open
    setConfirmDialog({ open: false, action: '', queryId: null });
    
    // Call parent handler if provided
    if (onResolve) {
      onResolve(id);
    }
  };
  
  // Handle Flag action
  const handleFlag = (id) => {
    // Update the status locally
    setAllQueries(prevQueries => 
      prevQueries.map(q => 
        q.id === id ? { ...q, status: 'flagged' } : q
      )
    );
    
    // Close dialog if open
    setConfirmDialog({ open: false, action: '', queryId: null });
  };
  
  // Open confirmation dialog
  const openConfirmDialog = (action, queryId) => {
    setConfirmDialog({
      open: true,
      action,
      queryId
    });
  };
  
  // Handle opening training dialog
  const handleOpenTrainingDialog = (query) => {
    setTrainingDialog({
      open: true,
      query: query
    });
    setTrainingResponse('');
  };
  
  // Handle adding training data
  const handleAddTrainingData = () => {
    if (!trainingResponse.trim() || !trainingDialog.query) return;
    
    // Call the parent component's handler
    if (onAddTraining) {
      onAddTraining(trainingDialog.query.question, trainingResponse);
    }
    
    // Mark as resolved (optional - depends on your use case)
    handleResolve(trainingDialog.query.id);
    
    // Close the dialog
    setTrainingDialog({ open: false, query: null });
    
    // Give user feedback
    alert('Training data added successfully!');
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Low Confidence Query Center
      </Typography>
      
      {/* Basic Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" color="primary">{totalQueries}</Typography>
            <Typography variant="body2">Total Queries</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" color="warning.main">{pendingQueries}</Typography>
            <Typography variant="body2">Pending</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" color="success.main">{resolvedQueries}</Typography>
            <Typography variant="body2">Resolved</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" color="error.main">{flaggedQueries}</Typography>
            <Typography variant="body2">Flagged</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Status Filter */}
      <Box sx={{ mb: 3 }}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FilterListIcon color="primary" />
            <Typography variant="body1">Filter:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="status-filter-label">Query Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Query Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Queries ({allQueries.length})</MenuItem>
                <MenuItem value="pending">Pending ({pendingQueries})</MenuItem>
                <MenuItem value="flagged">Flagged ({flaggedQueries})</MenuItem>
                <MenuItem value="resolved">Resolved ({resolvedQueries})</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>
      </Box>
      
      {/* Simple Table */}
      <Paper sx={{ width: '100%', mb: 3, overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          {statusFilter === 'all' ? 'All Queries' : 
           statusFilter === 'pending' ? 'Pending Queries' : 
           statusFilter === 'flagged' ? 'Flagged Queries' : 
           'Resolved Queries'}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell align="center">Confidence</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQueries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">No queries match the selected filter</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQueries.map((query) => {
                  const statusChip = getStatusChip(query.status);
                  
                  return (
                    <TableRow key={query.id} hover>
                      <TableCell>{query.question}</TableCell>
                      <TableCell align="center">{query.confidence}%</TableCell>
                      <TableCell align="center">{formatDate(query.timestamp)}</TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={statusChip.label}
                          color={statusChip.color}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small"
                              onClick={() => handleViewDetails(query)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {query.status !== 'resolved' && (
                            <Tooltip title="Mark as Resolved">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => openConfirmDialog('resolve', query.id)}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {query.status !== 'flagged' && (
                            <Tooltip title="Flag for Review">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => openConfirmDialog('flag', query.id)}
                              >
                                <FlagIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Basic Message */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Select a query to view details or take action
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </Button>
      </Box>
      
      {/* Improved View Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 450 },
            p: 0,
            bgcolor: mode === 'dark' ? theme.palette.background.paper : '#fff' // Removed transparency
          }
        }}
      >
        {selectedQuery && (
          <>
            {/* Header */}
            <Box 
              sx={{ 
                p: 2,
                bgcolor: mode === 'dark' 
                  ? theme.palette.background.default 
                  : alpha(theme.palette.primary.main, 0.05), // Removed transparency
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Query Details</Typography>
                <IconButton 
                  onClick={() => setDrawerOpen(false)}
                  sx={{ 
                    bgcolor: alpha(theme.palette.background.paper, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.2) }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>
            
            {/* Main content */}
            <Box sx={{ p: 3, height: 'calc(100% - 120px)', overflowY: 'auto' }}>
              <Stack spacing={4}>
                {/* Confidence score - fixed layout to prevent overlapping */}
                <Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: mode === 'dark'
                        ? alpha(getConfidenceColor(selectedQuery.confidence), 0.15)
                        : alpha(getConfidenceColor(selectedQuery.confidence), 0.08),
                      border: `1px solid ${alpha(getConfidenceColor(selectedQuery.confidence), 0.3)}`
                    }}
                  >
                    {/* Fixed circle with confidence score */}
                    <Box 
                      sx={{
                        width: 70,
                        height: 70,
                        minWidth: 70, // Ensure fixed width
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: mode === 'dark' 
                          ? alpha(getConfidenceColor(selectedQuery.confidence), 0.2)
                          : alpha(getConfidenceColor(selectedQuery.confidence), 0.1),
                        border: `4px solid ${getConfidenceColor(selectedQuery.confidence)}`,
                        mr: 2,
                        boxShadow: `0 0 10px ${alpha(getConfidenceColor(selectedQuery.confidence), 0.4)}`
                      }}
                    >
                      <Typography 
                        variant="h6" // Smaller text to avoid overlap
                        fontWeight="bold" 
                        color={getConfidenceColor(selectedQuery.confidence)}
                      >
                        {selectedQuery.confidence}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ flex: 1 }}> {/* Add flex: 1 to ensure this takes remaining space */}
                      <Typography 
                        variant="h6" 
                        fontWeight="medium" 
                        color={getConfidenceColor(selectedQuery.confidence)}
                      >
                        {getConfidenceLabel(selectedQuery.confidence).text}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This response needs {selectedQuery.confidence < 40 ? 'urgent' : 'some'} attention
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* User query - better styled */}
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: theme.palette.primary.main 
                      }}
                    />
                    User Query
                  </Typography>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}
                  >
                    <Typography variant="body1" fontWeight="medium">
                      {selectedQuery.question}
                    </Typography>
                  </Paper>
                </Box>
                
                {/* Bot response */}
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                    sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: getConfidenceColor(selectedQuery.confidence)
                      }}
                    />
                    Bot Response
                  </Typography>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      bgcolor: mode === 'dark'
                        ? alpha(getConfidenceColor(selectedQuery.confidence), 0.1)
                        : alpha(getConfidenceColor(selectedQuery.confidence), 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha(getConfidenceColor(selectedQuery.confidence), 0.2)}`
                    }}
                  >
                    <Typography variant="body1">
                      {selectedQuery.response}
                    </Typography>
                  </Paper>
                </Box>
                
                {/* Additional details */}
                <Box>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                    Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{ 
                          p: 1.5, 
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(selectedQuery.timestamp)}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{ 
                          p: 1.5, 
                          bgcolor: alpha(theme.palette.background.default, 0.5),
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            size="small"
                            label={getStatusChip(selectedQuery.status).label}
                            color={getStatusChip(selectedQuery.status).color}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Box>
            
            {/* Action buttons - fixed at bottom */}
            <Box
              sx={{
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                p: 2.5,
                position: 'sticky',
                bottom: 0,
                bgcolor: mode === 'dark' 
                  ? theme.palette.background.paper
                  : '#fff', // Removed transparency
                boxShadow: `0 -4px 10px ${alpha(theme.palette.common.black, 0.05)}`
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Take Action:
              </Typography>
              
              <Stack direction="column" spacing={1.5}>
                {/* Make the actions full width and more prominent */}
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<TrainingIcon />}
                  onClick={() => handleOpenTrainingDialog(selectedQuery)}
                  sx={{ 
                    borderRadius: 2,
                    py: 1,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                  }}
                >
                  Add Training Data
                </Button>
                
                <Stack direction="row" spacing={2}>
                  {selectedQuery.status !== 'resolved' && (
                    <Button 
                      variant="outlined" 
                      color="success"
                      fullWidth
                      startIcon={<CheckCircleIcon />}
                      onClick={() => openConfirmDialog('resolve', selectedQuery.id)}
                      sx={{ borderRadius: 2 }}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  
                  {selectedQuery.status !== 'flagged' && (
                    <Button 
                      variant="outlined" 
                      color="error"
                      fullWidth
                      startIcon={<FlagIcon />}
                      onClick={() => openConfirmDialog('flag', selectedQuery.id)}
                      sx={{ borderRadius: 2 }}
                    >
                      Flag for Review
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Box>
          </>
        )}
      </Drawer>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>
          {confirmDialog.action === 'resolve' 
            ? 'Mark as Resolved' 
            : 'Flag for Review'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === 'resolve'
              ? 'Are you sure you want to mark this query as resolved?'
              : 'Are you sure you want to flag this query for review?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            color={confirmDialog.action === 'resolve' ? 'success' : 'error'}
            onClick={() => {
              if (confirmDialog.action === 'resolve') {
                handleResolve(confirmDialog.queryId);
              } else {
                handleFlag(confirmDialog.queryId);
              }
              // Close drawer if it was opened
              if (drawerOpen) setDrawerOpen(false);
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Training Data Dialog */}
      <Dialog 
        open={trainingDialog.open} 
        onClose={() => setTrainingDialog({ open: false, query: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrainingIcon color="primary" />
          Add Training Data
        </DialogTitle>
        <DialogContent>
          {trainingDialog.query && (
            <>
              <DialogContentText sx={{ mt: 1, mb: 2 }}>
                Provide a better response for this query to help train the AI.
              </DialogContentText>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Original Query:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5) }}
                >
                  <Typography variant="body2">{trainingDialog.query.question}</Typography>
                </Paper>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Original Response:
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    borderColor: alpha(theme.palette.error.main, 0.3)
                  }}
                >
                  <Typography variant="body2">{trainingDialog.query.response}</Typography>
                </Paper>
              </Box>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Improved Response:
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                placeholder="Enter a better response to train the AI..."
                value={trainingResponse}
                onChange={(e) => setTrainingResponse(e.target.value)}
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setTrainingDialog({ open: false, query: null })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<TrainingIcon />}
            onClick={handleAddTrainingData}
            disabled={!trainingResponse.trim()}
          >
            Submit Training Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LowConfidence;