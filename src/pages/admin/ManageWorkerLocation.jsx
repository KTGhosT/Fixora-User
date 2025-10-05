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
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  fetchLocationsApi,
  createLocationApi,
  updateLocationApi,
  deleteLocationApi,
} from "../../services/serviceLocations"; // 👈 You need to implement these API services

function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLocation, setEditLocation] = useState(null);
  const [formData, setFormData] = useState({
    worker_id: "",
    lat: "",
    lng: "",
    status: true, // true = available, false = busy
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLocationsApi();
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load locations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (location = null) => {
    setEditLocation(location);
    setFormData({
      worker_id: location?.worker_id || "",
      lat: location?.lat || "",
      lng: location?.lng || "",
      status: location?.status ?? true,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditLocation(null);
    setError(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        status: Boolean(formData.status),
      };

      if (editLocation) {
        await updateLocationApi(editLocation.id, payload);
      } else {
        await createLocationApi(payload);
      }

      await fetchLocations();
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Save failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteLocationApi(id);
      await fetchLocations();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "#" },
      { accessorKey: "worker_id", header: "Worker ID" },
      { accessorKey: "lat", header: "Latitude" },
      { accessorKey: "lng", header: "Longitude" },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (cell.getValue() ? "✅ Available" : "❌ Busy"),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: locations,
    state: { isLoading },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => handleOpen(row.original)}>
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
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Location
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={fetchLocations}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>
    ),
  });

  return (
    <div className={styles.manageUsers}>
      <h2 className="mb-3">Manage Worker Locations</h2>

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close float-end"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <MaterialReactTable table={table} />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editLocation ? "Edit Location" : "Add Location"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Worker ID"
              value={formData.worker_id}
              onChange={(e) => setFormData({ ...formData, worker_id: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Latitude"
              value={formData.lat}
              onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Longitude"
              value={formData.lng}
              onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
              fullWidth
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                />
              }
              label="Available"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />} disabled={isLoading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManageLocations;
