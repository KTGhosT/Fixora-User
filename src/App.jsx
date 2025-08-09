import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Worker Pages
import Dashboard from "./pages/worker/dashboard";
import Register from "./pages/worker/register";

// Admin Layout & Pages
import AdminLayout from "./layouts/admin/adminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";

// Additional Components
import Navbar from './components/user/Header';
import Home from './components/user/Home';
import Services from './components/user/Services';
import Contact from './components/user/Contact';
import About from './components/user/About';
import Footer from './components/user/Footer';
import Slider from './components/user/Slider';
import UserLayout from './layouts/user/userlayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route with Layout */}
        <Route path="/Home" element={<UserLayout />} />

        {/* Worker Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes with Nested Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;