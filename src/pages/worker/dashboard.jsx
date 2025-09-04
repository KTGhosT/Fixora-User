import React from 'react';
import styles from './dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Modern Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>WorkerDash</h2>
        </div>
        <nav className={styles.navMenu}>
          <a href="#" className={`${styles.navItem} ${styles.active}`}>
            <i className="icon-dashboard"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-orders"></i>
            <span>Orders</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-tasks"></i>
            <span>Tasks</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-sales"></i>
            <span>Sales</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-payments"></i>
            <span>Payments</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-inventory"></i>
            <span>Inventory</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-clients"></i>
            <span>Clients</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-reports"></i>
            <span>Reports</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-calls"></i>
            <span>Calls</span>
          </a>
          <a href="#" className={styles.navItem}>
            <i className="icon-settings"></i>
            <span>Settings</span>
          </a>
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <i className="icon-user"></i>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.username}>John Doe</div>
            <div className={styles.role}>Worker</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Worker Dashboard</h1>
          <div className={styles.dateFilter}>
            <button className={styles.filterBtn}>Today</button>
            <button className={styles.filterBtn}>This Week</button>
            <button className={`${styles.filterBtn} ${styles.active}`}>This Month</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>Orders Today</h3>
              <i className={`icon-orders ${styles.statIcon}`}></i>
            </div>
            <div className={styles.statValue}>11</div>
            <div className={`${styles.statTrend} ${styles.positive}`}>+3 from yesterday</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>Sales Today</h3>
              <i className={`icon-sales ${styles.statIcon}`}></i>
            </div>
            <div className={styles.statValue}>€1,245.75</div>
            <div className={`${styles.statTrend} ${styles.negative}`}>-€245.25 from yesterday</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>Tasks Completed</h3>
              <i className={`icon-tasks ${styles.statIcon}`}></i>
            </div>
            <div className={styles.statValue}>8</div>
            <div className={`${styles.statTrend} ${styles.positive}`}>+2 from yesterday</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <h3>Performance</h3>
              <i className={`icon-performance ${styles.statIcon}`}></i>
            </div>
            <div className={styles.statValue}>92%</div>
            <div className={`${styles.statTrend} ${styles.positive}`}>+5% from last week</div>
          </div>
        </div>

        {/* Charts and Lists */}
        <div className={styles.contentSections}>
          <div className={styles.chartSection}>
            <h3>Work Progress</h3>
            <div className={styles.progressChart}>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '75%' }}></div>
              </div>
              <div className={styles.progressLabels}>
                <span>Completed</span>
                <span>In Progress</span>
                <span>Pending</span>
              </div>
            </div>
          </div>

          <div className={styles.taskList}>
            <h3>Upcoming Tasks</h3>
            <div className={styles.taskItem}>
              <div className={styles.taskInfo}>
                <div className={styles.taskTitle}>Complete client installation</div>
                <div className={styles.taskDetails}>Project Alpha - 3 hours</div>
              </div>
              <div className={`${styles.taskPriority} ${styles.high}`}>High</div>
            </div>
            <div className={styles.taskItem}>
              <div className={styles.taskInfo}>
                <div className={styles.taskTitle}>Follow up on quote</div>
                <div className={styles.taskDetails}>Client Beta - 1 hour</div>
              </div>
              <div className={`${styles.taskPriority} ${styles.medium}`}>Medium</div>
            </div>
            <div className={styles.taskItem}>
              <div className={styles.taskInfo}>
                <div className={styles.taskTitle}>Update inventory records</div>
                <div className={styles.taskDetails}>Warehouse - 2 hours</div>
              </div>
              <div className={`${styles.taskPriority} ${styles.low}`}>Low</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activitySection}>
          <h3>Recent Activity</h3>
          <div className={styles.activityFeed}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <i className="icon-check"></i>
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityText}>Completed order #ORD-1245</div>
                <div className={styles.activityTime}>2 hours ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <i className="icon-message"></i>
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityText}>Received message from client</div>
                <div className={styles.activityTime}>4 hours ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <i className="icon-clock"></i>
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityText}>Scheduled meeting with team</div>
                <div className={styles.activityTime}>Yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;