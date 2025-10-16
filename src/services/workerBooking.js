import axiosInstance from './api';

// Helper function to extract worker ID from various response structures
function extractWorkerId(workerResponse) {
  console.log('Full worker response structure:', JSON.stringify(workerResponse.data, null, 2));
  
  // Try different possible response structures
  if (workerResponse.data.data && workerResponse.data.data.worker && workerResponse.data.data.worker.id) {
    return workerResponse.data.data.worker.id;
  } else if (workerResponse.data.data && workerResponse.data.data.worker_id) {
    return workerResponse.data.data.worker_id;
  } else if (workerResponse.data.worker && workerResponse.data.worker.worker_id) {
    return workerResponse.data.worker.worker_id;
  } else if (workerResponse.data.worker && workerResponse.data.worker.id) {
    return workerResponse.data.worker.id;
  } else if (workerResponse.data.worker_id) {
    return workerResponse.data.worker_id;
  } else if (workerResponse.data.id) {
    return workerResponse.data.id;
  } else {
    // Try to find any ID field in the response recursively
    const findWorkerId = (obj, path = '') => {
      if (typeof obj !== 'object' || obj === null) return null;
      
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key === 'worker_id' || key === 'id') {
          console.log(`Found potential worker ID at ${currentPath}:`, value);
          return value;
        }
        
        if (typeof value === 'object' && value !== null) {
          const found = findWorkerId(value, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    const foundId = findWorkerId(workerResponse.data);
    if (foundId) {
      return foundId;
    } else {
      console.error('Available response structure:', Object.keys(workerResponse.data));
      throw new Error('Worker ID not found for user');
    }
  }
}

// Get worker bookings by worker ID
export async function getWorkerBookings(workerId) {
  try {
    console.log('Fetching bookings for worker ID:', workerId);
    const response = await axiosInstance.get(`/api/woker/worker-bookings/${workerId}`);
    console.log('Worker bookings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker bookings:', error);
    throw error;
  }
}

// Get worker bookings by user ID (with worker ID lookup)
export async function getWorkerBookingsByUserId(userId) {
  try {
    console.log('Fetching worker bookings for user ID:', userId);
    
    // First, get the worker ID from the user ID
    const workerResponse = await axiosInstance.get(`/api/worker/user/${userId}`);
    console.log('Worker lookup response:', workerResponse.data);
    
    const workerId = extractWorkerId(workerResponse);
    console.log('Found worker ID:', workerId, 'for user ID:', userId);
    
    // Now fetch bookings using the worker ID
    const bookingsResponse = await getWorkerBookings(workerId);
    return bookingsResponse;
  } catch (error) {
    console.error('Error fetching worker bookings by user ID:', error);
    throw error;
  }
}

// Get booking details by booking ID
export async function getBookingDetails(bookingId) {
  try {
    console.log('Fetching booking details for booking ID:', bookingId);
    const response = await axiosInstance.get(`/api/worker/bookings/${bookingId}`);
    console.log('Booking details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
}

// Update booking status
export async function updateBookingStatus(bookingId, status) {
  try {
    console.log('Updating booking status:', bookingId, 'to', status);
    const response = await axiosInstance.put(`/api/woker/bookings/${bookingId}/status`, {
      status: status
    });
    console.log('Booking status update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

// Get worker's assigned bookings (alternative endpoint)
export async function getAssignedBookings(workerId) {
  try {
    console.log('Fetching assigned bookings for worker ID:', workerId);
    const response = await axiosInstance.get(`/api/worker/${workerId}/bookings`);
    console.log('Assigned bookings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching assigned bookings:', error);
    throw error;
  }
}

// Get worker's assigned bookings by user ID
export async function getAssignedBookingsByUserId(userId) {
  try {
    console.log('Fetching assigned bookings for user ID:', userId);
    
    // First, get the worker ID from the user ID
    const workerResponse = await axiosInstance.get(`/api/worker/user/${userId}`);
    console.log('Worker lookup response:', workerResponse.data);
    
    const workerId = extractWorkerId(workerResponse);
    console.log('Found worker ID:', workerId, 'for user ID:', userId);
    
    // Now fetch assigned bookings using the worker ID
    const bookingsResponse = await getAssignedBookings(workerId);
    return bookingsResponse;
  } catch (error) {
    console.error('Error fetching assigned bookings by user ID:', error);
    throw error;
  }
}