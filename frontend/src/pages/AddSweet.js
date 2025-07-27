import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AddSweet() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Optional: redirect to login if no token or role is not admin (UI protection)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token) {
      navigate("/login");
    } else if (role !== "admin") {
      setError("You do not have permission to add sweets.");
    }
    // else allow access, no redirect
  }, [navigate]);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  // Basic validation
  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Name is required.");
      return false;
    }
    if (!form.category.trim()) {
      setError("Category is required.");
      return false;
    }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      setError("Price must be a positive number.");
      return false;
    }
    if (
      !form.quantity ||
      isNaN(form.quantity) ||
      !Number.isInteger(Number(form.quantity)) ||
      Number(form.quantity) < 0
    ) {
      setError("Quantity must be a non-negative integer.");
      return false;
    }
    setError("");
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setMsg("");
    setError("");

    try {
      await axios.post(
        "http://127.0.0.1:8000/sweets/",
        {
          name: form.name,
          category: form.category,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMsg("🎉 Sweet added successfully!");
      setForm({ name: "", category: "", price: "", quantity: "" });
    } catch (err) {
      setMsg("");
      setError(
        err.response?.data?.detail || "Could not add sweet. Are you logged in as admin?"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #30004d, #120030)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      {/* Background animated blobs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          top: "15%",
          left: "5%",
          filter: "blur(80px)",
        }}
      />
      <motion.div
        animate={{ rotate: 0 }}
        transition={{ repeat: Infinity, duration: 70, ease: "linear" }}
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          bottom: "10%",
          right: "10%",
          filter: "blur(100px)",
        }}
      />

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={10}
          sx={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.12)",
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            color: "#fff",
            maxWidth: 400,
            width: "100%",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            🍭 Add New Sweet
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              variant="filled"
              margin="normal"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
            />
            <TextField
              label="Category"
              name="category"
              fullWidth
              variant="filled"
              margin="normal"
              value={form.category}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              step="0.01"
              fullWidth
              variant="filled"
              margin="normal"
              value={form.price}
              onChange={handleChange}
              required
              disabled={loading}
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              fullWidth
              variant="filled"
              margin="normal"
              value={form.quantity}
              onChange={handleChange}
              required
              disabled={loading}
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
                "&:hover": { bgcolor: "#ffc350" },
              }}
              disabled={loading}
            >
              {loading ? "Adding Sweet..." : "Add Sweet"}
            </Button>
          </Box>

          {msg && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {msg}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}
