import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [sweets, setSweets] = useState([]);
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // Optionally fetch sweets for simple analytics
    const token = localStorage.getItem("token");
    if (role === "admin" && token) {
      axios.get("http://127.0.0.1:8000/sweets/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setSweets(res.data))
      .catch(() => setMessage("Could not fetch summary data."));
    }
  }, []);

  // UI protection: Only allow admins
  if (userRole !== "admin") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#1a1136",
          color: "#fff"
        }}>
        <Paper elevation={10} sx={{ p: 4, bgcolor: "rgba(255,255,255,0.06)", color: "#fff" }}>
          <Typography variant="h5">Access Denied</Typography>
          <Typography sx={{ mt: 2 }}>You must be an admin to view this page.</Typography>
          <Button sx={{ mt: 2 }} variant="outlined" color="secondary" onClick={() => navigate("/")}>
            Go back
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #28004a, #10002d)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        color: "#fff"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.09)",
            color: "#fff",
            boxShadow: "0 6px 32px 0 rgba(122,87,255,0.14)"
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography sx={{ mb: 2, color: "#eee" }}>
            Welcome, <b>Admin</b>! Here you can manage all sweets and users.
          </Typography>
          {message && <Alert severity="warning">{message}</Alert>}

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2, textAlign: "center", bgcolor: "#6742e383" }}>
                <Typography variant="h6">Total Sweets</Typography>
                <Typography variant="h4">{sweets.length}</Typography>
              </Paper>
            </Grid>
            {/* Add more stats/cards here (users, orders, etc.) as needed */}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ my: 2, bgcolor: "#ffb300", color: "#120030", "&:hover": { bgcolor: "#ffecb3" } }}
            onClick={() => navigate("/add-sweet")}
          >
            + Add New Sweet
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate("/sweets")}
          >
            View & Manage Sweets
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}
