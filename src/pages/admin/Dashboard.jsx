// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { fetchUsersApi } from "../../services/users";
import { fetchBookingsApi } from "../../services/bookings";
import { fetchWorkersApi } from "../../services/workers";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalWorkers: 0,
    pendingApprovals: 0,
    completedBookings: 0,
    revenue: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [bookingStatusData, setBookingStatusData] = useState([]);

  // Fetch real data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [users, bookings, workers] = await Promise.all([
          fetchUsersApi().catch(err => {
            console.error('Error fetching users:', err);
            return [];
          }),
          fetchBookingsApi().catch(err => {
            console.error('Error fetching bookings:', err);
            return [];
          }),
          fetchWorkersApi().catch(err => {
            console.error('Error fetching workers:', err);
            return [];
          })
        ]);

        // Calculate statistics
        const totalUsers = users.length;
        const totalBookings = bookings.length;
        const totalWorkers = workers.length;
        const completedBookings = bookings.filter(booking => 
          booking.status === 'completed' || booking.status === 'Completed'
        ).length;
        const pendingApprovals = workers.filter(worker => 
          worker.status === 'pending' || worker.status === 'Pending'
        ).length;

        // Calculate revenue (assuming bookings have price/amount field)
        const revenue = bookings
          .filter(booking => booking.status === 'completed' || booking.status === 'Completed')
          .reduce((sum, booking) => sum + (booking.price || booking.amount || 0), 0);

        setStats({
          totalUsers,
          totalBookings,
          totalWorkers,
          pendingApprovals,
          completedBookings,
          revenue
        });

        // Generate recent activities from bookings
        const activities = bookings
          .slice(0, 10)
          .map((booking, index) => ({
            id: booking.id || index,
            user: booking.user_name || booking.customer_name || 'Unknown User',
            action: `Booking ${booking.status || 'created'}`,
            time: formatTimeAgo(booking.created_at || booking.booking_date),
            type: getActivityType(booking.status)
          }));

        setRecentActivities(activities);

        // Generate chart data (last 7 days)
        const chartData = generateChartData(bookings);
        setChartData(chartData);

        // Generate booking status pie chart data
        const statusCounts = {};
        bookings.forEach(booking => {
          const status = booking.status || 'unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const pieData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count
        }));

        setBookingStatusData(pieData);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getActivityType = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'payment';
      case 'cancelled': return 'cancellation';
      case 'pending': return 'booking';
      default: return 'booking';
    }
  };

  const generateChartData = (bookings) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.created_at || booking.booking_date);
        return bookingDate.toISOString().split('T')[0] === dateStr;
      });

      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        bookings: dayBookings.length,
        revenue: dayBookings.reduce((sum, booking) => sum + (booking.price || booking.amount || 0), 0)
      });
    }
    return last7Days;
  };

  const StatCard = ({ title, value, subtitle, trend, icon }) => (
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
      <div className={styles.statIcon}>{icon}</div>
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

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button 
            className={styles.actionButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          <button 
            className={`${styles.actionButton} ${styles.primary}`}
            onClick={() => window.location.reload()}
          >
            Refresh Data
          </button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="Registered users"
          icon="👥"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          subtitle="All bookings"
          icon="📅"
        />
        <StatCard
          title="Total Workers"
          value={stats.totalWorkers.toLocaleString()}
          subtitle="Registered workers"
          icon="🔧"
        />
        <StatCard
          title="Completed Bookings"
          value={stats.completedBookings.toLocaleString()}
          subtitle="Successfully completed"
          icon="✅"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          subtitle="Total revenue earned"
          icon="💰"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          subtitle="Requires attention"
          icon="⏳"
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
            <h3 className={styles.cardTitle}>Bookings Trend (Last 7 Days)</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Revenue Trend (Last 7 Days)</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Booking Status Distribution</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
                <div className={`${styles.statusIndicator} ${styles.online}`}></div>
                <span>API Services</span>
                <span className={styles.statusText}>Operational</span>
              </div>
              <div className={styles.statusItem}>
                <div className={`${styles.statusIndicator} ${loading ? styles.warning : styles.online}`}></div>
                <span>Data Sync</span>
                <span className={styles.statusText}>{loading ? 'Syncing...' : 'Up to date'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;