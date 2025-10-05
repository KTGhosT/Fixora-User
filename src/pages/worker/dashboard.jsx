import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { Link, useParams } from 'react-router-dom'; // Added useParams for worker ID
import styles from './dashboard.module.css';
import axiosInstance from '../../services/api'; // Use your configured instance

const Dashboard = () => {
  const { id } = useParams(); // Get worker ID from route parameter
  const [workerData, setWorkerData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    experience_level: '',
    availability: '',
    short_info: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [range, setRange] = useState('month');

  const formatLKR = (value) =>
    `LKR ${Number(value || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const statsByRange = {
    day: { orders: 11, sales: 1245.75, tasks: 8, performance: 92 },
    week: { orders: 58, sales: 7425.3, tasks: 39, performance: 90 },
    month: { orders: 223, sales: 28450.9, tasks: 164, performance: 93 },
  };

  // Fetch worker data on component mount (with mock fallback when no id)
  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        if (id) {
          const response = await axiosInstance.get(`/worker/${id}`);
          setWorkerData(response.data.worker);
          setFormData({
            name: response.data.worker.name,
            email: response.data.worker.email,
            phone_number: response.data.worker.phone_number,
            address: response.data.worker.address,
            experience_level: response.data.worker.experience_level,
            availability: response.data.worker.availability,
            short_info: response.data.worker.short_info || '',
          });
        } else {
          const mock = {
            id: 0,
            name: 'John Doe',
            email: 'john@example.com',
            phone_number: '+1234567890',
            address: 'New York, USA',
            experience_level: 'Intermediate',
            availability: 'Available',
            short_info: 'Dedicated worker with 3 years experience',
          };
          setWorkerData(mock);
          setFormData({
            name: mock.name,
            email: mock.email,
            phone_number: mock.phone_number,
            address: mock.address,
            experience_level: mock.experience_level,
            availability: mock.availability,
            short_info: mock.short_info,
          });
        }
      } catch (error) {
        console.error('Error fetching worker data:', error);
        setErrors({ submit: 'Failed to load worker data. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkerData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(formData.phone_number.replace(/\D/g, ''))) newErrors.phone_number = 'Phone number is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.experience_level.trim()) newErrors.experience_level = 'Experience level is required';
    if (!formData.availability.trim()) newErrors.availability = 'Availability is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (id) {
        const response = await axiosInstance.put(`/worker/${id}`, formData);
        setWorkerData(response.data.worker);
      } else {
        // simulate local update when no id
        await new Promise((resolve) => setTimeout(resolve, 300));
        setWorkerData({ ...workerData, ...formData });
      }
      setEditMode(false);
      setErrors({});
      alert('Worker details updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update worker details. Please try again.';
      setErrors({ submit: errorMessage });
      console.error('Error updating worker:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setFormData({
        name: workerData?.name || '',
        email: workerData?.email || '',
        phone_number: workerData?.phone_number || '',
        address: workerData?.address || '',
        experience_level: workerData?.experience_level || '',
        availability: workerData?.availability || '',
        short_info: workerData?.short_info || '',
      });
      setErrors({});
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.dashboardContainer}>
      {/* Modern Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>WorkerDash</h2>
        </div>
        <nav className={styles.navMenu}>
          <Link to={`/worker/dashboard`} className={`${styles.navItem} ${styles.active}`}>
            <i className="icon-dashboard"></i>
            <span>Dashboard</span>
          </Link>
          <Link to={`/worker/works`} className={styles.navItem}>
            <i className="icon-orders"></i>
            <span>Works</span>
          </Link>
          <Link to="/worker/tasks" className={styles.navItem}>
            <i className="icon-tasks"></i>
            <span>Tasks</span>
          </Link>
          <Link to="/worker/sales" className={styles.navItem}>
            <i className="icon-sales"></i>
            <span>Sales</span>
          </Link>
          <Link to="/worker/payments" className={styles.navItem}>
            <i className="icon-payments"></i>
            <span>Payments</span>
          </Link>
          <Link to="/worker/inventory" className={styles.navItem}>
            <i className="icon-inventory"></i>
            <span>Inventory</span>
          </Link>
          <Link to="/worker/clients" className={styles.navItem}>
            <i className="icon-clients"></i>
            <span>Clients</span>
          </Link>
          <Link to="/worker/reports" className={styles.navItem}>
            <i className="icon-reports"></i>
            <span>Reports</span>
          </Link>
          <Link to="/worker/calls" className={styles.navItem}>
            <i className="icon-calls"></i>
            <span>Calls</span>
          </Link>
          <Link to={`/worker/settings`} className={styles.navItem}>
            <i className="icon-settings"></i>
            <span>Settings</span>
          </Link>
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <i className="icon-user"></i>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.username}>{workerData?.name || 'John Doe'}</div>
            <div className={styles.role}>Worker</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Worker Dashboard</h1>
          <div className={styles.dateFilter}>
            <button
              className={`${styles.filterBtn} ${range === 'day' ? styles.active : ''}`}
              onClick={() => setRange('day')}
            >
              Today
            </button>
            <button
              className={`${styles.filterBtn} ${range === 'week' ? styles.active : ''}`}
              onClick={() => setRange('week')}
            >
              This Week
            </button>
            <button
              className={`${styles.filterBtn} ${range === 'month' ? styles.active : ''}`}
              onClick={() => setRange('month')}
            >
              This Month
            </button>
          </div>
          {workerData && (
            <Button variant="primary" onClick={toggleEditMode} className="mt-3">
              {editMode ? 'Cancel' : 'Edit Profile'}
            </Button>
          )}
        </div>

        {editMode ? (
          <Form onSubmit={handleSubmit} className="p-4 bg-light rounded">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    isInvalid={!!errors.phone_number}
                  />
                  <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience Level *</Form.Label>
                  <Form.Select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    isInvalid={!!errors.experience_level}
                  >
                    <option value="">Select Experience</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="expert">Expert</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.experience_level}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Availability *</Form.Label>
                  <Form.Select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    isInvalid={!!errors.availability}
                  >
                    <option value="">Select Availability</option>
                    <option value="immediate">Immediate</option>
                    <option value="1week">Within 1 Week</option>
                    <option value="2weeks">Within 2 Weeks</option>
                    <option value="1month">Within 1 Month</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.availability}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Short Info</Form.Label>
              <Form.Control
                type="text"
                name="short_info"
                value={formData.short_info}
                onChange={handleChange}
                placeholder="Briefly describe yourself (max 255 characters)"
                maxLength={255}
              />
            </Form.Group>
            {errors.submit && <Alert variant="danger" className="mb-3">{errors.submit}</Alert>}
            <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        ) : (
          <>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3>Orders {range === 'day' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}</h3>
                  <i className={`icon-orders ${styles.statIcon}`}></i>
                </div>
                <div className={styles.statValue}>{statsByRange[range].orders}</div>
                <div className={`${styles.statTrend} ${styles.positive}`}>+3 from previous period</div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3>Sales {range === 'day' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}</h3>
                  <i className={`icon-sales ${styles.statIcon}`}></i>
                </div>
                <div className={styles.statValue}>{formatLKR(statsByRange[range].sales)}</div>
                <div className={`${styles.statTrend} ${styles.negative}`}>-LKR 245.25 from previous</div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3>Tasks Completed</h3>
                  <i className={`icon-tasks ${styles.statIcon}`}></i>
                </div>
                <div className={styles.statValue}>{statsByRange[range].tasks}</div>
                <div className={`${styles.statTrend} ${styles.positive}`}>+2 from previous period</div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <h3>Performance</h3>
                  <i className={`icon-performance ${styles.statIcon}`}></i>
                </div>
                <div className={styles.statValue}>{statsByRange[range].performance}%</div>
                <div className={`${styles.statTrend} ${styles.positive}`}>+5% from last period</div>
              </div>
            </div>

            {/* Charts and Lists */}
            <div className={styles.contentSections}>
              <div className={styles.chartSection}>
                <h3>Work Progress</h3>
                <div className={styles.progressChart}>
                  <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} style={{ width: '75%' }}></div>
                  </div>
                  <div className={styles.progressLabels}>
                    <span>Completed</span>
                    <span>In Progress</span>
                    <span>Pending</span>
                  </div>
                </div>
                <h4 style={{ marginTop: 24 }}>Sales (last 7 days)</h4>
                {(() => {
                  const sales7 = [1200, 800, 1500, 900, 2000, 1750, 1900];
                  const max = Math.max(...sales7);
                  return (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80, marginTop: 8 }}>
                      {sales7.map((v, i) => (
                        <div key={i} style={{ width: 24, background: '#3b82f6', height: `${(v / max) * 100}%`, borderRadius: 4 }} title={`Day ${i + 1}: ${formatLKR(v)}`}></div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className={styles.taskList}>
                <h3>Upcoming Tasks</h3>
                <div className={styles.taskItem}>
                  <div className={styles.taskInfo}>
                    <div className={styles.taskTitle}>Complete client installation</div>
                    <div className={styles.taskDetails}>Project Alpha - 3 hours</div>
                  </div>
                  <div className={`${styles.taskPriority} ${styles.high}`}>High</div>
                </div>
                <div className={styles.taskItem}>
                  <div className={styles.taskInfo}>
                    <div className={styles.taskTitle}>Follow up on quote</div>
                    <div className={styles.taskDetails}>Client Beta - 1 hour</div>
                  </div>
                  <div className={`${styles.taskPriority} ${styles.medium}`}>Medium</div>
                </div>
                <div className={styles.taskItem}>
                  <div className={styles.taskInfo}>
                    <div className={styles.taskTitle}>Update inventory records</div>
                    <div className={styles.taskDetails}>Warehouse - 2 hours</div>
                  </div>
                  <div className={`${styles.taskPriority} ${styles.low}`}>Low</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: 24 }}>
              <h3>Quick Actions</h3>
              <div className={styles.statsGrid}>
                <Link to="/worker/tasks" className={styles.statCard} style={{ textDecoration: 'none' }}>
                  <div className={styles.statHeader}>
                    <h3>Create Task</h3>
                    <i className={`icon-tasks ${styles.statIcon}`}></i>
                  </div>
                  <div className={styles.statTrend}>Jump to task manager</div>
                </Link>
                <Link to="/worker/sales" className={styles.statCard} style={{ textDecoration: 'none' }}>
                  <div className={styles.statHeader}>
                    <h3>New Sale</h3>
                    <i className={`icon-sales ${styles.statIcon}`}></i>
                  </div>
                  <div className={styles.statTrend}>View and add orders</div>
                </Link>
                <Link to="/worker/payments" className={styles.statCard} style={{ textDecoration: 'none' }}>
                  <div className={styles.statHeader}>
                    <h3>Record Payment</h3>
                    <i className={`icon-payments ${styles.statIcon}`}></i>
                  </div>
                  <div className={styles.statTrend}>Manage payment entries</div>
                </Link>
                <Link to="/worker/inventory" className={styles.statCard} style={{ textDecoration: 'none' }}>
                  <div className={styles.statHeader}>
                    <h3>Add Inventory</h3>
                    <i className={`icon-inventory ${styles.statIcon}`}></i>
                  </div>
                  <div className={styles.statTrend}>Update stock levels</div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.activitySection}>
              <h3>Recent Activity</h3>
              <div className={styles.activityFeed}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <i className="icon-check"></i>
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>Completed order #ORD-1245 — {formatLKR(1450)}</div>
                    <div className={styles.activityTime}>2 hours ago</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <i className="icon-message"></i>
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>Received message from client</div>
                    <div className={styles.activityTime}>4 hours ago</div>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <i className="icon-clock"></i>
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityText}>Recorded payment — {formatLKR(2500)}</div>
                    <div className={styles.activityTime}>Yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;