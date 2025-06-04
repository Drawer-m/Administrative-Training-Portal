import { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Divider, Slider, Select, MenuItem, 
  FormControl, InputLabel, IconButton, Tooltip, Grid, Switch, 
  Stack, Card, CardContent, CardHeader, Avatar, useTheme
} from '@mui/material';
import { 
  Brightness4, Brightness7, Contrast, TextFields, 
  FormatLineSpacing, FormatBold, FormatItalic, 
  Visibility, VisibilityOff, Palette, Settings, 
  FormatSize, Bookmark, FontDownload
} from '@mui/icons-material';
import { useThemeMode } from './Accessibility';

const themeOptions = [
  { key: 'light', label: 'Light', icon: <Brightness7 />, color: '#f5f5f5' },
  { key: 'dark', label: 'Dark', icon: <Brightness4 />, color: '#121212' },
  { key: 'high-contrast', label: 'High Contrast', icon: <Contrast />, color: '#000000' },
  { key: 'blue', label: 'Blue', icon: <Brightness7 />, color: '#e3f2fd' },
  { key: 'warm', label: 'Warm', icon: <Brightness7 />, color: '#fff3e0' },
  { key: 'nature', label: 'Nature', icon: <Brightness7 />, color: '#e8f5e9' },
];

const fontOptions = [
  { key: 'system-ui', label: 'System Default' },
  { key: 'Arial', label: 'Arial' },
  { key: 'Georgia', label: 'Georgia' },
  { key: 'Comic Sans MS', label: 'Comic Sans' },
  { key: 'Courier New', label: 'Courier New' },
  { key: 'Tahoma', label: 'Tahoma' },
];

const colorOptions = [
  { key: '#f8ede3', label: 'Peach' },
  { key: '#e0c3fc', label: 'Lavender' },
  { key: '#b5ead7', label: 'Mint' },
  { key: '#fff1e6', label: 'Cream' },
  { key: '#e3f2fd', label: 'Pastel Blue' },
  { key: '#f9f7d9', label: 'Lemon' },
  { key: '#ffffff', label: 'White' },
  { key: '#000000', label: 'Black' },
];

const lineHeightOptions = [
  { key: 1, label: 'Normal' },
  { key: 1.5, label: 'Relaxed' },
  { key: 2, label: 'Double' },
];

