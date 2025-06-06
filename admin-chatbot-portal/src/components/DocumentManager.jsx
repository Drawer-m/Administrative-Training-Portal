import { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Paper, Breadcrumbs, Link, Grid, Card, CardContent, 
  CardActions, IconButton, Tooltip, TextField, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, Divider, Menu, MenuItem,
  alpha, useTheme, CircularProgress, Alert, Snackbar, ListItemIcon
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  ArrowUpward as UpIcon,
  CreateNewFolder as NewFolderIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as CopyIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  InsertDriveFile as DocIcon,
  Article as TextIcon
} from '@mui/icons-material';
import { useThemeMode } from './Accessibility';

// Mock data structure for files and folders
const mockFileSystem = {
  root: {
    id: 'root',
    name: 'Document Repository',
    type: 'folder',
    children: ['folder1', 'folder2', 'file1'],
  },
  folder1: {
    id: 'folder1',
    name: 'Training Documents',
    type: 'folder',
    parent: 'root',
    children: ['folder3', 'file2', 'file3'],
  },
  folder2: {
    id: 'folder2',
    name: 'Reference Materials',
    type: 'folder',
    parent: 'root',
    children: ['file4', 'file5'],
  },
  folder3: {
    id: 'folder3',
    name: 'Course Materials',
    type: 'folder',
    parent: 'folder1',
    children: ['file6', 'file7'],
  },
  file1: {
    id: 'file1',
    name: 'Getting Started Guide.pdf',
    type: 'file', 
    fileType: 'pdf',
    size: '2.5 MB',
    modified: '2023-11-15',
    parent: 'root',
  },
  file2: {
    id: 'file2',
    name: 'Student Handbook.docx',
    type: 'file',
    fileType: 'docx',
    size: '1.8 MB',
    modified: '2023-12-01',
    parent: 'folder1',
  },
  file3: {
    id: 'file3',
    name: 'Registration Process.pdf',
    type: 'file',
    fileType: 'pdf',
    size: '3.2 MB',
    modified: '2023-10-22',
    parent: 'folder1',
  },
  file4: {
    id: 'file4',
    name: 'FAQ Document.pdf',
    type: 'file',
    fileType: 'pdf',
    size: '0.9 MB',
    modified: '2023-12-10',
    parent: 'folder2',
  },
  file5: {
    id: 'file5',
    name: 'Campus Map.jpg',
    type: 'file',
    fileType: 'jpg',
    size: '4.7 MB',
    modified: '2023-09-05',
    parent: 'folder2',
  },
  file6: {
    id: 'file6',
    name: 'Course Syllabus.pdf',
    type: 'file',
    fileType: 'pdf',
    size: '1.2 MB',
    modified: '2023-11-20',
    parent: 'folder3',
  },
  file7: {
    id: 'file7',
    name: 'Assignment Guidelines.docx',
    type: 'file',
    fileType: 'docx',
    size: '0.8 MB',
    modified: '2023-12-05',
    parent: 'folder3',
  },
};

// File type groups for icons
const fileTypeIcons = {
  pdf: <PdfIcon sx={{ fontSize: 54, color: '#f44336' }} />,
  doc: <DocIcon sx={{ fontSize: 54, color: '#2196f3' }} />,
  docx: <DocIcon sx={{ fontSize: 54, color: '#2196f3' }} />,
  xls: <DocIcon sx={{ fontSize: 54, color: '#4caf50' }} />,
  xlsx: <DocIcon sx={{ fontSize: 54, color: '#4caf50' }} />,
  ppt: <DocIcon sx={{ fontSize: 54, color: '#ff9800' }} />,
  pptx: <DocIcon sx={{ fontSize: 54, color: '#ff9800' }} />,
  txt: <TextIcon sx={{ fontSize: 54, color: '#607d8b' }} />,
  jpg: <ImageIcon sx={{ fontSize: 54, color: '#9c27b0' }} />,
  jpeg: <ImageIcon sx={{ fontSize: 54, color: '#9c27b0' }} />,
  png: <ImageIcon sx={{ fontSize: 54, color: '#9c27b0' }} />,
  gif: <ImageIcon sx={{ fontSize: 54, color: '#9c27b0' }} />,
  mp3: <AudioIcon sx={{ fontSize: 54, color: '#3f51b5' }} />,
  wav: <AudioIcon sx={{ fontSize: 54, color: '#3f51b5' }} />,
  mp4: <VideoIcon sx={{ fontSize: 54, color: '#e91e63' }} />,
  avi: <VideoIcon sx={{ fontSize: 54, color: '#e91e63' }} />,
  mov: <VideoIcon sx={{ fontSize: 54, color: '#e91e63' }} />,
};

