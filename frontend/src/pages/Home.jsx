import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Typography, CircularProgress,
  AppBar, Toolbar, IconButton, Link as MuiLink
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

const Home = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('Please upload an image.');
      return;
    }

    setLoading(true);
    setCaption('');
    setError('');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/image-to-text-gemini/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCaption(response.data.caption);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Image to Caption
          </Typography>
          <MuiLink
            component={Link}
            to="/history"
            color="inherit"
            underline="none"
            sx={{ marginRight: 2 }}
          >
            View Full History
          </MuiLink>
          <IconButton onClick={handleLogout} color="inherit">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Upload an Image
        </Typography>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {previewUrl && (
          <Box mt={2}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Caption'}
        </Button>

        {caption && (
          <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
            Caption: {caption}
          </Typography>
        )}

        {error && (
          <Typography variant="body1" sx={{ mt: 2, color: 'red' }}>
            {error}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Home;
