import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Sales = () => {
  const [expandedId, setExpandedId] = useState(null);
  const orders = [
    {
      id: 101,
      orderNo: 'SO-101',
      client: 'Acme Ltd',
      date: '2025-10-10',
      status: 'Paid',
      items: [
        { name: 'Service A', qty: 1, price: 120 },
        { name: 'Extra Materials', qty: 2, price: 15 },
      ],
    },
    {
      id: 102,
      orderNo: 'SO-102',
      client: 'Beta Traders',
      date: '2025-10-11',
      status: 'Pending',
      items: [
        { name: 'Service B', qty: 1, price: 75 },
      ],
    },
    {
      id: 103,
      orderNo: 'SO-103',
      client: 'Civic Co',
      date: '2025-10-12',
      status: 'Paid',
      items: [
        { name: 'Service C', qty: 1, price: 200 },
      ],
    },
  ];

  const subtotal = (order) => order.items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const taxRate = 0.08;
  const total = orders.reduce((sum, o) => sum + subtotal(o) * (1 + taxRate), 0);

  const formatLKR = (amount) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
    }).format(amount);

  const badgeForStatus = (status) => (status === 'Paid' ? 'bg-success' : 'bg-warning');

  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));

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
        <div className="d-flex justify-content-between align-items-center">
          <h1>Sales</h1>
          <span className="badge bg-primary">Total: {formatLKR(total)}</span>
        </div>

        <div className="card mt-3">
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th className="text-end">Subtotal</th>
                  <th className="text-end">Tax (8%)</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const sub = subtotal(order);
                  const tax = sub * taxRate;
                  const tot = sub + tax;
                  return (
                    <React.Fragment key={order.id}>
                      <tr onClick={() => toggleExpand(order.id)} style={{ cursor: 'pointer' }}>
                        <td>
                          <div className="fw-semibold">{order.orderNo}</div>
                          <small className="text-muted">ID: {order.id}</small>
                        </td>
                        <td>{order.client}</td>
                        <td><span className="text-muted">{order.date}</span></td>
                        <td><span className={`badge ${badgeForStatus(order.status)}`}>{order.status}</span></td>
                        <td>{order.items.length}</td>
                        <td className="text-end">{formatLKR(sub)}</td>
                        <td className="text-end">{formatLKR(tax)}</td>
                        <td className="text-end">{formatLKR(tot)}</td>
                      </tr>
                      {expandedId === order.id && (
                        <tr>
                          <td colSpan="8" className="bg-light">
                            <div className="p-3">
                              <strong>Items Breakdown</strong>
                              <ul className="mb-0">
                                {order.items.map((it, idx) => (
                                  <li key={idx}>{it.name} × {it.qty} — {formatLKR(it.qty * it.price)}</li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;