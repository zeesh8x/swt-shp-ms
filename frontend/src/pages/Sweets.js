import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Paper,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

  // Purchase dialog states
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState("");

  // Restock dialog states
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockSweet, setRestockSweet] = useState(null);
  const [restockQty, setRestockQty] = useState("");

  // Notifications
  const [notification, setNotification] = useState({ message: "", severity: "" });

  // Search/filter states
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    min_price: "",
    max_price: ""
  });

  const navigate = useNavigate();

  // Load sweets and user role on mount
  useEffect(() => {
    fetchSweets();
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
  }, []);

  // Fetch sweets - used initially and after actions like search, restock, purchase
  async function fetchSweets(params) {
  const token = localStorage.getItem("token");
  try {
    const url = params ? `http://127.0.0.1:8000/sweets/search?${params}` : "http://127.0.0.1:8000/sweets/";
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    setSweets(res.data);
  } catch (error) {
    setError("Failed to fetch sweets.");
  }
}

  // Handlers for search inputs
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Execute search
const handleSearch = (e) => {
  e.preventDefault();
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (key === "min_price" || key === "max_price") {
      if (value !== "" && !isNaN(Number(value))) {
        params.append(key, Number(value));
      }
    } else if (typeof value === "string" && value.trim() !== "") {
      params.append(key, value.trim());
    }
  });

  fetchSweets(params.toString());
};
  // Admin Edit handler
  function handleEdit(id) {
    navigate(`/edit-sweet/${id}`);
  }

  // Admin Delete handler
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSweets((prev) => prev.filter((sweet) => sweet.id !== id));
      setNotification({ message: "Sweet deleted successfully", severity: "success" });
    } catch {
      setNotification({ message: "Failed to delete sweet. Make sure you have admin rights.", severity: "error" });
    }
  }

  // Purchase dialog handlers
  function openPurchaseDialog(sweet) {
    setSelectedSweet(sweet);
    setPurchaseQty("");
    setPurchaseOpen(true);
  }
  function closePurchaseDialog() {
    setSelectedSweet(null);
    setPurchaseQty("");
    setPurchaseOpen(false);
  }
  async function handlePurchase() {
    const qty = parseInt(purchaseQty, 10);
    if (!qty || qty <= 0) {
      setNotification({ message: "Please enter a valid quantity", severity: "error" });
      return;
    }
    if (qty > selectedSweet.quantity) {
      setNotification({ message: "Not enough stock available", severity: "error" });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://127.0.0.1:8000/purchase/${selectedSweet.id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSweets((prev) =>
        prev.map(sweet => sweet.id === selectedSweet.id ? res.data : sweet)
      );
      setNotification({ message: "Purchase successful! Thank you.", severity: "success" });
      closePurchaseDialog();
    } catch (err) {
      const detail = err.response?.data?.detail || "Purchase failed";
      setNotification({ message: detail, severity: "error" });
    }
  }

  // Restock dialog handlers (Admin only)
  function openRestockDialog(sweet) {
    setRestockSweet(sweet);
    setRestockQty("");
    setRestockOpen(true);
  }
  function closeRestockDialog() {
    setRestockSweet(null);
    setRestockQty("");
    setRestockOpen(false);
  }
  async function handleRestock() {
    const qty = parseInt(restockQty, 10);
    if (!qty || qty <= 0) {
      setNotification({ message: "Please enter a valid restock quantity", severity: "error" });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://127.0.0.1:8000/sweets/${restockSweet.id}/restock`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSweets(prev => prev.map(s => s.id === restockSweet.id ? res.data : s));
      setNotification({ message: "Sweet restocked successfully.", severity: "success" });
      closeRestockDialog();
    } catch {
      setNotification({ message: "Failed to restock sweet.", severity: "error" });
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #30004d, #120030)",
        position: "relative",
        overflow: "hidden",
        p: { xs: 3, sm: 6 }
      }}
    >
      {/* Animated Background Blobs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "20%",
          left: "5%",
          filter: "blur(100px)"
        }}
      />
      <motion.div
        animate={{ rotate: 0 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          top: "70%",
          right: "10%",
          filter: "blur(80px)"
        }}
      />

      {/* Search Form */}
      <Paper
        elevation={8}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.15)",
          borderRadius: 3,
          p: 2,
          mb: 4,
          maxWidth: 1000,
          marginX: "auto",
          color: "#fff"
        }}
      >
        <form onSubmit={handleSearch}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <TextField
              label="Name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              variant="filled"
              size="small"
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
              sx={{ flex: 1, minWidth: 120 }}
            />
            <TextField
              label="Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              variant="filled"
              size="small"
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
              sx={{ flex: 1, minWidth: 120 }}
            />
            <TextField
              label="Min Price"
              name="min_price"
              type="number"
              value={filters.min_price}
              onChange={handleFilterChange}
              variant="filled"
              size="small"
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" }, inputProps: { min: 0, step: "0.01" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
              sx={{ width: 100 }}
            />
            <TextField
              label="Max Price"
              name="max_price"
              type="number"
              value={filters.max_price}
              onChange={handleFilterChange}
              variant="filled"
              size="small"
              InputProps={{ sx: { bgcolor: "rgba(255,255,255,0.2)", color: "#fff" }, inputProps: { min: 0, step: "0.01" } }}
              InputLabelProps={{ sx: { color: "#eee" } }}
              sx={{ width: 100 }}
            />
            <Button type="submit" variant="contained" sx={{ bgcolor: "#ffb300", color: "#120030", "&:hover": { bgcolor: "#ffc350" } }}>
              Search
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Main Content */}
      <Paper
        elevation={10}
        sx={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,255,255,0.1)",
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          color: "#fff",
          maxWidth: 1000,
          marginX: "auto"
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          🍭 Sweet Shop Inventory
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {sweets.map((sweet) => (
            <Grid item xs={12} sm={6} md={4} key={sweet.id}>
              <Card
                sx={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: "0 0 15px rgba(255,255,255,0.1)"
                }}
              >
                <CardContent>
                  <Typography variant="h6">{sweet.name}</Typography>
                  <Typography variant="body2">
                    Category: <strong>{sweet.category}</strong>
                  </Typography>
                  <Typography variant="body2">Price: ₹{sweet.price}</Typography>
                  <Typography variant="body2">Quantity: {sweet.quantity}</Typography>

                  {/* Admin Buttons */}
                  {userRole === "admin" && (
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(sweet.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(sweet.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => openRestockDialog(sweet)}
                      >
                        Restock
                      </Button>
                    </Stack>
                  )}

                  {/* Buy Button for normal users */}
                  {userRole !== "admin" && sweet.quantity > 0 && (
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => openPurchaseDialog(sweet)}
                    >
                      Buy
                    </Button>
                  )}

                  {/* Out of stock message for buyers */}
                  {userRole !== "admin" && sweet.quantity === 0 && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                      Out of stock
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {sweets.length === 0 && !error && (
          <Typography align="center" sx={{ mt: 4, opacity: 0.8 }}>
            No sweets available 🍬
          </Typography>
        )}
      </Paper>

      {/* Purchase Dialog */}
      <Dialog open={purchaseOpen} onClose={closePurchaseDialog}>
        <DialogTitle>Purchase {selectedSweet?.name}</DialogTitle>
        <DialogContent>
          <Typography>Available Stock: {selectedSweet?.quantity}</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Purchase Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={purchaseQty}
            onChange={(e) => setPurchaseQty(e.target.value)}
            inputProps={{ min: 1, max: selectedSweet?.quantity || 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePurchaseDialog}>Cancel</Button>
          <Button onClick={handlePurchase} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restock Dialog (Admin) */}
      <Dialog open={restockOpen} onClose={closeRestockDialog}>
        <DialogTitle>Restock {restockSweet?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Add Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRestockDialog}>Cancel</Button>
          <Button onClick={handleRestock} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({ message: "", severity: "" })}
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
