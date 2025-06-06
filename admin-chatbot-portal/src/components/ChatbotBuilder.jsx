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
  Check as CheckIcon,
  // Add additional chat button icons
  Chat as ChatFilledIcon,
  QuestionAnswer as QuestionAnswerIcon,
  HeadsetMic as HeadsetMicIcon,
  Message as MessageIcon,
  Forum as ForumIcon,
  ContactSupport as ContactSupportIcon,
  WhatsApp as WhatsAppIcon,
  Sms as SmsIcon,
  // Add more icons for better selection
  ChatBubble as ChatBubbleIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Smartphone as SmartphoneIcon,
  Support as SupportAgentIcon,
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  EmojiEmotions as EmojiIcon
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

// Define available button icons with their components - make sure this is outside the component
const BUTTON_ICONS = {
  'chat': <ChatIcon />,
  'chatFilled': <ChatFilledIcon />,
  'chatBubble': <ChatBubbleIcon />,
  'question': <QuestionAnswerIcon />,
  'headset': <HeadsetMicIcon />,
  'message': <MessageIcon />,
  'forum': <ForumIcon />,
  'support': <ContactSupportIcon />,
  'supportAgent': <SupportAgentIcon />,
  'whatsapp': <WhatsAppIcon />,
  'sms': <SmsIcon />,
  'mail': <MailIcon />,
  'phone': <PhoneIcon />,
  'smartphone': <SmartphoneIcon />,
  'notifications': <NotificationsIcon />,
  'info': <InfoIcon />,
  'emoji': <EmojiIcon />
};

