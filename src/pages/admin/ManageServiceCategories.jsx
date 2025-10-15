import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import styles from "./admin-components.module.css";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Tooltip, Switch, FormControlLabel, InputLabel,
  Grid, Card, CardContent, Typography, Chip, Alert, Snackbar,
  FormControl, InputAdornment, Divider
} from "@mui/material";
import {
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
  Refresh as RefreshIcon, Save as SaveIcon, UploadFile as UploadFileIcon,
  AttachMoney as MoneyIcon, Schedule as ScheduleIcon, Category as CategoryIcon,
  TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon
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
  const [success, setSuccess] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    icon: "",
    isAvailable: true,
    baseAmount: "",
    hourly_price: "",
  });

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
  }, [formData]);

  // Preserve form data during icon changes
  const preserveFormData = useCallback(() => {
    console.log('Preserving form data during icon change');
    return formData;
  }, [formData]);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper function to construct icon URL
  const getIconUrl = (iconValue) => {
    if (!iconValue) return null;
    if (iconValue.startsWith('http')) return iconValue;
    
    // Use the most common Laravel storage path
    return `http://127.0.0.1:8000/storage/${iconValue}`;
  };

  // Test function to verify API endpoints
  const testApiEndpoints = async () => {
    console.log('🧪 Testing Service Categories API Endpoints...');
    
    try {
      // Test 1: Fetch categories
      console.log('1️⃣ Testing GET /api/service-categories');
      const categories = await fetchCategoriesApi();
      console.log('✅ Fetch successful:', categories);
      
      // Inspect the first category structure
      if (categories && categories.length > 0) {
        console.log('📋 First category structure:', JSON.stringify(categories[0], null, 2));
        
        // Test icon URL construction
        const firstCategory = categories[0];
        if (firstCategory.icon) {
          console.log('🖼️ Icon value:', firstCategory.icon);
          console.log('🖼️ Constructed URL:', getIconUrl(firstCategory.icon));
        }
      }
      
      // Test 2: Create a test category (if we have data)
      if (categories && categories.length > 0) {
        console.log('2️⃣ Testing PUT /api/service-categories/{id}');
        const testCategory = categories[0];
        
        // Test with minimal data first
        console.log('🧪 Testing with minimal data...');
        const minimalData = {
          categoryName: testCategory.categoryName
        };
        
        try {
          await updateCategoryApi(testCategory.categoryId, minimalData);
          console.log('✅ Minimal update successful');
        } catch (minimalErr) {
          console.log('⚠️ Minimal update failed:', minimalErr.response?.data);
        }
        
        // Test with full data (excluding icon since backend expects file)
        console.log('🧪 Testing with full data...');
        const fullData = {
          categoryName: testCategory.categoryName,
          description: testCategory.description || "Test description",
          isAvailable: testCategory.isAvailable,
          baseAmount: testCategory.baseAmount || 0,
          hourly_price: testCategory.hourly_price || 0
        };
        
        try {
          await updateCategoryApi(testCategory.categoryId, fullData);
          console.log('✅ Full update successful');
        } catch (fullErr) {
          console.log('⚠️ Full update failed:', fullErr.response?.data);
        }
      }
      
      console.log('🎉 API testing completed');
    } catch (err) {
      console.error('❌ API testing failed:', err);
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCategoriesApi();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (category = null) => {
    setEditCategory(category);
    if (category) {
      setFormData({
        categoryName: category.categoryName || "",
        description: category.description || "",
        icon: category.icon || "",
        isAvailable: category.isAvailable ?? true,
        baseAmount: category.baseAmount || "",
        hourly_price: category.hourly_price || "",
      });
    } else {
      setFormData({
        categoryName: "",
        description: "",
        icon: "",
        isAvailable: true,
        baseAmount: "",
        hourly_price: "",
      });
    }
    setIconFile(null);
    setIconPreview(null);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditCategory(null);
    setFormData({
      categoryName: "",
      description: "",
      icon: "",
      isAvailable: true,
      baseAmount: "",
      hourly_price: "",
    });
    setIconFile(null);
    setIconPreview(null);
    setError(null);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setIconPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Validate required fields only for new categories, not for edits
      if (!editCategory) {
        // Only validate name for new categories
        if (!formData.categoryName.trim()) {
          setError("Category name is required");
          return;
        }

        // Additional validation for new categories
        if (formData.categoryName.trim().length < 2) {
          setError("Category name must be at least 2 characters long");
          return;
        }
      } else {
        // For edits, only validate if name is provided and not empty
        if (formData.categoryName.trim() && formData.categoryName.trim().length < 2) {
          setError("Category name must be at least 2 characters long");
          return;
        }
      }

      // Debug form data
      console.log('Form data before processing:', {
        categoryName: formData.categoryName,
        description: formData.description,
        isAvailable: formData.isAvailable,
        baseAmount: formData.baseAmount,
        hourly_price: formData.hourly_price,
        hasIconFile: !!iconFile
      });

      let payload;

      // 🟢 Ensure correct boolean type
      const isAvailableBool = Boolean(formData.isAvailable);

      if (iconFile) {
        // 🟢 File upload using FormData
        payload = new FormData();
        
        // For edits, use existing name if not changed; for new, use provided name
        const categoryName = editCategory 
          ? (formData.categoryName.trim() || editCategory.categoryName)
          : formData.categoryName.trim();
          
        // Validate categoryName is not empty
        if (!categoryName || categoryName.trim() === '') {
          setError("Category name is required for update");
          setIsLoading(false);
          return;
        }
          
        console.log('FormData - using name:', categoryName, '(provided:', formData.categoryName.trim(), 'existing:', editCategory?.categoryName, ')');
        // Ensure all fields are properly appended
        console.log('Appending to FormData:');
        console.log('  categoryName:', categoryName);
        console.log('  description:', formData.description.trim());
        console.log('  isAvailable:', isAvailableBool ? 1 : 0);
        console.log('  baseAmount:', formData.baseAmount || 0);
        console.log('  hourly_price:', formData.hourly_price || 0);
        console.log('  icon file:', iconFile?.name);
        
        payload.append("categoryName", categoryName);
        payload.append("description", formData.description.trim());
        payload.append("isAvailable", isAvailableBool ? 1 : 0); // ✅ Send as boolean-int
        payload.append("baseAmount", formData.baseAmount || 0);
        payload.append("hourly_price", formData.hourly_price || 0);
        payload.append("icon", iconFile);
        console.log('Saving with FormData (file upload)');
        
        // Debug FormData contents properly
        console.log('FormData contents:');
        for (let [key, value] of payload.entries()) {
          console.log(`  ${key}:`, value);
        }
        console.log('FormData categoryName:', payload.get('categoryName'));
        console.log('FormData description:', payload.get('description'));
        console.log('FormData isAvailable:', payload.get('isAvailable'));
        console.log('FormData baseAmount:', payload.get('baseAmount'));
        console.log('FormData hourly_price:', payload.get('hourly_price'));
        console.log('FormData icon file:', payload.get('icon'));
      } else {
        // 🟢 When no new file uploaded - use JSON payload
        payload = {
          description: formData.description.trim(),
          isAvailable: isAvailableBool,
          baseAmount: parseFloat(formData.baseAmount) || 0,
          hourly_price: parseFloat(formData.hourly_price) || 0
        };
        
        // For edits, always include categoryName - use existing if not changed
        if (editCategory) {
          const finalName = formData.categoryName.trim() || editCategory.categoryName;
          payload.categoryName = finalName;
          console.log('Edit mode - using name:', finalName, '(provided:', formData.categoryName.trim(), 'existing:', editCategory.categoryName, ')');
        } else {
          // For new categories, only include if provided
          if (formData.categoryName.trim()) {
            payload.categoryName = formData.categoryName.trim();
          }
        }
        
        // Note: Not including icon field when no file is uploaded
        console.log('Saving with JSON payload (no file upload)');
      }

      if (editCategory) {
        await updateCategoryApi(editCategory.categoryId, payload);
        setSuccess("Category updated successfully!");
      } else {
        await createCategoryApi(payload);
        setSuccess("Category created successfully!");
      }
      
      handleClose();
      await fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoryApi(id);
        setSuccess("Category deleted successfully!");
        await fetchCategories();
      } catch (err) {
        setError("Failed to delete category");
        console.error("Error deleting category:", err);
      }
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = categories.length;
    const available = categories.filter(c => c.isAvailable).length;
    const unavailable = total - available;
    const withBaseAmount = categories.filter(c => c.baseAmount > 0).length;
    const withHourlyPrice = categories.filter(c => c.hourly_price > 0).length;
    
    return { total, available, unavailable, withBaseAmount, withHourlyPrice };
  }, [categories]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "categoryName",
        header: "Category Name",
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CategoryIcon color="primary" />
            <Typography variant="body2" fontWeight="medium">
              {cell.getValue()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ cell }) => (
          <Typography variant="body2" color="text.secondary">
            {cell.getValue() || "No description"}
          </Typography>
        ),
      },
      {
        accessorKey: "baseAmount",
        header: "Base Amount",
        Cell: ({ cell }) => {
          const amount = parseFloat(cell.getValue() || 0);
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CategoryIcon fontSize="small" color="success" />
              <Typography variant="body2" fontWeight="medium">
                LKR {amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "hourly_price",
        header: "Hourly Price",
        Cell: ({ cell }) => {
          const amount = parseFloat(cell.getValue() || 0);
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ScheduleIcon fontSize="small" color="info" />
              <Typography variant="body2" fontWeight="medium">
                LKR {amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "icon",
        header: "Icon",
        Cell: ({ cell }) => {
          const iconUrl = getIconUrl(cell.getValue());
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={iconUrl}
                alt="icon"
                style={{ 
                  width: 32, 
                  height: 32, 
                  objectFit: "contain",
                  borderRadius: 4,
                  border: "1px solid #eee"
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.parentNode.querySelector('.icon-fallback');
                  if (fallback) {
                    fallback.style.display = 'inline';
                  }
                }}
              />
              <span 
                className="icon-fallback" 
                style={{ 
                  display: 'none',
                  fontSize: '12px',
                  color: '#666',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5'
                }}
              >
                No Icon
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "isAvailable",
        header: "Available",
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue() ? "Available" : "Unavailable"} 
            color={cell.getValue() ? "success" : "error"}
            size="small"
            icon={cell.getValue() ? <CheckCircleIcon /> : undefined}
          />
        ),
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
        <Button
          variant="outlined"
          size="small"
          onClick={testApiEndpoints}
          disabled={isLoading}
          sx={{ color: 'orange', borderColor: 'orange' }}
        >
          Test API
        </Button>
      </Box>
    ),
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Service Categories</h1>
              <p className="text-gray-600 mt-2">Create and manage service categories with pricing</p>
            </div>
            <div className="flex space-x-3">
              <Chip 
                label={`Total: ${stats.total}`} 
                color="primary" 
                variant="outlined" 
                icon={<TrendingUpIcon />}
              />
              <Chip 
                label={`Available: ${stats.available}`} 
                color="success" 
                variant="outlined" 
                icon={<CheckCircleIcon />}
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
                      Total Categories
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                      {stats.total}
                    </Typography>
                  </div>
                  <CategoryIcon sx={{ fontSize: '40px', color: '#dbeafe' }} />
                </div>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2" sx={{ color: '#d1fae5', fontSize: '14px', fontWeight: 500 }}>
                      Available
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                      {stats.available}
                    </Typography>
                  </div>
                  <CheckCircleIcon sx={{ fontSize: '40px', color: '#d1fae5' }} />
                </div>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2" sx={{ color: '#fef3c7', fontSize: '14px', fontWeight: 500 }}>
                      With Base Amount
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                      {stats.withBaseAmount}
                    </Typography>
                  </div>
                  <MoneyIcon sx={{ fontSize: '40px', color: '#fef3c7' }} />
                </div>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="body2" sx={{ color: '#e9d5ff', fontSize: '14px', fontWeight: 500 }}>
                      With Hourly Price
                    </Typography>
                    <Typography variant="h3" sx={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>
                      {stats.withHourlyPrice}
                    </Typography>
                  </div>
                  <ScheduleIcon sx={{ fontSize: '40px', color: '#e9d5ff' }} />
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

        {/* Main Table */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <MaterialReactTable table={table} />
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CategoryIcon />
              {editCategory ? "Edit Category" : "Add New Category"}
            </Box>
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Category Name"
                  value={formData.categoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryName: e.target.value })
                  }
                  fullWidth
                  required={!editCategory}
                  helperText={editCategory ? "Leave empty to keep existing name" : "Required field"}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Base Amount"
                  type="number"
                  value={formData.baseAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, baseAmount: e.target.value })
                  }
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                  }}
                  helperText="Base price for this service category"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Hourly Price"
                  type="number"
                  value={formData.hourly_price}
                  onChange={(e) =>
                    setFormData({ ...formData, hourly_price: e.target.value })
                  }
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/hr</InputAdornment>,
                  }}
                  helperText="Hourly rate for this service category"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Icon Upload
                </Typography>
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
                      src={iconPreview || getIconUrl(formData.icon)}
                      alt="icon preview"
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "contain",
                        borderRadius: 4,
                        border: "1px solid #eee",
                      }}
                      onError={(e) => {
                        console.log('Icon preview error:', formData.icon);
                        e.target.style.display = 'none';
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
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({ ...formData, isAvailable: e.target.checked })
                      }
                    />
                  }
                  label="Available for booking"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
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
    </div>
  );
}

export default ManageServiceCategories;