import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Stack,
  InputAdornment,
  useTheme,
  alpha,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Switch,
  InputLabel,
  Radio,
  RadioGroup,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Chip,
} from "@mui/material";
import {
  SmartToy as SmartToyIcon,
  ColorLens as ColorLensIcon,
  Message as MessageIcon,
  Psychology as PsychologyIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Celebration as CelebrationIcon,
  // Additional icon imports
  ChatBubble as ChatBubbleIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Forum as ForumIcon,
  QuestionAnswer as QuestionAnswerIcon,
  SupportAgent as SupportAgentIcon,
  ContactSupport as ContactSupportIcon,
  Help as HelpIcon,
  LiveHelp as LiveHelpIcon,
  Comment as CommentIcon,
  Textsms as TextsmsIcon,
  Feedback as FeedbackIcon,
  HeadsetMic as HeadsetMicIcon,
  MarkChatUnread as MarkChatUnreadIcon,
  AssistantPhoto as AssistantPhotoIcon,
  // Additional enhanced icon imports
  EmojiObjects as LightBulbIcon,
  School as SchoolIcon,
  AllInclusive as InfinityIcon,
  Adb as AndroidIcon,
  Assistant as AssistantIcon,
  Biotech as BiotechIcon,
  ChildCare as ChildCareIcon,
  Cloud as CloudIcon,
  Bolt as BoltIcon,
  Diamond as DiamondIcon,
  Computer as ComputerIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  Devices as DevicesIcon,
  Gesture as GestureIcon,
  Extension as PuzzleIcon,
  // Knowledge base icons
  UploadFile as UploadFileIcon,
  Description as DocumentIcon,
  DataObject as DataObjectIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  Article as ArticleIcon,
  FileCopy as FileCopyIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  Source as SourceIcon,
  Link as LinkIcon,
  CloudUpload as CloudUploadIcon,
  Code as CodeIcon,
  AddLink as AddLinkIcon,
  ContentCopy as ContentCopyIcon,
  Info as InfoIcon,
  TextSnippet as TextSnippetIcon,
  Language as LanguageIcon,
  QuestionAnswer as QAIcon,
  Dns as DnsIcon,
  ManageAccounts as ManageAccountsIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Confetti from "react-confetti";

// Simplified steps for onboarding - Change Behavior to Knowledge Base
const steps = [
  { label: "Appearance", icon: <ColorLensIcon /> },
  { label: "Greeting", icon: <MessageIcon /> },
  { label: "Knowledge Base", icon: <ArticleIcon /> }, // Changed from "Behavior" to "Knowledge Base"
  { label: "Embed", icon: <CodeIcon /> } // Added new step for embedding
];

// Predefined colors for simple selection
const predefinedColors = [
  "#7C3AED", "#2563EB", "#10B981", "#EF4444", 
  "#F59E0B", "#EC4899", "#6B7280", "#000000"
];

// Glass-like UI style
const glassStyles = {
  background: "rgba(30, 30, 40, 0.6)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const SimpleOnboarding = ({ onCompleteOnboarding }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [iconClicked, setIconClicked] = useState(false);
  const [showBotIcon, setShowBotIcon] = useState(false);
  const [showBotSpeech, setShowBotSpeech] = useState(false);
  const botIconRef = useRef(null);
  const [isReturning, setIsReturning] = useState(false);
  const animationTimeline = useRef(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [finalPosition, setFinalPosition] = useState({ x: 0, y: 0, scale: 1 });
  
  // Keep this initialized to true and don't toggle it during step navigation
  const [showWhiteBackground, setShowWhiteBackground] = useState(true);
  
  const [isMorphing, setIsMorphing] = useState(false);
  const modalContainerRef = useRef(null);
  const speechBubbleRef = useRef(null);
  
  // Add a ref for the white background to keep it stable across renders
  const whiteBackgroundRef = useRef(null);
  
  // Create and manage the white background element directly in the DOM to prevent flashing
  useEffect(() => {
    // Create a stable background element that won't be affected by React re-renders
    const backgroundEl = document.createElement('div');
    backgroundEl.style.position = 'fixed';
    backgroundEl.style.top = '0';
    backgroundEl.style.left = '0';
    backgroundEl.style.right = '0';
    backgroundEl.style.bottom = '0';
    backgroundEl.style.backgroundColor = 'white';
    backgroundEl.style.zIndex = '1200';
    backgroundEl.style.pointerEvents = 'none';
    backgroundEl.style.opacity = '0';
    backgroundEl.style.transition = 'opacity 0.6s ease';
    
    document.body.appendChild(backgroundEl);
    whiteBackgroundRef.current = backgroundEl;
    
    // Make background visible with a slight delay to ensure smooth appearance
    setTimeout(() => {
      if (whiteBackgroundRef.current) {
        whiteBackgroundRef.current.style.opacity = '1';
      }
    }, 50);
    
    // Clean up function
    return () => {
      if (whiteBackgroundRef.current && document.body.contains(whiteBackgroundRef.current)) {
        document.body.removeChild(whiteBackgroundRef.current);
      }
    };
  }, []);
  
  // Update the background visibility when onboarding completes
  useEffect(() => {
    if (whiteBackgroundRef.current) {
      if (onboardingComplete) {
        whiteBackgroundRef.current.style.opacity = '0';
        // Remove after transition completes
        setTimeout(() => {
          if (whiteBackgroundRef.current && document.body.contains(whiteBackgroundRef.current)) {
            document.body.removeChild(whiteBackgroundRef.current);
          }
        }, 600);
      } else {
        whiteBackgroundRef.current.style.opacity = '1';
      }
    }
  }, [onboardingComplete]);
  
  // Simplified onboarding state - Add file uploads and knowledge base settings
  const [settings, setSettings] = useState({
    // Appearance
    primaryColor: "#7C3AED",
    theme: "light",
    botName: "My Assistant",
    
    // New icon customization options
    iconSize: "medium", // small, medium, large
    iconType: "robot", // now has 17 possible values
    bubbleShape: "circle", // circle, rounded, square
    buttonPosition: "right", // left, right
    showLabel: false, // true, false
    labelText: "Chat with us",
    labelShape: "rounded", // pill, rounded, square
    labelSize: "medium", // small, medium, large
    labelBgColor: "#7C3AED", // default: primary color
    labelTextColor: "#FFFFFF",
    
    // Greeting
    welcomeMessage: "Hello! How can I assist you today?",
    suggestedPrompts: [
      "How do I get started?",
      "What features do you offer?",
      "How can I contact support?"
    ],
    
    // Knowledge Base settings (removing notion from options)
    files: [], // Array to store file data
    webPages: [], // Array to store webpage URLs
    qaFormat: "auto", // 'auto', 'strict', 'flexible'
    fileTypes: ['pdf', 'doc', 'docx', 'txt'], // Supported file types
    knowledgeSource: 'files', // 'files', 'text', 'website', 'qa'
    
    // Embedding settings (new)
    embedLocation: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    embedType: 'floating',  // floating, inline, fullpage
    customCSS: false,
    autoOpen: false,
    deviceVisibility: 'all', // all, desktop, mobile
  });

  // Track files for uploading
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  // File upload handler
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    processFiles(newFiles);
  };

  // Process files for mock upload
  const processFiles = (files) => {
    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return settings.fileTypes.includes(extension);
    });

    if (validFiles.length !== files.length) {
      // In real app, show an error for invalid files
      console.log("Some files are invalid");
    }

    // Create new file objects with progress
    const newFileList = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 15),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
      uploadDate: new Date(),
    }));

    setUploadedFiles(prev => [...prev, ...newFileList]);

    // Simulate upload progress
    newFileList.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadedFiles(files => 
            files.map(f => 
              f.id === file.id ? { ...f, status: 'complete', progress: 100 } : f
            )
          );
        } else {
          setUploadedFiles(files => 
            files.map(f => 
              f.id === file.id ? { ...f, progress } : f
            )
          );
        }
      }, 300);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Delete file handler
  const handleDeleteFile = (id) => {
    setUploadedFiles(files => files.filter(file => file.id !== id));
  };

  // Show the onboarding icon immediately on mount
  useEffect(() => {
    setShowBotIcon(true);
    setTimeout(() => {
      setIconClicked(true);
    }, 1000);
  }, []);

  // Initialize GSAP animation when icon appears
  useEffect(() => {
    if (showBotIcon && botIconRef.current && !modalOpen && !iconClicked && !isReturning) {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
      }
      
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

  // Handle icon click animation
  useEffect(() => {
    if (iconClicked && botIconRef.current && !isReturning) {
      if (animationTimeline.current) {
        animationTimeline.current.kill();
      }
      
      const targetX = 120; 
      const targetY = 200; 
      
      animationTimeline.current = gsap.timeline({
        defaults: { ease: "power3.inOut" }
      });
      
      animationTimeline.current.to(botIconRef.current, {
        duration: 1.5,
        top: targetY,
        right: "auto",
        bottom: "auto", 
        left: targetX,
        position: "fixed",
        scale: 2,
        rotation: 360,
        ease: "power2.inOut",
        onComplete: () => {
          setShowBotSpeech(true);
          setFinalPosition({ 
            top: targetY,
            left: targetX,
            scale: 2
          });
        }
      });
    }
  }, [iconClicked, isReturning]);

  // Handle starting the onboarding process
  const handleStartOnboarding = () => {
    setIsMorphing(true);
    
    const bubbleEl = botIconRef.current;
    const speechEl = speechBubbleRef.current;
    
    if (!bubbleEl || !speechEl) return;
    
    if (animationTimeline.current) {
      animationTimeline.current.kill();
    }
    
    const bubbleRect = speechEl.getBoundingClientRect();
    
    // Use 0,0 position to cover the entire screen instead of centering
    const centerX = 0; 
    const centerY = 0;
    
    const modalContainer = document.createElement('div');
    modalContainer.style.position = 'fixed';
    modalContainer.style.left = `${bubbleRect.left}px`;
    modalContainer.style.top = `${bubbleRect.top}px`;
    modalContainer.style.width = `${bubbleRect.width}px`;
    modalContainer.style.height = `${bubbleRect.height}px`;
    modalContainer.style.backgroundColor = 'rgba(30, 30, 40, 0.6)';
    modalContainer.style.backdropFilter = 'blur(12px)';
    modalContainer.style.WebkitBackdropFilter = 'blur(12px)';
    modalContainer.style.borderRadius = '16px';
    modalContainer.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    modalContainer.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    modalContainer.style.zIndex = 1400;
    modalContainer.style.overflow = 'hidden';
    
    document.body.appendChild(modalContainer);
    modalContainerRef.current = modalContainer;
    
    const placeholderContent = document.createElement('div');
    placeholderContent.style.position = 'absolute';
    placeholderContent.style.top = '0';
    placeholderContent.style.left = '0';
    placeholderContent.style.width = '100%';
    placeholderContent.style.height = '100%';
    placeholderContent.style.display = 'flex';
    placeholderContent.style.flexDirection = 'column';
    placeholderContent.style.alignItems = 'center';
    placeholderContent.style.justifyContent = 'center';
    placeholderContent.style.opacity = '0';
    placeholderContent.innerHTML = `
      <div style="width: 80%; height: 24px; background: rgba(255,255,255,0.1); border-radius: 12px; margin: 10px 0;"></div>
      <div style="width: 60%; height: 24px; background: rgba(255,255,255,0.1); border-radius: 12px; margin: 10px 0;"></div>
    `;
    
    modalContainer.appendChild(placeholderContent);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setModalOpen(true);
        setShowBotIcon(false);
        setShowBotSpeech(false);
        setIconClicked(false);
        
        setTimeout(() => {
          if (modalContainerRef.current) {
            document.body.removeChild(modalContainerRef.current);
            modalContainerRef.current = null;
            setIsMorphing(false);
          }
        }, 150);
      }
    });
    
    tl.to(modalContainer, {
      duration: 0.2, 
      borderRadius: '0px', // Changed to 0px for full-screen effect
      ease: "power1.in"
    })
    .to(modalContainer, {
      duration: 0.6,
      left: centerX,
      top: centerY,
      width: '100%', // Full width
      height: '100%', // Full height
      borderRadius: '0px', // No border radius for full-screen
      ease: "power3.inOut"
    })
    .to(placeholderContent, {
      duration: 0.4,
      opacity: 0.7,
      ease: "power2.inOut"
    }, "-=0.4")
    .to(placeholderContent, {
      duration: 0.2,
      opacity: 0,
      delay: 0.2,
      ease: "power2.in"
    });
    
    gsap.to(bubbleEl, {
      opacity: 0,
      scale: 1.1,
      duration: 0.3,
      delay: 0.1,
      ease: "back.in(1.7)"
    });
  };

  // Handle onboarding completion
  const handleFinalOnboarding = () => {
    localStorage.setItem("onboardingComplete", "true");
    setShowCompletionDialog(false);
    setModalOpen(false);
    setOnboardingComplete(true);
    
    // Show a brief success message before redirecting
    const successMessage = document.createElement('div');
    successMessage.style.position = 'fixed';
    successMessage.style.top = '50%';
    successMessage.style.left = '50%';
    successMessage.style.transform = 'translate(-50%, -50%)';
    successMessage.style.padding = '20px 40px';
    successMessage.style.backgroundColor = settings.primaryColor;
    successMessage.style.color = 'white';
    successMessage.style.borderRadius = '8px';
    successMessage.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    successMessage.style.zIndex = '2000';
    successMessage.style.fontSize = '18px';
    successMessage.style.fontWeight = 'bold';
    successMessage.style.opacity = '0';
    successMessage.style.transition = 'opacity 0.3s ease';
    successMessage.innerHTML = '<div style="display:flex;align-items:center;gap:12px;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>Redirecting to Dashboard</div>';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
      successMessage.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(successMessage);
        // Call the completion callback to navigate to dashboard
        onCompleteOnboarding && onCompleteOnboarding();
      }, 400);
    }, 1500);
    
    if (botIconRef.current && animationTimeline.current) {
      animationTimeline.current.kill();
      
      gsap.timeline()
        .to(botIconRef.current, {
          duration: 0.4,
          scale: 1.2,
          ease: "power1.out"
        })
        .to(botIconRef.current, {
          duration: 0.8,
          opacity: 0,
          scale: 0.2,
          y: 50,
          ease: "power3.in",
          onComplete: () => {
            setShowBotIcon(false);
            setShowBotSpeech(false);
          }
        }, "-=0.2");
    } else {
      setShowBotIcon(false);
    }
  };

  // Handle window resize
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

  // Save onboarding progress
  useEffect(() => {
    localStorage.setItem(
      "onboardingProgress",
      JSON.stringify({ step: activeStep, settings })
    );
  }, [activeStep, settings]);

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem("onboardingProgress");
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setActiveStep(progress.step || 0);
        setSettings((prev) => ({ ...prev, ...progress.settings }));
      } catch (e) {
        console.error("Failed to parse saved onboarding progress");
      }
    }
  }, []);

  // Skip onboarding
  const handleSkipOnboarding = () => {
    if (animationTimeline.current) {
      animationTimeline.current.kill();
    }
    
    setOnboardingComplete(true);
    
    if (botIconRef.current) {
      gsap.to(botIconRef.current, {
        duration: 0.5,
        opacity: 0,
        scale: 0.2,
        y: 40,
        ease: "power1.in",
        onComplete: () => {
          setShowBotIcon(false);
          setShowBotSpeech(false);
          localStorage.setItem("onboardingComplete", "true");
          onCompleteOnboarding && onCompleteOnboarding();
        }
      });
    } else {
      setShowBotIcon(false);
      localStorage.setItem("onboardingComplete", "true");
      onCompleteOnboarding && onCompleteOnboarding();
    }
  };

  // Skip to next step function
  const handleSkipToNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleSkipOnboarding(); // If on last step, complete onboarding
    }
  };
  
  // Navigation - Take directly to dashboard when clicking Finish
  const handleNext = () => {
    setActiveStep((prev) => {
      const next = prev + 1;
      if (next >= steps.length) {
        // Add confetti before redirecting to dashboard
        setShowConfetti(true);
        
        // Close the modal immediately
        setModalOpen(false);
        
        // Mark onboarding as complete to trigger background removal
        localStorage.setItem("onboardingComplete", "true");
        setOnboardingComplete(true);
          
        // Short delay before redirecting to ensure confetti is visible
        setTimeout(() => {
          // Redirect to dashboard
          onCompleteOnboarding && onCompleteOnboarding();
        }, 1500); // Increased delay to enjoy the confetti
        
        return prev;
      }
      return next;
    });
  };
  
  const handleBack = () => setActiveStep((prev) => prev - 1);
  
  // Modal handlers - Updated to show confetti even after closing
  const handleCloseModal = () => {
    setModalOpen(false);
    
    if (onboardingComplete) {
      // Show confetti when closing on the final step
      if (activeStep === steps.length - 1) {
        setShowConfetti(true);
        
        // Give time for the confetti to be enjoyed before redirecting
        setTimeout(() => {
          setShowBotIcon(false);
          onCompleteOnboarding && onCompleteOnboarding();
        }, 1500);
        return;
      }
      
      setShowBotIcon(false);
      onCompleteOnboarding && onCompleteOnboarding();
      return;
    }
    
    // Show bot icon again without asking about skipping
    setTimeout(() => {
      setShowBotIcon(true);
      
      if (activeStep === steps.length - 1 || showCompletionDialog) {
        setIsReturning(true);
        setTimeout(() => setShowBotSpeech(true), 500);
      }
    }, 300);
  };

  // All available icon options with their components and labels - Enhanced with more sophisticated options
  const iconOptions = [
    { 
      value: "robot", 
      label: "Robot", 
      icon: <SmartToyIcon sx={{ 
        filter: 'drop-shadow(2px 3px 2px rgba(0,0,0,0.2))',
      }} /> 
    },
    { 
      value: "lightbulb", 
      label: "Ideas", 
      icon: <LightBulbIcon sx={{ 
        filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))',
      }} /> 
    },
    { 
      value: "assistant", 
      label: "Assistant", 
      icon: <AssistantIcon sx={{ 
        filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.25))',
      }} /> 
    },
    { 
      value: "biotech", 
      label: "Science", 
      icon: <BiotechIcon sx={{ 
        filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))',
      }} /> 
    },
    { 
      value: "chat", 
      label: "Chat", 
      icon: <ChatBubbleIcon sx={{ 
        filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.25))',
      }} /> 
    },
    { 
      value: "forum", 
      label: "Forum", 
      icon: <ForumIcon sx={{ 
        filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.25))',
      }} /> 
    },
    { 
      value: "cloud", 
      label: "Cloud", 
      icon: <CloudIcon sx={{ 
        filter: 'drop-shadow(2px 3px 3px rgba(0,0,0,0.3))',
      }} /> 
    },
    { 
      value: "bolt", 
      label: "Fast", 
      icon: <BoltIcon sx={{ 
        filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.3))',
      }} /> 
    },
    { 
      value: "support", 
      label: "Support", 
      icon: <SupportAgentIcon sx={{ 
        filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.25))',
      }} /> 
    },
    { 
      value: "diamond", 
      label: "Premium", 
      icon: <DiamondIcon sx={{ 
        filter: 'drop-shadow(2px 3px 3px rgba(0,0,0,0.3))',
      }} /> 
    },
    { 
      value: "heart", 
      label: "Love", 
      icon: <HeartIcon sx={{ 
        filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.3))',
      }} /> 
    },
    { 
      value: "star", 
      label: "Star", 
      icon: <StarIcon sx={{ 
        filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.3))',
      }} /> 
    },
    { 
      value: "devices", 
      label: "Devices", 
      icon: <DevicesIcon sx={{ 
        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.25))',
      }} /> 
    },
    { 
      value: "puzzle", 
      label: "Solutions", 
      icon: <PuzzleIcon sx={{ 
        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
      }} /> 
    },
    { 
      value: "gesture", 
      label: "Gesture", 
      icon: <GestureIcon sx={{ 
        filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.25))',
      }} /> 
    },
    { 
      value: "computer", 
      label: "Tech", 
      icon: <ComputerIcon sx={{ 
        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
      }} /> 
    },
  ];

  // Render content for each step - Include the updated Knowledge Base UI
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box p={3} sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: { xs: 2, md: 0 }, // Reduced gap to bring elements closer
            position: 'relative',
            alignItems: 'center', // Center items vertically
            justifyContent: 'center' // Center items horizontally
          }}>
            {/* Left Side Preview Panel */}
            <Box sx={{ 
              flex: { xs: 1, md: 0.7 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pt: 5,
              pb: 5,
              position: 'relative',
              zIndex: 3,
              mr: { xs: 0, md: '-25px' }, // Pull the icon toward the bubble on desktop
              mt: { xs: 0, md: '-30px' }, // Move icon slightly up for better appearance
            }}>
              {/* Preview of the chat icon - Made larger */}
              <Box sx={{
                width: 220,
                height: 220,
                bgcolor: settings.primaryColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                boxShadow: '0 10px 36px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                color: 'white',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 3,
              }}>
                <Box sx={{ 
                  fontSize: '200px',
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  transform: 'scale(3.8)',
                  transition: 'transform 0.3s ease',
                }}>
                  {iconOptions.find(option => option.value === settings.iconType)?.icon || <SmartToyIcon />}
                </Box>
              </Box>
            </Box>

            {/* Right Side Settings Panel as oval-shaped speech bubble */}
            <Box sx={{ 
              flex: 1.7,
              maxHeight: { xs: 'auto', md: '70vh' },
              overflow: 'auto',
              pr: 3,
              pl: 3,
              py: 4,
              backgroundColor: alpha(settings.primaryColor, 0.08),
              borderRadius: '40px',
              boxShadow: `0 8px 32px ${alpha(settings.primaryColor, 0.15)}`,
              border: `2px solid ${alpha(settings.primaryColor, 0.15)}`,
              position: 'relative',
              zIndex: 1,
              '&:before': {
                content: '""',
                position: 'absolute',
                // Move connector directly to the icon
                left: { xs: '48%', md: '-15px' }, 
                top: { xs: '-15px', md: '50%' },
                transform: { xs: 'translateX(-50%)', md: 'translateY(-50%)' },
                width: { xs: '30px', md: '30px' },
                height: { xs: '18px', md: '30px' },
                backgroundColor: alpha(settings.primaryColor, 0.08),
                clipPath: { 
                  xs: 'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle pointing up for mobile
                  md: 'polygon(0% 50%, 100% 0%, 100% 100%)' // Triangle pointing left for desktop
                },
                borderLeft: { xs: 'none', md: `2px solid ${alpha(settings.primaryColor, 0.15)}` },
                borderTop: { xs: `2px solid ${alpha(settings.primaryColor, 0.15)}`, md: 'none' },
                zIndex: 0,
              },
              // Adjust width and position to create better connection with icon
              width: { xs: '100%', md: 'auto' },
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // Add a margin to pull the speech bubble toward the icon
              ml: { xs: 0, md: '-15px' },
            }}>
              <Typography variant="h6" gutterBottom mb={3} sx={{ textAlign: 'center', color: alpha(settings.primaryColor, 0.9), fontWeight: 600 }}>
                {activeStep === 0 ? 'Choose Your Chat Button Icon' : 
                 activeStep === 1 ? 'Configure Greeting Messages' :
                 activeStep === 2 ? 'Knowledge Base Configuration' : // Changed from 'Setup Chatbot Behavior'
                 'Embed Your Chatbot'}
              </Typography>

              {activeStep === 0 && (
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  {iconOptions.map((option) => (
                    <Grid item xs={4} sm={4} md={4} lg={4} key={option.value}>
                      <Button
                        fullWidth
                        variant={settings.iconType === option.value ? 'contained' : 'outlined'}
                        onClick={() => setSettings({ ...settings, iconType: option.value })}
                        sx={{
                          minHeight: '100px',
                          maxHeight: '100px',
                          width: '100%',
                          aspectRatio: '1',
                          display: 'flex',
                          justifyContent: 'center', 
                          alignItems: 'center',
                          p: 0, // Remove padding to maximize space for icon
                          bgcolor: settings.iconType === option.value ? settings.primaryColor : 'transparent',
                          color: settings.iconType === option.value ? 'white' : alpha(settings.primaryColor, 0.7),
                          '&:hover': {
                            bgcolor: settings.iconType === option.value 
                              ? alpha(settings.primaryColor, 0.9)
                              : alpha(settings.primaryColor, 0.1),
                            transform: 'translateY(-3px)',
                            boxShadow: `0 5px 15px ${alpha(settings.primaryColor, 0.3)}`
                          },
                          borderColor: alpha(settings.primaryColor, 0.3),
                          mb: 2,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          position: 'relative',
                          overflow: 'hidden', // Prevent icon overflow
                        }}
                      >
                        <Box sx={{ 
                          fontSize: 150,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '& > svg': {
                            fontSize: 'inherit',
                            transform: 'scale(1.2)',
                            width: '85%',
                            height: '85%',
                            // Adding depth and sophistication to the icons
                            filter: settings.iconType === option.value 
                              ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' 
                              : 'none',
                            transition: 'filter 0.3s ease, transform 0.3s ease',
                          }
                        }}>
                          {option.icon}
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {activeStep === 1 && (
                <Box sx={{ width: '100%' }}>
                  <Stack spacing={3}>
                    <TextField
                      label="Welcome Message"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={settings.welcomeMessage}
                      onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', pt: 1 }}>
                            <MessageIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
    
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>Suggested Prompts</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        Quick questions users can click to begin conversation
                      </Typography>
                      {settings.suggestedPrompts.map((prompt, index) => (
                        <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            value={prompt}
                            onChange={(e) => {
                              const newPrompts = [...settings.suggestedPrompts];
                              newPrompts[index] = e.target.value;
                              setSettings({ ...settings, suggestedPrompts: newPrompts });
                            }}
                            size="small"
                            InputProps={{
                              endAdornment: index > 0 && (
                                <InputAdornment position="end">
                                  <IconButton 
                                    onClick={() => {
                                      const newPrompts = settings.suggestedPrompts.filter((_, i) => i !== index);
                                      setSettings({ ...settings, suggestedPrompts: newPrompts });
                                    }}
                                    edge="end"
                                    size="small"
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      ))}
                      {settings.suggestedPrompts.length < 5 && (
                        <Button 
                          variant="text"
                          onClick={() => {
                            setSettings({
                              ...settings,
                              suggestedPrompts: [...settings.suggestedPrompts, ""]
                            });
                          }}
                          sx={{ mt: 1 }}
                        >
                          + Add Another Prompt
                        </Button>
                      )}
                    </Box>
                  </Stack>
                </Box>
              )}
              
              {activeStep === 2 && (
                <Box p={3} sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  gap: { xs: 2, md: 0 },
                  position: 'relative',
                  alignItems: 'flex-start',
                  justifyContent: 'center'
                }}>
                  {/* Left Side Navigation Menu */}
                  <Box sx={{ 
                    flex: { xs: 1, md: 0.3 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    minWidth: { xs: '100%', md: '220px' },
                    mr: { xs: 0, md: 3 },
                    mb: { xs: 3, md: 0 },
                  }}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <List component="nav" disablePadding>
                        {[
                          { id: 'files', label: 'Files', icon: <ArticleIcon /> },
                          { id: 'text', label: 'Text', icon: <TextSnippetIcon /> },
                          { id: 'website', label: 'Website', icon: <LanguageIcon /> },
                          { id: 'qa', label: 'Q&A', icon: <QAIcon /> }
                          // Removed notion option
                        ].map((item) => (
                          <ListItem 
                            key={item.id}
                            disablePadding
                            onClick={() => setSettings({...settings, knowledgeSource: item.id})}
                            sx={{
                              borderLeft: '3px solid',
                              borderColor: settings.knowledgeSource === item.id 
                                ? settings.primaryColor 
                                : 'transparent',
                              bgcolor: settings.knowledgeSource === item.id
                                ? alpha(settings.primaryColor, 0.08)
                                : 'transparent',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <ListItemButton>
                              <ListItemIcon sx={{ 
                                color: settings.knowledgeSource === item.id 
                                  ? settings.primaryColor 
                                  : 'text.secondary',
                                minWidth: '40px'
                              }}>
                                {item.icon}
                              </ListItemIcon>
                              <ListItemText 
                                primary={item.label} 
                                primaryTypographyProps={{
                                  fontWeight: settings.knowledgeSource === item.id ? 600 : 400,
                                  color: settings.knowledgeSource === item.id 
                                    ? settings.primaryColor 
                                    : 'text.primary'
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Paper>

                    <Box sx={{ 
                      mt: 3, 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: alpha(settings.primaryColor, 0.05),
                      border: `1px solid ${alpha(settings.primaryColor, 0.1)}`,
                    }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Knowledge Base Tips
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Choose the data source that best fits your content:
                      </Typography>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: '1.2em',
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem'
                      }}>
                        <li style={{ marginBottom: '4px' }}>Files - Upload PDFs, DOCs, and TXTs</li>
                        <li style={{ marginBottom: '4px' }}>Text - Paste or type content directly</li>
                        <li style={{ marginBottom: '4px' }}>Website - Connect to web pages</li>
                      </ul>
                    </Box>
                  </Box>

                  {/* Right Side Content Area */}
                  <Box sx={{ 
                    flex: { xs: 1, md: 0.7 },
                    p: 0,
                    width: { xs: '100%', md: 'auto' },
                  }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        minHeight: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Files View */}
                      {settings.knowledgeSource === 'files' && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Files</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Upload documents to train your AI agent
                            </Typography>
                          </Box>
                          
                          {/* File Upload Area */}
                          <Box 
                            sx={{
                              border: dragActive 
                                ? `2px dashed ${settings.primaryColor}` 
                                : `2px dashed ${alpha(settings.primaryColor, 0.4)}`,
                              borderRadius: '12px',
                              p: 3,
                              textAlign: 'center',
                              backgroundColor: dragActive 
                                ? alpha(settings.primaryColor, 0.05) 
                                : 'transparent',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '180px',
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              hidden
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.txt"
                            />
                            <CloudUploadIcon 
                              sx={{ 
                                fontSize: 48, 
                                color: settings.primaryColor,
                                mb: 1,
                              }} 
                            />
                            <Typography variant="h6" sx={{ mb: 1, color: alpha(settings.primaryColor, 0.9) }}>
                              Drag & Drop Files Here
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              or click to select files
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Supported File Types: PDF, DOC, DOCX, TXT
                            </Typography>
                          </Box>

                          {/* File List */}
                          {uploadedFiles.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                Uploaded Files ({uploadedFiles.length})
                                <Chip 
                                  size="small" 
                                  label="Training in Progress" 
                                  color="primary"
                                  sx={{ ml: 2, bgcolor: alpha(settings.primaryColor, 0.9) }} 
                                />
                              </Typography>
                              <Paper 
                                variant="outlined" 
                                sx={{ 
                                  p: 0, 
                                  borderRadius: 2, 
                                  overflow: 'hidden',
                                  borderColor: alpha(settings.primaryColor, 0.2),
                                }}
                              >
                                {uploadedFiles.map((file) => (
                                  <Box 
                                    key={file.id} 
                                    sx={{ 
                                      p: 2, 
                                      display: 'flex', 
                                      alignItems: 'center',
                                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                      '&:last-child': {
                                        borderBottom: 'none',
                                      },
                                      backgroundColor: file.status === 'complete' 
                                        ? alpha(settings.primaryColor, 0.05) 
                                        : 'transparent',
                                    }}
                                  >
                                    {/* File Icon */}
                                    <Box sx={{ mr: 2, color: settings.primaryColor }}>
                                      {file.name.endsWith('.pdf') ? (
                                        <PdfIcon />
                                      ) : file.name.endsWith('.txt') ? (
                                        <DocumentIcon />
                                      ) : (
                                        <FileIcon />
                                      )}
                                    </Box>
                                    
                                    {/* File Info & Progress */}
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body2" noWrap sx={{ maxWidth: '220px' }}>
                                        {file.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {(file.size / 1024).toFixed(2)} KB • {file.status === 'complete' ? 'Processing' : 'Uploading'}
                                      </Typography>
                                      
                                      {file.status === 'uploading' && (
                                        <Box sx={{ width: '100%', mt: 1 }}>
                                          <Box 
                                            sx={{ 
                                              height: 4, 
                                              backgroundColor: alpha(settings.primaryColor, 0.2),
                                              borderRadius: 2,
                                              position: 'relative',
                                            }}
                                          >
                                            <Box 
                                              sx={{ 
                                                height: '100%', 
                                                width: `${file.progress}%`, 
                                                backgroundColor: settings.primaryColor,
                                                borderRadius: 2,
                                                transition: 'width 0.3s ease',
                                              }} 
                                            />
                                          </Box>
                                        </Box>
                                      )}
                                      
                                      {file.status === 'complete' && (
                                        <Box sx={{ width: '100%', mt: 1 }}>
                                          <Box 
                                            sx={{ 
                                              height: 4, 
                                              backgroundColor: alpha(settings.primaryColor, 0.2),
                                              borderRadius: 2,
                                              position: 'relative',
                                              overflow: 'hidden'
                                            }}
                                          >
                                            <Box 
                                              sx={{ 
                                                position: 'absolute',
                                                height: '100%', 
                                                width: '30%', 
                                                backgroundColor: settings.primaryColor,
                                                borderRadius: 0,
                                                animation: 'progress-animation 1.5s infinite linear',
                                                '@keyframes progress-animation': {
                                                  '0%': {
                                                    left: '-30%',
                                                  },
                                                  '100%': {
                                                    left: '100%',
                                                  }
                                                }
                                              }} 
                                            />
                                          </Box>
                                        </Box>
                                      )}
                                    </Box>
                                    
                                    {/* Delete Button */}
                                    <IconButton 
                                      size="small" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFile(file.id);
                                      }}
                                      sx={{ color: 'text.secondary' }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                ))}
                              </Paper>
                              
                              <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                sx={{ 
                                  display: 'block', 
                                  mt: 1, 
                                  fontStyle: 'italic',
                                  textAlign: 'center'
                                }}
                              >
                                Processing may take a few minutes for large documents
                              </Typography>
                            </Box>
                          )}

                          {/* No Files Message */}
                          {uploadedFiles.length === 0 && (
                            <Box sx={{ 
                              textAlign: 'center', 
                              mt: 3, 
                              color: 'text.secondary',
                              p: 2,
                              border: '1px dashed',
                              borderColor: alpha(theme.palette.divider, 0.3),
                              borderRadius: 2
                            }}>
                              <Typography variant="body2">
                                No files uploaded yet. Files you upload will appear here.
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}

                      {/* Text View */}
                      {settings.knowledgeSource === 'text' && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Text</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Add content directly as text
                            </Typography>
                          </Box>
                          
                          <TextField
                            multiline
                            rows={10}
                            fullWidth
                            placeholder="Paste or type your content here. This text will be used to train your AI agent."
                            variant="outlined"
                            sx={{ mb: 3 }}
                          />
                          
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                              bgcolor: settings.primaryColor,
                              alignSelf: 'flex-start',
                              '&:hover': {
                                bgcolor: alpha(settings.primaryColor, 0.9),
                              }
                            }}
                          >
                            Add Text Block
                          </Button>
                          
                          <Box sx={{ 
                            mt: 4, 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: alpha('#2563EB', 0.08),
                            border: `1px solid ${alpha('#2563EB', 0.2)}`,
                          }}>
                            <Typography variant="body2">
                              <strong>Tip:</strong> You can add multiple text blocks to organize different topics or sections.
                            </Typography>
                          </Box>
                        </>
                      )}

                      {/* Website View */}
                      {settings.knowledgeSource === 'website' && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Website</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Add content from web pages
                            </Typography>
                          </Box>
                          
                          <TextField
                            fullWidth
                            placeholder="Enter website URL (e.g., https://example.com/docs)"
                            variant="outlined"
                            size="medium"
                            sx={{ mb: 3 }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LinkIcon fontSize="small" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button 
                                    variant="contained"
                                    size="small" 
                                    sx={{ 
                                      bgcolor: settings.primaryColor,
                                      '&:hover': {
                                        bgcolor: alpha(settings.primaryColor, 0.9),
                                      }
                                    }}
                                  >
                                    Add
                                  </Button>
                                </InputAdornment>
                              ),
                            }}
                          />
                          
                          <Box sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            mb: 3
                          }}>
                            <Typography variant="subtitle2" gutterBottom>Crawling Options</Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                  control={
                                    <Switch 
                                      size="small"
                                      defaultChecked
                                      sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                          color: settings.primaryColor,
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                          backgroundColor: settings.primaryColor,
                                        },
                                      }}
                                    />
                                  }
                                  label="Follow links on same domain"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                  control={
                                    <Switch 
                                      size="small"
                                      sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                          color: settings.primaryColor,
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                          backgroundColor: settings.primaryColor,
                                        },
                                      }}
                                    />
                                  }
                                  label="Include images"
                                />
                              </Grid>
                            </Grid>
                          </Box>
                          
                          <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: alpha('#2563EB', 0.08),
                            border: `1px solid ${alpha('#2563EB', 0.2)}`,
                          }}>
                            <Typography variant="body2">
                              <strong>Note:</strong> Make sure you have permission to crawl and use content from the websites you add.
                            </Typography>
                          </Box>
                        </>
                      )}
                      
                      {/* Q&A View */}
                      {settings.knowledgeSource === 'qa' && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6">Q&A Pairs</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Define specific question-answer pairs
                            </Typography>
                          </Box>
                          
                          <Paper 
                            variant="outlined"
                            sx={{ 
                              p: 2, 
                              mb: 3, 
                              borderRadius: 2,
                              borderColor: alpha(settings.primaryColor, 0.3)
                            }}
                          >
                            <Typography variant="subtitle2" gutterBottom>Question 1</Typography>
                            <TextField
                              fullWidth
                              placeholder="Enter a question"
                              variant="outlined"
                              size="small"
                              defaultValue="What are your business hours?"
                              sx={{ mb: 2 }}
                            />
                            
                            <Typography variant="subtitle2" gutterBottom>Answer</Typography>
                            <TextField
                              fullWidth
                              placeholder="Enter the answer"
                              variant="outlined"
                              size="small"
                              multiline
                              rows={3}
                              defaultValue="Our business hours are Monday to Friday from 9 AM to 5 PM. We are closed on weekends and major holidays."
                            />
                            
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <Button 
                                size="small"
                                color="error"
                                startIcon={<DeleteIcon />}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Paper>
                          
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                              mb: 3,
                              bgcolor: settings.primaryColor,
                              '&:hover': {
                                bgcolor: alpha(settings.primaryColor, 0.9),
                              }
                            }}
                          >
                            Add Q&A Pair
                          </Button>
                          
                          <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: alpha('#2563EB', 0.08),
                            border: `1px solid ${alpha('#2563EB', 0.2)}`,
                          }}>
                            <Typography variant="body2">
                              <strong>Tip:</strong> Q&A pairs are perfect for ensuring precise answers to common questions.
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Paper>
                  </Box>
                </Box>
              )}
              
              {activeStep === 3 && (
                <Box sx={{ width: '100%' }}>
                  <Stack spacing={3}>
                    {/* Embed Type Selection */}
                    <FormControl component="fieldset">
                      <Typography variant="subtitle1" gutterBottom>Embed Type</Typography>
                      <RadioGroup
                        value={settings.embedType}
                        onChange={(e) => setSettings({ ...settings, embedType: e.target.value })}
                      >
                        <FormControlLabel 
                          value="floating" 
                          control={<Radio />} 
                          label="Floating Button - Chat button appears in the corner" 
                        />
                        <FormControlLabel 
                          value="inline" 
                          control={<Radio />} 
                          label="Inline - Embed within a specific div element" 
                        />
                        <FormControlLabel 
                          value="fullpage" 
                          control={<Radio />} 
                          label="Full Page - Chatbot takes the entire page" 
                        />
                      </RadioGroup>
                    </FormControl>

                    {/* Position Selection */}
                    <FormControl fullWidth>
                      <InputLabel>Button Position</InputLabel>
                      <Select
                        value={settings.embedLocation}
                        label="Button Position"
                        onChange={(e) => setSettings({ ...settings, embedLocation: e.target.value })}
                        disabled={settings.embedType !== 'floating'}
                      >
                        <MenuItem value="bottom-right">Bottom Right</MenuItem>
                        <MenuItem value="bottom-left">Bottom Left</MenuItem>
                        <MenuItem value="top-right">Top Right</MenuItem>
                        <MenuItem value="top-left">Top Left</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Device Visibility */}
                    <FormControl fullWidth>
                      <InputLabel>Device Visibility</InputLabel>
                      <Select
                        value={settings.deviceVisibility}
                        label="Device Visibility"
                        onChange={(e) => setSettings({ ...settings, deviceVisibility: e.target.value })}
                      >
                        <MenuItem value="all">All Devices</MenuItem>
                        <MenuItem value="desktop">Desktop Only</MenuItem>
                        <MenuItem value="mobile">Mobile Only</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Auto Open Toggle */}
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={settings.autoOpen}
                          onChange={(e) => setSettings({...settings, autoOpen: e.target.checked})}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: settings.primaryColor,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: settings.primaryColor,
                            },
                          }}
                        />
                      }
                      label="Auto-open chat for new visitors"
                    />

                    {/* Custom CSS Toggle */}
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={settings.customCSS}
                          onChange={(e) => setSettings({...settings, customCSS: e.target.checked})}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: settings.primaryColor,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: settings.primaryColor,
                            },
                          }}
                        />
                      }
                      label="Enable custom CSS"
                    />

                    {/* Integration Code */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Integration Code</Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: '#1e1e2e',
                          color: '#f8f8f2',
                          fontFamily: 'monospace',
                          borderRadius: 2,
                          overflow: 'auto',
                          position: 'relative',
                        }}
                      >
                        <pre style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap' }}>
{`<!-- Add before closing </body> tag -->
<script src="https://cdn.chatbot.example/widget.js"></script>
<script>
  ChatBot.init({
    apiKey: "your-api-key",
    position: "${settings.embedLocation}",
    type: "${settings.embedType}",
    autoOpen: ${settings.autoOpen},
    devices: "${settings.deviceVisibility}"
  });
</script>`}
                        </pre>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: alpha(settings.primaryColor, 0.9),
                            color: '#fff',
                            '&:hover': {
                              bgcolor: settings.primaryColor,
                            },
                          }}
                          startIcon={<ContentCopyIcon />}
                        >
                          Copy
                        </Button>
                      </Paper>
                    </Box>

                    {/* Information box */}
                    <Box sx={{ 
                      borderRadius: 2, 
                      p: 2, 
                      bgcolor: alpha(settings.primaryColor, 0.05),
                      border: `1px solid ${alpha(settings.primaryColor, 0.1)}`,
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'text.secondary',
                        }}
                      >
                        <InfoIcon sx={{ fontSize: 18 }} />
                        Need help? Contact our developer support for custom integration options.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>
        );
      
      // Remove or modify the separate case 1 and 2
      case 1:
      case 2:
        // We'll use the unified structure above instead
        return getStepContent(0); // This reuses the layout from step 0
      
      default:
        return null;
    }
  };

  // Get speech bubble content
  const getSpeechBubbleContent = () => {
    if (isReturning) {
      return (
        <>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
            🎉 Your chatbot is all set up!<br />
            You'll be redirected to the dashboard shortly.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              disableElevation
              sx={{ 
                bgcolor: settings.primaryColor,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: alpha(settings.primaryColor, 0.85),
                  boxShadow: `0 3px 8px ${alpha(settings.primaryColor, 0.4)}`
                },
              }}
              onClick={handleFinalOnboarding}
            >
              Go to Dashboard
            </Button>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: "1.05rem", 
              fontWeight: 600,
              mb: 0.75,
            }}
          >
            Welcome to the Chatbot Setup
          </Typography>
          <Typography variant="body2" sx={{ 
            lineHeight: 1.5,
            color: theme.palette.text.secondary,
            mb: 2,
          }}>
            Let's quickly set up your chatbot with just a few simple steps.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            pt: 0.75,
            gap: 1,
            borderTop: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.08)
          }}>
            <Button
              variant="contained"
              size="small"
              disableElevation
              sx={{ 
                bgcolor: settings.primaryColor,
                fontWeight: 600,
                px: 2,
                py: 0.75,
                '&:hover': {
                  bgcolor: alpha(settings.primaryColor, 0.85),
                  boxShadow: `0 3px 8px ${alpha(settings.primaryColor, 0.4)}`
                },
              }}
              onClick={handleStartOnboarding}
            >
              Start Setup
            </Button>
          </Box>
        </>
      );
    }
  };

  // Bot icon component
  const FloatingBotIcon = () => (
    <AnimatePresence>
      {showBotIcon && !onboardingComplete && (
        <div
          ref={botIconRef}
          style={{
            position: "fixed",
            top: finalPosition.top || "auto",
            left: finalPosition.left || "auto", 
            bottom: finalPosition.top ? "auto" : "30px",
            right: finalPosition.left ? "auto" : "30px",
            transform: `scale(${finalPosition.scale || 1})`,
            zIndex: 1300,
            display: "inline-block",
            transition: iconClicked ? "none" : "all 0.5s ease",
            willChange: "transform"
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
                bgcolor: alpha(settings.primaryColor, 0.9),
                transform: "scale(1.05)",
              },
              fontSize: 32,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              ...(isReturning && {
                boxShadow: `0 0 15px 5px ${settings.primaryColor}80`,
              }),
            }}
          >
            {iconOptions.find(option => option.value === settings.iconType)?.icon || <SmartToyIcon />}
          </IconButton>
          
          <AnimatePresence>
            {showBotSpeech && (
              <motion.div
                ref={speechBubbleRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.19, 1.0, 0.22, 1.0]
                }}
                style={{
                  position: "absolute",
                  left: isReturning ? "-340px" : "110%",
                  top: "10%",
                  zIndex: 1400,
                  minWidth: 280,
                  maxWidth: 340,
                  transformOrigin: isReturning ? "right center" : "left center",
                  filter: "drop-shadow(0px 5px 15px rgba(0,0,0,0.15))",
                  willChange: "transform, opacity"
                }}
              >
                <Paper
                  elevation={isReturning ? 2 : 1}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    color: "text.primary",
                    boxShadow: theme.palette.mode === 'light' 
                      ? '0 10px 25px rgba(0,0,0,0.08)' 
                      : '0 10px 25px rgba(0,0,0,0.25)',
                    mb: 1,
                    position: "relative",
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    overflow: 'hidden',
                  }}
                >
                  {getSpeechBubbleContent()}
                  <Box sx={{
                    position: "absolute",
                    left: -10,
                    top: 24,
                    width: 0,
                    height: 0,
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderRight: `10px solid ${theme.palette.background.paper}`,
                    filter: "drop-shadow(-3px 2px 2px rgba(0,0,0,0.05))"
                  }} />
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
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 38px rgba(0,0,0,0.2)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        p: 4,
        background: `linear-gradient(135deg, ${alpha(settings.primaryColor, 0.08)} 0%, rgba(255,255,255,0) 100%)`
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: alpha(settings.primaryColor, 0.15),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <CelebrationIcon sx={{ fontSize: 36, color: settings.primaryColor }} />
          </Box>
          
          <Typography variant="h5" fontWeight="700" align="center" gutterBottom>
            Setup Complete!
          </Typography>
          
          <Typography variant="body1" align="center" paragraph sx={{ maxWidth: '80%', mb: 4 }}>
            Your chatbot <strong>{settings.botName}</strong> has been configured successfully. You'll now be redirected to the admin dashboard.
          </Typography>
          
          <Button
            onClick={handleFinalOnboarding}
            variant="contained"
            size="large"
            sx={{
              bgcolor: settings.primaryColor,
              color: "#fff",
              px: 4,
              py: 1.2,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              boxShadow: `0 8px 25px ${alpha(settings.primaryColor, 0.4)}`,
              '&:hover': {
                bgcolor: alpha(settings.primaryColor, 0.9),
                boxShadow: `0 10px 28px ${alpha(settings.primaryColor, 0.5)}`,
              },
              transition: 'all 0.3s ease'
            }}
            startIcon={<ArrowForwardIcon />}
          >
            Go to Dashboard
          </Button>
        </Box>
        
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: alpha(settings.primaryColor, 0.08),
            zIndex: 1
          }} 
        />
        
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            bgcolor: alpha(settings.primaryColor, 0.05),
            zIndex: 1
          }} 
        />
      </Box>
      
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          colors={[
            settings.primaryColor, 
            '#FFD700', 
            '#FF69B4', 
            '#00FFFF', 
            '#32CD32'
          ]}
        />
      )}
    </Dialog>
  );
  
  // White background overlay - Simplified so it persists during all onboarding states
  const WhiteBackgroundOverlay = () => <></>;
  
  return (
    <>
      <FloatingBotIcon />
      <AnimatePresence>
        {modalOpen && !isMorphing && (
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
              zIndex: 1400,
              backdropFilter: "blur(3px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.25 }}
              style={{
                width: "100%", // Full width
                height: "100%", // Full height
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                ...glassStyles,
                borderRadius: 0, // No border radius for full-screen
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
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6">Chatbot Setup</Typography>
                  <Chip 
                    label={`Step ${activeStep + 1} of ${steps.length}`} 
                    size="small" 
                    sx={{ 
                      ml: 2, 
                      bgcolor: alpha(settings.primaryColor, 0.2),
                      color: alpha(settings.primaryColor, 0.9),
                      borderRadius: '12px'
                    }} 
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": { color: "#fff" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
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
                                height:  24,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: active
                                  ? settings.primaryColor
                                  : "transparent",
                                border: completed && !active
                                  ? `2px solid ${settings.primaryColor}`
                                  : "none",
                              }}
                            >
                              {completed ? (
                                <CheckIcon sx={{ color: "#fff", fontSize: 18 }} />
                              ) : (
                                <Typography variant="caption" sx={{ color, fontWeight: "medium" }}>
                                  {index + 1}
                                </Typography>
                              )}
                            </Box>
                          );
                        }}
                      >
                        {step.label}
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
                  justifyContent: "flex-end", // Changed from space-between to flex-end
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Back and Next buttons on right side */}
                <Box>
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": { color: "#fff" },
                      mr: 1
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
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Rest of the components remain unchanged */}
      
      <AnimatePresence>
        {isMorphing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              zIndex: 1390,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Show confetti at the top level, independent of other components */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={400}
          recycle={false}
          colors={[
            settings.primaryColor, 
            '#FFD700', 
            '#FF69B4', 
            '#00FFFF', 
            '#32CD32'
          ]}
        />
      )}
    </>
  );
};

export default SimpleOnboarding;
