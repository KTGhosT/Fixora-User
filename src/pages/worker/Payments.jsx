import React from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Payments = () => {
  const payments = [
    { id: 1, method: 'Credit Card', amount: 120, date: '2025-10-10', status: 'Settled' },
    { id: 2, method: 'Bank Transfer', amount: 75, date: '2025-10-11', status: 'Pending' },
    { id: 3, method: 'Cash', amount: 200, date: '2025-10-12', status: 'Settled' },
  ];

  const formatLKR = (amount) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}><h2>WorkerDash</h2></div>
        <nav className={styles.navMenu}>
          <Link to="/worker/dashboard" className={styles.navItem}><i className="icon-dashboard"></i><span>Dashboard</span></Link>
          <Link to="/worker/works" className={styles.navItem}><i className="icon-orders"></i><span>Works</span></Link>
          <Link to="/worker/tasks" className={styles.navItem}><i className="icon-tasks"></i><span>Tasks</span></Link>
          <Link to="/worker/sales" className={styles.navItem}><i className="icon-sales"></i><span>Sales</span></Link>
          <Link to="/worker/payments" className={`${styles.navItem} ${styles.active}`}><i className="icon-payments"></i><span>Payments</span></Link>
          <Link to="/worker/inventory" className={styles.navItem}><i className="icon-inventory"></i><span>Inventory</span></Link>
          <Link to="/worker/clients" className={styles.navItem}><i className="icon-clients"></i><span>Clients</span></Link>
          <Link to="/worker/reports" className={styles.navItem}><i className="icon-reports"></i><span>Reports</span></Link>
          <Link to="/worker/calls" className={styles.navItem}><i className="icon-calls"></i><span>Calls</span></Link>
          <Link to="/worker/settings" className={styles.navItem}><i className="icon-settings"></i><span>Settings</span></Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <h1>Payments</h1>
        {payments.map(p => (
          <div key={p.id} className="card mb-2">
            <div className="card-body d-flex justify-content-between">
              <div>
                <strong>{p.method}</strong>
                <div className="text-muted">{p.date}</div>
              </div>
              <div>
                <span className={`badge ${p.status === 'Settled' ? 'bg-success' : 'bg-warning'}`}>{p.status}</span>
                <span className="badge bg-primary ms-2">{formatLKR(p.amount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;