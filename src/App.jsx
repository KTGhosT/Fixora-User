import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Worker Pages
import Dashboard from "./pages/worker/dashboard";
import Register from "./pages/worker/register";

// Admin Layout & Pages
import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageServices from "./pages/admin/ManageServices";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Public Pages
import Homepage from "./pages/Homepage";

function App() {
  // ✅ Declare state first
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            user && user.role === "admin" ? (
              <AdminLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-services" element={<ManageServices />} />
        </Route>

        {/* Add worker & customer routes similarly */}
      </Routes>
    </Router>
  );
}

export default App;
