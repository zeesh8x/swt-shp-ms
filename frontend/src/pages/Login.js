import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert
} from "@mui/material";
import { motion } from "framer-motion";

// Animation settings
const formVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append("username", form.username);
      params.append("password", form.password);

      const res = await axios.post("http://127.0.0.1:8000/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      // Store token as before
      const token = res.data.access_token;
      localStorage.setItem("token", token);

      // Decode JWT to extract role and username, and store them as well
      const payload = jwtDecode(token);
      // payload.role and payload.sub are available if your backend JWT has them!
      if (payload.role) {
        localStorage.setItem("userRole", payload.role);
      }
      if (payload.sub) {
        localStorage.setItem("username", payload.sub);
      }

      setMsg("🎉 Login successful! Redirecting...");
      setTimeout(() => navigate("/sweets"), 1000);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.detail || "Login failed"));
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "radial-gradient(circle at top, #120030, #370066)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      {/* Floating animated blobs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.12)",
          top: "25%",
          left: "5%",
          filter: "blur(80px)"
        }}
      />
      <motion.div
        animate={{ rotate: 0 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "60%",
          right: "10%",
          filter: "blur(100px)"
        }}
      />

      {/* Login Card */}
      <motion.div initial="hidden" animate="visible" variants={formVariants}>
        <Paper
          elevation={10}
          sx={{
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            maxWidth: 360,
            width: "100%",
            color: "#fff"
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Welcome Back
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
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
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
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.3,
                fontSize: "1.05rem",
                bgcolor: "#ffb300",
                color: "#120030",
                "&:hover": { bgcolor: "#ffc350" }
              }}
            >
              Login
            </Button>
          </Box>
          {msg && (
            <Alert
              severity={msg.includes("successful") ? "success" : "error"}
              sx={{ mt: 2 }}
            >
              {msg}
            </Alert>
          )}
          <Typography variant="body2" align="center" sx={{ mt: 2, color: "#fff" }}>
            Don't have an account?{" "}
            <Button variant="text" sx={{ color: "#ffeb99" }} onClick={() => navigate("/register")}>
              Register
            </Button>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
