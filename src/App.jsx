import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Worker Pages
import Dashboard from "./pages/worker/dashboard";
import Register from "./pages/worker/register";

// Admin Layout & Pages
import AdminLayout from "./layouts/admin/adminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ManageServices from "./pages/admin/ManageServices";
import Homepage from './pages/Homepage';

// You can later add ManageWorkers, ManageWorks, ManageContent

function App() {
  return (
    <Router>


      {/* Routes */}
      <Routes>

        <Route path="/" element={<Homepage />} />

        {/* Worker Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes with Nested Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>
        <Route path="/admin/manageservices" element={<AdminLayout />}>
          <Route index element={<ManageServices />} />
          <Route path="ManageServices" element={<ManageServices />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
