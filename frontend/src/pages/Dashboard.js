import React from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #210049, #15002d)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        color: "#fff"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 5,
            backdropFilter: "blur(6px)",
            bgcolor: "rgba(255,255,255,0.13)",
            color: "#fff",
            textAlign: "center"
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Sweet Shop Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "#eedaff" }}>
            {token
              ? `Welcome${username ? `, ${username}` : ""}! Select an action below:`
              : "Welcome! Please log in or register to get started."}
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => navigate("/sweets")}
              sx={{ bgcolor: "#ffb300", color: "#120030", "&:hover": { bgcolor: "#ffc350" } }}
            >
              View Sweets Inventory
            </Button>
            {token && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate("/add-sweet")}
              >
                Add New Sweet
              </Button>
            )}
            {userRole === "admin" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => navigate("/admin-panel")}
                >
                  Admin Panel
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate("/admin-users")}
                >
                  User Management
                </Button>
              </>
            )}
            {!token ? (
              <>
                <Button fullWidth variant="outlined" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button fullWidth variant="outlined" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            ) : (
              <Button fullWidth variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  );
}
