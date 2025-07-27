import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, Table, TableHead, TableBody, TableCell, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from "@mui/material";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editFields, setEditFields] = useState({ username: "", password: "", role: "" });
  const [notification, setNotification] = useState({ message: "", severity: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://127.0.0.1:8000/users/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data));
  }, []);

  const openEdit = (user) => {
    setEditUser(user);
    setEditFields({ username: user.username, password: "", role: user.role });
  };
  const closeEdit = () => setEditUser(null);

  const handleEditChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`http://127.0.0.1:8000/users/${editUser.id}`, editFields, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u.id === editUser.id ? res.data : u));
      setNotification({ message: "User updated.", severity: "success" });
      closeEdit();
    } catch {
      setNotification({ message: "Update failed.", severity: "error" });
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>User Management</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell><TableCell>Username</TableCell><TableCell>Role</TableCell><TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => openEdit(user)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={!!editUser} onClose={closeEdit}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField name="username" label="Username" fullWidth margin="dense" value={editFields.username} onChange={handleEditChange}/>
          <TextField name="password" label="Password" type="password" fullWidth margin="dense" value={editFields.password} onChange={handleEditChange}/>
          <TextField name="role" label="Role" fullWidth margin="dense" value={editFields.role} onChange={handleEditChange}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!notification.message} autoHideDuration={4000} onClose={() => setNotification({ message: "", severity: "" })}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
}
