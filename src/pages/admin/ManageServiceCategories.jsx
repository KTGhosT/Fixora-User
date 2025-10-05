import React, { useEffect, useMemo, useState, useRef } from "react";
import styles from "./admin-components.module.css";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Tooltip, Switch, FormControlLabel, InputLabel
} from "@mui/material";
import {
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
  Refresh as RefreshIcon, Save as SaveIcon, UploadFile as UploadFileIcon
} from "@mui/icons-material";
import {
  fetchCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
} from "../../services/serviceCategories";

function ManageServiceCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    icon: "",
    isAvailable: true,
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCategoriesApi();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (category = null) => {
    setEditCategory(category);
    setFormData({
      categoryName: category?.categoryName || "",
      description: category?.description || "",
      icon: category?.icon || "",        // <-- set existing icon
      isAvailable: category?.isAvailable ?? true,
    });
    setIconFile(null);
    setIconPreview(category?.icon || null);
    setDialogOpen(true);
  };
  

  const handleClose = () => {
    setDialogOpen(false);
    setEditCategory(null);
    setError(null);
    setIconFile(null);
    setIconPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    setIconFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setIconPreview(null);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let payload;

      // 🟢 Ensure correct boolean type
      const isAvailableBool = Boolean(formData.isAvailable);

      if (iconFile) {
        // 🟢 File upload using FormData
        payload = new FormData();
        payload.append("categoryName", formData.categoryName);
        payload.append("description", formData.description);
        payload.append("isAvailable", isAvailableBool ? 1 : 0); // ✅ Send as boolean-int
        payload.append("icon", iconFile);
      } else {
        // 🟢 When no new file uploaded
        payload = editCategory
          ? {
              ...formData,
              isAvailable: isAvailableBool,
              icon: formData.icon || "",
            }
          : {
              ...formData,
              isAvailable: isAvailableBool,
              icon: "",
            };
      }

      if (editCategory) {
        await updateCategoryApi(editCategory.categoryId, payload);
      } else {
        await createCategoryApi(payload);
      }

      await fetchCategories();
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Save failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteCategoryApi(id);
      await fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "categoryId", header: "#" },
      { accessorKey: "categoryName", header: "Category Name" },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "icon",
        header: "Icon",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <img
              src={cell.getValue()}
              alt="icon"
              style={{ width: 32, height: 32, objectFit: "contain" }}
            />
          ) : (
            <span style={{ color: "#aaa" }}>No Icon</span>
          ),
      },
      {
        accessorKey: "isAvailable",
        header: "Available",
        Cell: ({ cell }) => (cell.getValue() ? "✅" : "❌"),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: categories,
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
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(row.original.categoryId)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Category
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={fetchCategories}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>
    ),
  });

  return (
    <div className={styles.manageUsers}>
      <h2 className="mb-3">Manage Service Categories</h2>

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
        <DialogTitle>{editCategory ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Category Name"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
            />
            <Box>
              <InputLabel shrink>Icon (image upload)</InputLabel>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  size="small"
                >
                  {iconFile ? "Change Icon" : "Upload Icon"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleIconChange}
                  />
                </Button>
                {iconPreview || formData.icon ? (
                <img
                  src={iconPreview || formData.icon}
                  alt="icon preview"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                    borderRadius: 4,
                    border: "1px solid #eee",
                  }}
                />
              ) : null}



              </Box>
              <Box sx={{ fontSize: 12, color: "#888", mt: 0.5 }}>
                {iconFile
                  ? iconFile.name
                  : !iconPreview && !formData.icon
                  ? "No icon selected"
                  : ""}
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                />
              }
              label="Available"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManageServiceCategories;
