import React, { useEffect, useMemo, useState } from "react";
import styles from "./admin-components.module.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, IconButton, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { fetchWorkersApi, updateWorkerApi, deleteWorkerApi, verifyWorkerApi, setWorkerAvailabilityApi } from '../../services/workers';

function ManageWorkers() {
  const [workers, setWorkers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", availability: "available" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWorkersApi();
      setWorkers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch workers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (editingWorker) {
        await updateWorkerApi(editingWorker.id, formData);
      }
      await fetchWorkers();
      setFormData({ name: "", email: "", phone: "", service: "", availability: "available" });
      setIsModalOpen(false);
      setEditingWorker(null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save worker');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name || "",
      email: worker.email || "",
      phone: worker.phone || "",
      service: worker.service || "",
      availability: worker.availability || "available",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this worker?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteWorkerApi(id);
      setWorkers(workers.filter((w) => w.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete worker');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(() => [
    { accessorKey: 'id', header: '#', size: 60 },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'service', header: 'Service' },
    { accessorKey: 'availability', header: 'Availability' },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: workers,
    state: { isLoading },
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => handleEdit(row.original)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Verify">
          <IconButton size="small" color="primary" onClick={async () => { setIsLoading(true); try { await verifyWorkerApi(row.original.id); await fetchWorkers(); } catch (err) { setError(err?.response?.data?.message || err?.message || 'Failed to verify worker'); } finally { setIsLoading(false); }}}>
            <span className="material-icons" style={{ fontSize: 18 }}>verified</span>
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
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={fetchWorkers} disabled={isLoading}>
          Refresh
        </Button>
      </Box>
    ),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      showColumnFilters: false,
    },
  });

  return (
    <div className={styles.manageUsers}>
      <h2 className="mb-3">Manage Workers</h2>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          <strong>Error:</strong> {error}
          <button type="button" className="btn-close float-end" onClick={() => setError(null)} aria-label="Close"></button>
        </div>
      )}

      <MaterialReactTable table={table} />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingWorker ? 'Edit Worker' : 'Add New Worker'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
              <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth />
              <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required fullWidth />
              <TextField label="Service" name="service" value={formData.service} onChange={handleChange} required fullWidth />
              <TextField select label="Availability" name="availability" value={formData.availability} onChange={handleChange} required fullWidth>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="unavailable">Unavailable</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>{isLoading ? 'Saving...' : editingWorker ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default ManageWorkers;


