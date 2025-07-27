import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

// Framer Motion variant for form
const formVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation
  function validateForm() {
    let valid = true;
    const errors = { username: '', password: '' };

    if (!form.username.trim()) {
      errors.username = 'Username is required';
      valid = false;
    } else if (form.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      valid = false;
    }

    if (!form.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMsg('');
    setFieldErrors(old => ({ ...old, [e.target.name]: '' }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      // Always send a user role (default to 'user')
      await axios.post('http://127.0.0.1:8000/users/', { ...form, role: 'user' });
      setMsg('🎉 Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setMsg('');
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(circle at top, #6a0dad, #120030)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      {/* Floating softly animated blobs */}
      <motion.div
        variants={{ hidden: { rotate: 0 }, animate: { rotate: 360 } }}
        animate="animate"
        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          top: '20%',
          left: '10%',
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        variants={{ hidden: { rotate: 360 }, animate: { rotate: 0 } }}
        animate="animate"
        transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          top: '60%',
          right: '10%',
          filter: 'blur(100px)',
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <Paper
          elevation={12}
          sx={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            maxWidth: 360,
            width: '100%',
            color: '#fff'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              name="username"
              label="Username"
              variant="filled"
              fullWidth
              margin="normal"
              value={form.username}
              onChange={handleChange}
              required
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
              InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#eee' } }}
              disabled={loading}
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              variant="filled"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' } }}
              InputLabelProps={{ sx: { color: '#eee' } }}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                fontSize: '1.05rem',
                bgcolor: '#ffb300',
                color: '#120030',
                '&:hover': { bgcolor: '#ffc350' }
              }}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Box>
          {msg && <Alert severity="success" sx={{ mt: 2 }}>{msg}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Typography variant="body2" align="center" sx={{ mt: 2, color: '#fff' }}>
            Already registered?{' '}
            <Button
              variant="text"
              sx={{ color: '#ffeb99' }}
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Login
            </Button>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
