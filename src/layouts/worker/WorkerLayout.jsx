// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Box,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Work as WorkIcon,
  Message as MessageIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { FaUserCog } from 'react-icons/fa';
import { FiHome, FiSettings, FiBriefcase, FiMessageSquare, FiLogOut } from 'react-icons/fi';

const drawerWidth = 260;

const navItems = [
  { text: 'Dashboard', icon: <FiHome className="text-xl" />, path: '/worker' },
  { text: 'My Jobs', icon: <FiBriefcase className="text-xl" />, path: '/worker/works' },
  { text: 'Messages', icon: <FiMessageSquare className="text-xl" />, path: '/worker/messages' },
  { text: 'Settings', icon: <FiSettings className="text-xl" />, path: '/worker/settings' },
];

const WorkerLayout = ({ user }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const drawer = (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-5 flex items-center gap-3 border-b">
        <FaUserCog className="text-blue-600 text-2xl" />
        <Typography variant="h6" className="font-bold text-gray-800">
          WorkerHub
        </Typography>
      </div>
      <List className="flex-1 px-2 py-4">
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            className={`mb-1 rounded-lg hover:bg-blue-50 ${
              location.pathname === item.path ? 'bg-blue-100' : ''
            }`}
          >
            <ListItemIcon className="min-w-[40px] text-blue-600">{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} className="text-gray-700 font-medium" />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box className="p-3">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <FiLogOut className="mr-3 text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </Box>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Mobile Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #e5e7eb',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box className="flex flex-col flex-1">
        {/* Top App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: '#ffffff',
            color: '#1f2937',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" className="font-semibold">
              Welcome back, {user?.name || 'Worker'}!
            </Typography>
            <Box className="ml-auto flex items-center">
              <Avatar
                alt="User"
                src="/avatar.png"
                sx={{ width: 36, height: 36, bgcolor: '#3b82f6' }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content (Outlet for nested routes) */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 4 },
            mt: { sm: 8 },
            backgroundColor: '#f9fafb',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </div>
  );
};

export default WorkerLayout;