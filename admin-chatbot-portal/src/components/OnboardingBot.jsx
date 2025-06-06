import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Stack,
  Chip,
  Card,
  InputAdornment,
  Tooltip,
  useTheme,
  alpha,
  Dialog,
  DialogContent,
  DialogActions,
  Switch,
    Avatar,
  Popover,
  Grid,
} from "@mui/material";
import {
  SmartToy as SmartToyIcon,
  ColorLens as ColorLensIcon,
  ChatBubble as ChatBubbleIcon,
  Message as MessageIcon,
  Psychology as PsychologyIcon,
  MenuBook as KnowledgeIcon,
  Code as CodeIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Mail as MailIcon,
  FormatColorFill as ColorIcon,
  Save as SaveIcon,
  RestartAlt as RestartIcon,
  Celebration as CelebrationIcon,
  Add as AddIcon,
  FileUpload as UploadIcon,
  Description as PdfIcon,
  InsertDriveFile as DocIcon,
} from "@mui/icons-material";
import Confetti from "react-confetti";

gsap.registerPlugin(MotionPathPlugin);

const steps = [
  { label: "Appearance", icon: <ColorLensIcon /> },
  { label: "Chat Button", icon: <ChatBubbleIcon /> },
  { label: "Greetings", icon: <MessageIcon /> },
  { label: "Behavior", icon: <PsychologyIcon /> },
  { label: "Knowledge", icon: <KnowledgeIcon /> },
  { label: "Install", icon: <CodeIcon /> },
];

const glassStyles = {
  background: "rgba(30, 30, 40, 0.6)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const predefinedColors = [
  "#7C3AED",
  "#2563EB",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#EC4899",
  "#6B7280",
  "#000000",
];

