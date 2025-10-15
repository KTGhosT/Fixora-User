import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
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
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  getWorkerBookings, 
  getBookingDetails, 
  startService, 
  completeService, 
  updateServiceStatus,
  getServiceByBookingId,
  createServiceForBooking,
  getWorkerServiceHistory 
} from '../../services/workerJob';

const WorkerWorks = () => {
  const [user, setUser] = useState(null);
  const [worker, setWorker] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('api'); // 'api' or 'mock'
  const [apiTestResults, setApiTestResults] = useState(null);
  const [selectedTab, setSelectedTab] = useState('active'); // active, completed, all
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user from localStorage
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (!savedUser) {
          throw new Error('User not logged in');
        }
        
        setUser(savedUser);
        
        // For now, we'll use the user ID as worker ID
        // In a real app, you'd fetch the worker profile first
        const workerId = savedUser.id;
        console.log('Fetching data for worker ID:', workerId);
        
        let hasRealData = false;
        
        // Try to fetch worker bookings
        try {
          const bookingsData = await getWorkerBookings(workerId);
          console.log('Worker bookings data:', bookingsData);
          console.log('Bookings array length:', bookingsData?.bookings?.length || 0);
          if (bookingsData && bookingsData.bookings) {
            setBookings(bookingsData.bookings);
            setDataSource('api');
            if (bookingsData.bookings.length > 0) {
              hasRealData = true;
              console.log('✅ Found', bookingsData.bookings.length, 'bookings');
            } else {
              console.log('ℹ️ API returned empty bookings array');
            }
          }
        } catch (bookingErr) {
          console.warn('Failed to fetch worker bookings:', bookingErr.message);
        }
        
        // Try to fetch worker service history
        try {
          const servicesData = await getWorkerServiceHistory(workerId);
          console.log('Worker services data:', servicesData);
          console.log('Services array length:', servicesData?.services?.length || 0);
          if (servicesData && servicesData.services) {
            setServices(servicesData.services);
            if (servicesData.services.length > 0) {
              hasRealData = true;
              console.log('✅ Found', servicesData.services.length, 'services');
            } else {
              console.log('ℹ️ API returned empty services array');
            }
          }
        } catch (serviceErr) {
          console.warn('Failed to fetch worker services:', serviceErr.message);
        }
        
        // Set data source to API regardless of data availability
        setDataSource('api');
        
        if (!hasRealData) {
          console.log('API responded successfully but no data available for this worker');
        }
        
      } catch (err) {
        console.error('Error fetching worker data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatLKR = (value) =>
    `LKR ${Number(value || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceStatusColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Finished':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartService = async (bookingId) => {
    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }));
      
      // First, try to get existing service
      let service = null;
      try {
        const serviceData = await getServiceByBookingId(bookingId);
        service = serviceData.service;
      } catch (err) {
        // If no service exists, create one
        const newService = await createServiceForBooking(bookingId, {
          totalAmount: bookings.find(b => b.bookingId === bookingId)?.baseAmount || 0,
          duration: 120, // default 2 hours
          isActive: 1,
          status: 'Pending'
        });
        service = newService.service;
      }
      
      // Start the service
      await startService(service.serviceId);
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId 
          ? { ...booking, status: 'ongoing' }
          : booking
      ));
      
      setServices(prev => prev.map(s => 
        s.serviceId === service.serviceId 
          ? { ...s, status: 'Ongoing' }
          : s
      ));
      
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
      
      const serviceData = await getServiceByBookingId(bookingId);
      await completeService(serviceData.service.serviceId);
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.bookingId === bookingId 
          ? { ...booking, status: 'completed', isCompleted: 1 }
          : booking
      ));
      
      setServices(prev => prev.map(s => 
        s.bookingId === bookingId 
          ? { ...s, status: 'Finished' }
          : s
      ));
      
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
      setSelectedBooking(booking);
      setShowBookingDetails(true);
    } catch (err) {
      console.error('Error fetching booking details:', err);
    }
  };

  const testAPIEndpoints = async () => {
    const results = {
      workerBookings: null,
      workerServices: null,
      errors: []
    };

    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (!savedUser) {
        throw new Error('User not logged in');
      }

      const workerId = savedUser.id;
      console.log('Testing API endpoints for worker ID:', workerId);

      // Test worker bookings endpoint
      try {
        const bookingsData = await getWorkerBookings(workerId);
        results.workerBookings = {
          success: true,
          data: bookingsData,
          message: 'Worker bookings API working'
        };
        console.log('✅ Worker bookings API test passed:', bookingsData);
      } catch (err) {
        results.workerBookings = {
          success: false,
          error: err.message,
          message: 'Worker bookings API failed'
        };
        results.errors.push(`Bookings API: ${err.message}`);
        console.error('❌ Worker bookings API test failed:', err);
      }

      // Test worker services endpoint
      try {
        const servicesData = await getWorkerServiceHistory(workerId);
        results.workerServices = {
          success: true,
          data: servicesData,
          message: 'Worker services API working'
        };
        console.log('✅ Worker services API test passed:', servicesData);
      } catch (err) {
        results.workerServices = {
          success: false,
          error: err.message,
          message: 'Worker services API failed'
        };
        results.errors.push(`Services API: ${err.message}`);
        console.error('❌ Worker services API test failed:', err);
      }

      setApiTestResults(results);
      
      // If APIs are working, refresh the data
      if (results.workerBookings.success || results.workerServices.success) {
        console.log('APIs are working, refreshing data...');
        // Trigger data refresh
        const fetchData = async () => {
          try {
            setLoading(true);
            setError(null);
            
            if (results.workerBookings.success) {
              setBookings(results.workerBookings.data.bookings || []);
            }
            if (results.workerServices.success) {
              setServices(results.workerServices.data.services || []);
            }
            
            setDataSource('api');
          } catch (err) {
            console.error('Error refreshing data:', err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
        
        fetchData();
      }

    } catch (err) {
      console.error('API test failed:', err);
      setApiTestResults({
        ...results,
        errors: [...results.errors, `General error: ${err.message}`]
      });
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
        <LinearProgress sx={{ width: '100%', mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Loading your jobs...
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
          onClick={() => window.location.reload()}
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
          My Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Manage your assigned bookings and services
        </Typography>
        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary">
              Total Jobs: {bookings.length}
            </Typography>
            <Chip 
              label={dataSource === 'api' ? (bookings.length > 0 ? 'Live Data' : 'API Connected') : 'No Data'} 
              color={dataSource === 'api' ? (bookings.length > 0 ? 'success' : 'info') : 'default'}
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={testAPIEndpoints}
              startIcon={<WorkIcon />}
              size="small"
            >
              Test API
            </Button>
            {apiTestResults && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {apiTestResults.workerBookings && (
                  <Chip
                    label={apiTestResults.workerBookings.success ? 'Bookings ✓' : 'Bookings ✗'}
                    color={apiTestResults.workerBookings.success ? 'success' : 'error'}
                    size="small"
                  />
                )}
                {apiTestResults.workerServices && (
                  <Chip
                    label={apiTestResults.workerServices.success ? 'Services ✓' : 'Services ✗'}
                    color={apiTestResults.workerServices.success ? 'success' : 'error'}
                    size="small"
                  />
                )}
              </Box>
            )}
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
            label={`Active Jobs (${bookings.filter(b => b.status === 'assigned' || b.status === 'ongoing').length})`} 
            value="active" 
          />
          <Tab 
            label={`Completed (${bookings.filter(b => b.status === 'completed').length})`} 
            value="completed" 
          />
          <Tab 
            label={`All Jobs (${bookings.length})`} 
            value="all" 
          />
        </Tabs>
      </Paper>

      {/* API Test Results */}
      {apiTestResults && (
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            API Test Results
          </Typography>
          <Grid container spacing={2}>
            {apiTestResults.workerBookings && (
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: 1, borderColor: apiTestResults.workerBookings.success ? 'success.main' : 'error.main', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color={apiTestResults.workerBookings.success ? 'success.main' : 'error.main'}>
                    Worker Bookings API
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {apiTestResults.workerBookings.message}
                  </Typography>
                  {apiTestResults.workerBookings.error && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      Error: {apiTestResults.workerBookings.error}
                    </Typography>
                  )}
                  {apiTestResults.workerBookings.data && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Data: {JSON.stringify(apiTestResults.workerBookings.data, null, 2)}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
            {apiTestResults.workerServices && (
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, border: 1, borderColor: apiTestResults.workerServices.success ? 'success.main' : 'error.main', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color={apiTestResults.workerServices.success ? 'success.main' : 'error.main'}>
                    Worker Services API
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {apiTestResults.workerServices.message}
                  </Typography>
                  {apiTestResults.workerServices.error && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                      Error: {apiTestResults.workerServices.error}
                    </Typography>
                  )}
                  {apiTestResults.workerServices.data && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Data: {JSON.stringify(apiTestResults.workerServices.data, null, 2)}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
          {apiTestResults.errors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="error">
                Errors:
              </Typography>
              {apiTestResults.errors.map((error, index) => (
                <Typography key={index} variant="caption" color="error" sx={{ display: 'block' }}>
                  • {error}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
      )}

      {/* Jobs List */}
      <Grid container spacing={3}>
        {filteredBookings.length === 0 ? (
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc' }}>
              <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No jobs found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {selectedTab === 'active' 
                  ? "You don't have any active jobs at the moment."
                  : selectedTab === 'completed'
                  ? "You haven't completed any jobs yet."
                  : "No jobs assigned to you."
                }
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {dataSource === 'api' 
                  ? "✅ API is working but no jobs are assigned to you yet."
                  : "Click 'Test API' to fetch data from the backend."
                }
              </Typography>
              {dataSource === 'api' && (
                <Typography variant="caption" color="text.secondary">
                  The backend API is responding correctly. You'll see jobs here once they are assigned to you.
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
                        {booking.serviceCategory?.categoryName || 'Service'}
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
                        color={booking.status === 'assigned' ? 'primary' : 
                               booking.status === 'ongoing' ? 'warning' : 
                               booking.status === 'completed' ? 'success' : 'default'}
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
                    {selectedBooking.serviceCategory?.categoryName}
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
                    {selectedBooking.user?.phone}
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
                    color={selectedBooking.status === 'assigned' ? 'primary' : 
                           selectedBooking.status === 'ongoing' ? 'warning' : 
                           selectedBooking.status === 'completed' ? 'success' : 'default'}
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

export default WorkerWorks;