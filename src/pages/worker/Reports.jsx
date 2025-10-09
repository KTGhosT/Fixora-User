import React from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Reports = () => {
  const stats = {
    month: 'October 2025',
    totalWorks: 24,
    completed: 18,
    pending: 6,
    revenue: 2450,
  };

  const formatLKR = (amount) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
    }).format(amount);

  const weeklyData = [
    { label: 'Mon', value: 3 },
    { label: 'Tue', value: 5 },
    { label: 'Wed', value: 4 },
    { label: 'Thu', value: 6 },
    { label: 'Fri', value: 2 },
    { label: 'Sat', value: 3 },
    { label: 'Sun', value: 1 },
  ];

  const maxVal = Math.max(...weeklyData.map(d => d.value));

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}><h2>WorkerDash</h2></div>
        <nav className={styles.navMenu}>
          <Link to="/worker/dashboard" className={styles.navItem}><i className="icon-dashboard"></i><span>Dashboard</span></Link>
          <Link to="/worker/works" className={styles.navItem}><i className="icon-orders"></i><span>Works</span></Link>
          {/* Tasks and Sales removed after consolidation into Works */}
          <Link to="/worker/payments" className={styles.navItem}><i className="icon-payments"></i><span>Payments</span></Link>
          <Link to="/worker/inventory" className={styles.navItem}><i className="icon-inventory"></i><span>Inventory</span></Link>
          <Link to="/worker/clients" className={styles.navItem}><i className="icon-clients"></i><span>Clients</span></Link>
          <Link to="/worker/reports" className={`${styles.navItem} ${styles.active}`}><i className="icon-reports"></i><span>Reports</span></Link>
          <Link to="/worker/calls" className={styles.navItem}><i className="icon-calls"></i><span>Calls</span></Link>
          <Link to="/worker/settings" className={styles.navItem}><i className="icon-settings"></i><span>Settings</span></Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <h1>Reports</h1>
        <div className="row mt-3">
          <div className="col-md-3">
            <div className="card"><div className="card-body"><strong>Month</strong><div>{stats.month}</div></div></div>
          </div>
          <div className="col-md-3">
            <div className="card"><div className="card-body"><strong>Total Works</strong><div>{stats.totalWorks}</div></div></div>
          </div>
          <div className="col-md-3">
            <div className="card"><div className="card-body"><strong>Completed</strong><div className="text-success">{stats.completed}</div></div></div>
          </div>
          <div className="col-md-3">
            <div className="card"><div className="card-body"><strong>Pending</strong><div className="text-warning">{stats.pending}</div></div></div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Revenue</h6>
              <span className="badge bg-primary">{formatLKR(stats.revenue)}</span>
            </div>
            <div className="mt-3">
              <h6 className="mb-2">Worker Weekly Tasks</h6>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weeklyData.length}, 1fr)`, gap: 8, alignItems: 'end', height: 140 }}>
                {weeklyData.map((d, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: '100%', background: '#eaf2ff', border: '1px solid #cfe0ff', borderRadius: 6, height: `${(d.value / maxVal) * 100}%` }}></div>
                    <small className="text-muted">{d.label}</small>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-2">
                <small className="text-muted">Max/day: {maxVal} tasks</small>
                <small className="text-muted">Total: {weeklyData.reduce((s, d) => s + d.value, 0)}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;