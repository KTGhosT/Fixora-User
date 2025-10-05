import React from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Calls = () => {
  const calls = [
    {
      id: 1,
      with: 'Alice (Tech Solutions)',
      time: '10:00 AM',
      status: 'Completed',
      duration: '15m',
      type: 'Support',
      phone: '+1 555 1010',
      email: 'alice@techsolutions.com',
      notes: 'Discussed network issue and scheduled follow-up visit for next week.'
    },
    {
      id: 2,
      with: 'Bob (Global Finance)',
      time: '02:30 PM',
      status: 'Scheduled',
      duration: '—',
      type: 'Onboarding',
      phone: '+1 555 2020',
      email: 'bob@globalfinance.com',
      notes: 'Intro call planned to outline migration steps and timelines.'
    },
    {
      id: 3,
      with: 'Eve (Cafe Central)',
      time: '04:15 PM',
      status: 'Missed',
      duration: '0m',
      type: 'Follow-up',
      phone: '+1 555 3030',
      email: 'eve@cafecentral.com',
      notes: 'Missed due to connectivity. Reschedule and confirm availability.'
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
          <Link to="/worker/clients" className={styles.navItem}><i className="icon-clients"></i><span>Clients</span></Link>
          <Link to="/worker/reports" className={styles.navItem}><i className="icon-reports"></i><span>Reports</span></Link>
          <Link to="/worker/calls" className={`${styles.navItem} ${styles.active}`}><i className="icon-calls"></i><span>Calls</span></Link>
          <Link to="/worker/settings" className={styles.navItem}><i className="icon-settings"></i><span>Settings</span></Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <div className="d-flex justify-content-between align-items-center">
          <h1>Calls</h1>
          <span className="badge bg-secondary">Total: {calls.length}</span>
        </div>
        {calls.map(call => (
          <div key={call.id} className="card mb-2 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{call.with}</strong>
                  <div className="text-muted">{call.type} · {call.time} · {call.duration}</div>
                </div>
                <div>
                  <span className={`badge ${call.status === 'Completed' ? 'bg-success' : call.status === 'Scheduled' ? 'bg-info' : 'bg-danger'}`}>{call.status}</span>
                </div>
              </div>
              <div className="mt-2">
                <small className="text-muted">{call.notes}</small>
              </div>
              <div className="mt-3 d-flex gap-2">
                <a href={`tel:${call.phone}`} className="btn btn-sm btn-outline-primary">Call</a>
                <a href={`mailto:${call.email}`} className="btn btn-sm btn-outline-secondary">Email</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calls;