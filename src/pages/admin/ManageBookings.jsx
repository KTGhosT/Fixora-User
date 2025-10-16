import React, { useEffect, useMemo, useState } from "react";
import styles from "./admin-components.module.css";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Assignment as AssignmentIcon,
  AssignmentInd as AssignmentIndIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";
import {
  fetchBookingsApi,
  updateBookingApi,
  deleteBookingApi,
  setBookingStatusApi,
  assignBookingApi,
  getBookingApi,
} from "../../services/bookings";
import { fetchWorkersApi } from "../../services/workers";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [assignDialog, setAssignDialog] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [editForm, setEditForm] = useState({
    status: "",
    worker_id: "",
    booking_date: "",
    booking_time: "",
    address: "",
    description: "",
    estimated_duration: "",
    special_requirements: "",
  });
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    dateRange: "",
  });

  useEffect(() => {
    fetchBookings();
    fetchWorkers();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBookingsApi();
      const mappedData = data.map((b) => ({
        id: b.bookingId ?? b.id,
        user_name: b.user?.name ?? b.user_name ?? "N/A",
        user_email: b.user?.email ?? b.user_email ?? "N/A",
        user_phone: b.user?.phone ?? b.user_phone ?? "N/A",
        worker_name: b.worker?.name ?? b.worker_name ?? "Unassigned",
        worker_id: b.worker?.id ?? b.worker_id ?? null,
        service: b.serviceCategory?.categoryName ?? b.service_name ?? "N/A",
        service_id: b.serviceCategory?.id ?? b.service_id ?? null,
        date: b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "N/A",
        booking_date: b.bookingDate ?? b.booking_date ?? null,
        booking_time: b.bookingTime ?? b.booking_time ?? null,
        address: b.address ?? b.booking_address ?? "N/A",
        description: b.description ?? b.booking_description ?? "N/A",
        status: b.status ?? "pending",
        total_amount: b.total_amount ?? b.amount ?? 0,
        estimated_duration: b.estimated_duration ?? b.duration ?? "",
        special_requirements: b.special_requirements ?? "",
        user: b.user,
        worker: b.worker,
        serviceCategory: b.serviceCategory,
      }));
      setBookings(mappedData);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const data = await fetchWorkersApi();
      setWorkers(data);
    } catch (err) {
      console.error("Error fetching workers:", err);
    }
  };

  const handleEdit = (row) => {
    setEditRow(row.original);
    setEditForm({
      status: row.original.status,
      worker_id: row.original.worker_id || "",
      booking_date: row.original.booking_date || "",
      booking_time: row.original.booking_time || "",
      address: row.original.address,
      description: row.original.description,
      estimated_duration: row.original.estimated_duration,
      special_requirements: row.original.special_requirements,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateBookingApi(editRow.id, editForm);
      setSuccess("Booking updated successfully!");
      setEditRow(null);
      await fetchBookings();
    } catch (err) {
      setError("Failed to update booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBookingApi(id);
        setSuccess("Booking deleted successfully!");
        await fetchBookings();
      } catch (err) {
        setError("Failed to delete booking");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await setBookingStatusApi(id, status);
      setSuccess("Status updated successfully!");
      await fetchBookings();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleAssignWorker = async () => {
    if (!selectedWorker) return;
    
    try {
      await assignBookingApi(assignDialog.id, { worker_id: selectedWorker });
      setSuccess("Worker assigned successfully!");
      setAssignDialog(null);
      setSelectedWorker("");
      await fetchBookings();
    } catch (err) {
      setError("Failed to assign worker");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      confirmed: "info",
      assigned: "primary",
      ongoing: "secondary",
      completed: "success",
      cancelled: "error",
    };
    return colors[status] || "default";
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const assigned = bookings.filter(b => b.worker_id && b.worker_name !== "Unassigned").length;
    const unassigned = total - assigned;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const ongoing = bookings.filter(b => b.status === 'ongoing').length;
    
    return { total, assigned, unassigned, pending, completed, ongoing };
  }, [bookings]);

  // Get unassigned bookings
  const unassignedBookings = useMemo(() => {
    return bookings.filter(b => !b.worker_id || b.worker_name === "Unassigned");
  }, [bookings]);

  // Get available workers
  const availableWorkers = useMemo(() => {
    return workers.filter(w => w.status === 'available' || w.status === 'active');
  }, [workers]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = filters.status === "all" || booking.status === filters.status;
      const matchesSearch = filters.search === "" || 
        booking.user_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.service.toLowerCase().includes(filters.search.toLowerCase()) ||
        booking.address.toLowerCase().includes(filters.search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, filters]);

  const columns = useMemo(
    () => [
      { 
        accessorKey: "id", 
        header: "#", 
        size: 60,
        Cell: ({ cell }) => (
          <Typography variant="body2" fontWeight="bold">
            #{cell.getValue()}
          </Typography>
        ),
      },
      { 
        accessorKey: "user_name", 
        header: "Customer",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {row.original.user_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.original.user_email}
              </Typography>
            </Box>
          </Box>
        ),
      },
      { 
        accessorKey: "worker_name", 
        header: "Worker",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              <WorkIcon />
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {row.original.worker_name}
              </Typography>
              {row.original.worker_id && (
                <Typography variant="caption" color="text.secondary">
                  ID: {row.original.worker_id}
                </Typography>
              )}
            </Box>
          </Box>
        ),
      },
      { 
        accessorKey: "service", 
        header: "Service",
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.original.service}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.original.description}
            </Typography>
          </Box>
        ),
      },
      { 
        accessorKey: "date", 
        header: "Date & Time",
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.original.date}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.original.address}
            </Typography>
          </Box>
        ),
      },
      { 
        accessorKey: "status", 
        header: "Status",
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue()} 
            color={getStatusColor(cell.getValue())}
            size="small"
          />
        ),
      },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => setViewBooking(row.original)}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(row)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            {(!row.original.worker_id || row.original.worker_name === "Unassigned") && (
              <Tooltip title="Assign Worker">
                <IconButton 
                  size="small" 
                  onClick={() => setAssignDialog(row.original)}
                  color="primary"
                >
                  <PersonAddIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <IconButton 
                size="small" 
                onClick={() => handleDelete(row.original.id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [getStatusColor]
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredBookings,
    state: { isLoading },
    enableRowSelection: false,
    enableColumnFilters: false,
    enableGlobalFilter: false,
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", p: 1 }}>
        <TextField
          placeholder="Search bookings..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          size="small"
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={fetchBookings}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>
    ),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
              <p className="text-gray-600 mt-2">Manage and assign workers to customer bookings</p>
            </div>
            <div className="flex space-x-3">
              <Chip 
                label={`Total: ${stats.total}`} 
                color="primary" 
                variant="outlined" 
                icon={<TrendingUpIcon />}
              />
              <Chip 
                label={`Assigned: ${stats.assigned}`} 
                color="success" 
                variant="outlined" 
                icon={<AssignmentTurnedInIcon />}
              />
              <Chip 
                label={`Unassigned: ${stats.unassigned}`} 
                color="warning" 
                variant="outlined" 
                icon={<AssignmentIndIcon />}
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2" sx={{ color: '#dbeafe', fontSize: '14px', fontWeight: 500 }}>
                      Total Bookings
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                      {stats.total}
                    </Typography>
                  </div>
                  <TrendingUpIcon sx={{ fontSize: '40px', color: '#dbeafe' }} />
                </div>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2" sx={{ color: '#d1fae5', fontSize: '14px', fontWeight: 500 }}>
                      Assigned
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                      {stats.assigned}
                    </Typography>
                  </div>
                  <AssignmentTurnedInIcon sx={{ fontSize: '40px', color: '#d1fae5' }} />
                </div>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2" sx={{ color: '#fef3c7', fontSize: '14px', fontWeight: 500 }}>
                      Unassigned
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                      {stats.unassigned}
                    </Typography>
                  </div>
                  <AssignmentIndIcon sx={{ fontSize: '40px', color: '#fef3c7' }} />
                </div>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2" sx={{ color: '#e9d5ff', fontSize: '14px', fontWeight: 500 }}>
                      Completed
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                      {stats.completed}
                    </Typography>
                  </div>
                  <CheckCircleIcon sx={{ fontSize: '40px', color: '#e9d5ff' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="mb-4" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Main Content with Tabs */}
        <Paper className="shadow-lg">
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            className="border-b"
          >
            <Tab label="All Bookings" />
            <Tab 
              label={
                <Badge badgeContent={unassignedBookings.length} color="warning">
                  Unassigned Bookings
                </Badge>
              } 
            />
          </Tabs>

          <div className="p-6">
            {tabValue === 0 && (
              <MaterialReactTable table={table} />
            )}

            {tabValue === 1 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Unassigned Bookings ({unassignedBookings.length})
                  </h3>
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={fetchBookings}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                </div>

                {unassignedBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <AssignmentTurnedInIcon className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All bookings are assigned!</h3>
                    <p className="text-gray-500">Great job! All bookings have been assigned to workers.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unassignedBookings.map((booking) => (
                      <Accordion key={booking.id} className="border border-gray-200 rounded-lg">
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="bg-blue-100">
                                <PersonIcon className="text-blue-600" />
                              </Avatar>
                              <div>
                                <Typography variant="h6" className="font-medium">
                                  {booking.user_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {booking.service} • {booking.date}
                                </Typography>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Chip 
                                label={booking.status} 
                                color={getStatusColor(booking.status)}
                                size="small"
                              />
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<PersonAddIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAssignDialog(booking);
                                }}
                              >
                                Assign Worker
                              </Button>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="h6" className="flex items-center mb-3">
                                    <PersonIcon className="mr-2" />
                                    Customer Details
                                  </Typography>
                                  <div className="space-y-2">
                                    <Typography><strong>Name:</strong> {booking.user_name}</Typography>
                                    <Typography><strong>Email:</strong> {booking.user_email}</Typography>
                                    <Typography><strong>Phone:</strong> {booking.user_phone}</Typography>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography variant="h6" className="flex items-center mb-3">
                                    <WorkIcon className="mr-2" />
                                    Service Details
                                  </Typography>
                                  <div className="space-y-2">
                                    <Typography><strong>Service:</strong> {booking.service}</Typography>
                                    <Typography><strong>Description:</strong> {booking.description}</Typography>
                                    <Typography><strong>Address:</strong> {booking.address}</Typography>
                                    <Typography><strong>Amount:</strong> ${booking.total_amount}</Typography>
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Paper>
      </div>

      {/* View Booking Details Dialog */}
      <Dialog open={!!viewBooking} onClose={() => setViewBooking(null)} fullWidth maxWidth="md">
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AssignmentIcon />
            Booking Details #{viewBooking?.id}
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewBooking && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Customer Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography><strong>Name:</strong> {viewBooking.user?.name || "N/A"}</Typography>
                      <Typography><strong>Email:</strong> {viewBooking.user?.email || "N/A"}</Typography>
                      <Typography><strong>Phone:</strong> {viewBooking.user?.phone || "N/A"}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <WorkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Service Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography><strong>Service:</strong> {viewBooking.serviceCategory?.categoryName || "N/A"}</Typography>
                      <Typography><strong>Worker:</strong> {viewBooking.worker?.name || "Unassigned"}</Typography>
                      <Typography><strong>Amount:</strong> ${viewBooking.total_amount || 0}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <LocationIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Booking Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Typography><strong>Date:</strong> {viewBooking.booking_date || "N/A"}</Typography>
                      <Typography><strong>Time:</strong> {viewBooking.booking_time || "N/A"}</Typography>
                      <Typography><strong>Address:</strong> {viewBooking.address || "N/A"}</Typography>
                      <Typography><strong>Description:</strong> {viewBooking.description || "N/A"}</Typography>
                      <Typography><strong>Status:</strong> 
                        <Chip 
                          label={viewBooking.status} 
                          color={getStatusColor(viewBooking.status)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewBooking(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Assign Worker Dialog */}
      <Dialog open={!!assignDialog} onClose={() => setAssignDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAddIcon />
            Assign Worker to Booking #{assignDialog?.id}
          </Box>
        </DialogTitle>
        <DialogContent>
          {assignDialog && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Customer: {assignDialog.user_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Service: {assignDialog.service}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date: {assignDialog.date}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Worker</InputLabel>
                <Select
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  label="Select Worker"
                >
                  {availableWorkers.map((worker) => (
                    <MenuItem key={worker.id} value={worker.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          <WorkIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {worker.name || worker.user?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {worker.work_role} • {worker.status}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {availableWorkers.length === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  No available workers found. Please add workers first.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(null)}>Cancel</Button>
          <Button
            onClick={handleAssignWorker}
            variant="contained"
            disabled={!selectedWorker || availableWorkers.length === 0}
            startIcon={<PersonAddIcon />}
          >
            Assign Worker
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={!!editRow} onClose={() => setEditRow(null)} fullWidth maxWidth="md">
        <DialogTitle>Edit Booking #{editRow?.id}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Worker</InputLabel>
                <Select
                  value={editForm.worker_id}
                  onChange={(e) => setEditForm({ ...editForm, worker_id: e.target.value })}
                  label="Worker"
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {workers.map((worker) => (
                    <MenuItem key={worker.id} value={worker.id}>
                      {worker.name || worker.user?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Booking Date"
                type="date"
                value={editForm.booking_date}
                onChange={(e) => setEditForm({ ...editForm, booking_date: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Booking Time"
                type="time"
                value={editForm.booking_time}
                onChange={(e) => setEditForm({ ...editForm, booking_time: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Estimated Duration (hours)"
                type="number"
                value={editForm.estimated_duration}
                onChange={(e) => setEditForm({ ...editForm, estimated_duration: e.target.value })}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Special Requirements"
                value={editForm.special_requirements}
                onChange={(e) => setEditForm({ ...editForm, special_requirements: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRow(null)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ManageBookings;