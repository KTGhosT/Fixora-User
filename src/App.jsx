import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load components to prevent CSS modules from loading unnecessarily
const Dashboard = lazy(() => import("./pages/worker/dashboard"));
const Register = lazy(() => import("./pages/worker/register"));
const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageServices = lazy(() => import("./pages/admin/ManageServices"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Homepage = lazy(() => import("./pages/Homepage"));

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/worker/dashboard"
            element={
              user ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <Dashboard />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/worker/register"
            element={
              user ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <Register />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/*"
            element={
              user ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminLayout />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