const AccessibilityPanel = () => {
  const { mode, setMode, currentTheme } = useThemeMode();
  const theme = useTheme();
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [bgColor, setBgColor] = useState('#f8ede3');
  const [showFocusOutline, setShowFocusOutline] = useState(true);
  const [useCustomColors, setUseCustomColors] = useState(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibilityFontSize');
    const savedFontFamily = localStorage.getItem('accessibilityFontFamily');
    const savedLineHeight = localStorage.getItem('accessibilityLineHeight');
    const savedBold = localStorage.getItem('accessibilityBold');
    const savedItalic = localStorage.getItem('accessibilityItalic');
    const savedShowFocusOutline = localStorage.getItem('accessibilityShowFocusOutline');
    const savedUseCustomColors = localStorage.getItem('accessibilityUseCustomColors');
    const savedBgColor = localStorage.getItem('accessibilityBgColor');

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedLineHeight) setLineHeight(parseFloat(savedLineHeight));
    if (savedBold) setBold(savedBold === 'true');
    if (savedItalic) setItalic(savedItalic === 'true');
    if (savedShowFocusOutline) setShowFocusOutline(savedShowFocusOutline === 'true');
    if (savedUseCustomColors) setUseCustomColors(savedUseCustomColors === 'true');
    if (savedBgColor) setBgColor(savedBgColor);
  }, []);

  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.fontFamily = fontFamily;
    document.body.style.lineHeight = lineHeight;
    document.body.style.fontWeight = bold ? 'bold' : 'normal';
    document.body.style.fontStyle = italic ? 'italic' : 'normal';

    if (useCustomColors) {
      document.body.style.setProperty('--bg-color', bgColor);
      document.body.style.background = bgColor;
      document.body.classList.add('using-custom-bg');
    } else {
      document.body.classList.remove('using-custom-bg');
      document.body.style.background = '';
      document.body.style.removeProperty('--custom-bg');
    }

    if (showFocusOutline) {
      document.body.classList.remove('no-focus-outline');
    } else {
      document.body.classList.add('no-focus-outline');
    }

    localStorage.setItem('accessibilityFontSize', fontSize);
    localStorage.setItem('accessibilityFontFamily', fontFamily);
    localStorage.setItem('accessibilityLineHeight', lineHeight);
    localStorage.setItem('accessibilityBold', bold);
    localStorage.setItem('accessibilityItalic', italic);
    localStorage.setItem('accessibilityShowFocusOutline', showFocusOutline);
    localStorage.setItem('accessibilityUseCustomColors', useCustomColors);
    localStorage.setItem('accessibilityBgColor', bgColor);
  }, [fontSize, fontFamily, lineHeight, bold, italic, bgColor, showFocusOutline, useCustomColors, mode]);

  const handleThemeChange = (newMode) => {
    setMode(newMode);
    setUseCustomColors(false);
  };

  const handleCustomBgColor = (color) => {
    setBgColor(color);
    setUseCustomColors(true);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      mt: 3, 
      mb: 6, 
      px: { xs: 2, md: 4 }
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 0, 
          borderRadius: 3, 
          overflow: 'hidden',
          background: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box 
          sx={{ 
            p: { xs: 3, sm: 4 },
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
        >
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
          >
            <Settings 
              sx={{ 
                fontSize: 36,
                bgcolor: 'rgba(255,255,255,0.2)',
                p: 1,
                borderRadius: '50%'
              }} 
            />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Accessibility Settings
              </Typography>
              <Typography variant="subtitle1">
                Customize your experience to suit your needs
              </Typography>
            </Box>
          </Stack>
        </Box>
        
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <Palette />
                    </Avatar>
                  }
                  title={<Typography variant="h6" fontWeight="bold">Theme Options</Typography>}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Choose a theme that works best for your visual preferences
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={3} // Increased spacing
                    sx={{ mb: 4 }} // Increased bottom margin
                    justifyContent="space-around"
                    flexWrap="wrap" // Allow wrapping for smaller screens
                    gap={2} // Gap between wrapped items
                  >
                    {themeOptions.map(option => (
                      <Tooltip key={option.key} title={option.label} arrow>
                        <Card 
                          onClick={() => handleThemeChange(option.key)}
                          sx={{
                            width: 90, // Increased width
                            cursor: 'pointer',
                            bgcolor: option.color,
                            border: mode === option.key ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                            transform: mode === option.key ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.3s', // Slightly longer transition
                            borderRadius: 2,
                            boxShadow: mode === option.key ? 3 : 0,
                            '&:hover': {
                              boxShadow: 2,
                              transform: 'scale(1.03)'
                            }
                          }}
                        >
                          <Box 
                            sx={{
                              p: 2.5, // Increased padding
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              color: option.key === 'dark' || option.key === 'high-contrast' ? '#fff' : '#000'
                            }}
                          >
                            {option.icon}
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                mt: 1.5, // Increased margin top
                                fontWeight: mode === option.key ? 'bold' : 'normal'
                              }}
                            >
                              {option.label}
                            </Typography>
                          </Box>
                        </Card>
                      </Tooltip>
                    ))}
                  </Stack>
                  
                  <Divider sx={{ mb: 3, mt: 1 }} /> {/* Added divider for visual separation */}
                  
                  <Box sx={{ mt: 4 }}> {/* Increased top margin */}
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Custom Background
                    </Typography>
                    <Stack 
                      direction="row"
                      spacing={2} 
                      alignItems="center" 
                      sx={{ mt: 1 }}
                    >
                      <Typography variant="body2">Enable custom colors</Typography>
                      <Switch
                        checked={useCustomColors}
                        onChange={(e) => setUseCustomColors(e.target.checked)}
                        color="primary"
                      />
                    </Stack>
                    
                    <Box 
                      sx={{ 
                        mt: 2, 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: 1.5
                      }}
                    >
                      {colorOptions.map(opt => (
                        <Tooltip key={opt.key} title={opt.label} arrow>
                          <Box
                            onClick={() => useCustomColors && handleCustomBgColor(opt.key)}
                            sx={{
                              bgcolor: opt.key,
                              border: bgColor === opt.key && useCustomColors 
                                ? `2px solid ${theme.palette.primary.main}` 
                                : '1px solid #ddd',
                              borderRadius: 1.5,
                              height: 36,
                              cursor: useCustomColors ? 'pointer' : 'default',
                              opacity: useCustomColors ? 1 : 0.6,
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: useCustomColors ? 'scale(1.05)' : 'none',
                              }
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <FormatSize />
                    </Avatar>
                  }
                  title={<Typography variant="h6" fontWeight="bold">Text Settings</Typography>}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Font Size: {fontSize}px
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" fontSize="0.8rem">A</Typography>
                        <Slider
                          min={12}
                          max={28}
                          step={1}
                          value={fontSize}
                          onChange={(_, v) => setFontSize(v)}
                          valueLabelDisplay="auto"
                          aria-label="Font size"
                        />
                        <Typography variant="body2" fontSize="1.5rem">A</Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Font Family
                      </Typography>
                      <FormControl fullWidth size="small">
                        <InputLabel id="font-family-label">Font</InputLabel>
                        <Select
                          labelId="font-family-label"
                          value={fontFamily}
                          label="Font"
                          onChange={e => setFontFamily(e.target.value)}
                          startAdornment={<FontDownload sx={{ mr: 1, ml: -0.5 }} fontSize="small" />}
                        >
                          {fontOptions.map(opt => (
                            <MenuItem 
                              key={opt.key} 
                              value={opt.key}
                              sx={{ fontFamily: opt.key }}
                            >
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Line Height
                      </Typography>
                      <FormControl fullWidth size="small">
                        <InputLabel id="line-height-label">Spacing</InputLabel>
                        <Select
                          labelId="line-height-label"
                          value={lineHeight}
                          label="Spacing"
                          onChange={e => setLineHeight(Number(e.target.value))}
                          startAdornment={<FormatLineSpacing sx={{ mr: 1, ml: -0.5 }} fontSize="small" />}
                        >
                          {lineHeightOptions.map(opt => (
                            <MenuItem key={opt.key} value={opt.key}>{opt.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Text Style & Visibility
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Bold Text">
                            <IconButton
                              color={bold ? 'primary' : 'default'}
                              onClick={() => setBold(v => !v)}
                              aria-label="Toggle bold"
                              sx={{
                                border: bold ? `1px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                                borderRadius: 1,
                              }}
                            >
                              <FormatBold />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Italic Text">
                            <IconButton
                              color={italic ? 'primary' : 'default'}
                              onClick={() => setItalic(v => !v)}
                              aria-label="Toggle italic"
                              sx={{
                                border: italic ? `1px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                                borderRadius: 1,
                              }}
                            >
                              <FormatItalic />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2">Focus Outline:</Typography>
                          <Switch
                            checked={showFocusOutline}
                            onChange={() => setShowFocusOutline(v => !v)}
                            color="primary"
                            icon={<VisibilityOff fontSize="small" />}
                            checkedIcon={<Visibility fontSize="small" />}
                          />
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              These settings are saved automatically and will be applied to your next visit
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AccessibilityPanel;
