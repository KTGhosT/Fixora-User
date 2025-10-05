import React from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Clients = () => {
  const formatLKR = (amount) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
    }).format(amount);

  const clients = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      contact: 'alice@techsolutions.com',
      phone: '+1 555 1010',
      industry: 'IT Services',
      address: '221B Baker Street, London',
      lastOrder: '2025-10-09',
      outstanding: 56000,
      tags: ['Priority', 'Monthly'],
    },
    {
      id: 2,
      name: 'Global Finance Corp',
      contact: 'bob@globalfinance.com',
      phone: '+1 555 2020',
      industry: 'Finance',
      address: '15 Wall Street, New York',
      lastOrder: '2025-09-28',
      outstanding: 0,
      tags: ['Quarterly'],
    },
    {
      id: 3,
      name: 'Cafe Central',
      contact: 'eve@cafecentral.com',
      phone: '+1 555 3030',
      industry: 'Hospitality',
      address: 'Main Square 11, Vienna',
      lastOrder: '2025-10-02',
      outstanding: 12500,
      tags: ['New'],
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}><h2>WorkerDash</h2></div>
        <nav className={styles.navMenu}>
          <Link to="/worker/dashboard" className={styles.navItem}><i className="icon-dashboard"></i><span>Dashboard</span></Link>
          <Link to="/worker/works" className={styles.navItem}><i className="icon-orders"></i><span>Works</span></Link>
          <Link to="/worker/tasks" className={styles.navItem}><i className="icon-tasks"></i><span>Tasks</span></Link>
          <Link to="/worker/sales" className={styles.navItem}><i className="icon-sales"></i><span>Sales</span></Link>
          <Link to="/worker/payments" className={styles.navItem}><i className="icon-payments"></i><span>Payments</span></Link>
          <Link to="/worker/inventory" className={styles.navItem}><i className="icon-inventory"></i><span>Inventory</span></Link>
          <Link to="/worker/clients" className={`${styles.navItem} ${styles.active}`}><i className="icon-clients"></i><span>Clients</span></Link>
          <Link to="/worker/reports" className={styles.navItem}><i className="icon-reports"></i><span>Reports</span></Link>
          <Link to="/worker/calls" className={styles.navItem}><i className="icon-calls"></i><span>Calls</span></Link>
          <Link to="/worker/settings" className={styles.navItem}><i className="icon-settings"></i><span>Settings</span></Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <div className="d-flex justify-content-between align-items-center">
          <h1>Clients</h1>
          <span className="badge bg-secondary">Total: {clients.length}</span>
        </div>
        {clients.map(c => (
          <div key={c.id} className="card mb-2 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{c.name}</strong>
                  <div className="text-muted">{c.industry}</div>
                  <div className="mt-2 small text-muted">{c.address}</div>
                </div>
                <div className="text-end">
                  <a href={`mailto:${c.contact}`} className="d-block small">{c.contact}</a>
                  <a href={`tel:${c.phone}`} className="badge bg-info mt-1">{c.phone}</a>
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark">Last order: {c.lastOrder}</span>
                  <span className={`badge ${c.outstanding > 0 ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {c.outstanding > 0 ? `Outstanding: ${formatLKR(c.outstanding)}` : 'No dues'}
                  </span>
                </div>
                <div>
                  {c.tags.map((t, i) => (
                    <span key={i} className="badge bg-secondary ms-1">{t}</span>
                  ))}
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <a href={`mailto:${c.contact}`} className="btn btn-sm btn-outline-secondary">Email</a>
                <a href={`tel:${c.phone}`} className="btn btn-sm btn-outline-primary">Call</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;