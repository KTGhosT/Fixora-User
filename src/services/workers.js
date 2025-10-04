import axiosInstance from './api';

export async function fetchWorkersApi() {
  try {
    const response = await axiosInstance.get('/api/workers/list');
    if (Array.isArray(response.data)) return response.data;
    if (response.data?.workers) return response.data.workers;
    if (response.data?.data) return response.data.data;
    return [];
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallback = await axiosInstance.get('/workers/list');
      if (Array.isArray(fallback.data)) return fallback.data;
      if (fallback.data?.workers) return fallback.data.workers;
      if (fallback.data?.data) return fallback.data.data;
      return [];
    }
    throw err;
  }
}

export async function getWorkerApi(id) {
  const response = await axiosInstance.get(`/api/workers/${id}`);
  return response.data;
}

export async function updateWorkerApi(id, payload) {
  const response = await axiosInstance.put(`/api/workers/${id}`, payload);
  return response.data;
}

export async function verifyWorkerApi(id) {
  const response = await axiosInstance.post(`/api/workers/${id}/verify`);
  return response.data;
}

export async function setWorkerAvailabilityApi(id, payload) {
  const response = await axiosInstance.post(`/api/workers/${id}/availability`, payload);
  return response.data;
}

export async function deleteWorkerApi(id) {
  const response = await axiosInstance.delete(`/api/workers/${id}`);
  return response.data;
}


