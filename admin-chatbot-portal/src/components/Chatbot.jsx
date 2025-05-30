import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  Chip, useTheme, alpha, IconButton, Tooltip, Fade, Badge, Avatar,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  Flag as FlagIcon,
  DataObject as DataObjectIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
  School as TrainingIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getGeminiResponse } from '../services/apiservice.js';
import { useThemeMode } from './Accessibility';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './ChatbotStyles.css'; // We'll create this for animations

// Sample FAQs for quick access
const FAQS = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password via the student portal by clicking on 'Forgot Password'."
  },
  {
    question: "When is the last date for registration?",
    answer: "Registration closes on June 30. Please complete your registration before this date."
  },
  {
    question: "How to apply for hostel?",
    answer: "You can apply for hostel accommodation through the student portal under the 'Hostel' section."
  },
  {
    question: "What is the fee structure?",
    answer: "The detailed fee structure is available on the official website under the 'Admissions' tab."
  },
  {
    question: "Where is the admin office?",
    answer: "The admin office is located in Block A, ground floor."
  }
];

// Extract confidence scoring to a separate function for better organization
function getSimulatedConfidence(message) {
  const msg = message.toLowerCase();

  // Low confidence keywords
  const lowKeywords = [
    'refund', 'alumni', 'duplicate id', 'branch change', 'not sure', 'unknown', 'lost', 'error', 
    'issue', 'problem', 'fail', 'failure', 'why', 'cannot', 'can\'t', 'unable', 'not working',
    'wrong', 'incorrect', 'reset', 'forgot', 'delay', 'pending', 'missing', 'complaint', 
    'appeal', 'dispute', 'reject', 'rejected', 'denied', 'denial', 'trouble', 'confused', 
    'unclear', 'help', 'support', 'contact', 'who', 'where', 'how do i', 'how can i', 'what if',
    'deadline', 'late', 'overdue', 'extension', 'problematic', 'manual', 'offline', 'paperwork', 
    'approval', 'approval pending'
  ];

  // Medium confidence keywords
  const mediumKeywords = [
    'hostel', 'housing', 'apply', 'fee', 'structure', 'scholarship', 'admission', 'register', 
    'registration', 'enroll', 'enrollment', 'course', 'subject', 'syllabus', 'exam', 'examination', 
    'marks', 'grades', 'result', 'score', 'attendance', 'leave', 'holiday', 'vacation', 'break', 
    'session', 'semester', 'class', 'schedule', 'time', 'date', 'calendar', 'event', 'activity', 
    'portal', 'website', 'login', 'account', 'password', 'update', 'change', 'edit', 'modify', 
    'renew', 'renewal', 'transfer', 'move', 'switch', 'option', 'preference', 'choice'
  ];

  // High confidence keywords
  const highKeywords = [
    'location', 'office', 'block', 'building', 'floor', 'contact number', 'phone', 'email', 
    'address', 'hours', 'timing', 'open', 'close', 'available', 'access', 'directions', 'map', 
    'route', 'nearest', 'distance', 'walk', 'bus', 'transport', 'canteen', 'library', 'lab', 
    'laboratory', 'wifi', 'internet', 'facility', 'facilities', 'sports', 'gym', 'medical', 
    'clinic', 'doctor', 'nurse', 'emergency', 'security', 'guard', 'parking', 'bike', 'car', 
    'cycle', 'mess', 'food', 'menu', 'breakfast', 'lunch', 'dinner', 'snacks', 'water', 'atm', 
    'bank', 'post', 'mail', 'delivery', 'package', 'parcel', 'shop', 'store', 'stationery', 
    'book', 'print', 'xerox', 'certainly', 'definitely', 'absolutely', 'of course', 'sure', 
    'gladly', 'happy to', 'can certainly', 'can help', 'will do', 'no problem', 'for sure', 
    'without a doubt', 'rest assured', 'guaranteed', 'yes', 'affirmative', 'resolved', 'completed', 
    'success', 'successful', 'done', 'provided', 'confirmed', 'approved', 'granted', 'valid', 
    'active', 'enabled', 'ready', 'in stock', 'in place', 'working', 'functioning', 'operational',
    'supported', 'permitted', 'allowed', 'authorized', 'permanently', 'always', 'immediately', 
    'instantly', 'right away', 'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 
    'good evening', 'welcome', 'nice to meet you', 'how are you', 'i am fine', 'thank you', 
    'thanks', 'you\'re welcome', 'no worries', 'sure thing', 'sounds good', 'okay', 'ok', 
    'alright', 'noted', 'understood', 'got it', 'roger', 'copy that', 'cheers', 'see you', 
    'bye', 'goodbye'
  ];

  for (const word of lowKeywords) {
    if (msg.includes(word)) {
      return Math.floor(15 + Math.random() * 25); // 15-40
    }
  }
  for (const word of mediumKeywords) {
    if (msg.includes(word)) {
      return Math.floor(45 + Math.random() * 25); // 45-70
    }
  }
  for (const word of highKeywords) {
    if (msg.includes(word)) {
      return Math.floor(75 + Math.random() * 25); // 75-99
    }
  }
  // Random between 60-95
  return Math.floor(60 + Math.random() * 35);
}

