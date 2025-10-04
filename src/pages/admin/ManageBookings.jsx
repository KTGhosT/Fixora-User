import React, { useEffect, useMemo, useState } from "react";
import styles from "./admin-components.module.css";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Save as SaveIcon } from '@mui/icons-material';
import { fetchBookingsApi, updateBookingApi, deleteBookingApi, setBookingStatusApi } from '../../services/bookings';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [statusValue, setStatusValue] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBookingsApi();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteBookingApi(id);
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setStatusValue(row.status || 'pending');
  };

  const handleSave = async () => {
    if (!editRow) return;
    setIsLoading(true);
    setError(null);
    try {
      // Prefer dedicated status endpoint if available
      await setBookingStatusApi(editRow.id, statusValue);
      await fetchBookings();
      setEditRow(null);
    } catch (err) {
      // fallback to full update
      try {
        await updateBookingApi(editRow.id, { ...editRow, status: statusValue });
        await fetchBookings();
        setEditRow(null);
      } catch (err2) {
        setError(err2?.response?.data?.message || err2?.message || 'Failed to update booking');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(() => [
    { accessorKey: 'id', header: '#', size: 60 },
    { accessorKey: 'user_name', header: 'User' },
    { accessorKey: 'worker_name', header: 'Worker' },
    { accessorKey: 'service', header: 'Service' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'status', header: 'Status' },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: bookings,
    state: { isLoading },
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Edit Status">
          <IconButton size="small" onClick={() => handleEdit(row.original)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={() => handleDelete(row.original.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={fetchBookings} disabled={isLoading}>
          Refresh
        </Button>
      </Box>
    ),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  });

  return (
    <div className={styles.manageUsers}>
      <h2 className="mb-3">Manage Bookings</h2>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          <strong>Error:</strong> {error}
          <button type="button" className="btn-close float-end" onClick={() => setError(null)} aria-label="Close"></button>
        </div>
      )}

      <MaterialReactTable table={table} />

      <Dialog open={!!editRow} onClose={() => setEditRow(null)} fullWidth maxWidth="sm">
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField select label="Status" value={statusValue} onChange={(e) => setStatusValue(e.target.value)} fullWidth>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRow(null)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />} disabled={isLoading}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManageBookings;


