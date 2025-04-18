import { useState } from 'react';
import {
  Box, Grid, Paper, Typography, Button, Chip, LinearProgress, Stack, List, ListItem, ListItemButton, ListItemText, Divider, TextField
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const MOCK_QUERIES = [
  { question: "How do I get my alumni certificate?", confidence: 28 },
  { question: "Can I change my branch after first year?", confidence: 45 },
  { question: "What is the process for fee refund?", confidence: 32 },
  { question: "How to get a duplicate ID card?", confidence: 41 },
];

const LowConfidence = ({ queries = [], onResolve, onAddTraining }) => {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [trainingResponse, setTrainingResponse] = useState('');
  const [action, setAction] = useState('');

  // Use simulated data if none provided
  const lowConfidenceQueries = queries.length > 0 ? queries : MOCK_QUERIES;

  const handleQueryClick = (query, index) => {
    setSelectedQuery({ ...query, index });
    setTrainingResponse('');
    setAction('');
  };

  const handleAddTraining = () => {
    if (!trainingResponse.trim()) {
      alert('Please provide a response for training');
      return;
    }
    if (onAddTraining) onAddTraining(selectedQuery.question, trainingResponse);
    setSelectedQuery(null);
  };

  const handleAction = (actionType) => {
    setAction(actionType);
  };

  const handleResolve = () => {
    if (onResolve) onResolve(selectedQuery.index);
    setSelectedQuery(null);
  };

  return (
    <Box sx={{ mt: 2, bgcolor: '#f8ede3' }}>
      <Grid container spacing={3}>
        {/* List of Low Confidence Queries */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', bgcolor: '#e0c3fc' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Low Confidence Queries
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {lowConfidenceQueries.length === 0 ? (
              <Typography color="text.secondary">No low-confidence queries yet.</Typography>
            ) : (
              <List disablePadding>
                {lowConfidenceQueries.map((q, idx) => (
                  <ListItem disablePadding key={idx} sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={selectedQuery && selectedQuery.index === idx}
                      onClick={() => handleQueryClick(q, idx)}
                      sx={{
                        borderRadius: 1,
                        border: selectedQuery && selectedQuery.index === idx ? `2px solid #1976d2` : '1px solid #e0e0e0',
                        bgcolor: selectedQuery && selectedQuery.index === idx ? 'action.selected' : 'background.paper',
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography fontWeight="medium">{q.question}</Typography>
                        }
                        secondary={
                          <Chip
                            label={`${q.confidence}%`}
                            size="small"
                            color={q.confidence < 30 ? "error" : "warning"}
                            sx={{ ml: 1 }}
                          />
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Query Details and Actions */}
        <Grid item xs={12} md={7}>
          {selectedQuery ? (
            <Paper elevation={2} sx={{ p: 3, height: '100%', bgcolor: '#b5ead7' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Query Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Question:</Typography>
                  <Typography fontWeight="medium">{selectedQuery.question}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Confidence:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={selectedQuery.confidence}
                      sx={{
                        flex: 1,
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#eee',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: selectedQuery.confidence < 30 ? 'error.main' : 'warning.main'
                        }
                      }}
                    />
                    <Chip
                      label={`${selectedQuery.confidence}%`}
                      size="small"
                      color={selectedQuery.confidence < 30 ? "error" : "warning"}
                    />
                  </Box>
                </Box>
                <Divider />
                <Typography fontWeight="medium" sx={{ mb: 1 }}>Take action:</Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant={action === 'train' ? "contained" : "outlined"}
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleAction('train')}
                  >
                    Add Training Data
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleResolve}
                  >
                    Mark as Resolved
                  </Button>
                  <Button
                    variant={action === 'flag' ? "contained" : "outlined"}
                    color="error"
                    startIcon={<FlagIcon />}
                    onClick={() => handleAction('flag')}
                  >
                    Flag for Review
                  </Button>
                </Stack>
                {/* Add Training Data */}
                {action === 'train' && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Provide correct response for training:
                    </Typography>
                    <TextField
                      multiline
                      minRows={3}
                      fullWidth
                      value={trainingResponse}
                      onChange={(e) => setTrainingResponse(e.target.value)}
                      placeholder="Enter the correct response..."
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddTraining}
                    >
                      Submit Training Data
                    </Button>
                  </Box>
                )}
                {/* Flag for Review */}
                {action === 'flag' && (
                  <Box sx={{ bgcolor: 'error.light', p: 2, borderRadius: 1 }}>
                    <Typography color="error.dark">
                      This query has been flagged for review by the AI team. They will analyze and improve the model accordingly.
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ p: 3, color: 'text.secondary', textAlign: 'center', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff1e6' }}>
              <Typography>Select a low-confidence query to view details and take action.</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default LowConfidence;