import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Inspect client site', status: 'In Progress', due: '2025-10-12' },
    { id: 2, title: 'Prepare materials list', status: 'Pending', due: '2025-10-13' },
    { id: 3, title: 'Follow-up call with client', status: 'Completed', due: '2025-10-11' },
  ]);

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? {
      ...t,
      status: t.status === 'Completed' ? 'In Progress' : 'Completed'
    } : t));
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}><h2>WorkerDash</h2></div>
        <nav className={styles.navMenu}>
          <Link to="/worker/dashboard" className={styles.navItem}><i className="icon-dashboard"></i><span>Dashboard</span></Link>
          <Link to="/worker/works" className={styles.navItem}><i className="icon-orders"></i><span>Works</span></Link>
          <Link to="/worker/tasks" className={`${styles.navItem} ${styles.active}`}><i className="icon-tasks"></i><span>Tasks</span></Link>
          <Link to="/worker/sales" className={styles.navItem}><i className="icon-sales"></i><span>Sales</span></Link>
          <Link to="/worker/payments" className={styles.navItem}><i className="icon-payments"></i><span>Payments</span></Link>
          <Link to="/worker/inventory" className={styles.navItem}><i className="icon-inventory"></i><span>Inventory</span></Link>
          <Link to="/worker/clients" className={styles.navItem}><i className="icon-clients"></i><span>Clients</span></Link>
          <Link to="/worker/reports" className={styles.navItem}><i className="icon-reports"></i><span>Reports</span></Link>
          <Link to="/worker/calls" className={styles.navItem}><i className="icon-calls"></i><span>Calls</span></Link>
          <Link to="/worker/settings" className={styles.navItem}><i className="icon-settings"></i><span>Settings</span></Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <h1>Tasks</h1>
        <div className="mt-3">
          {tasks.map(task => (
            <div key={task.id} className="card mb-2">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{task.title}</h6>
                  <small className="text-muted">Due: {task.due}</small>
                </div>
                <div>
                  <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-warning'} me-2`}>{task.status}</span>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => toggleStatus(task.id)}>Toggle</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;