// Memoized Message component for better performance
const Message = memo(({ msg, idx, messageHover, setMessageHover, handleMessageAction, formatTimestamp, getConfidenceColor, theme, mode }) => {
  const messageRef = useRef(null);

  // Show confidence color helper
  const confidenceColor = msg.type === 'bot' ? getConfidenceColor(msg.confidence) : null;
  
  return (
    <Box
      ref={messageRef}
      className="chat-message"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
        mb: 2.5,
        maxWidth: '100%',
        position: 'relative',
      }}
      onMouseEnter={() => setMessageHover(idx)}
      onMouseLeave={() => setMessageHover(null)}
    >
      <Box
        sx={{
          maxWidth: '80%',
          position: 'relative'
        }}
      >
        <Paper
          elevation={msg.type === 'user' ? 2 : 1}
          sx={{
            p: 2,
            borderRadius: msg.type === 'user' 
              ? '18px 18px 4px 18px'
              : '18px 18px 18px 4px',
            bgcolor: msg.type === 'user'
              ? theme.palette.primary.main
              : mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.6)
                : alpha(theme.palette.grey[50], 0.9),
            color: msg.type === 'user'
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            border: msg.type === 'bot' 
              ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
              : 'none',
            boxShadow: msg.type === 'user'
              ? `0 2px 10px ${alpha(theme.palette.primary.main, 0.3)}`
              : '0 1px 5px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {msg.content}
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              textAlign: 'right',
              mt: 1,
              opacity: 0.7,
              fontSize: '0.7rem'
            }}
          >
            {formatTimestamp(msg.timestamp)}
          </Typography>
        </Paper>
        
        {/* Confidence indicator for bot messages */}
        {msg.type === 'bot' && (
          <Box sx={{ mt: 0.5, px: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: confidenceColor.text }}>
                Confidence
              </Typography>
              <Typography variant="caption" fontWeight="bold" sx={{ color: confidenceColor.text }}>
                {Math.round(msg.confidence)}%
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                height: 6, 
                width: '100%',
                bgcolor: alpha(confidenceColor.main, 0.1),
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <Box 
                className="confidence-bar"
                sx={{
                  height: '100%',
                  width: `${msg.confidence}%`,
                  bgcolor: confidenceColor.main,
                  borderRadius: 3,
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </Box>
          </Box>
        )}
        
        {/* Message action buttons - show below message when hovered */}
        {messageHover === idx && (
          <Fade in={true}>
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                gap: 1
              }}
            >
              <Tooltip title="Flag for review">
                <IconButton 
                  size="small" 
                  className="action-button"
                  sx={{ 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                  }}
                  onClick={() => handleMessageAction(idx, 'flag')}
                >
                  <FlagIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Mark as resolved">
                <IconButton 
                  size="small"
                  className="action-button"
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                  }}
                  onClick={() => handleMessageAction(idx, 'resolve')}
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Add training data">
                <IconButton 
                  size="small"
                  className="action-button"
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                  }}
                  onClick={() => handleMessageAction(idx, 'train')}
                >
                  <TrainingIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
});

// Typing indicator as a separate component
const TypingIndicator = memo(({ theme, mode }) => (
  <Box
    sx={{
      display: 'flex',
      mb: 2.5,
    }}
    className="typing-indicator"
  >
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: '18px 18px 18px 4px',
        bgcolor: mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.6)
          : alpha(theme.palette.grey[50], 0.9),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box className="typing-dot typing-dot-1" />
        <Box className="typing-dot typing-dot-2" />
        <Box className="typing-dot typing-dot-3" />
      </Box>
    </Paper>
  </Box>
));