const ChatbotBuilder = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  // State for chatbot configuration
  const [chatbotConfig, setChatbotConfig] = useState({
    appearance: {
      primaryColor: '#7C3AED',
      accentColor: '#4EADEA',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      font: 'Inter',
      bubbleShape: 'pill', // Update with more options: 'pill', 'rectangle', 'rounded', 'bubble', or 'angled'
      avatarUrl: '',
      openAnimation: 'fade', // New property: 'fade', 'slide', 'scale', 'bounce', 'flip'
      bubbleIcon: 'chat', // New property for chat button icon
      bubbleIconSize: 'medium' // New property for icon size: 'small', 'medium', 'large'
    },
    chatButton: {
      position: 'bottom-right',
      icon: 'chat',
      animation: 'bounce',
      label: 'Chat with us',
      showLabel: true, 
      labelBgColor: '#FFFFFF',
      labelTextColor: '#000000', // Default to black text for better visibility instead of empty string
      labelShape: 'rounded', // 'rounded', 'pill', 'rectangle', 'slanted'
      labelSize: 'medium', // 'small', 'medium', 'large'
      labelBgOpacity: 100, // Percentage transparency, 100 = fully opaque
      labelTextOpacity: 100 // Percentage transparency, 100 = fully opaque
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
  const [expandedSections, setExpandedSections] = useState({
    appearance: true,
    chatButton: false,
    greetings: false,
    behavior: false,
    advanced: false
  });
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
      icon: <ColorIcon />
    },
    { 
      id: 'chatButton', 
      label: 'Chat Icon & Button', 
      icon: <ChatIcon />
    },
    { 
      id: 'greetings', 
      label: 'Greetings & Prompts', 
      icon: <TextFieldsIcon />
    },
    { 
      id: 'behavior', 
      label: 'Behavior', 
      icon: <PsychologyIcon />
    },
    { 
      id: 'advanced', 
      label: 'Advanced / Embed', 
      icon: <CodeIcon />
    }
  ];

  // Handle accordion toggle
  const handleToggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Effect for animating the chatbot preview
  useEffect(() => {
    if (chatbotPreviewRef.current) {
      gsap.to(chatbotPreviewRef.current, {
        duration: 0.5,
        ease: 'power2.out',
        css: {
          '--primary-color': chatbotConfig.appearance.primaryColor,
          '--accent-color': chatbotConfig.appearance.accentColor,
          '--background-color': chatbotConfig.appearance.backgroundColor,
          '--border-radius': `${chatbotConfig.appearance.borderRadius}px`
        }
      });
    }

    // No longer need the commented out position animation as we're using CSS positioning
  }, [chatbotConfig]);

  // Initialize chat window display and transform properties
  useEffect(() => {
    if (chatWindowRef.current) {
      // Set initial display state (hidden until opened)
      chatWindowRef.current.style.display = 'none';
      // Set transform origin for animations 
      chatWindowRef.current.style.transformOrigin = 'center bottom';
      // Set transform style to preserve 3d for flip animations
      chatWindowRef.current.style.transformStyle = 'preserve-3d';
      // Add perspective for 3D transformations
      chatWindowRef.current.style.perspective = '800px';
      // Set initial zIndex to prevent overlap
      chatWindowRef.current.style.zIndex = '0';
    }
  }, []);

  // Animation for opening/closing chat - update with more precise controls
  useEffect(() => {
    if (!chatWindowRef.current) return;
    
    // Reset any ongoing animations to prevent conflicts
    gsap.killTweensOf(chatWindowRef.current);
    
    // Apply different animations based on the selected animation type
    const animType = chatbotConfig.appearance.openAnimation;
    
    // Set appropriate transform origin based on animation type
    if (animType === 'scale') {
      chatWindowRef.current.style.transformOrigin = 'bottom right';
    } else if (animType === 'flip') {
      chatWindowRef.current.style.transformOrigin = 'center bottom';
    } else {
      chatWindowRef.current.style.transformOrigin = 'center center';
    }
    
    if (chatbotOpen) {
      // First make the element visible
      chatWindowRef.current.style.display = 'flex';
      chatWindowRef.current.style.opacity = '0'; // Start invisible
      
      // Add small delay to ensure display change takes effect
      setTimeout(() => {
        // Different entry animations
        switch (animType) {
          case 'slide':
            gsap.fromTo(
              chatWindowRef.current,
              { opacity: 0, y: 50, scale: 1 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' }
            );
            break;
            
          case 'scale':
            gsap.fromTo(
              chatWindowRef.current,
              { 
                opacity: 0, 
                scale: 0.7,
                transformOrigin: 'bottom right',
                // Adjust origin point to prevent overlap with button during scaling 
                xPercent: 3, 
                yPercent: -3
              },
              { 
                opacity: 1, 
                scale: 1,
                xPercent: 0,
                yPercent: 0,
                duration: 0.5, 
                ease: 'back.out(1.7)'
              }
            );
            break;
            
          case 'bounce':
            gsap.fromTo(
              chatWindowRef.current,
              { opacity: 0, y: 100, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
            );
            break;
            
          case 'flip':
            gsap.fromTo(
              chatWindowRef.current,
              { 
                opacity: 0, 
                rotationX: 90,
                transformPerspective: 800
              },
              { 
                opacity: 1, 
                rotationX: 0, 
                duration: 0.6, 
                ease: 'back.out(1.7)'
              }
            );
            break;
            
          case 'fade':
          default:
            gsap.fromTo(
              chatWindowRef.current,
              { opacity: 0, y: 20, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' }
            );
        }
      }, 20);
    } else {
      // Exit animations
      switch (animType) {
        case 'slide':
          gsap.to(chatWindowRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => {
              if (chatWindowRef.current) chatWindowRef.current.style.display = 'none';
            }
          });
          break;
          
        case 'scale':
          gsap.to(chatWindowRef.current, {
            opacity: 0,
            scale: 0.7,
            transformOrigin: 'bottom right',
            // Adjust origin point to match opening animation
            xPercent: 3,
            yPercent: -3,
            duration: 0.4,
            ease: 'back.in(1.7)',
            onComplete: () => {
              if (chatWindowRef.current) {
                chatWindowRef.current.style.display = 'none';
                // Reset transforms to prevent interference with next animation
                chatWindowRef.current.style.transform = '';
                chatWindowRef.current.style.xPercent = 0;
                chatWindowRef.current.style.yPercent = 0;
              }
            }
          });
          break;
          
        case 'bounce':
          gsap.to(chatWindowRef.current, {
            opacity: 0,
            y: 100,
            scale: 0.9,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => {
              if (chatWindowRef.current) chatWindowRef.current.style.display = 'none';
            }
          });
          break;
          
        case 'flip':
          gsap.to(chatWindowRef.current, {
            opacity: 0,
            rotationX: -90,
            transformPerspective: 800,
            duration: 0.5,
            ease: 'back.in(1.7)',
            onComplete: () => {
              if (chatWindowRef.current) chatWindowRef.current.style.display = 'none';
            }
          });
          break;
          
        case 'fade':
        default:
          gsap.to(chatWindowRef.current, {
            opacity: 0,
            y: 20,
            scale: 0.95,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => {
              if (chatWindowRef.current) chatWindowRef.current.style.display = 'none';
            }
          });
      }
    }
  }, [chatbotOpen, chatbotConfig.appearance.openAnimation]);
  
  // Add fixed dimensions and positions useEffect to maintain layout stability
  useEffect(() => {
    // Initialize preview container to fixed dimensions
    if (chatbotPreviewRef.current) {
      const previewContainer = chatbotPreviewRef.current.parentElement;
      if (previewContainer) {
        // Set fixed height and width to prevent layout shifts
        previewContainer.style.minHeight = '450px';
        previewContainer.style.position = 'relative';
        previewContainer.style.overflow = 'hidden';
      }
    }
  }, []);

  // Replace the avatar change useEffect with a version that always enforces fixed chat window size
  useEffect(() => {
    if (chatWindowRef.current) {
      // Always enforce fixed size for chat window
      chatWindowRef.current.style.height = '450px';
      chatWindowRef.current.style.maxHeight = '450px';
      chatWindowRef.current.style.minHeight = '450px';
      chatWindowRef.current.style.width = '320px';
      chatWindowRef.current.style.maxWidth = '320px';
      chatWindowRef.current.style.minWidth = '320px';
      // Don't directly modify display property here, let animations handle it
      // chatWindowRef.current.style.display = chatbotOpen ? 'flex' : 'none';
      chatWindowRef.current.style.flexDirection = 'column';
      chatWindowRef.current.style.overflow = 'hidden';
    }
    // Also enforce fixed size for avatar images
    document.querySelectorAll('.chat-header-avatar').forEach(img => {
      img.style.width = '32px';
      img.style.height = '32px';
      img.style.minWidth = '32px';
      img.style.minHeight = '32px';
      img.style.maxWidth = '32px';
      img.style.maxHeight = '32px';
      img.style.objectFit = 'cover';
      img.style.display = chatbotConfig.appearance.avatarUrl ? 'block' : 'none';
    });
    document.querySelectorAll('.chat-message-avatar').forEach(img => {
      img.style.width = '24px';
      img.style.height = '24px';
      img.style.minWidth = '24px';
      img.style.minHeight = '24px';
      img.style.maxWidth = '24px';
      img.style.maxHeight = '24px';
      img.style.objectFit = 'cover';
      img.style.display = chatbotConfig.appearance.avatarUrl ? 'block' : 'none';
    });
  }, [chatbotConfig.appearance.avatarUrl, chatbotOpen]);

  // Fix: Prevent left customization panel from expanding on image upload
  // Move this useEffect *after* the state and refs are defined
  useEffect(() => {
    // Always enforce fixed height for the left customization panel
    const leftPanel = document.querySelector('.customization-panel-fixed');
    if (leftPanel) {
      leftPanel.style.height = '';
      leftPanel.style.maxHeight = '';
      leftPanel.style.overflowY = '';
      // Only apply on desktop
      if (!isMobile) {
        leftPanel.style.height = '100%';
        leftPanel.style.maxHeight = 'calc(100vh - 150px)';
        leftPanel.style.overflowY = 'auto';
      }
    }
  }, [chatbotConfig.appearance.avatarUrl, isMobile]);

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
      if (colorPickerTarget === 'primary') {
        handleConfigChange('appearance', 'primaryColor', color);
      } else if (colorPickerTarget === 'accent') {
        handleConfigChange('appearance', 'accentColor', color);
      } else if (colorPickerTarget === 'background') {
        handleConfigChange('appearance', 'backgroundColor', color);
      } else if (colorPickerTarget === 'labelBg') {
        handleConfigChange('chatButton', 'labelBgColor', color);
      } else if (colorPickerTarget === 'labelText') {
        handleConfigChange('chatButton', 'labelTextColor', color);
      }
      handleClose();
    };
    
    const colorTargetLabels = {
      'primary': 'Primary',
      'accent': 'Accent',
      'background': 'Background',
      'labelBg': 'Label Background',
      'labelText': 'Label Text'
    };
    
    const currentColor = (() => {
      switch(colorPickerTarget) {
        case 'primary': return chatbotConfig.appearance.primaryColor;
        case 'accent': return chatbotConfig.appearance.accentColor;
        case 'background': return chatbotConfig.appearance.backgroundColor;
        case 'labelBg': return chatbotConfig.chatButton.labelBgColor || '#FFFFFF';
        case 'labelText': return chatbotConfig.chatButton.labelTextColor || '#000000';
        default: return '#000000';
      }
    })();
    
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
            Select a {colorTargetLabels[colorPickerTarget]} Color 
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

  // Add this function definition after state declarations and before rendering
  const renderChatButtonIcon = () => {
    const iconSize = chatbotConfig.appearance.bubbleIconSize === 'small' ? 22 : 
                    chatbotConfig.appearance.bubbleIconSize === 'large' ? 34 : 28;
    
    if (chatbotOpen) {
      return <ExpandMoreIcon sx={{ fontSize: iconSize }} />;
    }
    
    const selectedIcon = chatbotConfig.appearance.bubbleIcon;
    const IconComponent = (() => {
      switch(selectedIcon) {
        case 'chatFilled': return ChatFilledIcon;
        case 'chatBubble': return ChatBubbleIcon;
        case 'question': return QuestionAnswerIcon;
        case 'headset': return HeadsetMicIcon;
        case 'message': return MessageIcon;
        case 'forum': return ForumIcon;
        case 'support': return ContactSupportIcon;
        case 'supportAgent': return SupportAgentIcon;
        case 'whatsapp': return WhatsAppIcon;
        case 'sms': return SmsIcon;
        case 'mail': return MailIcon;
        case 'phone': return PhoneIcon;
        case 'smartphone': return SmartphoneIcon;
        case 'notifications': return NotificationsIcon;
        case 'info': return InfoIcon;
        case 'emoji': return EmojiIcon;
        case 'chat':
        default: return ChatIcon;
      }
    })();
    
    return <IconComponent sx={{ fontSize: iconSize }} />;
  };

  // Place this useEffect just before the return (
  useEffect(() => {
    if (!chatButtonRef.current) return;

    // Clear any existing animations
    gsap.killTweensOf(chatButtonRef.current);

    // Reset to default position first to avoid animation conflicts
    gsap.set(chatButtonRef.current, {
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      clearProps: "all"
    });

    // If chat is open, don't animate
    if (chatbotOpen) {
      gsap.to(chatButtonRef.current, {
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.out'
      });
      return;
    }

    // Apply different animations based on selected animation type
    const buttonAnimation = chatbotConfig.chatButton.animation;

    switch (buttonAnimation) {
      case 'bounce':
        gsap.to(chatButtonRef.current, {
          y: -10,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          yoyoEase: true
        });
        break;
        
      case 'pulse':
        gsap.to(chatButtonRef.current, {
          scale: 1.15,
          boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
        break;
        
      case 'fade':
        gsap.to(chatButtonRef.current, {
          opacity: 0.6,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
        break;
        
      case 'wiggle':
        const wiggleTl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
        wiggleTl.to(chatButtonRef.current, { rotation: 12, duration: 0.14, ease: 'power1.inOut' })
          .to(chatButtonRef.current, { rotation: -12, duration: 0.14, ease: 'power1.inOut' })
          .to(chatButtonRef.current, { rotation: 9, duration: 0.12, ease: 'power1.inOut' })
          .to(chatButtonRef.current, { rotation: -9, duration: 0.12, ease: 'power1.inOut' })
          .to(chatButtonRef.current, { rotation: 6, duration: 0.12, ease: 'power1.inOut' })
          .to(chatButtonRef.current, { rotation: -6, duration: 0.12, ease: 'power1.inOut' })
          .to(chatButtonRef.current, { rotation: 0, duration: 0.14, ease: 'power1.inOut' });
        break;
        
      case 'spin':
        gsap.to(chatButtonRef.current, {
          rotation: 360,
          duration: 12, // Slower spin
          repeat: -1,
          ease: 'linear'
        });
        break;
        
      case 'heartbeat':
        const heartbeatTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        heartbeatTl
          .to(chatButtonRef.current, { scale: 1.25, duration: 0.16, ease: 'power3.out' })
          .to(chatButtonRef.current, { scale: 1, duration: 0.12, ease: 'power3.in' })
          .to(chatButtonRef.current, { scale: 1.25, duration: 0.16, ease: 'power3.out', delay: 0.06 })
          .to(chatButtonRef.current, { scale: 1, duration: 0.12, ease: 'power3.in' });
        break;
        
      // New animations
      case 'float':
        // Creates a gentle floating effect with circular path
        // Make this distinct from bounce by adding horizontal movement in a figure-8 pattern
        const floatTl = gsap.timeline({ repeat: -1 });
        floatTl
          .to(chatButtonRef.current, { 
            x: 6, 
            y: -4, 
            rotation: 3,
            duration: 2, 
            ease: 'sine.inOut'
          })
          .to(chatButtonRef.current, { 
            x: -6, 
            y: -2,
            rotation: -3, 
            duration: 2, 
            ease: 'sine.inOut'
          })
          .to(chatButtonRef.current, { 
            x: 0, 
            y: 0,
            rotation: 0,
            duration: 2, 
            ease: 'sine.inOut'
          });
        break;
        
      case 'tadpole':
        // Creates a swimming tadpole-like motion
        const tadpoleTl = gsap.timeline({ repeat: -1 });
        tadpoleTl
          .to(chatButtonRef.current, { 
            x: 8, 
            y: -5, 
            rotation: 10,
            duration: 0.8, 
            ease: 'power1.inOut' 
          })
          .to(chatButtonRef.current, { 
            x: 0, 
            y: 0,
            rotation: 0,
            duration: 1, 
            ease: 'power1.inOut' 
          })
          .to(chatButtonRef.current, { 
            x: -8, 
            y: 5,
            rotation: -10, 
            duration: 0.8, 
            ease: 'power1.inOut' 
          })
          .to(chatButtonRef.current, { 
            x: 0, 
            y: 0,
            rotation: 0, 
            duration: 1, 
            ease: 'power1.inOut' 
          });
        break;
        
      case 'glowing':
        // Creates a pulsating glow effect
        const glowTl = gsap.timeline({ repeat: -1 });
        
        // Store original box-shadow and background color
        const originalElement = chatButtonRef.current;
        const originalBgColor = window.getComputedStyle(originalElement).backgroundColor;
        const originalBoxShadow = window.getComputedStyle(originalElement).boxShadow;
        
        glowTl
          .to(chatButtonRef.current, { 
            boxShadow: `0 0 15px 5px ${chatbotConfig.appearance.primaryColor}80, 0 4px 12px rgba(0,0,0,0.3)`,
            scale: 1.05,
            duration: 1.2,
            ease: 'sine.inOut'
          })
          .to(chatButtonRef.current, { 
            boxShadow: originalBoxShadow || '0 4px 12px rgba(0,0,0,0.25)',
            scale: 1,
            duration: 1.2,
            ease: 'sine.inOut'
          });
        break;
        
      case 'jump':
        // Creates a jumping and flipping effect
        const jumpTl = gsap.timeline({ repeat: -1, repeatDelay: 2.5 });
        jumpTl
          .to(chatButtonRef.current, { 
            y: -20, 
            duration: 0.3, 
            ease: 'power2.out'
          })
          .to(chatButtonRef.current, { 
            rotationY: 180,
            duration: 0.5,
            ease: 'power1.inOut'
          }, "-=0.1") // Overlap with the jump
          .to(chatButtonRef.current, { 
            y: 0, 
            duration: 0.3, 
            ease: 'bounce.out'
          })
          .to(chatButtonRef.current, {
            rotationY: 360,
            duration: 0.5,
            delay: 0.5,
            ease: 'power1.inOut'
          });
        break;
        
      case 'shake':
        // Creates an attention-grabbing shake
        const shakeTl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
        shakeTl
          .to(chatButtonRef.current, { x: -4, duration: 0.1, ease: 'sine.inOut' })
          .to(chatButtonRef.current, { x: 4, duration: 0.1, ease: 'sine.inOut' })
          .to(chatButtonRef.current, { x: -4, duration: 0.1, ease: 'sine.inOut' })
          .to(chatButtonRef.current, { x: 4, duration: 0.1, ease: 'sine.inOut' })
          .to(chatButtonRef.current, { x: -4, duration: 0.1, ease: 'sine.inOut' })
          .to(chatButtonRef.current, { x: 4, duration: 0.1, ease: 'sine.inOut' })
          .to(chatButtonRef.current, { x: -2, duration: 0.1, ease: 'sine.inOut' })
          .to(chatButtonRef.current, { x: 2, duration: 0.1, ease: 'sine.inOut' })
          .to(chatButtonRef.current, { x: 0, duration: 0.1, ease: 'sine.inOut' });
        break;
        
      case 'orbit':
        // Fix the orbit animation using a different approach
        const orbitRadius = 8;
        const orbitDuration = 4;
        const orbitTl = gsap.timeline({ repeat: -1 });
        
        // Create a circular motion using sine and cosine functions
        // Start the timeline to move in a circular path
        orbitTl
          .to(chatButtonRef.current, {
            duration: orbitDuration,
            ease: "none",
            onUpdate: function() {
              const progress = this.progress();
              const angle = progress * Math.PI * 2; 
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              
              // Apply the calculated position
              gsap.set(chatButtonRef.current, {
                x: x,
                y: y
              });
            }
          });
        break;
        
      case 'none':
      default:
        // No animation needed, already reset above
        break;
    }

    return () => {
      gsap.killTweensOf(chatButtonRef.current);
    };
  }, [chatbotConfig.chatButton.animation, chatbotOpen, chatbotConfig.appearance.primaryColor]);

  // Main render
  return (
    <Box sx={{ 
      p: 3, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Welcome banner for users coming from onboarding */}
      {showWelcomeBanner && (
        <Box
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.primary.light,
            color: theme.palette.getContrastText(theme.palette.primary.light),
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'inherit',
              opacity: 0.7,
              '&:hover': { opacity: 1 }
            }}
            onClick={() => setShowWelcomeBanner(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          
          <Typography variant="h6" gutterBottom>
            🎉 Welcome to the Chatbot Builder!
          </Typography>
          <Typography variant="body1">
            This is where you can customize your chatbot. Start by changing colors and appearance, then configure your bot's behavior. When you're ready, generate the code to embed it on your website!
          </Typography>
        </Box>
      )}
      
      {/* Add breadcrumb navigation */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          Dashboard &gt; Chatbot Builder
        </Typography>
      </Box>
      
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Chatbot Builder
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Customize your chatbot appearance, behavior, and messaging, then generate the embed code.
      </Typography>
      
      {/* Main Split Layout - Enhanced side-by-side positioning */}
      <Grid 
        container 
        spacing={3} 
        className="chatbot-preview-grid"
        sx={{ 
          mt: 1,
          flexGrow: 1,
          height: isMobile ? 'auto' : 'calc(100% - 100px)',
          display: 'flex',
          flexWrap: 'nowrap', // Prevent wrapping to ensure true side-by-side
          flexDirection: isMobile ? 'column' : 'row' // Stack on mobile, side-by-side on desktop
        }}
      >
        {/* Left Panel - Customization */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          className="customization-panel-fixed"
          sx={{ 
            height: isMobile ? 'auto' : '100%',
            pb: 2,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: isMobile ? 'auto' : 'calc(100vh - 150px)',
            width: isMobile ? '100%' : '50%', // Explicit width control
            flexShrink: 0, // Prevent shrinking
            overflowX: 'hidden' // Prevent horizontal overflow
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Mobile Tabs View */}
            {isMobile && renderMobileTabs()}
            
            {/* Desktop Accordion View */}
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: 'auto',
              pr: 1,
              mr: -1
            }}>
              {!isMobile && sections.map((section) => (
                <Accordion 
                  key={section.id}
                  expanded={!isMobile && expandedSections[section.id]}
                  onChange={() => handleToggleSection(section.id)}
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
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Panel - Preview */}
        <Grid 
          item 
          xs={12} 
          md={6}
          sx={{ 
            height: isMobile ? '600px' : 'calc(100vh - 100px)',
            position: isMobile ? 'relative' : 'sticky',
            top: 24,
            alignSelf: 'flex-start',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            width: isMobile ? '100%' : '50%', // Explicit width control
            flexShrink: 0, // Prevent shrinking
            overflowX: 'hidden' // Prevent horizontal overflow
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              bgcolor: theme.palette.mode === 'dark' ? '#1A1C2E' : '#F7F9FC',
              backgroundImage: `${theme.palette.mode === 'dark' 
                ? 'linear-gradient(45deg, #1A1C2E 25%, #20223A 25%, #20223A 50%, #1A1C2E 50%, #1A1C2E 75%, #20223A 75%, #20223A 100%)' 
                : 'linear-gradient(45deg, #F7F9FC 25%, #FFFFFF 25%, #FFFFFF 50%, #F7F9FC 50%, #F7F9FC 75%, #FFFFFF 75%, #FFFFFF 100%)'
              }`,
              backgroundSize: '40px 40px',
              overflow: 'hidden',
              maxWidth: '100%'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2,
              width: '100%' // Ensure header spans full width
            }}>
              <Typography variant="h6">
                Live Preview
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={copyEmbedCode}
                startIcon={<CopyIcon />}
                size="small"
                sx={{ whiteSpace: 'nowrap' }}
              >
                Generate Code
              </Button>
            </Box>
            
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
                overflow: 'hidden',
                minHeight: isMobile ? '450px' : '550px', // Increased height
                height: '100%',
                width: '100%' // Ensure full width
              }}
            >
              {/* Example website content - Make more representative of a real site */}
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Make the dummy website content more realistic */}
                <Box sx={{ 
                  maxWidth: '80%', 
                  width: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3
                }}>
                  <Typography variant="h5" color="text.primary" fontWeight="bold" textAlign="center">
                    Example Website Content
                  </Typography>
                  
                  <Box sx={{ 
                    width: '100%', 
                    height: '40px', 
                    bgcolor: 'rgba(0,0,0,0.05)', 
                    borderRadius: 1,
                    mb: 2
                  }}/>
                  
                  <Box sx={{ 
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    gap: 2,
                    justifyContent: 'center'
                  }}>
                    {[1, 2, 3].map(i => (
                      <Box 
                        key={i}
                        sx={{ 
                          width: '150px', 
                          height: '120px', 
                          bgcolor: 'rgba(0,0,0,0.05)', 
                          borderRadius: 1 
                        }}
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ 
                    width: '100%', 
                    height: '20px', 
                    bgcolor: 'rgba(0,0,0,0.05)', 
                    borderRadius: 1,
                    mt: 1
                  }}/>
                </Box>
              </Box>
              
              {/* Chatbot Preview Container */}
              <Box 
                ref={chatbotPreviewRef}
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20, // Add left padding to container we could try soemthing else but 
                  right: 20,
                  '--primary-color': chatbotConfig.appearance.primaryColor,
                  '--accent-color': chatbotConfig.appearance.accentColor,
                  '--background-color': chatbotConfig.appearance.backgroundColor,
                  '--border-radius': `${chatbotConfig.appearance.borderRadius}px`,
                  fontFamily: chatbotConfig.appearance.font,
                  maxHeight: 'calc(100% - 40px)',
                  width: 'calc(100% - 40px)', // Full width minus padding
                  height: 'calc(100% - 40px)', // Full height minus padding
                  zIndex: 1,
                  pointerEvents: 'none' // Allow clicking through container except on interactive elements
                }}
              >
                {/* Chat Button/Bubble - Position based on config */}
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    zIndex: 1,
                    position: 'absolute',
                    transition: 'box-shadow 0.3s',
                    bottom: 0,
                    top: 'auto',
                    left: chatbotConfig.chatButton.position === 'bottom-left' ? 0 : 'auto',
                    right: chatbotConfig.chatButton.position === 'bottom-right' ? 0 : 'auto',
                    pointerEvents: 'auto',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
                    },
                  }}
                >
                  {renderChatButtonIcon()}
                </Box>

                {/* Chat button label as separate element - not affected by animations */}
                {!chatbotOpen && chatbotConfig.chatButton.showLabel && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 17, // Fixed position at the middle of the chat button
                      left: chatbotConfig.chatButton.position === 'bottom-left' ? 70 : 'auto',
                      right: chatbotConfig.chatButton.position === 'bottom-right' ? 70 : 'auto',
                      px: chatbotConfig.chatButton.labelSize === 'small' ? 1 : chatbotConfig.chatButton.labelSize === 'large' ? 2.5 : 1.5,
                      py: chatbotConfig.chatButton.labelSize === 'small' ? 0.3 : chatbotConfig.chatButton.labelSize === 'large' ? 0.8 : 0.5,
                      bgcolor: `rgba(${hexToRgb(chatbotConfig.chatButton.labelBgColor || '#FFFFFF')}, ${chatbotConfig.chatButton.labelBgOpacity / 100})`,
                      // Ensure text color has a fallback and never fully transparent
                      color: `rgba(${hexToRgb(chatbotConfig.chatButton.labelTextColor || '#000000')}, ${Math.max(0.5, chatbotConfig.chatButton.labelTextOpacity / 100)})`,
                      borderRadius: (() => {
                        switch(chatbotConfig.chatButton.labelShape) {
                          case 'pill': return 24;
                          case 'rectangle': return 1;
                          case 'slanted': return 0; // No border radius for slanted shape
                          case 'rounded':
                          default: return 2;
                        }
                      })(),
                      fontSize: chatbotConfig.chatButton.labelSize === 'small' ? 12 : chatbotConfig.chatButton.labelSize === 'large' ? 16 : 14,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      fontFamily: chatbotConfig.appearance.font,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      zIndex: 2,
                      border: '1px solid',
                      borderColor: 'rgba(0,0,0,0.12)', // Consistent border color for visibility
                      pointerEvents: 'none',
                      minWidth: chatbotConfig.chatButton.labelSize === 'small' ? '70px' : chatbotConfig.chatButton.labelSize === 'large' ? '120px' : '90px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // Apply transform for slanted/rhombus shape
                      ...(chatbotConfig.chatButton.labelShape === 'slanted' && {
                        transform: 'skew(-15deg)',
                        '& > *': {
                          transform: 'skew(15deg)' // Counter-transform the content to keep it straight
                        }
                      })
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        color: 'inherit',
                        textShadow: chatbotConfig.chatButton.labelBgOpacity < 70 ? '0 1px 1px rgba(0,0,0,0.3)' : 'none',
                      }}
                    >
                      {chatbotConfig.chatButton.label}
                    </Typography>
                  </Box>
                )}
                
                {/* Chat Window - Adjust position based on button position */}
                <Box
                  ref={chatWindowRef}
                  sx={{
                    position: 'absolute',
                    bottom: 70,
                    // Dynamically position chat window based on button position
                    left: chatbotConfig.chatButton.position === 'bottom-left' ? 0 : 'auto',
                    right: chatbotConfig.chatButton.position === 'bottom-right' ? 0 : 'auto',
                    // For bottom-left position, we need to ensure it doesn't overflow the container
                    ...(chatbotConfig.chatButton.position === 'bottom-left' && {
                      maxWidth: '100%',
                    }),
                    width: 320,
                    height: 450,
                    minHeight: 450,
                    maxHeight: 450,
                    backgroundColor: 'var(--background-color)',
                    borderRadius: 'var(--border-radius)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    display: 'none', // Initially hidden
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 0,
                    pointerEvents: 'auto' // Ensure chat window is interactive
                  }}
                >
                  {/* Chat Header */}
                  <Box
                    sx={{
                      backgroundColor: 'var(--primary-color)',
                      color: '#fff',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: chatbotConfig.appearance.font
                    }}
                  >
                    {chatbotConfig.appearance.avatarUrl && (
                      <Box
                        component="img"
                        className="chat-header-avatar"
                        src={chatbotConfig.appearance.avatarUrl}
                        alt="Avatar"
                        sx={{ 
                          height: 32,
                          width: 32,
                          borderRadius: '50%',
                          marginRight: 1.5,
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <Typography variant="subtitle1" fontWeight="medium" sx={{ fontFamily: 'inherit' }}>
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
                      flexDirection: 'column',
                      fontFamily: chatbotConfig.appearance.font
                    }}
                  >
                    {mockConversation.map((msg, index) => (
                      <Box
                        key={index}
                        sx={{
                          alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                          maxWidth: '75%',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'flex-start'
                        }}
                      >
                        {msg.isBot && chatbotConfig.appearance.avatarUrl && (
                          <Box
                            component="img"
                            className="chat-message-avatar"
                            src={chatbotConfig.appearance.avatarUrl}
                            alt="Bot Avatar"
                            sx={{ 
                              height: 24,
                              width: 24,
                              borderRadius: '50%',
                              marginRight: 1,
                              objectFit: 'cover',
                              marginTop: 0.5
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            p: 1.5,
                            px: 2,
                            backgroundColor: msg.isBot 
                              ? '#f0f0f0' 
                              : msg.isBot === false ? 'var(--primary-color)' : 'var(--accent-color)',
                            color: msg.isBot ? 'rgba(0, 0, 0, 0.87)' : '#FFFFFF', // Explicit colors for better visibility
                            borderRadius: (() => {
                              switch(chatbotConfig.appearance.bubbleShape) {
                                case 'pill': return 18;
                                case 'rectangle': return 'var(--border-radius)';
                                case 'rounded': return '8px';
                                case 'bubble': 
                                  return msg.isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px';
                                case 'angled': 
                                  return msg.isBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px';
                                default: return 18;
                              }
                            })(),
                            ...(chatbotConfig.appearance.bubbleShape === 'bubble' && {
                              borderBottomLeftRadius: msg.isBot ? 4 : 18,
                              borderBottomRightRadius: msg.isBot ? 18 : 4,
                            }),
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'inherit', 
                              // Ensure high contrast text
                              color: 'inherit',
                              fontWeight: msg.isBot ? 400 : 500, // Make user messages slightly bolder
                              textShadow: msg.isBot ? 'none' : '0 1px 1px rgba(0,0,0,0.1)' // Add slight shadow to user text for better readability
                            }}
                          >
                            {msg.text}
                          </Typography>
                        </Box>
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
                          borderRadius: (() => {
                            switch(chatbotConfig.appearance.bubbleShape) {
                              case 'pill': return 18;
                              case 'rectangle': return 'var(--border-radius)';
                              case 'rounded': return '8px';
                              case 'bubble': return '18px 18px 18px 4px';
                              case 'angled': return '4px 18px 18px 18px';
                              default: return 18;
                            }
                          })(),
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
                              backgroundColor: 'var(--accent-color)',
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
                              backgroundColor: 'var(--accent-color)',
                              animation: 'bounce 1s infinite ease-in-out',
                              animationDelay: '0.1s'
                            }}
                          />
                          <Box 
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'var(--accent-color)',
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
                        borderColor: 'divider',
                        fontFamily: chatbotConfig.appearance.font
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
                            borderColor: 'var(--accent-color)',
                            color: 'var(--accent-color)',
                            fontFamily: 'inherit',
                            fontWeight: 500, // Slightly bolder for better visibility
                            '&:hover': {
                              backgroundColor: 'rgba(var(--accent-color-rgb), 0.1)'
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
                      display: 'flex',
                      fontFamily: chatbotConfig.appearance.font
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
                      InputProps={{
                        style: { fontFamily: chatbotConfig.appearance.font }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 'var(--border-radius)',
                          fontFamily: 'inherit',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.23)'  // Default border color
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--primary-color)'  // Hover border color
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--primary-color)'  // Focused border color
                          }
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        ml: 1,
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: 'var(--border-radius)',
                        fontFamily: 'inherit'
                      }}
                      onClick={handleSendMessage}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            {/* Preview Controls - Simplified to just show Generate Code button */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
              {/* Remove the separate Open/Close Chat button since it's now in the preview */}
              <Button
                variant="contained"
                color="primary"
                onClick={copyEmbedCode}
                startIcon={<CopyIcon />}
                fullWidth={isMobile}
                sx={{ maxWidth: '300px' }}
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
            
            {/* Add Background Color Option */}
            <Box>
              <Typography variant="body2" gutterBottom>Background Color</Typography>
              <Box 
                onClick={() => {
                  setColorPickerTarget('background');
                  setShowColorPicker(true);
                }}
                sx={{ 
                  height: 36, 
                  borderRadius: 1, 
                  backgroundColor: chatbotConfig.appearance.backgroundColor,
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
                <ColorIcon sx={{ color: theme.palette.getContrastText(chatbotConfig.appearance.backgroundColor) }} />
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
            
            {/* Add Open Animation Option */}
            <FormControl fullWidth>
              <InputLabel>Open Animation</InputLabel>
              <Select
                value={chatbotConfig.appearance.openAnimation}
                onChange={(e) => handleConfigChange('appearance', 'openAnimation', e.target.value)}
                label="Open Animation"
              >
                <MenuItem value="fade">Fade In</MenuItem>
                <MenuItem value="slide">Slide Up</MenuItem>
                <MenuItem value="scale">Scale</MenuItem>
                <MenuItem value="bounce">Bounce</MenuItem>
                <MenuItem value="flip">Flip</MenuItem>
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Animation effect when opening the chat window
              </Typography>
            </FormControl>
            
            {/* New: Bubble Icon Selection */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Chat Button Icon
              </Typography>
              <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                {Object.keys(BUTTON_ICONS).map((key) => {
                  const IconComponent = (() => {
                    switch(key) {
                      case 'chatFilled': return ChatFilledIcon;
                      case 'chatBubble': return ChatBubbleIcon;
                      case 'question': return QuestionAnswerIcon;
                      case 'headset': return HeadsetMicIcon;
                      case 'message': return MessageIcon;
                      case 'forum': return ForumIcon;
                      case 'support': return ContactSupportIcon;
                      case 'supportAgent': return SupportAgentIcon;
                      case 'whatsapp': return WhatsAppIcon;
                      case 'sms': return SmsIcon;
                      case 'mail': return MailIcon;
                      case 'phone': return PhoneIcon;
                      case 'smartphone': return SmartphoneIcon;
                      case 'notifications': return NotificationsIcon;
                      case 'info': return InfoIcon;
                      case 'emoji': return EmojiIcon;
                      case 'chat':
                      default: return ChatIcon;
                    }
                  })();
                  
                  const isSelected = chatbotConfig.appearance.bubbleIcon === key;
                  
                  return (
                    <Grid item key={key}>
                      <Box
                        onClick={() => handleConfigChange('appearance', 'bubbleIcon', key)}
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: isSelected ? 
                            'var(--primary-color)' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                          color: isSelected ? '#fff' : 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: `2px solid ${isSelected ? 
                            'var(--primary-color)' : 'transparent'}`,
                          boxShadow: isSelected ? `0 0 0 2px ${theme.palette.background.paper}` : 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: isSelected ? 
                              'var(--primary-color)' : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.09)',
                            transform: 'scale(1.05)'
                          }
                        }}
                      >
                        <IconComponent sx={{ 
                          fontSize: 24,
                          // Add slight shadow to make icons more visible on all backgrounds
                          filter: isSelected ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' : 'none'
                        }} />
                      </Box>
                      {isSelected && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            textAlign: 'center',
                            mt: 0.5,
                            fontWeight: 'medium',
                            color: 'var(--primary-color)'
                          }}
                        >
                          ✓
                        </Typography>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
            
            {/* New: Bubble Icon Size Selection */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Icon Size</FormLabel>
              <RadioGroup
                row
                value={chatbotConfig.appearance.bubbleIconSize}
                onChange={(e) => handleConfigChange('appearance', 'bubbleIconSize', e.target.value)}
              >
                <FormControlLabel value="small" control={<Radio />} label="Small" />
                <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                <FormControlLabel value="large" control={<Radio />} label="Large" />
              </RadioGroup>
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
                <FormControlLabel value="rounded" control={<Radio />} label="Rounded" />
                <FormControlLabel value="bubble" control={<Radio />} label="Bubble" />
                <FormControlLabel value="angled" control={<Radio />} label="Angled" />
              </RadioGroup>
            </FormControl>
            
            <Box>
              <Typography variant="body2" gutterBottom>Avatar Image</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button variant="outlined" component="label" size="small">
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      
                      if (file.size > 500 * 1024) { // Limit to 500KB
                        alert("Image is too large. Please select an image smaller than 500KB.");
                        return;
                      }
                      
                      // Create a fixed-size processing method
                      const processImage = (originalDataUrl) => {
                        return new Promise((resolve) => {
                          const img = new Image();
                          img.onload = () => {
                            // Create small fixed-size canvas (48x48px)
                            const canvas = document.createElement('canvas');
                            canvas.width = 48; 
                            canvas.height = 48;
                            const ctx = canvas.getContext('2d');
                            
                            // Fill with background color first
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            
                            // Calculate crop dimensions (square)
                            let sourceX = 0, sourceY = 0, sourceW = img.width, sourceH = img.height;
                            
                            if (img.width > img.height) {
                              sourceX = (img.width - img.height) / 2;
                              sourceW = img.height;
                            } else {
                              sourceY = (img.height - img.width) / 2;
                              sourceH = img.width;
                            }
                            
                            // Draw cropped image onto fixed-size canvas
                            ctx.drawImage(
                              img, 
                              sourceX, sourceY, sourceW, sourceH,
                              0, 0, canvas.width, canvas.height
                            );
                            
                            // Get highly compressed image
                            resolve(canvas.toDataURL('image/jpeg', 0.6));
                          };
                          img.src = originalDataUrl;
                        });
                      };
                      
                      // Process the file
                      const reader = new FileReader();
                      reader.onload = async (e) => {
                        // Get fixed-size image
                        const resizedImage = await processImage(e.target.result);
                        
                        // Update state
                        handleConfigChange('appearance', 'avatarUrl', resizedImage);
                        
                        // Update preview directly (with animation lock)
                        if (chatbotOpen && chatWindowRef.current) {
                          // Make sure layout doesn't shift during update
                          chatWindowRef.current.style.transition = 'none';
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </Button>
                
                {chatbotConfig.appearance.avatarUrl && (
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => {
                      // Remove the avatar without causing layout shifts
                      if (chatbotOpen && chatWindowRef.current) {
                        chatWindowRef.current.style.transition = 'none';
                      }
                      handleConfigChange('appearance', 'avatarUrl', '');
                    }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
              
              {chatbotConfig.appearance.avatarUrl && (
                <Box 
                  component="img"
                  src={chatbotConfig.appearance.avatarUrl}
                  alt="Avatar Preview"
                  sx={{ 
                    display: 'block',
                    mt: 1,
                    height: 48,
                    width: 48,
                    minWidth: 48,
                    maxWidth: 48,
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: 'divider',
                    backgroundColor: '#f0f0f0'
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
                <MenuItem value="wiggle">Wiggle</MenuItem>
                <MenuItem value="spin">Spin</MenuItem>
                <MenuItem value="heartbeat">Heartbeat</MenuItem>
                <MenuItem value="float">Floating</MenuItem>
                <MenuItem value="tadpole">Tadpole</MenuItem>
                <MenuItem value="glowing">Glowing</MenuItem>
                <MenuItem value="jump">Jump & Flip</MenuItem>
                <MenuItem value="shake">Attention Shake</MenuItem>
                <MenuItem value="orbit">Orbit</MenuItem>
              </Select>
            </FormControl>
            
            <Divider sx={{ my: 1 }}>Button Label</Divider>
            
            <TextField
              fullWidth
              label="Chat Button Label"
              value={chatbotConfig.chatButton.label}
              onChange={(e) => handleConfigChange('chatButton', 'label', e.target.value)}
              helperText="Text shown next to the chat button"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={chatbotConfig.chatButton.showLabel}
                  onChange={(e) => handleConfigChange('chatButton', 'showLabel', e.target.checked)}
                />
              }
              label="Show button label"
            />
            
            {chatbotConfig.chatButton.showLabel && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Label Shape</InputLabel>
                  <Select
                    value={chatbotConfig.chatButton.labelShape}
                    onChange={(e) => handleConfigChange('chatButton', 'labelShape', e.target.value)}
                    label="Label Shape"
                  >
                    <MenuItem value="rounded">Rounded</MenuItem>
                    <MenuItem value="pill">Pill</MenuItem>
                    <MenuItem value="rectangle">Rectangle</MenuItem>
                    <MenuItem value="slanted">Slanted (Rhombus)</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel>Label Size</InputLabel>
                  <Select
                    value={chatbotConfig.chatButton.labelSize}
                    onChange={(e) => handleConfigChange('chatButton', 'labelSize', e.target.value)}
                    label="Label Size"
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    <Typography variant="body2" gutterBottom>Label Background</Typography>
                    <Box 
                      onClick={() => {
                        setColorPickerTarget('labelBg');
                        setShowColorPicker(true);
                      }}
                      sx={{ 
                        height: 36, 
                        borderRadius: 1, 
                        backgroundColor: chatbotConfig.chatButton.labelBgColor || '#FFFFFF',
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
                      <ColorIcon sx={{ color: theme.palette.getContrastText(chatbotConfig.chatButton.labelBgColor || '#FFFFFF') }} />
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    <Typography variant="body2" gutterBottom>Label Text Color</Typography>
                    <Box 
                      onClick={() => {
                        setColorPickerTarget('labelText');
                        setShowColorPicker(true);
                      }}
                      sx={{ 
                        height: 36, 
                        borderRadius: 1, 
                        backgroundColor: chatbotConfig.chatButton.labelTextColor || '#000000',
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
                      <ColorIcon sx={{ color: theme.palette.getContrastText(chatbotConfig.chatButton.labelTextColor || '#000000') }} />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Background Opacity: {chatbotConfig.chatButton.labelBgOpacity}%
                  </Typography>
                  <Slider
                    value={chatbotConfig.chatButton.labelBgOpacity}
                    onChange={(e, value) => handleConfigChange('chatButton', 'labelBgOpacity', value)}
                    min={0}
                    max={100}
                    step={5}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Text Opacity: {chatbotConfig.chatButton.labelTextOpacity}%
                  </Typography>
                  <Slider
                    value={chatbotConfig.chatButton.labelTextOpacity}
                    onChange={(e, value) => handleConfigChange('chatButton', 'labelTextOpacity', value)}
                    min={0}
                    max={100}
                    step={5}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                  />
                </Box>
              </>
            )}
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
      
      case 'advanced':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Custom Domain Integration"
              placeholder="yourdomain.com"
              onChange={(e) => handleConfigChange('advanced', 'domain', e.target.value)}
              value={chatbotConfig.advanced.domain}
              helperText="Optional: Limit chatbot to specific domains"
            />
            
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
            
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={chatbotConfig.advanced.language}
                onChange={(e) => handleConfigChange('advanced', 'language', e.target.value)}
                label="Language"
              >
                <MenuItem value="pt">Portuguese</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      
      default:
        return null;
    }
  }

  // Update this useEffect to load saved appearance, button, AND greeting settings from onboarding
  useEffect(() => {
    // Check if we have saved settings from onboarding
    const savedAppearance = localStorage.getItem('chatbotAppearance');
    const savedButtonSettings = localStorage.getItem('chatbotButton');
    const savedGreetingSettings = localStorage.getItem('chatbotGreetings');
    
    // Apply appearance settings if they exist
    if (savedAppearance) {
      try {
        const parsedSettings = JSON.parse(savedAppearance);
        
        // Apply saved appearance settings to chatbot configuration
        setChatbotConfig(prev => ({
          ...prev,
          appearance: {
            ...prev.appearance,
            primaryColor: parsedSettings.primaryColor || prev.appearance.primaryColor,
            font: parsedSettings.font || prev.appearance.font,
            borderRadius: parsedSettings.borderRadius || prev.appearance.borderRadius,
          }
        }));
      } catch (error) {
        console.error("Error parsing saved appearance settings:", error);
      }
    }
    
    // Apply button settings if they exist
    if (savedButtonSettings) {
      try {
        const parsedButtonSettings = JSON.parse(savedButtonSettings);
        
        // Apply saved button settings to chatbot configuration
        setChatbotConfig(prev => ({
          ...prev,
          chatButton: {
            ...prev.chatButton,
            position: parsedButtonSettings.position || prev.chatButton.position,
            icon: parsedButtonSettings.icon || prev.chatButton.icon,
            animation: parsedButtonSettings.hoverEffect || prev.chatButton.animation,
          },
          appearance: {
            ...prev.appearance,
            bubbleIcon: parsedButtonSettings.icon || prev.appearance.bubbleIcon,
            // Apply square shape if selected
            borderRadius: parsedButtonSettings.shape === 'square' ? 4 : prev.appearance.borderRadius,
          }
        }));
      } catch (error) {
        console.error("Error parsing saved button settings:", error);
      }
    }
    
    // Apply greeting settings if they exist
    if (savedGreetingSettings) {
      try {
        const parsedGreetingSettings = JSON.parse(savedGreetingSettings);
        
        // Apply saved greeting settings to chatbot configuration
        setChatbotConfig(prev => ({
          ...prev,
          greetings: {
            ...prev.greetings,
            welcomeMessage: parsedGreetingSettings.welcomeMessage || prev.greetings.welcomeMessage,
            faqOptions: parsedGreetingSettings.questions || prev.greetings.faqOptions,
          }
        }));
        
        // Show a success notification if any setting was loaded
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error parsing saved greeting settings:", error);
      }
    }
  }, []);

};

// Helper function to convert hex color to RGB values
const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert 3-character hex to 6-character equivalent
 
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return as comma-separated string for CSS rgba()
  return `${r}, ${g}, ${b}`;
};

// Add a utility function to ensure text is readable on any background color
const ensureTextContrast = (bgColor) => {
  // If no background color provided, return white as a safe default
  if (!bgColor) return '#FFFFFF';
  
  // Convert hex to RGB
  const rgb = hexToRgb(bgColor).split(', ').map(Number);
  
  // Calculate relative luminance using WCAG formula
  // https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export default ChatbotBuilder;
