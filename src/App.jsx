import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "./services/api"; // axios with withCredentials:true
import LoadingSpinner from "./components/LoadingSpinner";
import "leaflet/dist/leaflet.css";


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
const Account = lazy(() => import("./pages/user/Account"));
const CustomerFeedback = lazy(() => import("./pages/CustomerFeedback"));

// Service pages
const Plumber = lazy(() => import("./pages/Service/Plumber"));
const Electrician = lazy(() => import("./pages/Service/Electrician"));
const Carpenter = lazy(() => import("./pages/Service/Carpenter"));
const GardenCleaner = lazy(() => import("./pages/Service/GardenCleaner"));
const HouseCleaning = lazy(() => import("./pages/Service/HouseKeeper"));
const DeviceRepair = lazy(() => import("./pages/Service/DeviceRepair"));

// Header wrapper for all public pages except login and signup
function HeaderWrapper({ user, setUser }) {
  const location = useLocation();
  // Show header on all public pages except /login and /signup
  const publicHeaderPaths = [
    "/", "/services", "/services/plumber", "/services/electrician", "/services/carpenter",
    "/services/gardencleaner", "/services/housecleaning", "/services/devicerepair",
    "/user/account", "/feedback", "/booking"
  ];
  // If the path starts with /worker or /admin, don't show header
  const isWorkerOrAdmin = location.pathname.startsWith("/worker") || location.pathname.startsWith("/admin");
  const isLoginOrSignup = location.pathname === "/login" || location.pathname === "/signup";
  const showHeader =
    !isWorkerOrAdmin &&
    !isLoginOrSignup &&
    (
      publicHeaderPaths.includes(location.pathname) ||
      // Also show header for any /services/* route
      location.pathname.startsWith("/services/")
    );

  if (!showHeader) return null;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UniqueHeader user={user} setUser={setUser} />
    </Suspense>
  );
}

// Protected Route component
function ProtectedRoute({ user, roles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ✅ FIXED: Changed from "/profile" to "/api/profile"
        const res = await axios.get("/api/profile"); // Sanctum cookie auth
        setUser(res.data); // expects { id, name, email, role }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Router>
      <HeaderWrapper user={user} setUser={setUser} />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage user={user} setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/services" element={<Suspense fallback={<LoadingSpinner />}><Services /></Suspense>} />
          <Route path="/services/plumber" element={<Suspense fallback={<LoadingSpinner />}><Plumber /></Suspense>} />
          <Route path="/services/electrician" element={<Suspense fallback={<LoadingSpinner />}><Electrician /></Suspense>} />
          <Route path="/services/carpenter" element={<Suspense fallback={<LoadingSpinner />}><Carpenter /></Suspense>} />
          <Route path="/services/gardencleaner" element={<Suspense fallback={<LoadingSpinner />}><GardenCleaner /></Suspense>} />
          <Route path="/services/housecleaning" element={<Suspense fallback={<LoadingSpinner />}><HouseCleaning /></Suspense>} />
          <Route path="/services/devicerepair" element={<Suspense fallback={<LoadingSpinner />}><DeviceRepair /></Suspense>} />
          <Route path="/user/account" element={<Suspense fallback={<LoadingSpinner />}><Account user={user} setUser={setUser} /></Suspense>} />
          <Route path="/feedback" element={<Suspense fallback={<LoadingSpinner />}><CustomerFeedback /></Suspense>} />
          <Route path="/booking" element={<Suspense fallback={<LoadingSpinner />}><Booking /></Suspense>} />

          {/* Worker Routes */}
          <Route
            path="/worker/dashboard"
            element={
              <ProtectedRoute user={user} roles={["worker"]}>
                <Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/register"
            element={
              <ProtectedRoute user={user} roles={["admin"]}>
                <Suspense fallback={<LoadingSpinner />}><RegisterPage /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/settings"
            element={
              <ProtectedRoute user={user} roles={["worker"]}>
                <Suspense fallback={<LoadingSpinner />}><Settings /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/works"
            element={
              <ProtectedRoute user={user} roles={["worker"]}>
                <Suspense fallback={<LoadingSpinner />}><WorkerWorks /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="/worker" element={<Navigate to="/worker/dashboard" />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute user={user} roles={["admin"]}>
                <Suspense fallback={<LoadingSpinner />}><AdminLayout /></Suspense>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-services" element={<ManageServices />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;