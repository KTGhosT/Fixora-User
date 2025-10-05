import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Payments = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [payments, setPayments] = useState([
    { id: 1, paymentId: 'PMT-001', invoiceId: 'INV-1001', client: 'Acme Ltd', method: 'Credit Card', amount: 120, date: '2025-10-10', status: 'Settled', reference: 'AUTH-9X2', notes: 'Receipt emailed to client.' },
    { id: 2, paymentId: 'PMT-002', invoiceId: 'INV-1002', client: 'Beta Traders', method: 'Bank Transfer', amount: 75, date: '2025-10-11', status: 'Pending', reference: 'TX-53421', notes: 'Awaiting bank confirmation.' },
    { id: 3, paymentId: 'PMT-003', invoiceId: 'INV-1003', client: 'Civic Co', method: 'Cash', amount: 200, date: '2025-10-12', status: 'Settled', reference: 'CASH-1003', notes: 'Paid onsite.' },
  ]);

  const formatLKR = (amount) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
    }).format(amount);

  const badgeForStatus = (status) => (status === 'Settled' ? 'bg-success' : 'bg-warning');
  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));
  const markSettled = (id) => setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Settled' } : p));

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
        <div className="d-flex justify-content-between align-items-center">
          <h1>Payments</h1>
          <span className="badge bg-secondary">Total: {formatLKR(payments.reduce((s,p)=>s+p.amount,0))}</span>
        </div>

        <div className="card mt-3">
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Payment</th>
                  <th>Invoice</th>
                  <th>Client</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <React.Fragment key={p.id}>
                    <tr onClick={() => toggleExpand(p.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="fw-semibold">{p.paymentId}</div>
                        <small className="text-muted">ID: {p.id}</small>
                      </td>
                      <td>{p.invoiceId}</td>
                      <td>{p.client}</td>
                      <td>{p.method}</td>
                      <td><span className="text-muted">{p.date}</span></td>
                      <td><span className={`badge ${badgeForStatus(p.status)}`}>{p.status}</span></td>
                      <td className="text-end">{formatLKR(p.amount)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-success me-2" onClick={(e) => { e.stopPropagation(); markSettled(p.id); }}>Mark Settled</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); toggleExpand(p.id); }}>{expandedId === p.id ? 'Hide' : 'Details'}</button>
                      </td>
                    </tr>
                    {expandedId === p.id && (
                      <tr>
                        <td colSpan="8" className="bg-light">
                          <div className="p-3">
                            <div className="mb-2"><strong>Reference:</strong> {p.reference}</div>
                            <div className="mb-2"><strong>Notes:</strong> {p.notes}</div>
                            <div>
                              <button className="btn btn-sm btn-outline-secondary me-2">Send Receipt</button>
                              <button className="btn btn-sm btn-outline-dark">View Invoice</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;