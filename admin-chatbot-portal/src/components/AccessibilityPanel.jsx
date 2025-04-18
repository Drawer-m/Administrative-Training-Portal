import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Divider, Slider, Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip, Grid, Switch, Stack } from '@mui/material';
import { Brightness4, Brightness7, Contrast, TextFields, FormatLineSpacing, FormatBold, FormatItalic, FormatColorFill, Visibility, VisibilityOff } from '@mui/icons-material';
import { useThemeMode } from './Accesibility';

const themeOptions = [
  { key: 'light', label: 'Light', icon: <Brightness7 /> },
  { key: 'dark', label: 'Dark', icon: <Brightness4 /> },
  { key: 'high-contrast', label: 'High Contrast', icon: <Contrast /> },
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
  const { mode, setMode } = useThemeMode();
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [bgColor, setBgColor] = useState('#f8ede3');
  const [showFocusOutline, setShowFocusOutline] = useState(true);

  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.fontFamily = fontFamily;
    document.body.style.lineHeight = lineHeight;
    document.body.style.fontWeight = bold ? 'bold' : 'normal';
    document.body.style.fontStyle = italic ? 'italic' : 'normal';
    document.body.style.background = bgColor;
    document.body.style.outline = showFocusOutline ? '' : 'none';
  }, [fontSize, fontFamily, lineHeight, bold, italic, bgColor, showFocusOutline]);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Grid container spacing={4} justifyContent="flex-start" alignItems="stretch">
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 600, borderRadius: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Accessibility Options
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Theme
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  {themeOptions.map(option => (
                    <Tooltip key={option.key} title={option.label}>
                      <IconButton
                        color={mode === option.key ? 'primary' : 'default'}
                        onClick={() => setMode(option.key)}
                        aria-label={option.label}
                        sx={{
                          bgcolor: mode === option.key ? 'action.selected' : 'background.paper',
                          border: mode === option.key ? '2px solid' : '1px solid #eee',
                        }}
                      >
                        {option.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Background Color
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  {colorOptions.map(opt => (
                    <Tooltip key={opt.key} title={opt.label}>
                      <IconButton
                        onClick={() => setBgColor(opt.key)}
                        sx={{
                          bgcolor: opt.key,
                          border: bgColor === opt.key ? '2px solid #1976d2' : '1px solid #eee',
                          width: 28,
                          height: 28,
                        }}
                        aria-label={opt.label}
                      />
                    </Tooltip>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Font Size
                </Typography>
                <Slider
                  min={12}
                  max={28}
                  step={1}
                  value={fontSize}
                  onChange={(_, v) => setFontSize(v)}
                  valueLabelDisplay="auto"
                  aria-label="Font size"
                  sx={{ width: 170, mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Font Family
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel id="font-family-label">
                    <TextFields sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" />
                    Font
                  </InputLabel>
                  <Select
                    labelId="font-family-label"
                    value={fontFamily}
                    label="Font"
                    onChange={e => setFontFamily(e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    {fontOptions.map(opt => (
                      <MenuItem key={opt.key} value={opt.key}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Line Height
                </Typography>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel id="line-height-label">
                    <FormatLineSpacing sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" />
                    Line Height
                  </InputLabel>
                  <Select
                    labelId="line-height-label"
                    value={lineHeight}
                    label="Line Height"
                    onChange={e => setLineHeight(Number(e.target.value))}
                    sx={{ minWidth: 150 }}
                  >
                    {lineHeightOptions.map(opt => (
                      <MenuItem key={opt.key} value={opt.key}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Font Style
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Tooltip title="Bold">
                    <IconButton
                      color={bold ? 'primary' : 'default'}
                      onClick={() => setBold(v => !v)}
                      aria-label="Toggle bold"
                    >
                      <FormatBold />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Italic">
                    <IconButton
                      color={italic ? 'primary' : 'default'}
                      onClick={() => setItalic(v => !v)}
                      aria-label="Toggle italic"
                    >
                      <FormatItalic />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                  Focus Outline
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title="Toggle Focus Outline">
                    <IconButton
                      color={showFocusOutline ? 'primary' : 'default'}
                      onClick={() => setShowFocusOutline(v => !v)}
                      aria-label="Toggle focus outline"
                    >
                      {showFocusOutline ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Tooltip>
                  <Typography variant="body2">
                    {showFocusOutline ? 'On' : 'Off'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Grid>
    </Box>
  );
};

export default AccessibilityPanel;
