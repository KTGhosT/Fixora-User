import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUsers, FaTasks, FaUserTie, FaFileAlt, FaHome, FaSearch, FaBell, FaSun, FaMoon } from "react-icons/fa";
import "../../styles/admin.css";

function AdminLayout() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="admin-header p-3 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Dashboard</h4>
        </div>
        <div className="d-flex align-items-center">
          <input
            type="text"
            placeholder="Search"
            className="form-control admin-search"
          />
          <FaBell className="ms-3 admin-icon" />
          <div className="ms-3 d-flex align-items-center admin-reminder">
            <span className="me-2">Reminder</span>
            <div className="admin-badge">
              Design Meet
            </div>
          </div>
          <div className="ms-3 d-flex align-items-center admin-profile">
            <img
              src="https://via.placeholder.com/30"
              alt="Profile"
              className="rounded-circle"
            />
            <span className="ms-2">See All</span>
          </div>
          <button 
            className="btn ms-3 theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkTheme ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      {/* Middle: Sidebar + Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <nav className="admin-sidebar p-3">
          <h4 className="mb-4 border-bottom pb-2 text-center">Admin</h4>
          <ul className="nav flex-column align-items-center">
            <li className="nav-item mb-3">
              <Link to="/admin" className="nav-link d-flex flex-column align-items-center">
                <FaHome />
                <span className="small">Dashboard</span>
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="/admin/manage-users" className="nav-link d-flex flex-column align-items-center">
                <FaUsers />
                <span className="small">Users</span>
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="/admin/manage-workers" className="nav-link d-flex flex-column align-items-center">
                <FaUserTie />
                <span className="small">Workers</span>
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="/admin/manage-works" className="nav-link d-flex flex-column align-items-center">
                <FaTasks />
                <span className="small">Works</span>
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="/admin/manage-content" className="nav-link d-flex flex-column align-items-center">
                <FaFileAlt />
                <span className="small">Content</span>
              </Link>
            </li>
            <li className="nav-item mb-3">
              <Link to="/admin/ManageServices" className="nav-link d-flex flex-column align-items-center">
                <FaFileAlt />
                <span className="small">Services</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="admin-main flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; 