import React from 'react';
import '../../styles/worker/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Modern Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2>WorkerDash</h2>
        </div>
        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <i className="icon-dashboard"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-orders"></i>
            <span>Orders</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-tasks"></i>
            <span>Tasks</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-sales"></i>
            <span>Sales</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-payments"></i>
            <span>Payments</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-inventory"></i>
            <span>Inventory</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-clients"></i>
            <span>Clients</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-reports"></i>
            <span>Reports</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-calls"></i>
            <span>Calls</span>
          </a>
          <a href="#" className="nav-item">
            <i className="icon-settings"></i>
            <span>Settings</span>
          </a>
        </nav>
        <div className="user-profile">
          <div className="avatar">
            <i className="icon-user"></i>
          </div>
          <div className="user-info">
            <div className="username">John Doe</div>
            <div className="role">Worker</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Worker Dashboard</h1>
          <div className="date-filter">
            <button className="filter-btn">Today</button>
            <button className="filter-btn">This Week</button>
            <button className="filter-btn active">This Month</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Orders Today</h3>
              <i className="icon-orders stat-icon"></i>
            </div>
            <div className="stat-value">11</div>
            <div className="stat-trend positive">+3 from yesterday</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <h3>Sales Today</h3>
              <i className="icon-sales stat-icon"></i>
            </div>
            <div className="stat-value">€1,245.75</div>
            <div className="stat-trend negative">-€245.25 from yesterday</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <h3>Tasks Completed</h3>
              <i className="icon-tasks stat-icon"></i>
            </div>
            <div className="stat-value">8</div>
            <div className="stat-trend positive">+2 from yesterday</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <h3>Performance</h3>
              <i className="icon-performance stat-icon"></i>
            </div>
            <div className="stat-value">92%</div>
            <div className="stat-trend positive">+5% from last week</div>
          </div>
        </div>

        {/* Charts and Lists */}
        <div className="content-sections">
          <div className="chart-section">
            <h3>Work Progress</h3>
            <div className="progress-chart">
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: '75%' }}></div>
              </div>
              <div className="progress-labels">
                <span>Completed</span>
                <span>In Progress</span>
                <span>Pending</span>
              </div>
            </div>
          </div>

          <div className="task-list">
            <h3>Upcoming Tasks</h3>
            <div className="task-item">
              <div className="task-info">
                <div className="task-title">Complete client installation</div>
                <div className="task-details">Project Alpha - 3 hours</div>
              </div>
              <div className="task-priority high">High</div>
            </div>
            <div className="task-item">
              <div className="task-info">
                <div className="task-title">Follow up on quote</div>
                <div className="task-details">Client Beta - 1 hour</div>
              </div>
              <div className="task-priority medium">Medium</div>
            </div>
            <div className="task-item">
              <div className="task-info">
                <div className="task-title">Update inventory records</div>
                <div className="task-details">Warehouse - 2 hours</div>
              </div>
              <div className="task-priority low">Low</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-feed">
            <div className="activity-item">
              <div className="activity-icon">
                <i className="icon-check"></i>
              </div>
              <div className="activity-content">
                <div className="activity-text">Completed order #ORD-1245</div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="icon-message"></i>
              </div>
              <div className="activity-content">
                <div className="activity-text">Received message from client</div>
                <div className="activity-time">4 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <i className="icon-clock"></i>
              </div>
              <div className="activity-content">
                <div className="activity-text">Scheduled meeting with team</div>
                <div className="activity-time">Yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;