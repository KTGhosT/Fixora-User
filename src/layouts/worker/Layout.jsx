// Layout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useUser } from './UserContext'; // Add this import
import styles from './dashboard.module.css';

const Layout = () => {
  const { user } = useUser(); // Get user data from context

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar - now uses dynamic user data */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>WorkerDash</h2>
        </div>
        <nav className={styles.navMenu}>
          <Link to="/" className={`${styles.navItem} ${styles.active}`}>
            <i className="icon-dashboard"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-orders"></i>
            <span>Orders</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-tasks"></i>
            <span>Tasks</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-sales"></i>
            <span>Sales</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-payments"></i>
            <span>Payments</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-inventory"></i>
            <span>Inventory</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-clients"></i>
            <span>Clients</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-reports"></i>
            <span>Reports</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-calls"></i>
            <span>Calls</span>
          </Link>
          <Link to="/settings" className={styles.navItem}>
            <i className="icon-settings"></i>
            <span>Settings</span>
          </Link>
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <img 
              src={user.profilePhoto} 
              alt="Profile" 
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%',
                objectFit: 'cover'
              }} 
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.username}>{user.name}</div>
            <div className={styles.role}>{user.role}</div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;