import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddSweet from "./pages/AddSweet";
import Sweets from "./pages/Sweets";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sweets" element={<Sweets />} />
        <Route path="/add-sweet" element={<AddSweet />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin-users" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
