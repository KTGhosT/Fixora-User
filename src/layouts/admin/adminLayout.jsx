// src/layout/admin/AdminLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUsers, FaTasks, FaUserTie, FaFileAlt, FaHome } from "react-icons/fa";
import Header from "../../components/admin/header";
import Footer from "../../components/admin/footer";

function AdminLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Full Width Header */}
      <Header />

      {/* Middle: Sidebar + Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <nav
          className="bg-dark text-white p-3"
          style={{
            width: "250px",
            overflowY: "auto"
          }}
        >
          <h4 className="mb-4 border-bottom pb-2">Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/admin" className="nav-link text-white">
                <FaHome className="me-2" /> Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/manage-users" className="nav-link text-white">
                <FaUsers className="me-2" /> Manage Users
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/manage-workers" className="nav-link text-white">
                <FaUserTie className="me-2" /> Manage Workers
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/manage-works" className="nav-link text-white">
                <FaTasks className="me-2" /> Manage Works
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/admin/manage-content" className="nav-link text-white">
                <FaFileAlt className="me-2" /> Manage Content
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>

      {/* Full Width Footer */}
      <Footer />
    </div>
  );
}

export default AdminLayout;
