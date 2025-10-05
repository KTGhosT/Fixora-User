// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";

// Example: import your API instance if you want to fetch real data
// import api from "../../services/api";

function Dashboard() {
  // Replace with your actual data or fetch from your backend
  const [stats, setStats] = useState({
    totalUsers: 321,
    totalBookings: 87,
    revenue: 12450,
    pendingApprovals: 3
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: "Amanuel T.", action: "Booked a plumber", time: "5 mins ago", type: "booking" },
    { id: 2, user: "Mekdes B.", action: "Registered as user", time: "20 mins ago", type: "user" },
    { id: 3, user: "Kebede W.", action: "Booking cancelled", time: "1 hour ago", type: "cancellation" },
    { id: 4, user: "Selamawit G.", action: "Payment received", time: "2 hours ago", type: "payment" },
    { id: 5, user: "Yonas D.", action: "Updated profile", time: "3 hours ago", type: "update" }
  ]);
  const [loading, setLoading] = useState(false);

  // If you want to fetch from backend, uncomment and adjust this:
  /*
  useEffect(() => {
    setLoading(true);
    api.get("/admin/dashboard-stats").then(res => {
      setStats(res.data.stats);
      setRecentActivities(res.data.activities);
      setLoading(false);
    });
  }, []);
  */

  const StatCard = ({ title, value, subtitle, trend }) => (
    <div className={styles.statCard}>
      <div className={styles.statContent}>
        <h3 className={styles.statTitle}>{title}</h3>
        <div className={styles.statValue}>
          {loading ? (
            <div className={styles.skeletonText}></div>
          ) : (
            <>
              {value}
              {trend && <span className={`${styles.trend} ${trend > 0 ? styles.positive : styles.negative}`}>
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </span>}
            </>
          )}
        </div>
        <p className={styles.statSubtitle}>{subtitle}</p>
      </div>
      <div className={styles.statIcon}></div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className={`${styles.activityItem} ${styles[activity.type]}`}>
      <div className={styles.activityIcon}></div>
      <div className={styles.activityContent}>
        <div className={styles.activityText}>
          <strong>{activity.user}</strong> {activity.action}
        </div>
        <div className={styles.activityTime}>{activity.time}</div>
      </div>
    </div>
  );

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome to the admin panel. Use the menu to manage everything.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionButton}>Export Report</button>
          <button className={`${styles.actionButton} ${styles.primary}`}>
            Refresh Data
          </button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="Active users this month"
          trend={7.2}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          subtitle="Completed bookings"
          trend={3.8}
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          subtitle="Total revenue this month"
          trend={12.1}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          subtitle="Requires attention"
          trend={-1.5}
        />
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Activity</h3>
            <button className={styles.cardAction}>View All</button>
          </div>
          <div className={styles.cardContent}>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={styles.skeletonActivity}>
                  <div className={styles.skeletonIcon}></div>
                  <div className={styles.skeletonText}></div>
                </div>
              ))
            ) : (
              recentActivities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.actionsGrid}>
              <button className={styles.quickAction}>
                <div className={styles.actionIcon}>👥</div>
                <span>Manage Users</span>
              </button>
              <button className={styles.quickAction}>
                <div className={styles.actionIcon}>📅</div>
                <span>View Bookings</span>
              </button>
              <button className={styles.quickAction}>
                <div className={styles.actionIcon}>💰</div>
                <span>Financial Reports</span>
              </button>
              <button className={styles.quickAction}>
                <div className={styles.actionIcon}>⚙️</div>
                <span>System Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Performance Metrics</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.performanceChart}>
              <div className={styles.chartPlaceholder}>
                <p>Monthly Performance Chart</p>
                <div className={styles.chartBars}>
                  {[60, 75, 80, 90, 70, 85, 65].map((height, index) => (
                    <div
                      key={index}
                      className={styles.chartBar}
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>System Status</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statusList}>
              <div className={styles.statusItem}>
                <div className={`${styles.statusIndicator} ${styles.online}`}></div>
                <span>Web Server</span>
                <span className={styles.statusText}>Operational</span>
              </div>
              <div className={styles.statusItem}>
                <div className={`${styles.statusIndicator} ${styles.online}`}></div>
                <span>Database</span>
                <span className={styles.statusText}>Operational</span>
              </div>
              <div className={styles.statusItem}>
                <div className={`${styles.statusIndicator} ${styles.warning}`}></div>
                <span>Payment Gateway</span>
                <span className={styles.statusText}>Maintenance</span>
              </div>
              <div className={styles.statusItem}>
                <div className={`${styles.statusIndicator} ${styles.online}`}></div>
                <span>API Services</span>
                <span className={styles.statusText}>Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;