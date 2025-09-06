import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Plumber from "./pages/Service/Plumber";

// Lazy load components
const Dashboard = lazy(() => import("./pages/worker/dashboard"));
const RegisterPage = lazy(() => import("./pages/worker/register"));
const Settings = lazy(() => import("./pages/worker/Settings"));
const WorkerWorks = lazy(() => import("./pages/worker/works"));
const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageServices = lazy(() => import("./pages/admin/ManageServices"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Homepage = lazy(() => import("./pages/Homepage"));
const Services = lazy(() => import("./pages/Services"));
const UniqueHeader = lazy(() => import("./components/user/Header"));
const Booking = lazy(() => import("./pages/Booking"));

function HeaderWrapper({ user, setUser }) {
  const location = useLocation();
  // Only show header on home and services page
  const showHeader =
    location.pathname === "/" || location.pathname === "/services";
  if (!showHeader) return null;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UniqueHeader user={user} setUser={setUser} />
    </Suspense>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setUser({ token, role });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <HeaderWrapper user={user} setUser={setUser} />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage user={user} setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/services"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Services />
              </Suspense>
            }
          />
          <Route path="/plumber" element={<Plumber />} />
          <Route path="/booking" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Booking />
            </Suspense>
          } />

          {/* Worker Pages */}
          <Route
            path="/worker/dashboard"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/worker/register"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RegisterPage />
              </Suspense>
            }
          />
          <Route
            path="/worker/settings"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/worker/works"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <WorkerWorks />
              </Suspense>
            }
          />
          <Route path="/worker" element={<Navigate to="/worker/dashboard" />} />

          {/* Admin Pages */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-services" element={<ManageServices />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
