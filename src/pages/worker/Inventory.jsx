import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Inventory = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [items, setItems] = useState([
    { id: 1, sku: 'HAM-001', name: 'Hammer', category: 'Tools', qty: 5, reorderPoint: 3, unitCost: 1800, location: 'Shelf A', supplier: 'ToolCorp', lastUpdated: '2025-10-10', status: 'Available' },
    { id: 2, sku: 'DRL-002', name: 'Drill', category: 'Power Tools', qty: 2, reorderPoint: 4, unitCost: 12500, location: 'Shelf B', supplier: 'PowerMax', lastUpdated: '2025-10-09', status: 'Low Stock' },
    { id: 3, sku: 'GLV-003', name: 'Safety Gloves', category: 'Safety', qty: 20, reorderPoint: 10, unitCost: 450, location: 'Shelf C', supplier: 'SafeWear', lastUpdated: '2025-10-08', status: 'Available' },
  ]);

  const formatLKR = (amount) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', currencyDisplay: 'code', minimumFractionDigits: 2 }).format(amount);

  const restock = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1, status: 'Available', lastUpdated: new Date().toISOString().slice(0,10) } : i));
  };

  const badgeForStatus = (status) => (status === 'Available' ? 'bg-success' : 'bg-warning');
  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));
  const totalValue = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.unitCost, 0), [items]);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}><h2>WorkerDash</h2></div>
        <nav className={styles.navMenu}>
          <Link to="/worker/dashboard" className={styles.navItem}><i className="icon-dashboard"></i><span>Dashboard</span></Link>
          <Link to="/worker/works" className={styles.navItem}><i className="icon-orders"></i><span>Works</span></Link>
          {/* Tasks and Sales removed after consolidation into Works */}
          <Link to="/worker/payments" className={styles.navItem}><i className="icon-payments"></i><span>Payments</span></Link>
          <Link to="/worker/inventory" className={`${styles.navItem} ${styles.active}`}><i className="icon-inventory"></i><span>Inventory</span></Link>
          <Link to="/worker/clients" className={styles.navItem}><i className="icon-clients"></i><span>Clients</span></Link>
          <Link to="/worker/reports" className={styles.navItem}><i className="icon-reports"></i><span>Reports</span></Link>
          <Link to="/worker/calls" className={styles.navItem}><i className="icon-calls"></i><span>Calls</span></Link>
          <Link to="/worker/settings" className={styles.navItem}><i className="icon-settings"></i><span>Settings</span></Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <div className="d-flex justify-content-between align-items-center">
          <h1>Inventory</h1>
          <span className="badge bg-primary">Total Value: {formatLKR(totalValue)}</span>
        </div>

        <div className="card mt-3">
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Reorder</th>
                  <th>Unit Cost</th>
                  <th className="text-end">Value</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <React.Fragment key={item.id}>
                    <tr onClick={() => toggleExpand(item.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="fw-semibold">{item.sku}</div>
                        <small className="text-muted">ID: {item.id}</small>
                      </td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.qty}</td>
                      <td>{item.reorderPoint}</td>
                      <td>{formatLKR(item.unitCost)}</td>
                      <td className="text-end">{formatLKR(item.qty * item.unitCost)}</td>
                      <td><span className={`badge ${badgeForStatus(item.status)}`}>{item.status}</span></td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-success me-2" onClick={(e) => { e.stopPropagation(); restock(item.id); }}>Restock +1</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}>{expandedId === item.id ? 'Hide' : 'Details'}</button>
                      </td>
                    </tr>
                    {expandedId === item.id && (
                      <tr>
                        <td colSpan="9" className="bg-light">
                          <div className="p-3">
                            <div className="mb-2"><strong>Location:</strong> {item.location}</div>
                            <div className="mb-2"><strong>Supplier:</strong> {item.supplier}</div>
                            <div className="mb-2"><strong>Last Updated:</strong> {item.lastUpdated}</div>
                            <div className="mb-2"><strong>Alert:</strong> {item.qty <= item.reorderPoint ? 'Low stock — consider reordering.' : 'Sufficient stock.'}</div>
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

export default Inventory;