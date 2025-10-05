import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './dashboard.module.css';
import { gsap } from 'gsap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const WorkerWorks = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const listRef = useRef(null);
  const timeRef = useRef(null);
  const agendaRef = useRef(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(260);

  // Responsive sidebar width adjustments for laptop/PC
  useEffect(() => {
    const updateSidebar = () => {
      const w = window.innerWidth;
      const width = w <= 1024 ? 180 : w <= 1200 ? 200 : w <= 1366 ? 220 : 260;
      setSidebarWidth(width);
    };
    updateSidebar();
    window.addEventListener('resize', updateSidebar);
    return () => window.removeEventListener('resize', updateSidebar);
  }, []);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Animate list items when tab changes
  useEffect(() => {
    const cards = listRef.current?.querySelectorAll('.card');
    if (cards && cards.length) {
      gsap.fromTo(cards, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
    }
  }, [activeTab]);

  // Subtle pulse animation for real-time clock
  useEffect(() => {
    if (timeRef.current) {
      gsap.to(timeRef.current, { scale: 1.02, duration: 1.2, yoyo: true, repeat: -1, ease: 'power1.inOut' });
    }
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

  // Calendar events (stateful for adding new entries)
  const [calendarEvents, setCalendarEvents] = useState([
    { date: "2023-06-15", title: "Network Installation", time: "09:00 AM", status: "ongoing" },
    { date: "2023-06-15", title: "Server Maintenance", time: "02:00 PM", status: "pending" },
    { date: "2023-06-16", title: "WiFi Setup", time: "10:00 AM", status: "upcoming" },
    { date: "2023-06-17", title: "Security Audit", time: "09:00 AM", status: "ongoing" },
    { date: "2023-06-20", title: "Data Migration", time: "08:00 AM", status: "pending" },
    { date: "2023-06-22", title: "Hardware Upgrade", time: "11:00 AM", status: "upcoming" }
  ]);

  // Format date for display
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Shorten text for compact agenda display
  const shortText = (text, max = 22) => {
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  };

  // Map event status to color class
  const eventClass = (status) => {
    switch (status) {
      case 'ongoing':
        return 'rc-event--ongoing';
      case 'pending':
        return 'rc-event--pending';
      case 'upcoming':
        return 'rc-event--upcoming';
      default:
        return '';
    }
  };

  // Inline style mapping for colored chips and agenda items
  const chipColors = {
    ongoing: { bg: '#eaf2ff', border: '#cfe0ff', text: '#1f5bd8' },
    pending: { bg: '#fff6e9', border: '#ffe3bd', text: '#b85d00' },
    upcoming: { bg: '#e9f9ee', border: '#cdeed8', text: '#1f8a4d' },
  };

  const getEventChipStyle = (status) => {
    const c = chipColors[status] || chipColors.ongoing;
    return {
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
    };
  };

  const getAgendaItemStyle = (status) => {
    const c = chipColors[status] || chipColors.ongoing;
    return {
      borderLeft: `3px solid ${c.text}`,
    };
  };

  const getDotStyle = (status) => {
    const c = chipColors[status] || chipColors.ongoing;
    return {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: c.text,
      display: 'inline-block',
    };
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

  // React Calendar integration
  const getDayEvents = (date) => {
    const dateStr = formatDate(date);
    return calendarEvents.filter(ev => ev.date === dateStr);
  };

  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dayEvents = getDayEvents(date).slice(0, 2);
    if (!dayEvents.length) return null;
    return (
      <div className="rc-day-events">
        {dayEvents.map((ev, idx) => (
          <div
            key={idx}
            className={`rc-event ${eventClass(ev.status)}`}
            title={`${ev.time} · ${ev.title}`}
            style={getEventChipStyle(ev.status)}
          >
            <span className="rc-time">{ev.time}</span>
            <span className="rc-title">{shortText(ev.title, 18)}</span>
          </div>
        ))}
      </div>
    );
  };

  const handleActiveMonthChange = ({ activeStartDate }) => {
    setCurrentDate(activeStartDate);
    gsap.fromTo('.react-calendar__tile', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.01, ease: 'power2.out' });
  };

  const selectedDayEvents = getDayEvents(currentDate);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventTime.trim()) return;
    const newEv = { date: formatDate(currentDate), title: newEventTitle.trim(), time: newEventTime.trim() };
    setCalendarEvents(prev => [...prev, newEv]);
    setNewEventTitle('');
    setNewEventTime('');
    // Animate the newly added agenda item
    setTimeout(() => {
      const items = agendaRef.current?.querySelectorAll('.rc-agenda-item');
      if (items && items.length) {
        const last = items[items.length - 1];
        gsap.fromTo(last, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    }, 0);
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
          <div className="current-time" ref={timeRef}>
            <h2 className="mb-0 text-primary">{formattedTime}</h2>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Left Navigation Sidebar */}
      <div className={styles.sidebar} style={{ width: sidebarWidth }}>
        <div className={styles.logo}>
          <h2>WorkerDash</h2>
        </div>
        <nav className={styles.navMenu}>
          <Link to="/worker/dashboard" className={styles.navItem}>
            <i className="icon-dashboard"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/worker/works" className={`${styles.navItem} ${styles.active}`}>
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
      <div className={styles.mainContent} style={{ marginLeft: sidebarWidth }}>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-lg-8">
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
              <div className="works-list" ref={listRef}>
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
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">Schedule</h3>
                </div>
                <div className="card-body">
                  <Calendar
                    value={currentDate}
                    onChange={setCurrentDate}
                    onActiveStartDateChange={handleActiveMonthChange}
                    tileContent={renderTileContent}
                  />
                  {/* Selected day agenda */}
                  <div className="rc-agenda mt-3" ref={agendaRef}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Agenda for {formatDate(currentDate)}</h6>
                    </div>
                    {selectedDayEvents.length ? (
                      selectedDayEvents.map((ev, idx) => (
                        <div
                          key={`${ev.title}-${idx}`}
                          className={`rc-agenda-item ${eventClass(ev.status)}`}
                          title={`${ev.time} · ${ev.title}`}
                          style={getAgendaItemStyle(ev.status)}
                        >
                          <span className={`rc-dot ${eventClass(ev.status)}`} style={getDotStyle(ev.status)}></span>
                          <span className="rc-agenda-time">{ev.time}</span>
                          <span className="rc-agenda-title">{shortText(ev.title, 28)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="rc-agenda-empty">
                        No events for this day
                      </div>
                    )}
                    <form className="rc-add-form mt-2" onSubmit={handleAddEvent}>
                      <div className="row g-2">
                        <div className="col-5">
                          <input type="text" className="form-control form-control-sm" placeholder="Event title" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} />
                        </div>
                        <div className="col-4">
                          <input type="text" className="form-control form-control-sm" placeholder="Time (e.g. 09:00 AM)" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} />
                        </div>
                        <div className="col-3 d-grid">
                          <button type="submit" className="btn btn-primary btn-sm">Add</button>
                        </div>
                      </div>
                    </form>
                  </div>
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