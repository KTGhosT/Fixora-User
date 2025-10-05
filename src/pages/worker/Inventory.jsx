import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Hammer', qty: 5, status: 'Available' },
    { id: 2, name: 'Drill', qty: 2, status: 'Low Stock' },
    { id: 3, name: 'Safety Gloves', qty: 20, status: 'Available' },
  ]);

  const restock = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1, status: 'Available' } : i));
  };

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
          <Link to="/worker/inventory" className={`${styles.navItem} ${styles.active}`}><i className="icon-inventory"></i><span>Inventory</span></Link>
          <Link to="/worker/clients" className={styles.navItem}><i className="icon-clients"></i><span>Clients</span></Link>
          <Link to="/worker/reports" className={styles.navItem}><i className="icon-reports"></i><span>Reports</span></Link>
          <Link to="/worker/calls" className={styles.navItem}><i className="icon-calls"></i><span>Calls</span></Link>
          <Link to="/worker/settings" className={styles.navItem}><i className="icon-settings"></i><span>Settings</span></Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <h1>Inventory</h1>
        {items.map(item => (
          <div key={item.id} className="card mb-2">
            <div className="card-body d-flex justify-content-between">
              <div>
                <strong>{item.name}</strong>
                <div className="text-muted">Qty: {item.qty}</div>
              </div>
              <div>
                <span className={`badge ${item.status === 'Available' ? 'bg-success' : 'bg-warning'}`}>{item.status}</span>
                <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => restock(item.id)}>Restock</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;