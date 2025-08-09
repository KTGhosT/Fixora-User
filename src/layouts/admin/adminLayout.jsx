// src/layout/admin/AdminLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUsers, FaTasks, FaUserTie, FaFileAlt, FaHome } from "react-icons/fa";
import Header from "../../components/admin/header";

function AdminLayout() {
  return (
    <>
      <Header /> {/* Your existing header component */}

      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <nav
          className="bg-dark text-white p-3 vh-100 position-fixed"
          style={{ width: "250px", overflowY: "auto" }}
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
        <main
          className="flex-grow-1 p-4"
          style={{ marginLeft: "250px", overflowY: "auto", minHeight: "100vh" }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}



export default AdminLayout;
