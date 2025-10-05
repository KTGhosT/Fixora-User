import React from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Sales = () => {
  const sales = [
    { id: 1, item: 'Service A', amount: 120, date: '2025-10-10' },
    { id: 2, item: 'Service B', amount: 75, date: '2025-10-11' },
    { id: 3, item: 'Service C', amount: 200, date: '2025-10-12' },
  ];

  const total = sales.reduce((sum, s) => sum + s.amount, 0);

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
          <Link to="/worker/sales" className={`${styles.navItem} ${styles.active}`}><i className="icon-sales"></i><span>Sales</span></Link>
          <Link to="/worker/payments" className={styles.navItem}><i className="icon-payments"></i><span>Payments</span></Link>
          <Link to="/worker/inventory" className={styles.navItem}><i className="icon-inventory"></i><span>Inventory</span></Link>
          <Link to="/worker/clients" className={styles.navItem}><i className="icon-clients"></i><span>Clients</span></Link>
          <Link to="/worker/reports" className={styles.navItem}><i className="icon-reports"></i><span>Reports</span></Link>
          <Link to="/worker/calls" className={styles.navItem}><i className="icon-calls"></i><span>Calls</span></Link>
          <Link to="/worker/settings" className={styles.navItem}><i className="icon-settings"></i><span>Settings</span></Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <h1>Sales</h1>
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Recent Sales</h6>
            <span className="badge bg-primary">Total: {formatLKR(total)}</span>
          </div>
          {sales.map(sale => (
            <div key={sale.id} className="card mb-2">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <strong>{sale.item}</strong>
                  <div className="text-muted">{sale.date}</div>
                </div>
                <div>
                  <span className="badge bg-success">{formatLKR(sale.amount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sales;