import axiosInstance from './api';

// Get all worker locations
export const fetchLocationsApi = async () => {
  const res = await axiosInstance.get("/api/worker-locations");
  return res.data;
};

// Create new location
export const createLocationApi = async (data) => {
  const res = await axiosInstance.post("/api/worker-locations", data);
  return res.data;
};

// Update location
export const updateLocationApi = async (id, data) => {
  const res = await axiosInstance.put(`/api/worker-locations/${id}`, data);
  return res.data;
};

// Delete location
export const deleteLocationApi = async (id) => {
  const res = await axiosInstance.delete(`/api/worker-locations/${id}`);
  return res.data;
};
