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
  const [formData, setFormData] = useState({ 
    work_role: "", 
    bio: "", 
    experience_level: "", 
    availability: "available",
    status: "pending",
    minimum_education: ""
  });
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
      setFormData({ 
        work_role: "", 
        bio: "", 
        experience_level: "", 
        availability: "available",
        status: "pending",
        minimum_education: ""
      });
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
      work_role: worker.work_role || "",
      bio: worker.bio || "",
      experience_level: worker.experience_level || "",
      availability: worker.availability || "available",
      status: worker.status || "pending",
      minimum_education: worker.minimum_education || "",
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
    { accessorKey: 'user_id', header: 'User ID', size: 80 },
    { accessorKey: 'work_role', header: 'Work Role' },
    { accessorKey: 'bio', header: 'Bio', size: 200 },
    { accessorKey: 'experience_level', header: 'Experience' },
    { accessorKey: 'status', header: 'Status' },
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
              <TextField label="Work Role" name="work_role" value={formData.work_role} onChange={handleChange} required fullWidth />
              <TextField label="Bio" name="bio" value={formData.bio} onChange={handleChange} multiline rows={3} fullWidth />
              <TextField select label="Experience Level" name="experience_level" value={formData.experience_level} onChange={handleChange} required fullWidth>
                <MenuItem value="entry">Entry Level</MenuItem>
                <MenuItem value="mid">Mid Level</MenuItem>
                <MenuItem value="senior">Senior Level</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </TextField>
              <TextField select label="Minimum Education" name="minimum_education" value={formData.minimum_education} onChange={handleChange} required fullWidth>
                <MenuItem value="O/L">O/L</MenuItem>
                <MenuItem value="A/L">A/L</MenuItem>
                <MenuItem value="NVQ4">NVQ Level 4</MenuItem>
                <MenuItem value="Diploma">Diploma</MenuItem>
                <MenuItem value="Degree">Degree</MenuItem>
              </TextField>
              <TextField select label="Status" name="status" value={formData.status} onChange={handleChange} required fullWidth>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
              </TextField>
              <TextField select label="Availability" name="availability" value={formData.availability} onChange={handleChange} required fullWidth>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="unavailable">Unavailable</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
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


