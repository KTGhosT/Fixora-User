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
  Map as MapIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Mock data
const dashboardStats = [
  { title: 'Total Users', value: '1,234', icon: <Group />, color: '#3b82f6', change: '+12%' },
  { title: 'Active Workers', value: '89', icon: <PeopleIcon />, color: '#10b981', change: '+5%' },
  { title: 'Services', value: '24', icon: <BuildIcon />, color: '#f59e0b', change: '+8%' },
  { title: 'Bookings', value: '456', icon: <Assignment />, color: '#8b5cf6', change: '+23%' }
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
    { text: 'Service Categories', icon: <CategoryIcon />, id: 'service-categories', path: '/admin/manage-service-categories' },
    { text: 'Worker Location', icon: <MapIcon />, id: 'worker-location', path: '/admin/manage-worker-location' }
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

  const drawer = (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <Typography variant="h6" className="font-bold text-white">
            Fixaora
          </Typography>
        </div>
      </div>

      {/* Navigation List */}
      <List className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <ListItem key={item.id} className="p-0">
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`
                rounded-lg transition-all duration-200 mb-1
                ${activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25' 
                  : 'hover:bg-gray-800 hover:bg-opacity-50'
                }
              `}
            >
              <ListItemIcon className={`min-w-10 ${activeSection === item.id ? 'text-white' : 'text-gray-400'}`}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                className={activeSection === item.id ? 'text-white' : 'text-gray-300'}
                primaryTypographyProps={{ fontSize: '14px', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800 bg-opacity-50">
          <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-xs">
            A
          </Avatar>
          <div className="flex-1 min-w-0">
            <Typography variant="body2" className="text-white font-medium truncate">
              Admin User
            </Typography>
            <Typography variant="caption" className="text-gray-400 truncate">
              administrator@fixaora.com
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Box className="flex h-screen bg-gray-950">
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        className="bg-gray-900 shadow-lg border-b border-gray-800"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className="px-4">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="lg:hidden mr-4"
          >
            <MenuIcon />
          </IconButton>
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center lg:hidden">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <Typography variant="h6" className="font-bold text-white">
              Admin Panel
            </Typography>
          </div>
          
          <div className="flex items-center space-x-2">
            <IconButton 
              color="inherit" 
              aria-label="back to home" 
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <HomeIcon />
            </IconButton>
            
            <IconButton 
              color="inherit"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-xs">
                A
              </Avatar>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <nav className="flex-shrink-0">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          className="lg:hidden"
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              backgroundColor: '#111827'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          className="hidden lg:block"
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              backgroundColor: '#111827',
              borderRight: '1px solid #374151'
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950">
        <Toolbar />
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="mt-2"
        PaperProps={{
          className: "bg-gray-800 text-white mt-2 rounded-lg shadow-xl border border-gray-700",
          elevation: 8
        }}
      >
        <MenuItem onClick={handleMenuClose} className="flex items-center space-x-3 hover:bg-gray-700">
          <PersonIcon className="text-gray-400" fontSize="small" />
          <span className="text-sm">Profile</span>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="flex items-center space-x-3 hover:bg-gray-700">
          <SettingsIcon className="text-gray-400" fontSize="small" />
          <span className="text-sm">Settings</span>
        </MenuItem>
        <div className="border-t border-gray-600 my-1"></div>
        <MenuItem onClick={handleMenuClose} className="flex items-center space-x-3 hover:bg-red-600 hover:bg-opacity-20 text-red-400">
          <LogoutIcon className="text-red-400" fontSize="small" />
          <span className="text-sm">Logout</span>
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <Typography variant="h4" className="font-bold text-white mb-4 sm:mb-0">
        Dashboard Overview
      </Typography>
      <div className="flex space-x-3">
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium">
          Export Report
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg shadow-blue-500/25 text-sm font-medium">
          Generate Insights
        </button>
      </div>
    </div>
    
    {/* Stats Grid */}
    <Grid container spacing={3}>
      {dashboardStats.map((stat, index) => (
        <Grid item xs={12} sm={6} xl={3} key={index}>
          <Card className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h3" className="font-bold text-white mb-1">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" className="text-gray-400 font-medium mb-2">
                    {stat.title}
                  </Typography>
                  <div className={`flex items-center text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp fontSize="small" className={stat.change.startsWith('+') ? '' : 'rotate-180'} />
                    <span className="ml-1 font-medium">{stat.change}</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  {React.cloneElement(stat.icon, { 
                    style: { color: stat.color, fontSize: '28px' } 
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* Additional Content Sections */}
    <Grid container spacing={3} className="mt-6">
      <Grid item xs={12} lg={8}>
        <Paper className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <Typography variant="h6" className="text-white font-bold mb-4">
            Recent Activity
          </Typography>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-4 p-3 hover:bg-gray-750 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <PeopleIcon className="text-white text-sm" />
                </div>
                <div className="flex-1">
                  <Typography variant="body2" className="text-white font-medium">
                    New user registration
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    2 hours ago
                  </Typography>
                </div>
                <div className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-xs font-medium">
                  Completed
                </div>
              </div>
            ))}
          </div>
        </Paper>
      </Grid>
      
      <Grid item xs={12} lg={4}>
        <Paper className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <Typography variant="h6" className="text-white font-bold mb-4">
            Quick Actions
          </Typography>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-gray-750 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600">
              <Typography variant="body2" className="text-white font-medium">
                Add New Service
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Create a new service category
              </Typography>
            </button>
            <button className="w-full text-left p-4 bg-gray-750 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600">
              <Typography variant="body2" className="text-white font-medium">
                View Analytics
              </Typography>
              <Typography variant="caption" className="text-gray-400">
                Check performance metrics
              </Typography>
            </button>
          </div>
        </Paper>
      </Grid>
    </Grid>
  </div>
);

// Placeholder Components for Different Sections
const ManageUsers = () => (
  <div className="space-y-6">
    <Typography variant="h4" className="font-bold text-white">
      Manage Users
    </Typography>
    <Paper className="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <div className="text-center">
        <PeopleIcon className="text-gray-500 text-6xl mx-auto mb-4" />
        <Typography variant="h6" className="text-white font-medium mb-2">
          Users Management
        </Typography>
        <Typography variant="body2" className="text-gray-400 max-w-md mx-auto">
          Advanced users management interface with search, filters, and bulk actions coming soon...
        </Typography>
      </div>
    </Paper>
  </div>
);

const ManageWorkers = () => (
  <div className="space-y-6">
    <Typography variant="h4" className="font-bold text-white">
      Manage Workers
    </Typography>
    <Paper className="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <div className="text-center">
        <BuildIcon className="text-gray-500 text-6xl mx-auto mb-4" />
        <Typography variant="h6" className="text-white font-medium mb-2">
          Workers Management
        </Typography>
        <Typography variant="body2" className="text-gray-400 max-w-md mx-auto">
          Comprehensive workers management system with verification and performance tracking coming soon...
        </Typography>
      </div>
    </Paper>
  </div>
);

const ManageBookings = () => (
  <div className="space-y-6">
    <Typography variant="h4" className="font-bold text-white">
      Manage Bookings
    </Typography>
    <Paper className="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <div className="text-center">
        <BookingIcon className="text-gray-500 text-6xl mx-auto mb-4" />
        <Typography variant="h6" className="text-white font-medium mb-2">
          Bookings Management
        </Typography>
        <Typography variant="body2" className="text-gray-400 max-w-md mx-auto">
          Complete booking management system with calendar view and status tracking coming soon...
        </Typography>
      </div>
    </Paper>
  </div>
);

const ManageWorkerLocation = () => (
  <div className="space-y-6">
    <Typography variant="h4" className="font-bold text-white">
      Manage Worker Location
    </Typography>
    <Paper className="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <div className="text-center">
        <MapIcon className="text-gray-500 text-6xl mx-auto mb-4" />
        <Typography variant="h6" className="text-white font-medium mb-2">
          Worker Location Management
        </Typography>
        <Typography variant="body2" className="text-gray-400 max-w-md mx-auto">
          Real-time worker location tracking and geofencing system coming soon...
        </Typography>
      </div>
    </Paper>
  </div>
);

export default AdminDashboard;