const OnboardingBot = ({ onCompleteOnboarding }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [iconClicked, setIconClicked] = useState(false);
  const [showBotIcon, setShowBotIcon] = useState(false);
  const [showBotSpeech, setShowBotSpeech] = useState(false);
  const botIconRef = useRef(null);
  const [isReturning, setIsReturning] = useState(false);
  const animationTimeline = useRef(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  // Remove finalTransform, add finalPosition
  const [finalPosition, setFinalPosition] = useState({ x: 0, y: 0, scale: 1 });
  
  // Main onboarding state
  const [settings, setSettings] = useState({
    primaryColor: "#7C3AED",
    font: "Inter",
    theme: "light",
    borderRadius: 12,
    buttonPosition: "bottom-right",
    buttonShape: "circle",
    buttonIcon: "chat",
    buttonAnimation: "pulse",
    welcomeMessage: "Hi! How can I help you today?",
    suggestedQuestions: [
      "How do I get started?",
      "What features do you offer?",
      "Can you help me troubleshoot?",
    ],
    confidenceThreshold: 70,
    decayFactor: 0.5,
    logProbFilter: 0.3,
    fallbackMessage: "I'm not sure about that. Would you like to talk to a human?",
    testQuestion: "",
    testResponse: "",
    knowledgeSources: {
      documents: [],
      websites: [],
      faqs: [],
    },
    botName: "My Assistant",
    previewTheme: "light",
  });

  // Show the onboarding icon with animation after 1s on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowBotIcon(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize GSAP animation when icon appears
  useEffect(() => {
    if (showBotIcon && botIconRef.current && !modalOpen && !iconClicked && !isReturning) {
      // Kill any existing animations
      if (animationTimeline.current) {
        animationTimeline.current.kill();
      }
      
      // Initial animation bringing the bot into view
      animationTimeline.current = gsap.timeline();
      animationTimeline.current.fromTo(botIconRef.current, 
        { 
          opacity: 0, 
          scale: 0.5,
          y: 80
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        }
      ).to(botIconRef.current, {
        scale: 1.05,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    return () => {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
      }
    };
  }, [showBotIcon, modalOpen, iconClicked, isReturning]);

  // Handle the icon click animation with GSAP and motion path
  useEffect(() => {
    if (iconClicked && botIconRef.current && !isReturning) {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
      }
      
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;
      
      // Calculate target position
      const targetX = -screenWidth/2 + 80;
      const targetY = -screenHeight/2 + 170;
      
      // Use motionPath for smoother animation
      animationTimeline.current = gsap.timeline();
      animationTimeline.current.to(botIconRef.current, {
        duration: 1.5,
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: targetX/2, y: targetY/1.5 },
            { x: targetX, y: targetY }
          ],
          curviness: 1.5,
          autoRotate: false
        },
        scale: 1.6,
        rotation: 720,
        ease: "power2.inOut",
        onComplete: () => {
          // Add a slight bounce effect
          gsap.to(botIconRef.current, {
            y: "+=20",
            duration: 0.15,
            repeat: 1,
            yoyo: true,
            ease: "power4.out",
            onComplete: () => {
              setShowBotSpeech(true);
              // Save the final position
              setFinalPosition({ 
                x: targetX, 
                y: targetY, 
                scale: 1.6 
              });
            }
          });
        }
      });
    }
  }, [iconClicked, isReturning]);

  // Handle modal close - Final animation
  useEffect(() => {
    if (!modalOpen && showBotIcon === false && botIconRef.current && !onboardingComplete) {
      // Show the bot at its final position after modal closes
      setShowBotIcon(true);
      setIsReturning(true);
      setIconClicked(false);
      setShowBotSpeech(false);

      setTimeout(() => {
        if (botIconRef.current) {
          // Kill any existing animations
          if (animationTimeline.current) {
            animationTimeline.current.kill();
          }
          // No need to animate back, just keep the icon at the finalTransform
        }
      }, 300);
    }
  }, [modalOpen, showBotIcon, onboardingComplete, showCompletionDialog]);

  // Modified function to handle onboarding completion
  const handleFinalOnboarding = () => {
    localStorage.setItem("onboardingComplete", "true");
    localStorage.removeItem("onboardingProgress");
    setShowCompletionDialog(false);
    setModalOpen(false);
    setOnboardingComplete(true);

    // Delay the completion callback to allow the animation to play
    setTimeout(() => {
      onCompleteOnboarding && onCompleteOnboarding();
    }, 1000);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem("onboardingProgress");
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setActiveStep(progress.step || 0);
        setSettings((prev) => ({ ...prev, ...progress.settings }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "onboardingProgress",
      JSON.stringify({ step: activeStep, settings })
    );
  }, [activeStep, settings]);

  useEffect(() => {
    if (settings.testQuestion.trim()) {
      setTimeout(() => {
        let response;
        const confidenceScore = Math.random() * 100;
        if (confidenceScore > settings.confidenceThreshold) {
          response = `Based on my knowledge, I'd recommend checking our documentation section on this topic. The confidence score for this answer is ${confidenceScore.toFixed(1)}%.`;
        } else {
          response = settings.fallbackMessage;
        }
        setSettings((prev) => ({ ...prev, testResponse: response }));
      }, 1000);
    }
  }, [
    settings.testQuestion,
    settings.confidenceThreshold,
    settings.fallbackMessage,
  ]);

  // Color picker handlers
  const handleColorClick = (event) => setColorAnchorEl(event.currentTarget);
  const handleColorClose = () => setColorAnchorEl(null);
  const colorPickerOpen = Boolean(colorAnchorEl);

  // Modal open/close
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    // We don't immediately show the bot here
    // The useEffect for !modalOpen will handle showing it
  };

  // Step navigation
  const handleNext = () => {
    setActiveStep((prev) => {
      const next = prev + 1;
      if (next >= steps.length) {
        setShowCompletionDialog(true);
        setShowConfetti(true);
      }
      return next < steps.length ? next : prev;
    });
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleSkipStep = () => handleNext();

  // Completion
  const handleFinishOnboarding = () => {
    setShowCompletionDialog(true);
    setShowConfetti(true);
  };

  // Embed code
  const generateEmbedCode = () => {
    // ...existing code...
    return `<!-- Chatbot Embed Code -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['ChatbotWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments}};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','chatbot','https://cdn.chatbot.com/widget.js'));
  chatbot('init', {
    primaryColor: '${settings.primaryColor}',
    position: '${settings.buttonPosition}',
    shape: '${settings.buttonShape}',
    icon: '${settings.buttonIcon}',
    animation: '${settings.buttonAnimation}',
    welcomeMessage: '${settings.welcomeMessage}',
    theme: '${settings.theme}',
    name: '${settings.botName}',
    borderRadius: ${settings.borderRadius},
    font: '${settings.font}',
    confidenceThreshold: ${settings.confidenceThreshold / 100},
    fallbackMessage: '${settings.fallbackMessage}'
  });
</script>`;
  };
  const copyEmbedCode = () => navigator.clipboard.writeText(generateEmbedCode());
  const emailEmbedCode = () => {
    const code = generateEmbedCode();
    const subject = encodeURIComponent("Your Chatbot Embed Code");
    const body = encodeURIComponent(`Here's your chatbot embed code:\n\n${code}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Customize Appearance
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Bot Name"
                variant="outlined"
                value={settings.botName}
                onChange={(e) =>
                  setSettings({ ...settings, botName: e.target.value })
                }
              />
              <Select
                value={settings.font}
                onChange={(e) =>
                  setSettings({ ...settings, font: e.target.value })
                }
                displayEmpty
                inputProps={{ "aria-label": "Select font" }}
              >
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Roboto">Roboto</MenuItem>
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Times New Roman">Times New Roman</MenuItem>
              </Select>
              <Select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({ ...settings, theme: e.target.value })
                }
                displayEmpty
                inputProps={{ "aria-label": "Select theme" }}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
              <Box>
                <Typography gutterBottom>Primary Color</Typography>
                <IconButton
                  onClick={handleColorClick}
                  sx={{
                    bgcolor: settings.primaryColor,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    "&:hover": {
                      bgcolor: settings.primaryColor,
                    },
                  }}
                />
                <Popover
                  open={colorPickerOpen}
                  anchorEl={colorAnchorEl}
                  onClose={handleColorClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <Box p={2}>
                    {predefinedColors.map((color) => (
                      <Chip
                        key={color}
                        onClick={() => {
                          setSettings({ ...settings, primaryColor: color });
                          handleColorClose();
                        }}
                        sx={{
                          bgcolor: color,
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          cursor: "pointer",
                          margin: "4px",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Popover>
              </Box>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        );
      case 1:
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Configure Chat Button
            </Typography>
            <Stack spacing={2}>
              <Select
                value={settings.buttonPosition}
                onChange={(e) =>
                  setSettings({ ...settings, buttonPosition: e.target.value })
                }
                displayEmpty
                inputProps={{ "aria-label": "Select button position" }}
              >
                <MenuItem value="bottom-right">Bottom Right</MenuItem>
                <MenuItem value="bottom-left">Bottom Left</MenuItem>
                <MenuItem value="top-right">Top Right</MenuItem>
                <MenuItem value="top-left">Top Left</MenuItem>
              </Select>
              <Select
                value={settings.buttonShape}
                onChange={(e) =>
                  setSettings({ ...settings, buttonShape: e.target.value })
                }
                displayEmpty
                inputProps={{ "aria-label": "Select button shape" }}
              >
                <MenuItem value="circle">Circle</MenuItem>
                <MenuItem value="square">Square</MenuItem>
                <MenuItem value="rounded">Rounded</MenuItem>
              </Select>
              <Select
                value={settings.buttonIcon}
                onChange={(e) =>
                  setSettings({ ...settings, buttonIcon: e.target.value })
                }
                displayEmpty
                inputProps={{ "aria-label": "Select button icon" }}
              >
                <MenuItem value="chat">Chat Icon</MenuItem>
                <MenuItem value="message">Message Icon</MenuItem>
                <MenuItem value="support">Support Icon</MenuItem>
              </Select>
              <Select
                value={settings.buttonAnimation}
                onChange={(e) =>
                  setSettings({ ...settings, buttonAnimation: e.target.value })
                }
                displayEmpty
                inputProps={{ "aria-label": "Select button animation" }}
              >
                <MenuItem value="pulse">Pulse</MenuItem>
                <MenuItem value="bounce">Bounce</MenuItem>
                <MenuItem value="shake">Shake</MenuItem>
              </Select>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        );
      case 2:
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Set Up Greetings
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Welcome Message"
                variant="outlined"
                value={settings.welcomeMessage}
                onChange={(e) =>
                  setSettings({ ...settings, welcomeMessage: e.target.value })
                }
              />
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        );
      case 3:
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Configure Behavior
            </Typography>
            <Stack spacing={2}>
              <Typography gutterBottom>Confidence Threshold</Typography>
              <Slider
                value={settings.confidenceThreshold}
                onChange={(e, newValue) =>
                  setSettings({ ...settings, confidenceThreshold: newValue })
                }
                aria-labelledby="confidence-threshold-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={100}
              />
              <Typography gutterBottom>Decay Factor</Typography>
              <Slider
                value={settings.decayFactor}
                onChange={(e, newValue) =>
                  setSettings({ ...settings, decayFactor: newValue })
                }
                aria-labelledby="decay-factor-slider"
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={0}
                max={1}
              />
              <Typography gutterBottom>Log Probability Filter</Typography>
              <Slider
                value={settings.logProbFilter}
                onChange={(e, newValue) =>
                  setSettings({ ...settings, logProbFilter: newValue })
                }
                aria-labelledby="log-probability-filter-slider"
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={0}
                max={1}
              />
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        );
      case 4:
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Knowledge Base Setup
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
              >
                Upload Document
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target.result;
                        setSettings((prev) => ({
                          ...prev,
                          knowledgeSources: {
                            ...prev.knowledgeSources,
                            documents: [
                              ...prev.knowledgeSources.documents,
                              { name: file.name, content },
                            ],
                          },
                        }));
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
              </Button>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddIcon />}
              >
                Add Website
                <input
                  type="text"
                  hidden
                  onBlur={(e) => {
                    const url = e.target.value;
                    if (url) {
                      setSettings((prev) => ({
                        ...prev,
                        knowledgeSources: {
                          ...prev.knowledgeSources,
                          websites: [...prev.knowledgeSources.websites, url],
                        },
                      }));
                    }
                  }}
                />
              </Button>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddIcon />}
              >
                Add FAQ
                <input
                  type="text"
                  hidden
                  onBlur={(e) => {
                    const faq = e.target.value;
                    if (faq) {
                      setSettings((prev) => ({
                        ...prev,
                        knowledgeSources: {
                          ...prev.knowledgeSources,
                          faqs: [...prev.knowledgeSources.faqs, faq],
                        },
                      }));
                    }
                  }}
                />
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        );
      case 5:
        return (
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Installation
            </Typography>
            <Stack spacing={2}>
              <Typography>
                To install the chatbot, add the following code to your website:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  borderRadius: 2,
                  borderColor: "primary.main",
                }}
              >
                <pre>
                  <code>{generateEmbedCode()}</code>
                </pre>
              </Paper>
              <Button
                variant="contained"
                onClick={handleFinishOnboarding}
                endIcon={<CheckIcon />}
              >
                Finish Onboarding
              </Button>
            </Stack>
          </Box>
        );
      default:
        return null;
    }
  };

  // Floating bot icon with fixed positioning
  const FloatingBotIcon = () => (
    <AnimatePresence>
      {showBotIcon && (
        <div
          ref={botIconRef}
          style={{
            position: "fixed",
            top: "calc(100vh - 100px)",
            left: "calc(100vw - 100px)",
            transform: isReturning ? 
              `translate(${finalPosition.x}px, ${finalPosition.y}px) scale(${finalPosition.scale})` : 
              "translate(0px, 0px)",
            zIndex: 1300,
            display: "inline-block",
            filter: isReturning ? "drop-shadow(0 0 8px rgba(124, 58, 237, 0.6))" : "none",
          }}
        >
          <IconButton
            onClick={() => !isReturning && setIconClicked(true)}
            sx={{
              width: 60,
              height: 60,
              bgcolor: settings.primaryColor,
              color: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              "&:hover": {
                bgcolor: settings.primaryColor,
              },
              fontSize: 32,
              transition: "box-shadow 0.3s ease",
              ...(isReturning && {
                boxShadow: `0 0 15px 5px ${settings.primaryColor}80`,
              }),
            }}
          >
            <SmartToyIcon sx={{ fontSize: 44 }} />
          </IconButton>
          
          {/* Speech bubble appears after animation */}
          <AnimatePresence>
            {showBotSpeech && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  left: isReturning ? "-340px" : "110%",
                  top: "10%",
                  zIndex: 1400,
                  minWidth: 260,
                  maxWidth: 340,
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    color: "text.primary",
                    fontSize: 18,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    mb: 1,
                    position: "relative",
                  }}
                >
                  {isReturning ? (
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      🎉 Your chatbot is all set up and ready to go!<br />
                      You'll be redirected to the dashboard shortly.
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      👋 Hi! I'm your onboarding assistant.<br />
                      I'll walk you through setting up your chatbot step by step.<br />
                      Click "Let's Start" to begin!
                    </Typography>
                  )}
                  <Box sx={{
                    position: "absolute",
                    left: -18,
                    top: 32,
                    width: 0,
                    height: 0,
                    borderTop: "10px solid transparent",
                    borderBottom: "10px solid transparent",
                    borderRight: `18px solid ${theme.palette.background.paper}`,
                    zIndex: 1,
                  }} />
                  {!isReturning && (
                    <Box sx={{ textAlign: "right", mt: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: settings.primaryColor }}
                        onClick={() => {
                          setModalOpen(true);
                          setShowBotIcon(false);
                          setShowBotSpeech(false);
                          setIconClicked(false);
                          if (animationTimeline.current) {
                            animationTimeline.current.kill();
                          }
                        }}
                      >
                        Let's Start
                      </Button>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );

  // Completion dialog
  const CompletionDialog = () => (
    <Dialog
      open={showCompletionDialog}
      onClose={() => setShowCompletionDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <Box p={3} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Onboarding Complete!
          </Typography>
          <Typography variant="body1" paragraph>
            You've successfully configured your chatbot. You can always revisit
            the settings to make changes or updates.
          </Typography>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={300}
            recycle={false}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleFinalOnboarding}
          color="primary"
          variant="contained"
          autoFocus
        >
          Go to Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <FloatingBotIcon />
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1200,
              backdropFilter: "blur(3px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
              style={{
                width: "90%",
                maxWidth: 1000,
                maxHeight: "90vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                ...glassStyles,
              }}
            >
              <Box
                p={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Typography variant="h6">Chatbot Onboarding</Typography>
                <IconButton
                  onClick={handleCloseModal}
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box p={3} flexGrow={1} overflow="auto">
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((step, index) => (
                    <Step key={index} completed={activeStep > index}>
                      <StepLabel
                        StepIconComponent={({ active, completed }) => {
                          const color = completed
                            ? settings.primaryColor
                            : active
                            ? "#fff"
                            : "rgba(255, 255, 255, 0.5)";
                          return (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: active
                                  ? settings.primaryColor
                                  : "transparent",
                                border:
                                  completed && !active
                                    ? `2px solid ${settings.primaryColor}`
                                    : "none",
                              }}
                            >
                              {completed ? (
                                <CheckIcon sx={{ color: "#fff", fontSize: 18 }} />
                              ) : (
                                <Typography
                                  variant="caption"
                                  sx={{ color, fontWeight: "medium" }}
                                >
                                  {index + 1}
                                </Typography>
                              )}
                            </Box>
                          );
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor:
                                activeStep === index
                                  ? settings.primaryColor
                                  : "transparent",
                              border:
                                activeStep > index
                                  ? `4px solid ${settings.primaryColor}`
                                  : "none",
                              position: "absolute",
                              top: 8,
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                activeStep === index
                                  ? "#fff"
                                  : "rgba(255, 255, 255, 0.7)",
                              fontWeight: activeStep === index ? "medium" : "regular",
                              mb: 0.5,
                            }}
                          >
                            {step.label}
                          </Typography>
                          </Box>
                        </StepLabel>
                      </Step>
                    ))}
                </Stepper>
                <Box py={3}>{getStepContent(activeStep)}</Box>
              </Box>
              <Box
                p={2}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  <ArrowBackIcon sx={{ mr: 1 }} />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    bgcolor: settings.primaryColor,
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    "&:hover": {
                      bgcolor: settings.primaryColor,
                    },
                  }}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  <ArrowForwardIcon sx={{ ml: 1 }} />
                </Button>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CompletionDialog />
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={300}
          recycle={false}
        />
      )}
    </>
  );
};

export default OnboardingBot;