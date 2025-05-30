import { useState, useEffect, useRef } from 'react';
import { 
  Grid, Box, Typography, Accordion, AccordionSummary, AccordionDetails, 
  Slider, Select, MenuItem, TextField, Switch, FormControlLabel, Button, 
  Paper, Tabs, Tab, Chip, IconButton, Tooltip, FormControl, InputLabel,
  RadioGroup, Radio, FormLabel, Divider, Snackbar, Alert, Popover
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ColorLens as ColorIcon,
  FormatSize as FormatSizeIcon,
  ChatBubbleOutline as ChatIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  FileCopy as CopyIcon,
  TextFields as TextFieldsIcon,
  PanTool as GestureIcon,
  Psychology as PsychologyIcon,
  DesktopWindows as DesktopIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { gsap } from 'gsap';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Predefined colors for our simple color picker
const PRESET_COLORS = [
  '#7C3AED', '#4EADEA', '#3B82F6', '#10B981', '#F59E0B', 
  '#EF4444', '#EC4899', '#8B5CF6', '#6366F1', '#000000',
  '#0EA5E9', '#14B8A6', '#22C55E', '#F97316', '#F43F5E',
  '#8B5CF6', '#0891B2', '#059669', '#65A30D', '#334155'
];

const ChatbotBuilder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State for chatbot configuration
  const [chatbotConfig, setChatbotConfig] = useState({
    appearance: {
      primaryColor: '#7C3AED',
      accentColor: '#4EADEA',
      borderRadius: 12,
      font: 'Inter',
      bubbleShape: 'pill', // 'pill' or 'rectangle'
      avatarUrl: ''
    },
    chatButton: {
      position: 'bottom-right',
      icon: 'chat',
      animation: 'bounce',
      label: 'Chat with us'
    },
    greetings: {
      welcomeMessage: 'Hello! How can I assist you today?',
      faqOptions: [
        'How do I reset my password?',
        'What are your business hours?',
        'How can I contact support?'
      ],
      messageDelay: 1000 // ms
    },
    behavior: {
      personality: 70, // 0-100 (Professional to Friendly)
      responseLength: 'medium', // 'short', 'medium', 'long'
      typingAnimation: true,
      escToClose: true,
      autoCloseTimeout: 0 // 0 = never auto-close
    },
    customLogic: {
      keywords: [
        { trigger: 'pricing', response: 'Our pricing starts at $10/month.' },
        { trigger: 'refund', response: 'We offer a 30-day money-back guarantee.' }
      ]
    },
    advanced: {
      language: 'en',
      timezone: 'auto',
      domain: ''
    }
  });

  // State for UI
  const [activeSection, setActiveSection] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState('');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [mockInput, setMockInput] = useState('');
  const [mockConversation, setMockConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  // Refs for animations
  const chatbotPreviewRef = useRef(null);
  const chatButtonRef = useRef(null);
  const chatWindowRef = useRef(null);
  
  // Sections for the accordion
  const sections = [
    { 
      id: 'appearance', 
      label: 'Appearance', 
      icon: <ColorIcon />,
      expanded: true
    },
    { 
      id: 'chatButton', 
      label: 'Chat Icon & Button', 
      icon: <ChatIcon />,
      expanded: false
    },
    { 
      id: 'greetings', 
      label: 'Greetings & Prompts', 
      icon: <TextFieldsIcon />,
      expanded: false
    },
    { 
      id: 'behavior', 
      label: 'Behavior', 
      icon: <PsychologyIcon />,
      expanded: false
    },
    { 
      id: 'customLogic', 
      label: 'Custom Logic', 
      icon: <GestureIcon />,
      expanded: false
    },
    { 
      id: 'advanced', 
      label: 'Advanced / Embed', 
      icon: <CodeIcon />,
      expanded: false
    }
  ];

  // Effect for animating the chatbot preview
  useEffect(() => {
    if (chatbotPreviewRef.current) {
      gsap.to(chatbotPreviewRef.current, {
        duration: 0.5,
        ease: 'power2.out',
        css: {
          '--primary-color': chatbotConfig.appearance.primaryColor,
          '--accent-color': chatbotConfig.appearance.accentColor,
          '--border-radius': `${chatbotConfig.appearance.borderRadius}px`
        }
      });
    }

    // Animate chat button position
    if (chatButtonRef.current) {
      const position = chatbotConfig.chatButton.position;
      gsap.to(chatButtonRef.current, {
        duration: 0.5,
        ease: 'power2.out',
        x: position.includes('right') ? 0 : '-20px',
        y: position.includes('top') ? '-20px' : 0
      });
    }
  }, [chatbotConfig]);

  // Animation for opening/closing chat
  useEffect(() => {
    if (chatWindowRef.current) {
      if (chatbotOpen) {
        gsap.fromTo(
          chatWindowRef.current,
          { 
            opacity: 0, 
            y: 20, 
            scale: 0.95 
          },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.4, 
            ease: 'back.out(1.4)' 
          }
        );
      } else {
        gsap.to(
          chatWindowRef.current,
          { 
            opacity: 0, 
            y: 20, 
            scale: 0.95, 
            duration: 0.3, 
            ease: 'power3.in' 
          }
        );
      }
    }
  }, [chatbotOpen]);

  // Handle form changes
  const handleConfigChange = (section, field, value) => {
    setChatbotConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle chat button click
  const handleChatButtonClick = () => {
    setChatbotOpen(prev => !prev);
    
    // Add welcome message if opening and no messages
    if (!chatbotOpen && mockConversation.length === 0) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMockConversation([
            { text: chatbotConfig.greetings.welcomeMessage, isBot: true }
          ]);
          setIsTyping(false);
        }, chatbotConfig.greetings.messageDelay);
      }, 500);
    }
  };

  // Handle sending a message in the mock chat
  const handleSendMessage = () => {
    if (!mockInput.trim()) return;
    
    // Add user message
    setMockConversation(prev => [...prev, { text: mockInput, isBot: false }]);
    setMockInput('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Find matching keyword or use default response
    const keyword = chatbotConfig.customLogic.keywords.find(
      k => mockInput.toLowerCase().includes(k.trigger.toLowerCase())
    );
    
    const botResponse = keyword 
      ? keyword.response 
      : "Thank you for your message. How else can I help you?";
    
    // Add bot response after delay
    setTimeout(() => {
      setMockConversation(prev => [...prev, { text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1500);
  };

  // Generate embed code
  const generateEmbedCode = () => {
    const configStr = JSON.stringify(chatbotConfig, null, 2);
    return `<script>
  window.CHATBOT_CONFIG = ${configStr};
</script>
<script src="https://admin-chatbot.example.com/embed.js" async></script>`;
  };

  // Copy embed code to clipboard
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setSnackbarOpen(true);
  };

  // Render color picker - replace with our custom implementation
  const renderColorPicker = () => {
    if (!showColorPicker) return null;
    
    const handleClose = () => {
      setShowColorPicker(false);
      setColorPickerTarget('');
    };
    
    const handleColorSelect = (color) => {
      handleConfigChange(
        'appearance',
        colorPickerTarget === 'primary' ? 'primaryColor' : 'accentColor',
        color
      );
      handleClose();
    };
    
    const currentColor = colorPickerTarget === 'primary' 
      ? chatbotConfig.appearance.primaryColor 
      : chatbotConfig.appearance.accentColor;
    
    return (
      <Popover
        open={showColorPicker}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 200, left: 400 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select a {colorPickerTarget === 'primary' ? 'Primary' : 'Accent'} Color
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: 1, 
            mt: 1 
          }}>
            {PRESET_COLORS.map((color) => (
              <Box 
                key={color}
                onClick={() => handleColorSelect(color)}
                sx={{ 
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  borderRadius: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: currentColor === color ? '2px solid #fff' : 'none',
                  outline: currentColor === color ? `3px solid ${color}` : 'none',
                  '&:hover': {
                    opacity: 0.9,
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                {currentColor === color && (
                  <CheckIcon 
                    sx={{ 
                      color: '#fff',
                      fontSize: 20
                    }} 
                  />
                )}
              </Box>
            ))}
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Custom Color
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Hex Color"
                size="small"
                value={currentColor}
                onChange={(e) => {
                  const color = e.target.value;
                  if (/^#([0-9A-F]{3}){1,2}$/i.test(color) || /^#([0-9A-F]{6})$/i.test(color) || /^#([0-9A-F]{8})$/i.test(color)) {
                    handleColorSelect(color);
                  }
                }}
                sx={{ flex: 1 }}
              />
              <Box 
                sx={{ 
                  width: 35, 
                  height: 35, 
                  backgroundColor: currentColor,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} size="small">
              Close
            </Button>
          </Box>
        </Box>
      </Popover>
    );
  };

  // Responsive tabs for mobile view
  const renderMobileTabs = () => (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {sections.map((section, index) => (
          <Tab 
            key={section.id}
            label={section.label} 
            icon={section.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>
    </Box>
  );

  // Main render
  return (
    <Box sx={{ p: 3, height: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Chatbot Builder
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Customize your chatbot appearance, behavior, and messaging, then generate the embed code.
      </Typography>
      
      {/* Main Split Layout */}
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          mt: 1,
          height: isMobile ? 'auto' : 'calc(100% - 100px)',
        }}
      >
        {/* Left Panel - Customization */}
        <Grid 
          item 
          xs={12} 
          md={5} 
          sx={{ 
            height: isMobile ? 'auto' : '100%',
            overflowY: isMobile ? 'visible' : 'auto',
            pb: 2
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              position: 'relative'
            }}
          >
            {/* Mobile Tabs View */}
            {isMobile && renderMobileTabs()}
            
            {/* Desktop Accordion View */}
            {!isMobile && sections.map((section, index) => (
              <Accordion 
                key={section.id}
                expanded={!isMobile && activeSection === index}
                onChange={() => setActiveSection(index)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 1, color: 'primary.main' }}>
                      {section.icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {section.label}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {renderSectionContent(section.id)}
                </AccordionDetails>
              </Accordion>
            ))}
            
            {/* Mobile Section Content */}
            {isMobile && (
              <Box sx={{ mt: 2 }}>
                {renderSectionContent(sections[currentTab].id)}
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Right Panel - Preview */}
        <Grid 
          item 
          xs={12} 
          md={7} 
          sx={{ 
            height: isMobile ? '500px' : '100%'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              bgcolor: theme.palette.mode === 'dark' ? '#1A1C2E' : '#F7F9FC',
              backgroundImage: `${theme.palette.mode === 'dark' 
                ? 'linear-gradient(45deg, #1A1C2E 25%, #20223A 25%, #20223A 50%, #1A1C2E 50%, #1A1C2E 75%, #20223A 75%, #20223A 100%)' 
                : 'linear-gradient(45deg, #F7F9FC 25%, #FFFFFF 25%, #FFFFFF 50%, #F7F9FC 50%, #F7F9FC 75%, #FFFFFF 75%, #FFFFFF 100%)'
              }`,
              backgroundSize: '40px 40px'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Live Preview
            </Typography>
            
            <Box 
              sx={{ 
                flexGrow: 1, 
                position: 'relative',
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Example website content */}
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '50%', textAlign: 'center' }}>
                (This represents your website content)
              </Typography>
              
              {/* Chatbot Preview Container */}
              <Box 
                ref={chatbotPreviewRef}
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  '--primary-color': chatbotConfig.appearance.primaryColor,
                  '--accent-color': chatbotConfig.appearance.accentColor,
                  '--border-radius': `${chatbotConfig.appearance.borderRadius}px`,
                  fontFamily: chatbotConfig.appearance.font
                }}
              >
                {/* Chat Button */}
                <Box
                  ref={chatButtonRef}
                  onClick={handleChatButtonClick}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1,
                    position: 'relative',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    },
                    animation: chatbotConfig.chatButton.animation === 'bounce' ? 
                      'bounce 2s infinite ease-in-out' : 
                      'none'
                  }}
                >
                  <ChatIcon sx={{ fontSize: 28 }} />
                </Box>
                
                {/* Chat Window */}
                <Box
                  ref={chatWindowRef}
                  sx={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    width: 320,
                    height: 450,
                    backgroundColor: '#fff',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    display: chatbotOpen ? 'flex' : 'none',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  {/* Chat Header */}
                  <Box
                    sx={{
                      backgroundColor: 'var(--primary-color)',
                      color: '#fff',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      Chat Assistant
                    </Typography>
                    <Box sx={{ ml: 'auto' }}>
                      <IconButton
                        size="small"
                        sx={{ color: '#fff' }}
                        onClick={() => setChatbotOpen(false)}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {/* Chat Messages */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      p: 2,
                      overflow: 'auto',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {mockConversation.map((msg, index) => (
                      <Box
                        key={index}
                        sx={{
                          alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                          maxWidth: '75%',
                          mb: 1,
                          p: 1.5,
                          px: 2,
                          backgroundColor: msg.isBot 
                            ? '#f0f0f0' 
                            : 'var(--primary-color)',
                          color: msg.isBot ? 'text.primary' : '#fff',
                          borderRadius: chatbotConfig.appearance.bubbleShape === 'pill' 
                            ? 18
                            : 'var(--border-radius)'
                        }}
                      >
                        <Typography variant="body2">
                          {msg.text}
                        </Typography>
                      </Box>
                    ))}
                    {isTyping && (
                      <Box
                        sx={{
                          alignSelf: 'flex-start',
                          maxWidth: '75%',
                          mb: 1,
                          p: 1.5,
                          px: 2,
                          backgroundColor: '#f0f0f0',
                          borderRadius: chatbotConfig.appearance.bubbleShape === 'pill' 
                            ? 18
                            : 'var(--border-radius)',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary-color)',
                              animation: 'bounce 1s infinite ease-in-out',
                              animationDelay: '0s'
                            }}
                          />
                          <Box 
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              mx: 0.5,
                              backgroundColor: 'var(--primary-color)',
                              animation: 'bounce 1s infinite ease-in-out',
                              animationDelay: '0.1s'
                            }}
                          />
                          <Box 
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary-color)',
                              animation: 'bounce 1s infinite ease-in-out',
                              animationDelay: '0.2s'
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                  
                  {/* FAQ Chips */}
                  {chatbotConfig.greetings.faqOptions.length > 0 && mockConversation.length <= 1 && (
                    <Box
                      sx={{
                        p: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {chatbotConfig.greetings.faqOptions.map((faq, i) => (
                        <Chip
                          key={i}
                          label={faq}
                          size="small"
                          onClick={() => {
                            setMockInput(faq);
                            handleSendMessage();
                          }}
                          sx={{
                            cursor: 'pointer',
                            borderColor: 'var(--primary-color)',
                            color: 'var(--primary-color)',
                            '&:hover': {
                              backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)'
                            }
                          }}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                  
                  {/* Chat Input */}
                  <Box
                    sx={{
                      p: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      display: 'flex'
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={mockInput}
                      onChange={(e) => setMockInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 'var(--border-radius)'
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        ml: 1,
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: 'var(--border-radius)'
                      }}
                      onClick={handleSendMessage}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            {/* Preview Controls */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setChatbotOpen(!chatbotOpen)}
                startIcon={<ChatIcon />}
              >
                {chatbotOpen ? 'Close Chat' : 'Open Chat'}
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={copyEmbedCode}
                startIcon={<CopyIcon />}
              >
                Generate & Copy Code
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Color Picker */}
      {renderColorPicker()}
      
      {/* Copy Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Embed code copied to clipboard!
        </Alert>
      </Snackbar>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
  
  // Helper function to render the content of each section
  function renderSectionContent(sectionId) {
    switch(sectionId) {
      case 'appearance':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <Typography variant="body2" gutterBottom>Primary Color</Typography>
                <Box 
                  onClick={() => {
                    setColorPickerTarget('primary');
                    setShowColorPicker(true);
                  }}
                  sx={{ 
                    height: 36, 
                    borderRadius: 1, 
                    backgroundColor: chatbotConfig.appearance.primaryColor,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      opacity: 0.9
                    }
                  }} 
                >
                  <ColorIcon sx={{ color: theme.palette.getContrastText(chatbotConfig.appearance.primaryColor) }} />
                </Box>
              </Box>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <Typography variant="body2" gutterBottom>Accent Color</Typography>
                <Box 
                  onClick={() => {
                    setColorPickerTarget('accent');
                    setShowColorPicker(true);
                  }}
                  sx={{ 
                    height: 36, 
                    borderRadius: 1, 
                    backgroundColor: chatbotConfig.appearance.accentColor,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      opacity: 0.9
                    }
                  }} 
                >
                  <ColorIcon sx={{ color: theme.palette.getContrastText(chatbotConfig.appearance.accentColor) }} />
                </Box>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Border Radius: {chatbotConfig.appearance.borderRadius}px
              </Typography>
              <Slider 
                value={chatbotConfig.appearance.borderRadius}
                onChange={(e, value) => handleConfigChange('appearance', 'borderRadius', value)}
                min={0}
                max={24}
                step={1}
                marks={[
                  { value: 0, label: '0' },
                  { value: 12, label: '12' },
                  { value: 24, label: '24' }
                ]}
              />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Font Family</InputLabel>
              <Select
                value={chatbotConfig.appearance.font}
                onChange={(e) => handleConfigChange('appearance', 'font', e.target.value)}
                label="Font Family"
              >
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Roboto">Roboto</MenuItem>
                <MenuItem value="Poppins">Poppins</MenuItem>
                <MenuItem value="Open Sans">Open Sans</MenuItem>
                <MenuItem value="Lato">Lato</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl component="fieldset">
              <FormLabel component="legend">Bubble Shape</FormLabel>
              <RadioGroup
                row
                value={chatbotConfig.appearance.bubbleShape}
                onChange={(e) => handleConfigChange('appearance', 'bubbleShape', e.target.value)}
              >
                <FormControlLabel value="pill" control={<Radio />} label="Pill" />
                <FormControlLabel value="rectangle" control={<Radio />} label="Rectangle" />
              </RadioGroup>
            </FormControl>
            
            <Box>
              <Typography variant="body2" gutterBottom>Avatar Image</Typography>
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        handleConfigChange('appearance', 'avatarUrl', reader.result);
                      };
                    }
                  }}
                />
              </Button>
              {chatbotConfig.appearance.avatarUrl && (
                <Box 
                  component="img"
                  src={chatbotConfig.appearance.avatarUrl}
                  alt="Avatar"
                  sx={{ 
                    display: 'block',
                    mt: 1,
                    height: 60,
                    width: 60,
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              )}
            </Box>
          </Box>
        );
      
      case 'chatButton':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Button Position</FormLabel>
              <RadioGroup
                row
                value={chatbotConfig.chatButton.position}
                onChange={(e) => handleConfigChange('chatButton', 'position', e.target.value)}
              >
                <FormControlLabel value="bottom-right" control={<Radio />} label="Bottom Right" />
                <FormControlLabel value="bottom-left" control={<Radio />} label="Bottom Left" />
              </RadioGroup>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Button Animation</InputLabel>
              <Select
                value={chatbotConfig.chatButton.animation}
                onChange={(e) => handleConfigChange('chatButton', 'animation', e.target.value)}
                label="Button Animation"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="bounce">Bounce</MenuItem>
                <MenuItem value="pulse">Pulse</MenuItem>
                <MenuItem value="fade">Fade</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Chat Button Label"
              value={chatbotConfig.chatButton.label}
              onChange={(e) => handleConfigChange('chatButton', 'label', e.target.value)}
              helperText="Text shown when hovering over chat button"
            />
          </Box>
        );
      
      case 'greetings':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Welcome Message"
              value={chatbotConfig.greetings.welcomeMessage}
              onChange={(e) => handleConfigChange('greetings', 'welcomeMessage', e.target.value)}
            />
            
            <Box>
              <Typography variant="body2" gutterBottom>
                FAQ Options (click to remove)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {chatbotConfig.greetings.faqOptions.map((faq, index) => (
                  <Chip
                    key={index}
                    label={faq}
                    onDelete={() => {
                      const newFaqs = [...chatbotConfig.greetings.faqOptions];
                      newFaqs.splice(index, 1);
                      handleConfigChange('greetings', 'faqOptions', newFaqs);
                    }}
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                label="Add FAQ Option"
                placeholder="Type and press Enter to add"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    handleConfigChange(
                      'greetings',
                      'faqOptions',
                      [...chatbotConfig.greetings.faqOptions, e.target.value]
                    );
                    e.target.value = '';
                  }
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Message Delay: {chatbotConfig.greetings.messageDelay}ms
              </Typography>
              <Slider
                value={chatbotConfig.greetings.messageDelay}
                onChange={(e, value) => handleConfigChange('greetings', 'messageDelay', value)}
                min={0}
                max={3000}
                step={100}
                marks={[
                  { value: 0, label: '0ms' },
                  { value: 1500, label: '1.5s' },
                  { value: 3000, label: '3s' }
                ]}
              />
            </Box>
          </Box>
        );
      
      case 'behavior':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" gutterBottom>
                AI Personality: 
                {chatbotConfig.behavior.personality <= 30 
                  ? ' Professional' 
                  : chatbotConfig.behavior.personality >= 70 
                    ? ' Friendly' 
                    : ' Balanced'
                }
              </Typography>
              <Slider
                value={chatbotConfig.behavior.personality}
                onChange={(e, value) => handleConfigChange('behavior', 'personality', value)}
                min={0}
                max={100}
                marks={[
                  { value: 0, label: 'Professional' },
                  { value: 50, label: 'Balanced' },
                  { value: 100, label: 'Friendly' }
                ]}
              />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Response Length</InputLabel>
              <Select
                value={chatbotConfig.behavior.responseLength}
                onChange={(e) => handleConfigChange('behavior', 'responseLength', e.target.value)}
                label="Response Length"
              >
                <MenuItem value="short">Short</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="long">Long</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chatbotConfig.behavior.typingAnimation}
                    onChange={(e) => handleConfigChange('behavior', 'typingAnimation', e.target.checked)}
                  />
                }
                label="Enable typing animation"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={chatbotConfig.behavior.escToClose}
                    onChange={(e) => handleConfigChange('behavior', 'escToClose', e.target.checked)}
                  />
                }
                label="Enable Esc key to close"
              />
            </Box>
            
            <Box>
              <Typography variant="body2" gutterBottom>
                Auto-close timeout (seconds)
                {chatbotConfig.behavior.autoCloseTimeout === 0 
                  ? ': Never' 
                  : `: ${chatbotConfig.behavior.autoCloseTimeout}s`
                }
              </Typography>
              <Slider
                value={chatbotConfig.behavior.autoCloseTimeout}
                onChange={(e, value) => handleConfigChange('behavior', 'autoCloseTimeout', value)}
                min={0}
                max={300}
                step={30}
                marks={[
                  { value: 0, label: 'Off' },
                  { value: 60, label: '60s' },
                  { value: 300, label: '5m' }
                ]}
              />
            </Box>
          </Box>
        );
      
      case 'customLogic':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" gutterBottom>
              Keyword Triggers & Responses
            </Typography>
            
            {chatbotConfig.customLogic.keywords.map((keyword, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <TextField
                  fullWidth
                  label="Trigger Keyword"
                  value={keyword.trigger}
                  onChange={(e) => {
                    const newKeywords = [...chatbotConfig.customLogic.keywords];
                    newKeywords[index].trigger = e.target.value;
                    handleConfigChange('customLogic', 'keywords', newKeywords);
                  }}
                  sx={{ mb: 1 }}
                />
                
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Response"
                  value={keyword.response}
                  onChange={(e) => {
                    const newKeywords = [...chatbotConfig.customLogic.keywords];
                    newKeywords[index].response = e.target.value;
                    handleConfigChange('customLogic', 'keywords', newKeywords);
                  }}
                  sx={{ mb: 1 }}
                />
                
                <Button
                  color="error"
                  onClick={() => {
                    const newKeywords = [...chatbotConfig.customLogic.keywords];
                    newKeywords.splice(index, 1);
                    handleConfigChange('customLogic', 'keywords', newKeywords);
                  }}
                >
                  Remove
                </Button>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              onClick={() => {
                const newKeywords = [...chatbotConfig.customLogic.keywords, { trigger: '', response: '' }];
                handleConfigChange('customLogic', 'keywords', newKeywords);
              }}
            >
              Add New Keyword
            </Button>
          </Box>
        );
      
      case 'advanced':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={chatbotConfig.advanced.language}
                onChange={(e) => handleConfigChange('advanced', 'language', e.target.value)}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={chatbotConfig.advanced.timezone === 'auto'}
                  onChange={(e) => handleConfigChange(
                    'advanced', 
                    'timezone', 
                    e.target.checked ? 'auto' : 'UTC'
                  )}
                />
              }
              label="Auto-detect user timezone"
            />
            
            <TextField
              fullWidth
              label="Custom Domain Integration"
              value={chatbotConfig.advanced.domain}
              onChange={(e) => handleConfigChange('advanced', 'domain', e.target.value)}
              placeholder="yourdomain.com"
              helperText="Optional: Limit chatbot to specific domains"
            />
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Generate Embed Code
            </Typography>
            
            <Paper 
              sx={{ 
                p: 2, 
                backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
                maxHeight: 250,
                overflow: 'auto'
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {generateEmbedCode()}
              </Typography>
            </Paper>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<CopyIcon />}
              onClick={copyEmbedCode}
            >
              Copy to Clipboard
            </Button>
          </Box>
        );
      
      default:
        return null;
    }
  }
};

export default ChatbotBuilder;
