import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Divider,
  Alert,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { 
  getWorkerBookingsByUserId,
  getBookingDetails,
  updateBookingStatus,
  getAssignedBookingsByUserId
} from '../../services/workerBooking';

const WorkerJob = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('active'); // active, completed, all
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [dataSource, setDataSource] = useState('api');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user from localStorage
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (!savedUser) {
        throw new Error('User not logged in');
      }
      
      console.log('Fetching bookings for user ID:', savedUser.id);
      
      // Try multiple API endpoints to get bookings
      let bookingsData = null;
      
      try {
        // Try the new workerBooking API
        bookingsData = await getWorkerBookingsByUserId(savedUser.id);
        console.log('Worker bookings by user ID response:', bookingsData);
      } catch (err) {
        console.warn('Failed to fetch bookings by user ID, trying assigned bookings:', err.message);
        try {
          // Try assigned bookings API
          bookingsData = await getAssignedBookingsByUserId(savedUser.id);
          console.log('Assigned bookings response:', bookingsData);
        } catch (err2) {
          console.warn('Failed to fetch assigned bookings:', err2.message);
          throw new Error('Unable to fetch bookings. Please try again.');
        }
      }
      
      if (bookingsData && bookingsData.bookings) {
        setBookings(bookingsData.bookings);
        setDataSource('api');
        console.log('✅ Found', bookingsData.bookings.length, 'bookings');
      } else if (bookingsData && bookingsData.data && Array.isArray(bookingsData.data)) {
        setBookings(bookingsData.data);
        setDataSource('api');
        console.log('✅ Found', bookingsData.data.length, 'bookings (data array)');
      } else if (bookingsData && Array.isArray(bookingsData)) {
        setBookings(bookingsData);
        setDataSource('api');
        console.log('✅ Found', bookingsData.length, 'bookings (direct array)');
      } else {
        setBookings([]);
        console.log('ℹ️ No bookings found');
      }
      
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatLKR = (value) =>
    `LKR ${Number(value || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Error formatting time:', timeString, error);
      return 'Invalid Time';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'primary';
      case 'ongoing':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStartService = async (bookingId) => {
    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      
      // Update booking status to ongoing
      await updateBookingStatus(bookingId, 'ongoing');
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId 
          ? { ...booking, status: 'ongoing' }
          : booking
      ));
      
      console.log('✅ Service started for booking:', bookingId);
      
    } catch (err) {
      console.error('Error starting service:', err);
      alert('Failed to start service. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleCompleteService = async (bookingId) => {
    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      
      // Update booking status to completed
      await updateBookingStatus(bookingId, 'completed');
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId 
          ? { ...booking, status: 'completed', isCompleted: 1 }
          : booking
      ));
      
      console.log('✅ Service completed for booking:', bookingId);
      
    } catch (err) {
      console.error('Error completing service:', err);
      alert('Failed to complete service. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleViewDetails = async (bookingId) => {
    try {
      const booking = bookings.find(b => b.bookingId === bookingId);
      if (booking) {
        setSelectedBooking(booking);
        setShowBookingDetails(true);
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    switch (selectedTab) {
      case 'active':
        return booking.status === 'assigned' || booking.status === 'ongoing';
      case 'completed':
        return booking.status === 'completed';
      case 'all':
        return true;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', p: 4 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Loading your bookings...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', p: 4 }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          ⚠️
        </Typography>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={fetchBookings}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937' }}>
          My Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Manage your assigned bookings and services
        </Typography>
        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary">
              Total Bookings: {bookings.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={dataSource === 'api' ? (bookings.length > 0 ? 'Live Data' : 'API Connected') : 'No Data'} 
                color={dataSource === 'api' ? (bookings.length > 0 ? 'success' : 'info') : 'default'}
                size="small"
              />
              <Button
                variant="outlined"
                onClick={fetchBookings}
                startIcon={<RefreshIcon />}
                size="small"
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Tab Navigation */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={`Active Bookings (${bookings.filter(b => b.status === 'assigned' || b.status === 'ongoing').length})`} 
            value="active" 
          />
          <Tab 
            label={`Completed (${bookings.filter(b => b.status === 'completed').length})`} 
            value="completed" 
          />
          <Tab 
            label={`All Bookings (${bookings.length})`} 
            value="all" 
          />
        </Tabs>
      </Paper>

      {/* Bookings List */}
      <Grid container spacing={3}>
        {filteredBookings.length === 0 ? (
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc' }}>
              <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No bookings found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {selectedTab === 'active' 
                  ? "You don't have any active bookings at the moment."
                  : selectedTab === 'completed'
                  ? "You haven't completed any bookings yet."
                  : "No bookings assigned to you."
                }
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {dataSource === 'api' 
                  ? "✅ API is working but no bookings are assigned to you yet."
                  : "Click 'Refresh' to fetch data from the backend."
                }
              </Typography>
              {dataSource === 'api' && (
                <Typography variant="caption" color="text.secondary">
                  The backend API is responding correctly. You'll see bookings here once they are assigned to you.
                </Typography>
              )}
            </Paper>
          </Grid>
        ) : (
          filteredBookings.map((booking, index) => (
            <Grid item xs={12} md={6} lg={4} key={booking.bookingId}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <WorkIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {booking.service_category?.categoryName || 'Service'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Client: {booking.user?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Date
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(booking.scheduledDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Time
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatTime(booking.scheduledTime)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MoneyIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Amount
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        {formatLKR(booking.baseAmount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                      </Box>
                      <Chip 
                        label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {booking.address}
                    </Typography>
                  </Box>

                  {booking.specialInstructions && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Special Instructions
                      </Typography>
                      <Paper elevation={0} sx={{ p: 1, bgcolor: 'grey.50' }}>
                        <Typography variant="body2">
                          {booking.specialInstructions}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewDetails(booking.bookingId)}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    View Details
                  </Button>
                  
                  {booking.status === 'assigned' && (
                    <Button
                      variant="contained"
                      startIcon={<StartIcon />}
                      onClick={() => handleStartService(booking.bookingId)}
                      disabled={actionLoading[booking.bookingId]}
                      fullWidth
                      color="primary"
                    >
                      {actionLoading[booking.bookingId] ? 'Starting...' : 'Start Service'}
                    </Button>
                  )}
                  
                  {booking.status === 'ongoing' && (
                    <Button
                      variant="contained"
                      startIcon={<StopIcon />}
                      onClick={() => handleCompleteService(booking.bookingId)}
                      disabled={actionLoading[booking.bookingId]}
                      fullWidth
                      color="success"
                    >
                      {actionLoading[booking.bookingId] ? 'Completing...' : 'Complete Service'}
                    </Button>
                  )}
                  
                  {booking.status === 'completed' && (
                    <Button
                      variant="contained"
                      startIcon={<CheckIcon />}
                      disabled
                      fullWidth
                      color="success"
                    >
                      ✓ Completed
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Booking Details Modal */}
      <Dialog 
        open={showBookingDetails} 
        onClose={() => setShowBookingDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              Booking Details
            </Typography>
            <IconButton onClick={() => setShowBookingDetails(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Booking ID
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    #{selectedBooking.bookingId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Service
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedBooking.service_category?.categoryName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Client Name
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedBooking.user?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Client Phone
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedBooking.user?.phone || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Scheduled Date
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(selectedBooking.scheduledDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Scheduled Time
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {formatTime(selectedBooking.scheduledTime)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MoneyIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Amount
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    {formatLKR(selectedBooking.baseAmount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                  </Box>
                  <Chip 
                    label={selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    color={getStatusColor(selectedBooking.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Address
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedBooking.address}
                  </Typography>
                </Grid>
                {selectedBooking.specialInstructions && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Special Instructions
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {selectedBooking.specialInstructions}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBookingDetails(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkerJob;
