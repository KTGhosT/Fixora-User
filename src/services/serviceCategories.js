import axiosInstance from './api';

// Get all categories
export const fetchCategoriesApi = async () => {
  const res = await axiosInstance.get("/api/service-categories");
  return res.data;
};

// Create new category
export const createCategoryApi = async (data) => {
  const res = await axiosInstance.post("/api/service-categories", data);
  return res.data;
};

// Update category
export const updateCategoryApi = async (id, data) => {
  const res = await axiosInstance.put(`/api/service-categories/${id}`, data);
  return res.data;
};

// Delete category
export const deleteCategoryApi = async (id) => {
  const res = await axiosInstance.delete(`/api/service-categories/${id}`);
  return res.data;
};
