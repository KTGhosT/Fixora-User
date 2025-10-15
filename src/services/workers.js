import axiosInstance from './api';

// Get current user's worker profile by userId
export async function getWorkerByUserId(userId) {
  try {
    const response = await axiosInstance.get(`/api/workers/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker by userId:', error);
    throw error;
  }
}

// Get worker profile by worker ID
export async function getWorkerApi(id) {
  try {
    const response = await axiosInstance.get(`/api/workers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker:', error);
    throw error;
  }
}

// Update worker profile by worker ID
export async function updateWorkerApi(id, payload) {
  try {
    const response = await axiosInstance.put(`/api/workers/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating worker:', error);
    throw error;
  }
}

// Update worker profile by userId
export async function updateWorkerByUserId(userId, payload) {
  try {
    const response = await axiosInstance.put(`/api/workers/user/${userId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating worker by userId:', error);
    throw error;
  }
}

// Create new worker profile for user
export async function createWorkerApi(payload) {
  try {
    const response = await axiosInstance.post('/api/workers', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating worker:', error);
    throw error;
  }
}

// Get all workers (admin function)
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

// Verify worker
export async function verifyWorkerApi(id) {
  try {
    const response = await axiosInstance.post(`/api/workers/${id}/verify`);
    return response.data;
  } catch (error) {
    console.error('Error verifying worker:', error);
    throw error;
  }
}

// Set worker availability
export async function setWorkerAvailabilityApi(id, payload) {
  try {
    const response = await axiosInstance.post(`/api/workers/${id}/availability`, payload);
    return response.data;
  } catch (error) {
    console.error('Error setting worker availability:', error);
    throw error;
  }
}

// Delete worker
export async function deleteWorkerApi(id) {
  try {
    const response = await axiosInstance.delete(`/api/workers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting worker:', error);
    throw error;
  }
}

// Clean worker API functions - only worker data with user_id reference

// Get worker profile by worker ID (clean endpoint - only worker data)
export async function getWorkerProfileApi(workerId) {
  try {
    const response = await axiosInstance.get(`/api/worker/${workerId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    throw error;
  }
}

// Update worker profile by worker ID (clean endpoint - only worker data)
export async function updateWorkerProfileApi(workerId, payload) {
  try {
    const response = await axiosInstance.put(`/api/worker/${workerId}/profile`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating worker profile:', error);
    throw error;
  }
}

// Get worker dashboard stats by worker ID (clean endpoint)
export async function getWorkerDashboardStatsApi(workerId) {
  try {
    const response = await axiosInstance.get(`/api/worker/${workerId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker dashboard stats:', error);
    throw error;
  }
}

// Create worker profile (clean endpoint - only worker data with user_id)
export async function createWorkerProfileApi(workerData) {
  try {
    const response = await axiosInstance.post('/api/workers', workerData);
    return response.data;
  } catch (error) {
    console.error('Error creating worker profile:', error);
    throw error;
  }
}


