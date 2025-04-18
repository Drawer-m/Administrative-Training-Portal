import { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  CircularProgress, Chip, useTheme, Accordion, AccordionSummary, AccordionDetails, List, Divider, alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import HelpIcon from '@mui/icons-material/Help';
import { getGeminiResponse } from '../services/apiservice.js';
import { useThemeMode } from './Accessibility';

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

function getSimulatedConfidence(message) {
  const msg = message.toLowerCase();

  //low confidence
  const lowKeywords = [
    'refund', 'alumni', 'duplicate id', 'branch change', 'not sure', 'unknown', 'lost', 'error', 'issue', 'problem',
    'fail', 'failure', 'why', 'cannot', 'can\'t', 'unable', 'not working', 'wrong', 'incorrect', 'reset', 'forgot',
    'delay', 'pending', 'missing', 'complaint', 'appeal', 'dispute', 'reject', 'rejected', 'denied', 'denial',
    'trouble', 'confused', 'unclear', 'help', 'support', 'contact', 'who', 'where', 'how do i', 'how can i', 'what if',
    'deadline', 'late', 'overdue', 'extension', 'problematic', 'manual', 'offline', 'paperwork', 'approval', 'approval pending'
  ];

  //medium confidence
  const mediumKeywords = [
    'hostel', 'housing', 'apply', 'fee', 'structure', 'scholarship', 'admission', 'register', 'registration',
    'enroll', 'enrollment', 'course', 'subject', 'syllabus', 'exam', 'examination', 'marks', 'grades', 'result',
    'score', 'attendance', 'leave', 'holiday', 'vacation', 'break', 'session', 'semester', 'class', 'schedule',
    'time', 'date', 'calendar', 'event', 'activity', 'portal', 'website', 'login', 'account', 'password', 'update',
    'change', 'edit', 'modify', 'renew', 'renewal', 'transfer', 'move', 'switch', 'option', 'preference', 'choice'
  ];

  //high confidence
  const highKeywords = [
    'location', 'office', 'block', 'building', 'floor', 'contact number', 'phone', 'email', 'address', 'hours',
    'timing', 'open', 'close', 'available', 'access', 'directions', 'map', 'route', 'nearest', 'distance', 'walk',
    'bus', 'transport', 'canteen', 'library', 'lab', 'laboratory', 'wifi', 'internet', 'facility', 'facilities',
    'sports', 'gym', 'medical', 'clinic', 'doctor', 'nurse', 'emergency', 'security', 'guard', 'parking', 'bike',
    'car', 'cycle', 'mess', 'food', 'menu', 'breakfast', 'lunch', 'dinner', 'snacks', 'water', 'atm', 'bank',
    'post', 'mail', 'delivery', 'package', 'parcel', 'shop', 'store', 'stationery', 'book', 'print', 'xerox',

    'certainly', 'definitely', 'absolutely', 'of course', 'sure', 'gladly', 'happy to', 'can certainly', 'can help',
    'will do', 'no problem', 'for sure', 'without a doubt', 'rest assured', 'guaranteed', 'yes', 'affirmative',
    'resolved', 'completed', 'success', 'successful', 'done', 'provided', 'confirmed', 'approved', 'granted',
    'valid', 'active', 'enabled', 'ready', 'in stock', 'in place', 'working', 'functioning', 'operational',
    'supported', 'permitted', 'allowed', 'authorized', 'permanently', 'always', 'immediately', 'instantly', 'right away',
   
    'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'welcome', 'nice to meet you',
    'how are you', 'i am fine', 'thank you', 'thanks', 'you\'re welcome', 'no worries', 'sure thing', 'sounds good',
    'okay', 'ok', 'alright', 'noted', 'understood', 'got it', 'roger', 'copy that', 'cheers', 'see you', 'bye', 'goodbye'
  ];

  for (const word of lowKeywords) {
    if (msg.includes(word)) {
      return Math.floor(15 + Math.random() * 25); //15-40
    }
  }
  for (const word of mediumKeywords) {
    if (msg.includes(word)) {
      return Math.floor(45 + Math.random() * 25); //45-70
    }
  }
  for (const word of highKeywords) {
    if (msg.includes(word)) {
      return Math.floor(75 + Math.random() * 25); //75-99
    }
  }
  //random between 60-95
  return Math.floor(60 + Math.random() * 35);
}

const Chatbot = ({ onLowConfidence }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { mode } = useThemeMode();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      console.log("Calling getGeminiResponse with:", userMessage);
      const result = await getGeminiResponse(userMessage);

      
      const simulatedConfidence = getSimulatedConfidence(userMessage);

      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: result.response,
        confidence: simulatedConfidence
      }]);
      
      if (simulatedConfidence < 50) {
        onLowConfidence({ question: userMessage, confidence: simulatedConfidence });
      }
    } catch (error) {
      console.error("Error:", error);
      
      const botResponse = "I'm having trouble processing your request right now.";
      const confidence = 30;
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: botResponse,
        confidence
      }]);
      
      onLowConfidence({ question: userMessage, confidence });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return {
      bg: alpha(theme.palette.success.main, mode === 'dark' ? 0.2 : 0.1),
      color: theme.palette.success.main
    };
    if (confidence >= 50) return {
      bg: alpha(theme.palette.warning.main, mode === 'dark' ? 0.2 : 0.1),
      color: theme.palette.warning.main
    };
    return {
      bg: alpha(theme.palette.error.main, mode === 'dark' ? 0.2 : 0.1),
      color: theme.palette.error.main
    };
  };

  // Create gradient heading styles based on theme
  const getHeadingStyle = (color = 'primary') => {
    if (mode === 'high-contrast') {
      return {
        color: '#ffff00',
        textShadow: '0 0 5px rgba(255,255,255,0.5)',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1
      };
    } else if (mode === 'dark') {
      return {
        background: color === 'primary' 
          ? 'linear-gradient(90deg, #90caf9 0%, #64b5f6 100%)'
          : 'linear-gradient(90deg, #ce93d8 0%, #ba68c8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        fontWeight: 'bold',
        letterSpacing: 1
      };
    } else {
      return {
        background: color === 'primary'
          ? 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
          : 'linear-gradient(90deg, #7b1fa2 0%, #9c27b0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        fontWeight: 'bold',
        letterSpacing: 1,
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      };
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Main title for the section - Now in its own container above the chatbot components */}
      <Box sx={{ width: '100%', mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center"
          sx={{
            fontWeight: 800,
            letterSpacing: '0.5px',
            mb: 1.5,
            fontSize: { xs: '1.8rem', md: '2.2rem' },
            ...getHeadingStyle('primary'),
          }}
        >
          Interactive Chatbot Testing
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          sx={{ 
            mb: 1.5, 
            maxWidth: '700px', 
            color: 'text.secondary',
            fontWeight: 500
          }}
        >
          Test the chatbot's responses and track confidence levels in real-time
        </Typography>
      </Box>

      {/* Chat components container - separate from the heading */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          width: '100%',
          gap: 2.5, // Reduced gap for better space usage
          bgcolor: 'transparent',
        }}
      >
        {/* Chatbot Panel */}
        <Paper 
          elevation={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: { xs: '500px', md: '600px' }, // Fixed height even on mobile
            borderRadius: 4,
            overflow: 'hidden',
            width: { xs: '100%', md: '60%' },
            maxWidth: '850px', // Increased max-width
            minWidth: { md: 350 },
            bgcolor: 'var(--surface-color)',
            boxShadow: mode === 'high-contrast' 
              ? '0 0 0 2px var(--border-color)' 
              : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
              transform: 'translateY(-5px)'
            }
          }}
        >
          {/* Chatbox Header */}
          <Box
            sx={{
              bgcolor: mode === 'dark' ? 'primary.dark' : 'primary.main',
              px: 3,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid var(--border-color)`,
              boxShadow: 2
            }}
          >
            <Box
              sx={{
                bgcolor: mode === 'dark' ? '#1565c0' : '#0d47a1',
                color: 'white',
                borderRadius: '50%',
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2.5,
                fontSize: 24,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <ChatIcon fontSize="inherit" />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                letterSpacing: 1.2, 
                color: '#ffffff',
                textTransform: 'uppercase',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Chatbot Assistant
            </Typography>
          </Box>
          {/* Chatbox Body */}
          <Box sx={{
            flexGrow: 1,
            p: 3, // Increased padding
            overflow: 'auto',
            bgcolor: alpha(theme.palette.background.default, 0.7),
            backgroundImage: mode === 'high-contrast' ? 'none' : 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0))'
          }}>
            {messages.length === 0 ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8,
                  py: 4
                }}
              >
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '50%',
                    p: 2,
                    mb: 2
                  }}
                >
                  <ChatIcon sx={{ fontSize: '3rem', color: 'primary.main', opacity: 0.7 }} />
                </Box>
                <Typography 
                  color="text.primary" 
                  align="center"
                  variant="h6"
                  sx={{ fontWeight: 'bold' }}
                >
                  No messages yet
                </Typography>
                <Typography 
                  color="text.secondary" 
                  align="center" 
                  variant="body2" 
                  sx={{ mt: 1, maxWidth: '80%' }}
                >
                  Start a conversation by typing a question about registration, courses, financial aid, or housing.
                </Typography>
              </Box>
            ) : (
              messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 2.5,
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    animation: 'fadeIn 0.3s ease-out',
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0, transform: 'translateY(10px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  <Paper
                    elevation={msg.type === 'user' ? 4 : 2}
                    sx={{
                      maxWidth: '80%',
                      p: 2,
                      borderRadius: 3,
                      ...(msg.type === 'user'
                        ? {
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            borderTopRightRadius: 0,
                            boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.15)',
                            ml: 4 // Pull from right
                          }
                        : {
                            bgcolor: mode === 'high-contrast' ? 'var(--surface-color)' : alpha(theme.palette.background.paper, 0.85),
                            color: 'var(--text-color)',
                            borderTopLeftRadius: 0,
                            border: `1px solid var(--border-color)`,
                            boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.1)',
                            mr: 4 // Pull from left
                          }
                      ),
                      transition: 'background 0.3s, color 0.3s'
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        wordBreak: 'break-word',
                        fontWeight: msg.type === 'user' ? 500 : 400
                      }}
                    >
                      {msg.content}
                    </Typography>
                    {msg.type === 'bot' && (
                      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
                        <Chip
                          label={`${Math.round(msg.confidence)}% confidence`}
                          size="small"
                          sx={{
                            bgcolor: getConfidenceColor(msg.confidence).bg,
                            color: getConfidenceColor(msg.confidence).color,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            boxShadow: 1,
                            py: 0.5,
                            borderRadius: '12px'
                          }}
                        />
                      </Box>
                    )}
                  </Paper>
                </Box>
              ))
            )}
            {isLoading && (
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: mode === 'dark' ? 'grey.800' : 'grey.100',
                    borderTopLeftRadius: 0
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <CircularProgress size={12} color={mode === 'high-contrast' ? 'secondary' : 'primary'} />
                    <CircularProgress size={12} sx={{ animationDelay: '0.2s' }} color={mode === 'high-contrast' ? 'secondary' : 'primary'} />
                    <CircularProgress size={12} sx={{ animationDelay: '0.4s' }} color={mode === 'high-contrast' ? 'secondary' : 'primary'} />
                  </Box>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          {/* Chatbox Footer */}
          <Box sx={{
            p: 2,
            borderTop: `1px solid var(--border-color)`,
            bgcolor: mode === 'dark' ? alpha(theme.palette.grey[900], 0.9) : alpha(theme.palette.grey[100], 0.9),
            display: 'flex',
            boxShadow: '0 -4px 6px rgba(0,0,0,0.05)'
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your question here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              size="small"
              sx={{
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  bgcolor: mode === 'dark' ? 'grey.800' : 'background.paper',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? 'grey.700' : alpha(theme.palette.background.paper, 0.9)
                  }
                }
              }}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                boxShadow: 2,
                fontWeight: 600,
                px: 3,
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                },
                transition: 'all 0.2s ease'
              }}
            >
              Send
            </Button>
          </Box>
        </Paper>

        {/* FAQ Panel */}
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: { xs: 'auto', md: '600px' },
            width: { xs: '100%', md: '38%' }, // Slightly narrower
            minWidth: { md: 300 },
            maxWidth: 450, // Increased max-width
            borderRadius: 3,
            overflow: 'hidden', // Hide overflow
            bgcolor: 'var(--surface-color)',
            border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 25px 0 rgba(31, 38, 135, 0.15)',
              transform: 'translateY(-5px)'
            }
          }}
        >
          {/* FAQ Header */}
          <Box
            sx={{
              bgcolor: mode === 'dark' ? 'secondary.dark' : 'secondary.main',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid var(--border-color)`,
              boxShadow: 1
            }}
          >
            <Box
              sx={{
                bgcolor: mode === 'dark' ? '#6a1b9a' : '#4a148c',
                color: 'white',
                borderRadius: '50%',
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                fontSize: 24,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              <HelpIcon fontSize="inherit" />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                letterSpacing: 1, 
                color: '#ffffff',
                textTransform: 'uppercase',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Frequently Asked Questions
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <List disablePadding>
              {FAQS.map((faq, idx) => (
                <Accordion 
                  key={idx} 
                  sx={{ 
                    mb: 1.5, 
                    boxShadow: 1, 
                    bgcolor: mode === 'dark' ? alpha(theme.palette.grey[800], 0.7) : alpha(theme.palette.grey[50], 0.7),
                    border: mode === 'high-contrast' ? '1px solid var(--border-color)' : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    color: 'var(--text-color)',
                    borderRadius: '8px !important', // Force border-radius on accordions
                    '&:before': {
                      display: 'none' // Remove accordion divider
                    },
                    '&.Mui-expanded': {
                      boxShadow: 3,
                      bgcolor: mode === 'dark' ? alpha(theme.palette.grey[800], 0.9) : alpha(theme.palette.background.paper, 0.9),
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ 
                      color: mode === 'high-contrast' ? 'secondary.main' : 'primary.main',
                      fontSize: '1.2rem'
                    }} />}
                    aria-controls={`faq-content-${idx}`}
                    id={`faq-header-${idx}`}
                    sx={{ 
                      minHeight: 48,
                      '&.Mui-expanded': {
                        bgcolor: mode === 'dark' 
                          ? alpha(theme.palette.primary.dark, 0.1)
                          : alpha(theme.palette.primary.light, 0.1),
                        borderRadius: '8px 8px 0 0'
                      }
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{
                    py: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <Typography 
                      variant="body2" 
                      color={mode === 'high-contrast' ? 'secondary.main' : 'text.secondary'}
                      sx={{ lineHeight: 1.6 }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Chatbot;