// Welcome screen as a separate component
const WelcomeScreen = memo(({ theme, mode, addFaqToChat }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      px: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}
    className="welcome-screen"
  >
    <Avatar
      sx={{ 
        width: 80, 
        height: 80, 
        mb: 3,
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main
      }}
    >
      <ChatIcon sx={{ fontSize: 40 }} />
    </Avatar>
    
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
      Welcome to the Admin Assistant
    </Typography>
    
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
      This is where you can test the chatbot's responses and monitor confidence levels.
      Try asking questions about registration, courses, or campus facilities.
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
      {FAQS.slice(0, 3).map((faq, idx) => (
        <Chip 
          key={idx}
          label={faq.question}
          onClick={() => addFaqToChat(faq.question)}
          color="primary"
          variant="outlined"
          className="faq-chip"
          sx={{ 
            px: 1,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        />
      ))}
    </Box>
  </Box>
));

// Training Dialog as a separate component
const TrainingDialog = memo(({
  open, 
  messageIndex, 
  messages,
  trainingInput,
  setTrainingInput,
  handleAddTrainingData,
  handleCloseDialog,
  theme
}) => (
  <Dialog 
    open={open} 
    onClose={handleCloseDialog}
    fullWidth
    maxWidth="sm"
    PaperProps={{
      elevation: 5,
      sx: {
        borderRadius: 3,
        bgcolor: theme.palette.background.paper,
        overflow: 'hidden'
      }
    }}
    className="training-dialog"
  >
    <DialogTitle sx={{ 
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      pb: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrainingIcon color="primary" />
        <Typography variant="h6" component="div">
          Add Training Data
        </Typography>
      </Box>
      <IconButton 
        onClick={handleCloseDialog}
        size="small"
        edge="end"
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    
    <DialogContent sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" paragraph>
        Improve the AI responses by providing better training data:
      </Typography>
      
      {messageIndex !== null && messages[messageIndex] && (
        <Box sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Original {messages[messageIndex]?.type === 'user' ? 'Query' : 'Response'}:
          </Typography>
          <Typography variant="body2">
            {messages[messageIndex]?.content}
          </Typography>
        </Box>
      )}
      
      <TextField
        autoFocus
        multiline
        rows={4}
        label="Improved Response"
        fullWidth
        variant="outlined"
        value={trainingInput}
        onChange={(e) => setTrainingInput(e.target.value)}
        placeholder="Enter a better response for this query..."
        sx={{ 
          mt: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
    </DialogContent>
    
    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button 
        variant="outlined"
        onClick={handleCloseDialog}
        startIcon={<DeleteIcon />}
      >
        Cancel
      </Button>
      <Button 
        variant="contained" 
        onClick={handleAddTrainingData}
        disabled={!trainingInput.trim()}
        startIcon={<EditIcon />}
        sx={{ ml: 1 }}
      >
        Submit Training Data
      </Button>
    </DialogActions>
  </Dialog>
));

// Main Chatbot Component
const Chatbot = ({ onLowConfidence }) => {
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageHover, setMessageHover] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState({ open: false, message: '', severity: 'success' });
  const [trainingDialog, setTrainingDialog] = useState({ open: false, messageIndex: null });
  const [trainingInput, setTrainingInput] = useState('');
  
  // Theme and refs
  const theme = useTheme();
  const { mode } = useThemeMode();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const confidenceThreshold = 70;

  // Scroll to bottom when messages change with smooth behavior
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use RAF to ensure DOM is ready
      requestAnimationFrame(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    }
  }, [messages, isTyping]);

  // Format timestamp helper
  const formatTimestamp = useCallback((timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  }, []);

  // Get confidence color helper
  const getConfidenceColor = useCallback((confidence) => {
    if (confidence >= 85) return {
      main: theme.palette.success.main,
      light: alpha(theme.palette.success.main, 0.2),
      bg: alpha(theme.palette.success.main, mode === 'dark' ? 0.2 : 0.1),
      text: theme.palette.success.main
    };
    
    if (confidence >= 60) return {
      main: theme.palette.warning.main,
      light: alpha(theme.palette.warning.main, 0.2),
      bg: alpha(theme.palette.warning.main, mode === 'dark' ? 0.2 : 0.1),
      text: theme.palette.warning.main
    };
    
    return {
      main: theme.palette.error.main,
      light: alpha(theme.palette.error.main, 0.2),
      bg: alpha(theme.palette.error.main, mode === 'dark' ? 0.2 : 0.1),
      text: theme.palette.error.main
    };
  }, [theme, mode]);

  // Send message handler with proper error management
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    
    // Update messages with user input
    setMessages(prev => [...prev, { 
      id: Date.now(), // Unique ID for better list rendering
      type: 'user', 
      content: userMessage, 
      timestamp: new Date() 
    }]);
    
    setInput('');
    setIsLoading(true);
    
    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Artificial delay to ensure typing indicator is visible
      await new Promise(r => setTimeout(r, 800));
      
      const result = await getGeminiResponse(userMessage);
      const simulatedConfidence = getSimulatedConfidence(userMessage);
      
      setIsTyping(false);
      
      // Add bot response
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, // Ensure unique ID
        type: 'bot', 
        content: result.response,
        confidence: simulatedConfidence,
        timestamp: new Date(),
        modelNotes: "Model processed query with standard parameters."
      }]);
      
      // Check if confidence is below threshold
      if (simulatedConfidence < confidenceThreshold) {
        onLowConfidence({ question: userMessage, response: result.response, confidence: simulatedConfidence });
      }
    } catch (error) {
      console.error("Error:", error);
      
      setIsTyping(false);
      const botResponse = "I'm having trouble processing your request right now. Please try again later.";
      const confidence = 30;
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1,
        type: 'bot', 
        content: botResponse,
        confidence,
        timestamp: new Date(),
        modelNotes: "Error encountered during processing."
      }]);
      
      onLowConfidence({ question: userMessage, response: botResponse, confidence });
    } finally {
      setIsLoading(false);
    }
  }, [input, onLowConfidence]);

  // Handle key press for sending messages
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Clear chat history
  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  // Insert sample prompt
  const insertSamplePrompt = useCallback(() => {
    setInput("Can you explain how the registration process works for new students?");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Add FAQ to chat
  const addFaqToChat = useCallback((question) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle message actions (flag, resolve, train)
  const handleMessageAction = useCallback((idx, action) => {
    if (action === 'flag') {
      onLowConfidence(messages[idx]);
      showSnackbar('Message flagged for review', 'info');
    } else if (action === 'resolve') {
      // Mark as resolved by increasing confidence
      const updatedMessages = [...messages];
      updatedMessages[idx] = {
        ...updatedMessages[idx],
        confidence: Math.min(95, updatedMessages[idx].confidence + 20),
        resolved: true
      };
      setMessages(updatedMessages);
      showSnackbar('Message marked as resolved', 'success');
    } else if (action === 'train') {
      // Toggle training dialog
      setTrainingDialog(prev => {
        if (prev.open && prev.messageIndex === idx) {
          return { open: false, messageIndex: null };
        } else {
          return { open: true, messageIndex: idx };
        }
      });
      setTrainingInput('');
    }
  }, [messages, onLowConfidence]);

  // Show snackbar helper
  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbarMessage({ 
      open: true, 
      message, 
      severity 
    });
  }, []);

  // Close training dialog
  const handleCloseTrainingDialog = useCallback(() => {
    setTrainingDialog({ open: false, messageIndex: null });
  }, []);

  // Handle adding training data
  const handleAddTrainingData = useCallback(() => {
    if (!trainingInput.trim() || trainingDialog.messageIndex === null) return;
    
    // In a real app, you would send this to your backend
    console.log('Adding training data:', {
      originalQuery: messages[trainingDialog.messageIndex].type === 'bot' 
        ? messages[trainingDialog.messageIndex - 1]?.content 
        : messages[trainingDialog.messageIndex].content,
      response: messages[trainingDialog.messageIndex].type === 'bot' 
        ? messages[trainingDialog.messageIndex].content 
        : 'N/A',
      improvedResponse: trainingInput
    });
    
    showSnackbar('Training data added successfully', 'success');
    setTrainingDialog({ open: false, messageIndex: null });
    setTrainingInput('');
  }, [trainingInput, trainingDialog.messageIndex, messages, showSnackbar]);

  return (
    <Box sx={{ width: '100%', height: '100%' }} className="chatbot-container">
      {/* Main chat container with improved styling */}
      <Paper 
        ref={chatContainerRef}
        elevation={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'calc(100vh - 180px)', sm: 'calc(100vh - 200px)', md: '700px' },
          maxWidth: '900px',
          mx: 'auto',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: mode === 'dark' 
            ? '0 10px 40px rgba(0,0,0,0.5)'
            : '0 10px 40px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            bgcolor: mode === 'dark' ? 'primary.dark' : 'primary.main',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${alpha('#000', 0.1)}`,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
          className="chat-header"
        >
          {/* Bot identity */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: mode === 'dark' ? alpha(theme.palette.common.white, 0.2) : alpha(theme.palette.primary.dark, 0.8),
                width: 40,
                height: 40,
                mr: 1.5
              }}
            >
              <ChatIcon />
            </Avatar>
            
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#fff', 
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Admin Assistant
                <Badge
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: 'success.main',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      ml: 1
                    }
                  }}
                  variant="dot"
                />
              </Typography>
              
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.8) }}>
                Powered by Gemini API
              </Typography>
            </Box>
          </Box>
          
          {/* Settings button */}
          <Tooltip title="Settings">
            <IconButton sx={{ color: '#fff' }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Messages Container */}
        <Box 
          ref={chatBodyRef}
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            p: 3,
            bgcolor: mode === 'dark' ? alpha(theme.palette.background.paper, 0.7) : alpha(theme.palette.grey[50], 0.7),
            display: 'flex',
            flexDirection: 'column'
          }}
          className="chat-body"
        >
          {/* Welcome message when empty */}
          {messages.length === 0 && (
            <WelcomeScreen theme={theme} mode={mode} addFaqToChat={addFaqToChat} />
          )}
          
          {/* Message list with TransitionGroup for smooth animations */}
          <TransitionGroup component={null}>
            {messages.map((msg, idx) => (
              <CSSTransition
                key={msg.id || idx}
                timeout={300}
                classNames="message"
              >
                <Message 
                  msg={msg}
                  idx={idx}
                  messageHover={messageHover}
                  setMessageHover={setMessageHover}
                  handleMessageAction={handleMessageAction}
                  formatTimestamp={formatTimestamp}
                  getConfidenceColor={getConfidenceColor}
                  theme={theme}
                  mode={mode}
                />
              </CSSTransition>
            ))}
            
            {/* Typing indicator with proper animation */}
            {isTyping && (
              <CSSTransition
                timeout={300}
                classNames="typing"
              >
                <TypingIndicator theme={theme} mode={mode} />
              </CSSTransition>
            )}
          </TransitionGroup>
          
          <div ref={messagesEndRef} />
        </Box>
        
        {/* Chat Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            bgcolor: mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.8) 
              : '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          className="chat-input"
        >
          {/* Admin tools */}
          <Tooltip title="Insert sample prompt">
            <IconButton 
              color="primary"
              onClick={insertSamplePrompt}
              className="tool-button"
            >
              <DataObjectIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Clear history">
            <span>
              <IconButton 
                color="error"
                onClick={clearHistory}
                disabled={messages.length === 0}
                className="tool-button"
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
          
          {/* Message input */}
          <TextField
            inputRef={inputRef}
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading || isTyping}
            multiline
            maxRows={3}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                bgcolor: mode === 'dark' 
                  ? alpha(theme.palette.grey[800], 0.6) 
                  : alpha(theme.palette.grey[100], 0.6),
                '&:hover': {
                  bgcolor: mode === 'dark' 
                    ? alpha(theme.palette.grey[800], 0.8) 
                    : alpha(theme.palette.grey[100], 0.8)
                },
                '& fieldset': {
                  transition: 'border-color 0.3s'
                }
              }
            }}
            className="message-input"
          />
          
          {/* Send button */}
          <Tooltip title={isLoading ? "Processing..." : "Send message"}>
            <span>
              <IconButton
                color="primary"
                disabled={!input.trim() || isLoading || isTyping}
                onClick={sendMessage}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'scale(1.05)'
                  },
                  '&.Mui-disabled': {
                    bgcolor: alpha(theme.palette.primary.main, 0.4),
                    color: alpha('#fff', 0.6)
                  }
                }}
                className="send-button"
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>
      
      {/* Training Dialog */}
      <TrainingDialog
        open={trainingDialog.open}
        messageIndex={trainingDialog.messageIndex}
        messages={messages}
        trainingInput={trainingInput}
        setTrainingInput={setTrainingInput}
        handleAddTrainingData={handleAddTrainingData}
        handleCloseDialog={handleCloseTrainingDialog}
        theme={theme}
      />
      
      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbarMessage.open}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarMessage(prev => ({ ...prev, open: false }))}
          severity={snackbarMessage.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Chatbot;