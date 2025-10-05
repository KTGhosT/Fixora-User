import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Tasks = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Inspect client site',
      assignee: 'Sam',
      priority: 'High',
      status: 'In Progress',
      due: '2025-10-12',
      tags: ['Onsite', 'Safety'],
      notes: 'Check electrical panel and note any hazards.'
    },
    {
      id: 2,
      title: 'Prepare materials list',
      assignee: 'Nadia',
      priority: 'Medium',
      status: 'Pending',
      due: '2025-10-13',
      tags: ['Procurement'],
      notes: 'Confirm quantities for plumbing fixtures.'
    },
    {
      id: 3,
      title: 'Follow-up call with client',
      assignee: 'Liam',
      priority: 'Low',
      status: 'Completed',
      due: '2025-10-11',
      tags: ['Communication'],
      notes: 'Call completed; client approved the material list.'
    },
  ]);

  const toggleStatus = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? ({
      ...t,
      status: t.status === 'Completed' ? 'In Progress' : 'Completed'
    }) : t));
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const badgeForStatus = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success';
      case 'In Progress':
        return 'bg-info';
      case 'Pending':
      default:
        return 'bg-warning';
    }
  };

  const badgeForPriority = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-danger';
      case 'Medium':
        return 'bg-primary';
      case 'Low':
      default:
        return 'bg-secondary';
    }
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
        <div className="d-flex justify-content-between align-items-center">
          <h1>Tasks</h1>
          <span className="badge bg-secondary">Total: {tasks.length}</span>
        </div>

        <div className="card mt-3">
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <React.Fragment key={task.id}>
                    <tr onClick={() => toggleExpand(task.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="fw-semibold">{task.title}</div>
                        <small className="text-muted">ID: {task.id}</small>
                      </td>
                      <td>{task.assignee}</td>
                      <td><span className={`badge ${badgeForPriority(task.priority)}`}>{task.priority}</span></td>
                      <td><span className="text-muted">{task.due}</span></td>
                      <td><span className={`badge ${badgeForStatus(task.status)}`}>{task.status}</span></td>
                      <td>
                        {task.tags.map(tag => (
                          <span key={tag} className="badge bg-light text-dark me-1">{tag}</span>
                        ))}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-success me-2" onClick={(e) => { e.stopPropagation(); toggleStatus(task.id); }}>
                          {task.status === 'Completed' ? 'Mark In Progress' : 'Mark Completed'}
                        </button>
                        <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}>
                          {expandedId === task.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === task.id && (
                      <tr>
                        <td colSpan="7" className="bg-light">
                          <div className="p-3">
                            <div className="mb-2"><strong>Notes:</strong> {task.notes}</div>
                            <div>
                              <strong>Activity:</strong>
                              <ul className="mb-0">
                                <li>Created on 2025-10-09</li>
                                <li>Assigned to {task.assignee}</li>
                                <li>Status updated to {task.status}</li>
                              </ul>
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

export default Tasks;