import { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  CircularProgress, Chip, useTheme, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import { getGeminiResponse } from '../services/apiservice.js';

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

  // Many keywords for low confidence
  const lowKeywords = [
    'refund', 'alumni', 'duplicate id', 'branch change', 'not sure', 'unknown', 'lost', 'error', 'issue', 'problem',
    'fail', 'failure', 'why', 'cannot', 'can\'t', 'unable', 'not working', 'wrong', 'incorrect', 'reset', 'forgot',
    'delay', 'pending', 'missing', 'complaint', 'appeal', 'dispute', 'reject', 'rejected', 'denied', 'denial',
    'trouble', 'confused', 'unclear', 'help', 'support', 'contact', 'who', 'where', 'how do i', 'how can i', 'what if',
    'deadline', 'late', 'overdue', 'extension', 'problematic', 'manual', 'offline', 'paperwork', 'approval', 'approval pending'
  ];

  // Many keywords for medium confidence
  const mediumKeywords = [
    'hostel', 'housing', 'apply', 'fee', 'structure', 'scholarship', 'admission', 'register', 'registration',
    'enroll', 'enrollment', 'course', 'subject', 'syllabus', 'exam', 'examination', 'marks', 'grades', 'result',
    'score', 'attendance', 'leave', 'holiday', 'vacation', 'break', 'session', 'semester', 'class', 'schedule',
    'time', 'date', 'calendar', 'event', 'activity', 'portal', 'website', 'login', 'account', 'password', 'update',
    'change', 'edit', 'modify', 'renew', 'renewal', 'transfer', 'move', 'switch', 'option', 'preference', 'choice'
  ];

  // Many keywords for high confidence
  const highKeywords = [
    'location', 'office', 'block', 'building', 'floor', 'contact number', 'phone', 'email', 'address', 'hours',
    'timing', 'open', 'close', 'available', 'access', 'directions', 'map', 'route', 'nearest', 'distance', 'walk',
    'bus', 'transport', 'canteen', 'library', 'lab', 'laboratory', 'wifi', 'internet', 'facility', 'facilities',
    'sports', 'gym', 'medical', 'clinic', 'doctor', 'nurse', 'emergency', 'security', 'guard', 'parking', 'bike',
    'car', 'cycle', 'mess', 'food', 'menu', 'breakfast', 'lunch', 'dinner', 'snacks', 'water', 'atm', 'bank',
    'post', 'mail', 'delivery', 'package', 'parcel', 'shop', 'store', 'stationery', 'book', 'print', 'xerox',
    // Positive/affirmative words and phrases
    'certainly', 'definitely', 'absolutely', 'of course', 'sure', 'gladly', 'happy to', 'can certainly', 'can help',
    'will do', 'no problem', 'for sure', 'without a doubt', 'rest assured', 'guaranteed', 'yes', 'affirmative',
    'resolved', 'completed', 'success', 'successful', 'done', 'provided', 'confirmed', 'approved', 'granted',
    'valid', 'active', 'enabled', 'ready', 'in stock', 'in place', 'working', 'functioning', 'operational',
    'supported', 'permitted', 'allowed', 'authorized', 'permanently', 'always', 'immediately', 'instantly', 'right away',
    // Greetings and common conversational words
    'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'welcome', 'nice to meet you',
    'how are you', 'i am fine', 'thank you', 'thanks', 'you\'re welcome', 'no worries', 'sure thing', 'sounds good',
    'okay', 'ok', 'alright', 'noted', 'understood', 'got it', 'roger', 'copy that', 'cheers', 'see you', 'bye', 'goodbye'
  ];

  for (const word of lowKeywords) {
    if (msg.includes(word)) {
      return Math.floor(15 + Math.random() * 25); // 15-40% (low)
    }
  }
  for (const word of mediumKeywords) {
    if (msg.includes(word)) {
      return Math.floor(45 + Math.random() * 25); // 45-70% (medium)
    }
  }
  for (const word of highKeywords) {
    if (msg.includes(word)) {
      return Math.floor(75 + Math.random() * 25); // 75-99% (high)
    }
  }
  // Default: random between 60-95%
  return Math.floor(60 + Math.random() * 35);
}

const Chatbot = ({ onLowConfidence }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      console.log("Calling getGeminiResponse with:", userMessage);
      const result = await getGeminiResponse(userMessage);

      // Simulate confidence based on message content
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
      bg: theme.palette.success.light,
      color: theme.palette.success.dark
    };
    if (confidence >= 50) return {
      bg: theme.palette.warning.light,
      color: theme.palette.warning.dark
    };
    return {
      bg: theme.palette.error.light,
      color: theme.palette.error.dark
    };
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'flex-start',
        width: '100%',
        mt: 2,
        gap: 3,
        bgcolor: '#f8ede3',
      }}
    >
      {/* Chatbot Panel */}
      <Paper 
        elevation={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'auto', md: '600px' },
          borderRadius: 4,
          overflow: 'hidden',
          width: { xs: '100%', md: '60%' },
          maxWidth: '800px',
          minWidth: { md: 350 },
          bgcolor: '#e0c3fc',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}
      >
        {/* Chatbox Header */}
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
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              fontSize: 22,
              boxShadow: 2
            }}
          >
            <SendIcon fontSize="inherit" />
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
            Chatbot Assistant
          </Typography>
        </Box>
        {/* Chatbox Body */}
        <Box sx={{
          flexGrow: 1,
          p: 2,
          overflow: 'auto',
          bgcolor: '#f9f7d9'
        }}>
          {messages.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography color="text.secondary" align="center">
                No messages yet. Start a conversation!
              </Typography>
              <Typography color="text.secondary" align="center" variant="body2" sx={{ mt: 1 }}>
                Try asking about registration, courses, financial aid, or housing.
              </Typography>
            </Box>
          ) : (
            messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
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
                          boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)'
                        }
                      : {
                          bgcolor: '#fff',
                          color: theme.palette.text.primary,
                          borderTopLeftRadius: 0,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.07)'
                        }
                    ),
                    transition: 'background 0.2s'
                  }}
                >
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{msg.content}</Typography>
                  {msg.type === 'bot' && (
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Chip
                        label={`${Math.round(msg.confidence)}% confidence`}
                        size="small"
                        sx={{
                          bgcolor: getConfidenceColor(msg.confidence).bg,
                          color: getConfidenceColor(msg.confidence).color,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          boxShadow: 1
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
                  bgcolor: theme.palette.grey[100],
                  borderTopLeftRadius: 0
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CircularProgress size={12} />
                  <CircularProgress size={12} sx={{ animationDelay: '0.2s' }} />
                  <CircularProgress size={12} sx={{ animationDelay: '0.4s' }} />
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
        {/* Chatbox Footer */}
        <Box sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: '#fff1e6',
          display: 'flex',
          boxShadow: 1
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
              bgcolor: '#fff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
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
              fontWeight: 600
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
          width: { xs: '100%', md: '40%' },
          minWidth: { md: 300 },
          maxWidth: 400,
          borderRadius: 2,
          p: 2,
          bgcolor: '#b5ead7',
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, textAlign: 'center' }}>
          Frequently Asked Questions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List disablePadding>
            {FAQS.map((faq, idx) => (
              <Accordion key={idx} sx={{ mb: 1, boxShadow: 0, bgcolor: theme.palette.grey[50] }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`faq-content-${idx}`}
                  id={`faq-header-${idx}`}
                  sx={{ minHeight: 48 }}
                >
                  <Typography variant="subtitle1" fontWeight="medium">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chatbot;