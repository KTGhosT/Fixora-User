import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "./services/api"; // axios with withCredentials:true
import LoadingSpinner from "./components/LoadingSpinner";
import "leaflet/dist/leaflet.css";


// Import worker components directly (no lazy loading for better UX)
import WorkerLayout from "./layouts/worker/WorkerLayout";
import Dashboard from "./pages/worker/dashboard";
import Settings from "./pages/worker/Settings";
import WorkerWorks from "./pages/worker/WorkerJob";
import WorkerPayments from "./pages/worker/Payments";
import WorkerInventory from "./pages/worker/Inventory";
import WorkerClients from "./pages/worker/Clients";
import WorkerReports from "./pages/worker/Reports";
import WorkerCalls from "./pages/worker/Calls";

// Lazy load other components
const RegisterPage = lazy(() => import("./pages/register"));
const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageServices = lazy(() => import("./pages/admin/ManageServices"));
const ManageWorkers = lazy(() => import("./pages/admin/ManageWorkers"));
const ManageBookings = lazy(() => import("./pages/admin/ManageBookings"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const PasswordReset = lazy(() => import("./pages/auth/PasswordReset"));
const Homepage = lazy(() => import("./pages/Homepage"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const UniqueHeader = lazy(() => import("./components/user/Header"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingStatus = lazy(() => import("./pages/BookingStatus"));
const Account = lazy(() => import("./pages/user/Account"));
const CustomerFeedback = lazy(() => import("./pages/CustomerFeedback"));

// Service pages
const Plumber = lazy(() => import("./pages/Service/Plumber"));
const Electrician = lazy(() => import("./pages/Service/Electrician"));
const Carpenter = lazy(() => import("./pages/Service/Carpenter"));
const GardenCleaner = lazy(() => import("./pages/Service/GardenCleaner"));
const HouseCleaning = lazy(() => import("./pages/Service/HouseKeeper"));
const DeviceRepair = lazy(() => import("./pages/Service/DeviceRepair"));
const PhoneLogin = lazy(() => import("./PhoneLogin"));
const ForgotPasswordTest = lazy(() => import("./components/ForgotPasswordTest"));
const BackendConnectionTest = lazy(() => import("./components/BackendConnectionTest"));
const PasswordResetDebug = lazy(() => import("./components/PasswordResetDebug"));
const ManageServiceCategories = lazy(() => import("./pages/admin/ManageServiceCategories"));
const ManageWorkerLocation = lazy(() => import("./pages/admin/ManageWorkerLocation"));
const HomeService = lazy(() => import("./pages/Service/HomeService"));


const AgotaSample = lazy(() => import("./agotasample"));
const LoadingSpinnerTest = lazy(() => import("./components/LoadingSpinnerTest"));

// Header wrapper for all public pages except login and signup
function HeaderWrapper({ user, setUser }) {
  const location = useLocation();
  // Show header on all public pages except /login and /signup
  const publicHeaderPaths = [
    "/", "/about", "/services", "/services/plumber", "/services/electrician",
    "/services/gardencleaner", "/services/housecleaning", "/services/devicerepair",
    "/feedback"
  ];
  // If the path starts with /worker or /admin, don't show header
  const isWorkerOrAdmin = location.pathname.startsWith("/worker") || location.pathname.startsWith("/admin");
  const isLoginOrSignup = location.pathname === "/login" || location.pathname === "/signup";
  const isPasswordReset = location.pathname === "/password-reset" || 
                         location.pathname === "/reset-password" || 
                         location.pathname === "/forgot-password";
  const showHeader =
    !isWorkerOrAdmin &&
    !isLoginOrSignup &&
    !isPasswordReset &&
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
        // First check if user data exists in localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setLoading(false);
          return;
        }

        // If no saved user, try to fetch from API
        const res = await axios.get("/api/profile"); // Sanctum cookie auth
        const userData = res.data;
        setUser(userData);
        // Store user data in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
      } catch {
        // Clear any invalid user data
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token");
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
          <Route path="/password-reset" element={<Suspense fallback={<LoadingSpinner />}><PasswordReset /></Suspense>} />
          <Route path="/reset-password" element={<Suspense fallback={<LoadingSpinner />}><PasswordReset /></Suspense>} />
          <Route path="/forgot-password" element={<Suspense fallback={<LoadingSpinner />}><PasswordReset /></Suspense>} />
          <Route path="/services" element={<Suspense fallback={<LoadingSpinner />}><Services /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<LoadingSpinner />}><About /></Suspense>} />
          <Route path="/services/plumber" element={<Suspense fallback={<LoadingSpinner />}><Plumber /></Suspense>} />
          <Route path="/services/electrician" element={<Suspense fallback={<LoadingSpinner />}><Electrician /></Suspense>} />
          <Route path="/services/carpenter" element={<Suspense fallback={<LoadingSpinner />}><Carpenter /></Suspense>} />
          <Route path="/services/gardencleaner" element={<Suspense fallback={<LoadingSpinner />}><GardenCleaner /></Suspense>} />
          <Route path="/services/housecleaning" element={<Suspense fallback={<LoadingSpinner />}><HouseCleaning /></Suspense>} />
          <Route path="/services/devicerepair" element={<Suspense fallback={<LoadingSpinner />}><DeviceRepair /></Suspense>} />
          <Route path="/user/account" element={<Suspense fallback={<LoadingSpinner />}><Account user={user} setUser={setUser} /></Suspense>} />
          <Route path="/feedback" element={<Suspense fallback={<LoadingSpinner />}><CustomerFeedback /></Suspense>} />
          <Route path="/booking" element={<Suspense fallback={<LoadingSpinner />}><Booking /></Suspense>} />
          <Route path="/booking-status/:id" element={<Suspense fallback={<LoadingSpinner />}><BookingStatus /></Suspense>} />

          {/* Worker Routes with Layout */}
          <Route path="/worker" element={<WorkerLayout user={user} />}>
            <Route index element={<Navigate to="/worker/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/:id" element={
              <ProtectedRoute user={user} roles={["worker", "admin"]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="settings" element={<Settings />} />
            <Route path="works" element={<WorkerWorks />} />
            {/* <Route path="works/:id" element={<WorkerWorks />} /> */}
            <Route path="payments" element={<WorkerPayments />} />
            <Route path="inventory" element={<WorkerInventory />} />
            <Route path="clients" element={<WorkerClients />} />
            <Route path="reports" element={<WorkerReports />} />
            <Route path="calls" element={<WorkerCalls />} />
          </Route>
          
          {/* Worker Register (standalone) */}
          <Route
            path="/worker/register"
            element={
              <Suspense fallback={<LoadingSpinner />}><RegisterPage /></Suspense>
            }
          />

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
            <Route path="manage-workers" element={<ManageWorkers />} />
            <Route path="manage-services" element={<ManageServices />} />
            <Route path="manage-bookings" element={<ManageBookings />} />
            <Route path="manage-service-categories" element={<ManageServiceCategories />} />
            <Route path="manage-worker-location" element={<ManageWorkerLocation />} />
          </Route>

          <Route path="/phone-login" element={<Suspense fallback={<LoadingSpinner />}><PhoneLogin setUser={setUser} /></Suspense>} />


          <Route
            path="/test-notification"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                {React.createElement(lazy(() => import("./components/test-notification")))}
              </Suspense>
            }
          />
          <Route
            path="/test-forgot-password"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ForgotPasswordTest />
              </Suspense>
            }
          />
          <Route
            path="/test-backend"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BackendConnectionTest />
              </Suspense>
            }
          />
          <Route
            path="/debug-password-reset"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PasswordResetDebug />
              </Suspense>
            }
          />
          
          {/* Catch-all route - must be last */}
          <Route path="*" element={<Navigate to="/" replace />} />



          <Route path="/agora" element={<AgotaSample />} />
          <Route path="/HomeService" element={<HomeService />} />
          <Route path="/test-spinner" element={<Suspense fallback={<LoadingSpinner />}><LoadingSpinnerTest /></Suspense>} />



          {/* inmoly */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;