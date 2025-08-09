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

import UserLayout from './layouts/user/userlayout';
// You can later add ManageWorkers, ManageWorks, ManageContent

function App() {
  return (
    <Router>


      {/* Routes */}
      <Routes>

        <Route path="/Home" element={<UserLayout />} />

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
      </Routes>
    </Router>
  );
}

export default App;
