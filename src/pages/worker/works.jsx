import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './dashboard.module.css';

const WorkerWorks = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Mock data for works
  const works = {
    ongoing: [
      {
        id: 1,
        title: "Office Network Installation",
        client: "Tech Solutions Inc.",
        location: "123 Business Ave, New York",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
        date: "2023-06-15",
        status: "In Progress",
        priority: "High",
        description: "Installing new network infrastructure for 50 workstations",
        progress: 65
      },
      {
        id: 2,
        title: "Server Maintenance",
        client: "Global Finance Corp",
        location: "456 Financial Blvd, Boston",
        startTime: "02:00 PM",
        endTime: "06:00 PM",
        date: "2023-06-15",
        status: "Pending Review",
        priority: "Medium",
        description: "Quarterly server maintenance and security updates",
        progress: 90
      }
    ],
    pending: [
      {
        id: 3,
        title: "WiFi Setup",
        client: "Cafe Central",
        location: "789 Coffee St, Chicago",
        startTime: "10:00 AM",
        endTime: "01:00 PM",
        date: "2023-06-16",
        status: "Assigned",
        priority: "Low",
        description: "Setup new WiFi network with 3 access points",
        progress: 0
      },
      {
        id: 4,
        title: "Security Audit",
        client: "Health Plus Clinic",
        location: "321 Medical Dr, Los Angeles",
        startTime: "09:00 AM",
        endTime: "03:00 PM",
        date: "2023-06-17",
        status: "Scheduled",
        priority: "High",
        description: "Comprehensive network security audit",
        progress: 0
      }
    ],
    upcoming: [
      {
        id: 5,
        title: "Data Migration",
        client: "EduTech University",
        location: "555 Campus Rd, Austin",
        startTime: "08:00 AM",
        endTime: "04:00 PM",
        date: "2023-06-20",
        status: "Confirmed",
        priority: "High",
        description: "Migrate university database to new servers",
        progress: 0
      },
      {
        id: 6,
        title: "Hardware Upgrade",
        client: "Retail Chain",
        location: "777 Shopping Mall, Miami",
        startTime: "11:00 AM",
        endTime: "07:00 PM",
        date: "2023-06-22",
        status: "Confirmed",
        priority: "Medium",
        description: "Upgrade POS systems across 5 locations",
        progress: 0
      }
    ]
  };

  // Mock calendar events
  const calendarEvents = [
    { date: "2023-06-15", title: "Network Installation", time: "09:00 AM" },
    { date: "2023-06-15", title: "Server Maintenance", time: "02:00 PM" },
    { date: "2023-06-16", title: "WiFi Setup", time: "10:00 AM" },
    { date: "2023-06-17", title: "Security Audit", time: "09:00 AM" },
    { date: "2023-06-20", title: "Data Migration", time: "08:00 AM" },
    { date: "2023-06-22", title: "Hardware Upgrade", time: "11:00 AM" }
  ];

  // Format date for display
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Work item component
  const WorkItem = ({ work }) => (
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">{work.title}</h5>
            <p className="card-text text-muted mb-2">{work.client}</p>
          </div>
          <span className={`badge ${
            work.priority === 'High' ? 'bg-danger' : 
            work.priority === 'Medium' ? 'bg-warning' : 'bg-info'
          }`}>
            {work.priority}
          </span>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="bi bi-geo-alt me-1"></i> {work.location}
          </small>
        </div>
        
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <small className="text-muted">
              <i className="bi bi-calendar-event me-1"></i> {work.date}
            </small>
          </div>
          <div>
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i> {work.startTime} - {work.endTime}
            </small>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Progress</small>
            <small className="text-muted">{work.progress}%</small>
          </div>
          <div className="progress" style={{height: '8px'}}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${work.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between">
          <span className={`badge ${
            work.status === 'In Progress' ? 'bg-primary' :
            work.status === 'Pending Review' ? 'bg-warning' :
            work.status === 'Assigned' ? 'bg-info' : 'bg-success'
          }`}>
            {work.status}
          </span>
          <button className="btn btn-sm btn-outline-primary">View Details</button>
        </div>
      </div>
    </div>
  );

  // Mobile-style Calendar Component
  const MobileCalendar = () => {
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    // Navigate months
    const prevMonth = () => {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };
    
    const nextMonth = () => {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };
    
    // Generate calendar days
    const calendarDays = [];
    
    // Add empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === formatDate(today);
      const isSelected = dateStr === formatDate(currentDate);
      const dayEvents = calendarEvents.filter(event => event.date === dateStr);
      
      calendarDays.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => setCurrentDate(new Date(currentYear, currentMonth, day))}
        >
          <div className="day-header">
            <span className="day-number">{day}</span>
            {isToday && <span className="today-indicator">Today</span>}
          </div>
          <div className="day-events">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div key={index} className="event-item" title={event.title}>
                <span className="event-time">{event.time}</span>
                <span className="event-title">{event.title}</span>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="event-item more-events">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mobile-calendar">
        <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-sm btn-outline-secondary" onClick={prevMonth}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <h5 className="mb-0">{monthNames[currentMonth]} {currentYear}</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={nextMonth}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        <div className="calendar-grid">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="calendar-day-header text-center text-muted small">
              {day}
            </div>
          ))}
          {calendarDays}
        </div>
      </div>
    );
  };

  // Real-time clock component
  const RealTimeClock = () => {
    const formattedDate = currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const formattedTime = currentTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    return (
      <div className="real-time-display card border-0 shadow-sm mt-4">
        <div className="card-body text-center">
          <div className="current-date mb-2">
            <h5 className="mb-0">{formattedDate}</h5>
          </div>
          <div className="current-time">
            <h2 className="mb-0 text-primary">{formattedTime}</h2>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Left Navigation Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>WorkerDash</h2>
        </div>
        <nav className={styles.navMenu}>
          <Link to="/" className={styles.navItem}>
            <i className="icon-dashboard"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="#" className={`${styles.navItem} ${styles.active}`}>
            <i className="icon-orders"></i>
            <span>Works</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-tasks"></i>
            <span>Tasks</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-sales"></i>
            <span>Sales</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-payments"></i>
            <span>Payments</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-inventory"></i>
            <span>Inventory</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-clients"></i>
            <span>Clients</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-reports"></i>
            <span>Reports</span>
          </Link>
          <Link to="#" className={styles.navItem}>
            <i className="icon-calls"></i>
            <span>Calls</span>
          </Link>
          <Link to="/worker/settings" className={styles.navItem}>
            <i className="icon-settings"></i>
            <span>Settings</span>
          </Link>
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <i className="icon-user"></i>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.username}>John Doe</div>
            <div className={styles.role}>Worker</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Works</h1>
                <div className="btn-group" role="group">
                  <button 
                    className={`btn ${activeTab === 'ongoing' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('ongoing')}
                  >
                    Ongoing ({works.ongoing.length})
                  </button>
                  <button 
                    className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('pending')}
                  >
                    Pending ({works.pending.length})
                  </button>
                  <button 
                    className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    Upcoming ({works.upcoming.length})
                  </button>
                </div>
              </div>

              {/* Works List */}
              <div className="works-list">
                {works[activeTab].length > 0 ? (
                  works[activeTab].map(work => (
                    <WorkItem key={work.id} work={work} />
                  ))
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-clipboard-check" style={{fontSize: '3rem', opacity: 0.3}}></i>
                    <p className="mt-3">No {activeTab} works found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Calendar Panel */}
            <div className="col-lg-3">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">Schedule</h3>
                </div>
                <div className="card-body">
                  <MobileCalendar />
                  <RealTimeClock />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerWorks;