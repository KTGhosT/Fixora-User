import axiosInstance from './api';

// Get all categories
export const fetchCategoriesApi = async () => {
  try {
    const res = await axiosInstance.get("/api/service-categories");
    console.log('Fetched categories:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Create new category
export const createCategoryApi = async (data) => {
  try {
    console.log('Creating category with data:', data);
    
    // Check if data is FormData or regular object
    const isFormData = data instanceof FormData;
    console.log('Is FormData:', isFormData);
    
    // Set appropriate headers
    const config = isFormData ? {
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type for FormData - let browser set it with boundary
      }
    } : {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    console.log('Request config:', config);
    
    // Debug FormData contents before sending
    if (isFormData) {
      console.log('FormData contents before API call:');
      for (let [key, value] of data.entries()) {
        console.log(`  ${key}:`, value);
      }
    }
    
    const res = await axiosInstance.post("/api/service-categories", data, config);
    console.log('Category created:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error creating category:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Update category
export const updateCategoryApi = async (id, data) => {
  try {
    console.log(`Updating category ${id} with data:`, data);
    
    // Check if data is FormData or regular object
    const isFormData = data instanceof FormData;
    console.log('Is FormData:', isFormData);
    
    // Set appropriate headers
    const config = isFormData ? {
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type for FormData - let browser set it with boundary
      }
    } : {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    console.log('Request config:', config);
    
    // Debug FormData contents before sending
    if (isFormData) {
      console.log('FormData contents before API call:');
      for (let [key, value] of data.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      // Additional debugging for the actual request
      console.log('Request URL:', `${axiosInstance.defaults.baseURL}/api/service-categories/${id}`);
      console.log('Request method: PUT');
      console.log('Request headers will be set by browser for FormData');
      
      // For FormData with Laravel, we need to use POST with _method=PUT
      console.log('Using POST with _method=PUT for FormData (Laravel requirement)');
      data.append('_method', 'PUT');
      const res = await axiosInstance.post(`/api/service-categories/${id}`, data, config);
      console.log('Category updated:', res.data);
      return res.data;
    }
    
    const res = await axiosInstance.put(`/api/service-categories/${id}`, data, config);
    console.log('Category updated:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating category:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    throw error;
  }
};

// Delete category
export const deleteCategoryApi = async (id) => {
  try {
    console.log(`Deleting category ${id}`);
    const res = await axiosInstance.delete(`/api/service-categories/${id}`);
    console.log('Category deleted:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
