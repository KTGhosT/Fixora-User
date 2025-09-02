import React from 'react';
import '../../styles/worker/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Menu</h2>
        <div className="menu-item">
          <input type="checkbox" id="tasks" />
          <label htmlFor="tasks">Tasks</label>
        </div>
        <div className="menu-item active">
          <input type="checkbox" id="orders" checked readOnly />
          <label htmlFor="orders">Orders</label>
        </div>
        <div className="menu-item">
          <input type="checkbox" id="sales" />
          <label htmlFor="sales">Sales</label>
        </div>
        <div className="menu-item">
          <input type="checkbox" id="payments" />
          <label htmlFor="payments">Payments</label>
        </div>
        <div className="menu-item">
          <input type="checkbox" id="inventory" />
          <label htmlFor="inventory">Inventory</label>
        </div>
        <div className="menu-item">
          <input type="checkbox" id="clients" />
          <label htmlFor="clients">Clients</label>
        </div>
        <div className="menu-item">
          <input type="checkbox" id="dashboard" />
          <label htmlFor="dashboard">Dashboard</label>
        </div>
        <div className="menu-item">
          <input type="checkbox" id="reports" />
          <label htmlFor="reports">Reports</label>
        </div>
        <div className="menu-item">
          <input type="checkbox" id="calls" />
          <label htmlFor="calls">Calls</label>
        </div>
        <div className="menu-item">
          <input type="checkbox" id="settings" />
          <label htmlFor="settings">Settings</label>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Dashboard</h1>
        
        {/* First row of cards */}
        <div className="cards-row">
          <div className="dashboard-card">
            <h3>Orders today</h3>
            <div className="card-value">11</div>
          </div>
          
          <div className="dashboard-card">
            <h3>Sales today</h3>
            <div className="card-subvalues">
              <div className="subvalue">
                <span className="value">5</span>
                <span className="percentage">19%</span>
              </div>
              <div className="subtitle">Orders in work</div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3>Sales today</h3>
            <div className="card-subvalues">
              <div className="subvalue">
                <span className="value">6</span>
                <span className="percentage">17%</span>
              </div>
              <div className="subtitle">Urgent</div>
              <div className="subvalue">
                <span className="value">13</span>
                <span className="percentage">27%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second row of cards */}
        <div className="cards-row">
          <div className="dashboard-card green">
            <h3>Client payments today</h3>
            <div className="card-value">€867.50</div>
            <div className="card-secondary">€1,264.50</div>
          </div>
          
          <div className="dashboard-card">
            <h3>Revenue</h3>
            <div className="card-subvalues">
              <div className="subvalue">
                <span className="value">5</span>
                <span className="percentage">4%</span>
              </div>
              <div className="subvalue">
                <span className="value">5</span>
                <span className="percentage">8%</span>
              </div>
              <div className="subtitle">Receivables</div>
            </div>
          </div>
          
          <div className="dashboard-card red">
            <h3>Returns to clients today</h3>
            <div className="card-value">-€144.50</div>
            <div className="card-secondary">€0</div>
          </div>
        </div>
        
        {/* Third row - larger cards */}
        <div className="cards-row">
          <div className="dashboard-card large green">
            <h3>Total money in cashboxes</h3>
            <div className="card-value">€32,133.80</div>
            <div className="card-secondary">cash: €19,588.50 | Cashless: €12,595.50</div>
          </div>
          
          <div className="dashboard-card large">
            <h3>Orders by assigned specialists</h3>
            <div className="specialists-list">
              <div className="specialist">
                <span className="name">Ben</span>
                <div className="bar-container">
                  <div className="bar" style={{width: '40%'}}></div>
                </div>
              </div>
              <div className="specialist">
                <span className="name">David</span>
                <div className="bar-container">
                  <div className="bar" style={{width: '70%'}}></div>
                </div>
              </div>
              <div className="specialist">
                <span className="name">Den</span>
                <div className="bar-container">
                  <div className="bar" style={{width: '30%'}}></div>
                </div>
              </div>
              <div className="specialist">
                <span className="name">Max</span>
                <div className="bar-container">
                  <div className="bar" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="specialist">
                <span className="name">Michael</span>
                <div className="bar-container">
                  <div className="bar" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fourth row - lost orders */}
        <div className="cards-row">
          <div className="dashboard-card large">
            <h3>Lost orders</h3>
            <div className="lost-orders">
              <div className="lost-reason">
                <span className="reason">Lost - price</span>
                <div className="bar-container">
                  <div className="bar red" style={{width: '40%'}}></div>
                </div>
              </div>
              <div className="lost-reason">
                <span className="reason">Lost - quality</span>
                <div className="bar-container">
                  <div className="bar red" style={{width: '25%'}}></div>
                </div>
              </div>
              <div className="lost-reason">
                <span className="reason">Lost - terms</span>
                <div className="bar-container">
                  <div className="bar red" style={{width: '35%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3>Orders in work</h3>
            <div className="orders-status">
              <div className="status-item">
                <span className="status-name">In progress</span>
                <span className="status-count">10</span>
              </div>
              <div className="status-item">
                <span className="status-name">Pending</span>
                <span className="status-count">6</span>
              </div>
              <div className="status-item">
                <span className="status-name">New</span>
                <span className="status-count">5</span>
              </div>
              <div className="status-item">
                <span className="status-name">None</span>
                <span className="status-count">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;