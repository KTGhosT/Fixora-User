// AdminDashboard.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  CalendarToday as BookingIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Home as HomeIcon,
  TrendingUp,
  Group,
  Assignment,
  Category as CategoryIcon,
  Map as MapIcon // <-- Import icon for Manage Worker Location
} from '@mui/icons-material';
import './admin.css';



// Mock data
const dashboardStats = [
  { title: 'Total Users', value: '1,234', icon: <Group />, color: '#1976d2' },
  { title: 'Active Workers', value: '89', icon: <PeopleIcon />, color: '#2e7d32' },
  { title: 'Services', value: '24', icon: <BuildIcon />, color: '#ed6c02' },
  { title: 'Bookings', value: '456', icon: <Assignment />, color: '#9c27b0' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = useMemo(() => ([
    { text: 'Dashboard', icon: <DashboardIcon />, id: 'dashboard', path: '/admin' },
    { text: 'Manage Users', icon: <PeopleIcon />, id: 'users', path: '/admin/manage-users' },
    { text: 'Manage Workers', icon: <BuildIcon />, id: 'workers', path: '/admin/manage-workers' },
    { text: 'Manage Services', icon: <WorkIcon />, id: 'services', path: '/admin/manage-services' },
    { text: 'Manage Bookings', icon: <BookingIcon />, id: 'bookings', path: '/admin/manage-bookings' },
    { text: 'Manage Locations', icon: <LocationIcon />, id: 'locations', path: '/admin/manage-locations' },
    { text: 'Manage Service Categories', icon: <CategoryIcon />, id: 'service-categories', path: '/admin/manage-service-categories' },
    { text: 'Manage Worker Location', icon: <MapIcon />, id: 'worker-location', path: '/admin/manage-worker-location' } // <-- Added
  ]), []);

  const activeSection = useMemo(() => {
    const subPath = location.pathname.replace(/^\/admin\/?/, '').split('/')[0];
    if (!subPath) return 'dashboard';
    if (subPath === 'manage-users') return 'users';
    if (subPath === 'manage-services') return 'services';
    if (subPath === 'manage-workers') return 'workers';
    if (subPath === 'manage-bookings') return 'bookings';
    if (subPath === 'manage-locations') return 'locations';
    if (subPath === 'manage-service-categories') return 'service-categories';
    if (subPath === 'manage-worker-location') return 'worker-location';
    return 'dashboard';
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // nested routes will render via <Outlet />

  const drawer = (
    <div className="drawer-container">
      <div className="drawer-header">
        <Typography variant="h6" className="logo">
          Fixaora Admin
        </Typography>
      </div>
      <List className="nav-list">
        {menuItems.map((item) => (
            <ListItem
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
          >
              <ListItemButton onClick={() => navigate(item.path)} className="nav-item-btn">
                <ListItemIcon className="nav-icon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box className="admin-dashboard">
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="menu-button"
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap className="brand-text">
            Admin Panel
          </Typography>
          
          <Box className="header-actions">
            <IconButton color="inherit" aria-label="back to home" onClick={() => navigate('/') }>
              <HomeIcon />
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar className="avatar" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <nav className="drawer">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          className="mobile-drawer"
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          className="desktop-drawer"
          open
        >
          {drawer}
        </Drawer>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="toolbar-spacer" />
        <Outlet />
      </main>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => (
  <div className="dashboard-overview">
    <Typography variant="h4" gutterBottom className="section-title">
      Dashboard Overview
    </Typography>
    
    <Grid container spacing={3}>
      {/* Stats Cards */}
      {dashboardStats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card className="stat-card" elevation={3}>
            <CardContent className="stat-content">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15` }}>
                {React.cloneElement(stat.icon, { style: { color: stat.color } })}
              </div>
              <div className="stat-info">
                <Typography variant="h4" className="stat-value">
                  {stat.value}
                </Typography>
                <Typography variant="body2" className="stat-title">
                  {stat.title}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </div>
);

// Placeholder Components for Different Sections
const ManageUsers = () => (
  <div className="section-container">
    <Typography variant="h4" gutterBottom className="section-title">
      Manage Users
    </Typography>
    <Paper className="content-paper">
      <Typography>Users management interface coming soon...</Typography>
    </Paper>
  </div>
);

const ManageWorkers = () => (
  <div className="section-container">
    <Typography variant="h4" gutterBottom className="section-title">
      Manage Workers
    </Typography>
    <Paper className="content-paper">
      <Typography>Workers management interface coming soon...</Typography>
    </Paper>
  </div>
);

// Note: ManageServiceCategories is not defined here, assumed to be handled by routing to src/pages/admin/ManageServiceCategories.jsx

const ManageBookings = () => (
  <div className="section-container">
    <Typography variant="h4" gutterBottom className="section-title">
      Manage Bookings
    </Typography>
    <Paper className="content-paper">
      <Typography>Bookings management interface coming soon...</Typography>
    </Paper>
  </div>
);

// const ManageLocations = () => (
//   <div className="section-container">
//     <Typography variant="h4" gutterBottom className="section-title">
//       Manage Locations
//     </Typography>
//     <Paper className="content-paper">
//       <Typography>Locations management interface coming soon...</Typography>
//     </Paper>
//   </div>
// );

// NEW: Manage Worker Location placeholder
const ManageWorkerLocation = () => (
  <div className="section-container">
    <Typography variant="h4" gutterBottom className="section-title">
      Manage Worker Location
    </Typography>
    <Paper className="content-paper">
      <Typography>Worker location management interface coming soon...</Typography>
    </Paper>
  </div>
);

export default AdminDashboard;