const DocumentManager = () => {
  const [fileSystem, setFileSystem] = useState(() => {
    const saved = localStorage.getItem('fileSystem');
    return saved ? JSON.parse(saved) : mockFileSystem;
  });
  
  const [currentFolder, setCurrentFolder] = useState('root');
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: 'root', name: 'Home' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const fileInputRef = useRef(null);
  
  const theme = useTheme();
  const { mode } = useThemeMode();

  // Save file system to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

  // Navigate to a folder
  const navigateToFolder = (folderId) => {
    setCurrentFolder(folderId);
    
    // Update breadcrumbs
    const newBreadcrumbs = [];
    let current = fileSystem[folderId];
    newBreadcrumbs.unshift({ id: current.id, name: current.name });
    
    while (current.parent) {
      current = fileSystem[current.parent];
      newBreadcrumbs.unshift({ id: current.id, name: current.name });
    }
    
    // If we're at the root, make sure we have a "Home" breadcrumb
    if (folderId === 'root') {
      setBreadcrumbs([{ id: 'root', name: 'Home' }]);
    } else {
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  // Navigate up one level
  const navigateUp = () => {
    if (currentFolder !== 'root') {
      const parentId = fileSystem[currentFolder].parent;
      navigateToFolder(parentId);
    }
  };

  // Handle item click (navigate to folder or view file)
  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    } else {
      setSelectedItem(item);
      // In a real app, open the file for viewing
      console.log("Viewing file:", item.name);
    }
  };

  // Handle menu open
  const handleMenuClick = (event, item) => {
    event.stopPropagation();
    setSelectedItem(item);
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Start renaming process
  const handleRename = () => {
    setNewName(selectedItem.name);
    setIsRenaming(true);
    handleMenuClose();
  };

  // Complete rename process
  const completeRename = () => {
    if (newName.trim()) {
      const updatedFileSystem = { ...fileSystem };
      updatedFileSystem[selectedItem.id] = {
        ...updatedFileSystem[selectedItem.id],
        name: newName,
      };
      setFileSystem(updatedFileSystem);
    }
    setIsRenaming(false);
    setSelectedItem(null);
  };

  // Delete item
  const handleDelete = () => {
    const updatedFileSystem = { ...fileSystem };
    
    // Remove from parent's children list
    const parentId = selectedItem.parent;
    const parent = updatedFileSystem[parentId];
    const updatedChildren = parent.children.filter(id => id !== selectedItem.id);
    updatedFileSystem[parentId] = {
      ...parent,
      children: updatedChildren
    };
    
    // If it's a folder, we would need to recursively delete all children
    // For simplicity, we'll just delete the item itself in this example
    delete updatedFileSystem[selectedItem.id];
    
    setFileSystem(updatedFileSystem);
    handleMenuClose();
    
    setSnackbar({
      open: true,
      message: `${selectedItem.name} has been deleted`,
      severity: 'success'
    });
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      // Generate a unique ID - in a real app, use a proper ID generation method
      const newId = `folder${Date.now()}`;
      
      const updatedFileSystem = { ...fileSystem };
      updatedFileSystem[newId] = {
        id: newId,
        name: newFolderName,
        type: 'folder',
        parent: currentFolder,
        children: [],
      };
      
      // Add to current folder's children
      updatedFileSystem[currentFolder] = {
        ...updatedFileSystem[currentFolder],
        children: [...updatedFileSystem[currentFolder].children, newId]
      };
      
      setFileSystem(updatedFileSystem);
      setNewFolderName('');
      setIsNewFolderDialogOpen(false);
      
      setSnackbar({
        open: true,
        message: `Folder "${newFolderName}" created successfully`,
        severity: 'success'
      });
    }
  };

  // Handle file selection from the device
  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };
  
  // Handle file upload
  const handleFileUpload = async () => {
    if (files.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one file to upload",
        severity: "error"
      });
      return;
    }
    
    setUploading(true);
    let progressIncrement = 100 / files.length;
    
    const updatedFileSystem = { ...fileSystem };
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulating upload delay
      await new Promise(r => setTimeout(r, 500));
      
      // Generate unique ID for the file
      const newId = `file${Date.now()}-${i}`;
      
      // Get file extension
      const extension = file.name.split('.').pop().toLowerCase();
      
      // Get file size in MB
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      
      // Add file to the file system
      updatedFileSystem[newId] = {
        id: newId,
        name: file.name,
        type: 'file',
        fileType: extension,
        size: `${sizeInMB} MB`,
        modified: new Date().toISOString().split('T')[0],
        parent: currentFolder,
      };
      
      // Add to current folder's children
      updatedFileSystem[currentFolder] = {
        ...updatedFileSystem[currentFolder],
        children: [...updatedFileSystem[currentFolder].children, newId]
      };
      
      // Update progress
      setUploadProgress((i + 1) * progressIncrement);
    }
    
    setFileSystem(updatedFileSystem);
    setUploading(false);
    setUploadProgress(0);
    setFiles([]);
    setUploadDialogOpen(false);
    
    setSnackbar({
      open: true,
      message: `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`,
      severity: "success"
    });
  };

  // Handle downloadFile
  const handleDownloadFile = () => {
    // In a real application, this would initiate a download
    // For this demo, we'll just show a snackbar
    handleMenuClose();
    setSnackbar({
      open: true,
      message: `Download started for ${selectedItem.name}`,
      severity: "info"
    });
  };

  const closeSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Get filtered items based on search or current folder
  const getFilteredItems = () => {
    if (searchQuery) {
      // If searching, find all items that match the query
      const results = Object.values(fileSystem).filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return results;
    } else {
      // Otherwise show contents of current folder
      const folder = fileSystem[currentFolder];
      if (!folder || !folder.children) return [];
      
      return folder.children.map(id => fileSystem[id]).sort((a, b) => {
        // Folders first, then files
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
    }
  };

  // Get the appropriate icon based on file type
  const getFileIcon = (item) => {
    if (item.type === 'folder') {
      return <FolderIcon sx={{ fontSize: 54, color: '#ffc107' }} />;
    }

    const extension = item.fileType || item.name.split('.').pop().toLowerCase();
    return fileTypeIcons[extension] || <FileIcon sx={{ fontSize: 54, color: '#607d8b' }} />;
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center"
          sx={{
            fontWeight: 800,
            letterSpacing: '0.5px',
            mb: 1,
            fontSize: { xs: '1.8rem', md: '2.2rem' },
            background: 'linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          Document Manager
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          sx={{ color: 'text.secondary', mb: 3 }}
        >
          Manage documents and knowledge base for the chatbot
        </Typography>

        <Paper
          sx={{
            p: 2,
            mb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
            bgcolor: 'var(--surface-color)',
            border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
          }}
        >
          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
            <TextField
              fullWidth
              placeholder="Search files and folders..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <Tooltip title="Go up one level">
              <span>
                <IconButton 
                  onClick={navigateUp}
                  disabled={currentFolder === 'root' || searchQuery}
                  color="primary"
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                >
                  <UpIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="New Folder">
              <IconButton 
                onClick={() => setIsNewFolderDialogOpen(true)}
                disabled={searchQuery}
                color="primary"
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
              >
                <NewFolderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload Files">
              <IconButton 
                onClick={() => setUploadDialogOpen(true)}
                disabled={searchQuery}
                color="secondary"
                sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}
              >
                <UploadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Breadcrumbs Navigation */}
        {!searchQuery && (
          <Paper 
            sx={{ 
              p: 1.5, 
              mb: 2, 
              borderRadius: 1,
              bgcolor: mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.light, 0.3),
              display: 'flex',
              alignItems: 'center',
              overflowX: 'auto'
            }}
          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ whiteSpace: 'nowrap' }}>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography 
                    key={crumb.id} 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}
                  >
                    {crumb.name}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.id}
                    component="button"
                    onClick={() => navigateToFolder(crumb.id)}
                    sx={{ 
                      cursor: 'pointer',
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {crumb.name}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Paper>
        )}
      </Box>

      {/* File and Folder Grid */}
      <Grid container spacing={2}>
        {getFilteredItems().map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card 
              onClick={() => handleItemClick(item)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                },
                height: '100%',
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'var(--surface-color)',
                border: mode === 'high-contrast' ? '1px solid var(--border-color)' : 'none',
              }}
            >
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pt: 3
              }}>
                {getFileIcon(item)}
                
                {isRenaming && selectedItem?.id === item.id ? (
                  <TextField
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={completeRename}
                    onKeyPress={(e) => e.key === 'Enter' && completeRename()}
                    size="small"
                    fullWidth
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    sx={{ mt: 1.5 }}
                  />
                ) : (
                  <Typography 
                    variant="subtitle1" 
                    align="center" 
                    noWrap
                    sx={{ fontWeight: 500, mt: 1.5 }}
                  >
                    {item.name}
                  </Typography>
                )}
                
                {item.type === 'file' && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mt: 1 }}
                  >
                    {item.size} • {item.modified}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'flex-end', pb: 1.5, pt: 0.5 }}>
                <Tooltip title="More options">
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuClick(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
        
        {/* Empty state when no items found */}
        {getFilteredItems().length === 0 && (
          <Box 
            sx={{ 
              width: '100%', 
              p: 4,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center'
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
              {searchQuery ? (
                <SearchIcon sx={{ fontSize: '3rem', color: 'primary.main', opacity: 0.7 }} />
              ) : (
                <FolderIcon sx={{ fontSize: '3rem', color: 'primary.main', opacity: 0.7 }} />
              )}
            </Box>
            <Typography variant="h6" gutterBottom>
              {searchQuery ? 'No results found' : 'This folder is empty'}
            </Typography>
            <Typography color="text.secondary" align="center">
              {searchQuery 
                ? 'Try a different search term or browse folders instead.' 
                : 'Create a new folder or upload files to get started.'}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                sx={{ mt: 2 }}
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload Files
              </Button>
            )}
          </Box>
        )}
      </Grid>

      {/* Item Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRename}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Rename
        </MenuItem>
        {selectedItem?.type === 'file' && (
          <MenuItem onClick={handleDownloadFile}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            Download
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onClose={() => setIsNewFolderDialogOpen(false)}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewFolderDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateFolder} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Files Dialog */}
      <Dialog 
        open={uploadDialogOpen} 
        onClose={() => {
          if (!uploading) setUploadDialogOpen(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          {!uploading ? (
            <>
              <Typography variant="body2" paragraph>
                Select files to upload to the current folder.
              </Typography>
              <Box 
                sx={{ 
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  p: 3,
                  mb: 2,
                  textAlign: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="*/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelection}
                />
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7, mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Drag files here or click to browse
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF, Word, Excel, Images, and other file types supported
                </Typography>
              </Box>
              
              {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {files.length} file{files.length > 1 ? 's' : ''} selected:
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      maxHeight: 150, 
                      overflowY: 'auto',
                      p: 1
                    }}
                  >
                    {files.map((file, i) => (
                      <Box 
                        key={i} 
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 0.5,
                          borderBottom: i < files.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <FileIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                          {file.name}
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress
                variant="determinate"
                value={uploadProgress}
                size={60}
                thickness={4}
                sx={{ mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Uploading Files...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(uploadProgress)}% complete
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setUploadDialogOpen(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFileUpload}
            variant="contained" 
            color="secondary"
            disabled={uploading || files.length === 0}
            startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentManager;
