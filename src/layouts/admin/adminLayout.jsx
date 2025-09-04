import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  FaUsers, FaTasks, FaUserTie, FaFileAlt, FaHome, FaSearch, FaBell, 
  FaSun, FaMoon, FaCog, FaSignOutAlt, FaChevronDown, FaBars, 
  FaTimes, FaChartLine, FaCog as FaSettings, FaQuestionCircle,
  FaEnvelope, FaCalendarAlt, FaUserCircle, FaShieldAlt
} from "react-icons/fa";
import styles from "./admin.module.css";


function AdminLayout() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState([
    { id: 1, title: "New user registered", time: "2 min ago", type: "info" },
    { id: 2, title: "System maintenance scheduled", time: "1 hour ago", type: "warning" },
    { id: 3, title: "Payment received", time: "3 hours ago", type: "success" },
  ]);
  
  const location = useLocation();
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/admin': 'Dashboard',
      '/admin/manage-users': 'User Management',
      '/admin/manage-workers': 'Worker Management',
      '/admin/manage-works': 'Work Management',
      '/admin/manage-content': 'Content Management',
      '/admin/ManageServices': 'Service Management'
    };
    return titles[path] || 'Admin Panel';
  };

  const navigationItems = [
    { path: '/admin', icon: FaHome, label: 'Dashboard', badge: null },
    { path: '/admin/manage-users', icon: FaUsers, label: 'Users', badge: '12' },
    { path: '/admin/manage-workers', icon: FaUserTie, label: 'Workers', badge: '8' },
    { path: '/admin/manage-works', icon: FaTasks, label: 'Works', badge: '24' },
    { path: '/admin/manage-content', icon: FaFileAlt, label: 'Content', badge: null },
    { path: '/admin/ManageServices', icon: FaSettings, label: 'Services', badge: '5' },
  ];

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.adminLayout}`}>
      {/* Header */}
      <header className={`${styles.adminHeader} p-3 d-flex justify-content-between align-items-center`}>
        <div className="d-flex align-items-center">
          <button 
            className={`${styles.btn} me-3 d-md-none`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <FaBars />
          </button>
          <div className="d-flex align-items-center">
            <div className="me-3">
              <h4 className={`mb-0 ${styles.gradientText}`}>{getPageTitle()}</h4>
              <small className="text-muted">Welcome back, Admin</small>
            </div>
          </div>
        </div>
        
        <div className="d-flex align-items-center">
          {/* Search Bar */}
          <div className={`position-relative me-3`}>
            <FaSearch className={`position-absolute top-50 start-0 translate-middle-y ms-3 text-muted`} />
            <input
              type="text"
              placeholder="Search anything..."
              className={`form-control ${styles.adminSearch} ps-5`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Notifications */}
          <div className={`position-relative me-3`} ref={notificationRef}>
            <button 
              className={`${styles.btn} ${styles.adminIcon} position-relative`}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              aria-label="Notifications"
            >
              <FaBell />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {isNotificationOpen && (
              <div className={`position-absolute top-100 end-0 mt-2 ${styles.glass} rounded shadow-lg`} 
                   style={{ width: '320px', zIndex: 1000 }}>
                <div className="p-3 border-bottom">
                  <h6 className="mb-0">Notifications</h6>
                </div>
                <div className="p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-3 border-bottom ${styles.hoverEffect}`}>
                      <div className="d-flex align-items-start">
                        <div className={`me-3 p-2 rounded-circle bg-${notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'info'}`}>
                          <FaBell className="text-white" size={12} />
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-medium">{notification.title}</p>
                          <small className="text-muted">{notification.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <Link to="/admin/notifications" className="btn btn-sm btn-outline-primary">
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button 
            className={`${styles.btn} me-3 ${styles.themeToggle}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkTheme ? <FaSun /> : <FaMoon />}
          </button>

          {/* User Menu */}
          <div className="position-relative" ref={userMenuRef}>
            <button 
              className={`${styles.btn} d-flex align-items-center ${styles.adminProfile}`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User menu"
            >
              <img
                src="https://via.placeholder.com/35"
                alt="Profile"
                className="rounded-circle me-2"
                style={{ width: '35px', height: '35px' }}
              />
              <span className="me-1">Admin User</span>
              <FaChevronDown size={12} />
            </button>
            
            {isUserMenuOpen && (
              <div className={`position-absolute top-100 end-0 mt-2 ${styles.glass} rounded shadow-lg`} 
                   style={{ width: '200px', zIndex: 1000 }}>
                <div className="p-3 border-bottom">
                  <div className="d-flex align-items-center">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Profile"
                      className="rounded-circle me-3"
                      style={{ width: '40px', height: '40px' }}
                    />
                    <div>
                      <p className="mb-0 fw-medium">Admin User</p>
                      <small className="text-muted">admin@example.com</small>
                    </div>
                  </div>
                </div>
                <div className="p-0">
                  <Link to="/admin/profile" className={`d-flex align-items-center p-3 text-decoration-none ${styles.hoverEffect}`}>
                    <FaUserCircle className="me-3" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/admin/settings" className={`d-flex align-items-center p-3 text-decoration-none ${styles.hoverEffect}`}>
                    <FaCog className="me-3" />
                    <span>Settings</span>
                  </Link>
                  <Link to="/admin/help" className={`d-flex align-items-center p-3 text-decoration-none ${styles.hoverEffect}`}>
                    <FaQuestionCircle className="me-3" />
                    <span>Help & Support</span>
                  </Link>
                  <hr className="my-0" />
                  <button className={`d-flex align-items-center p-3 w-100 border-0 bg-transparent text-decoration-none ${styles.hoverEffect}`}>
                    <FaSignOutAlt className="me-3 text-danger" />
                    <span className="text-danger">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50`} 
             style={{ zIndex: 1040 }} 
             onClick={toggleMobileMenu}>
        </div>
      )}

      {/* Middle: Sidebar + Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <nav className={`${styles.adminSidebar} p-3 ${isMobileMenuOpen ? styles.show : ''} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div className="me-3 p-2 rounded-circle bg-primary">
                <FaShieldAlt className="text-white" />
              </div>
              <div>
                <h5 className={`mb-0 ${styles.gradientText}`}>Admin Panel</h5>
                <small className="text-muted">Management System</small>
              </div>
            </div>
            <button 
              className={`${styles.btn} d-none d-md-block`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FaBars />
            </button>
          </div>

          <ul className="nav flex-column">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path} className="nav-item mb-2">
                  <Link 
                    to={item.path} 
                    className={`nav-link d-flex align-items-center ${isActive ? styles.active : ''} ${styles.stagger}${index + 1}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center">
                      <Icon />
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-medium">{item.label}</span>
                      {item.badge && (
                        <span className="badge bg-primary ms-2">{item.badge}</span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sidebar Footer */}
          <div className="mt-auto pt-4 border-top">
            <div className={`d-flex align-items-center p-2 rounded ${styles.hoverEffect}`}>
              <div className="me-3 p-2 rounded-circle bg-success">
                <FaChartLine className="text-white" size={14} />
              </div>
              <div className="flex-grow-1">
                <small className="fw-medium">System Status</small>
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ width: '8px', height: '8px', backgroundColor: '#28a745', borderRadius: '50%' }}></div>
                  <small className="text-muted">All systems operational</small>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`${styles.adminMain} flex-grow-1 p-4`}>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/admin" className="text-decoration-none">
                  <FaHome className="me-1" />
                  Dashboard
                </Link>
              </li>
              {location.pathname !== '/admin' && (
                <li className="breadcrumb-item active" aria-current="page">
                  {getPageTitle()}
                </li>
              )}
            </ol>
          </nav>

          {/* Page Content */}
          <div className={styles.fadeIn}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; 