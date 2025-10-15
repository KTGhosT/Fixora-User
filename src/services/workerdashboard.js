import axiosInstance from './api';

// Get worker settings by user ID (matches: GET /workers/user/{userId})
// Returns: { user: {...}, worker: {...} }
export async function getWorkerByUserId(userId) {
  console.log(`Fetching worker settings for user ID: ${userId}`);
  
  try {
    const response = await axiosInstance.get(`/api/workers/user/${userId}`);
    console.log('Worker settings fetched successfully:', response.data);
    
    // Controller returns: { user: {...}, worker: {...} }
    return response.data;
  } catch (error) {
    console.error('Error fetching worker settings:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // If the route doesn't exist (404), try alternative approach
    if (error.response?.status === 404) {
      console.log('Primary route not found, trying alternative approach...');
      return await getWorkerByUserIdFallback(userId);
    }
    
    throw error;
  }
}

// Fallback method when the primary route doesn't exist
async function getWorkerByUserIdFallback(userId) {
  try {
    console.log('Trying fallback approach for user ID:', userId);
    
    // First, get user data
    const userResponse = await axiosInstance.get(`/api/users/${userId}`);
    const user = userResponse.data;
    
    // Try to find worker data by searching all workers
    let worker = null;
    try {
      // Try to get workers list and find the one with matching user_id
      const workersResponse = await axiosInstance.get('/api/workers');
      const workers = workersResponse.data;
      
      // Find worker with matching user_id
      if (Array.isArray(workers)) {
        worker = workers.find(w => w.user_id === userId);
      } else if (workers?.data && Array.isArray(workers.data)) {
        worker = workers.data.find(w => w.user_id === userId);
      }
    } catch (workerError) {
      console.log('Could not fetch workers list, worker will be null');
    }
    
    // Return the expected format
    return {
      user: user,
      worker: worker || {}
    };
  } catch (fallbackError) {
    console.error('Fallback approach also failed:', fallbackError);
    
    // Return minimal structure to prevent complete failure
    return {
      user: { id: userId },
      worker: {}
    };
  }
}

// Update worker info (matches: PUT /workers/{workerId})
// Expected fields: work_role, bio, status, experience_level, availability, short_info, minimum_education
export async function updateWorker(workerId, payload) {
  try {
    console.log('Updating worker with ID:', workerId);
    console.log('Worker payload being sent:', payload);
    
    // Filter payload to only include fields expected by controller
    const allowedFields = ['work_role', 'bio', 'status', 'experience_level', 'availability', 'short_info', 'minimum_education'];
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([key]) => allowedFields.includes(key))
    );
    
    console.log('Filtered worker payload:', filteredPayload);
    
    const response = await axiosInstance.put(`/api/workers/${workerId}`, filteredPayload);
    console.log('Worker update successful:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error updating worker:', err);
    
    // Log detailed error information
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
      console.error('Response headers:', err.response.headers);
    }
    
    throw err;
  }
}

// Update user info (matches: PUT /users/{userId})
// Expected fields: name, first_name, last_name, phone, address, email
export async function updateUser(userId, payload) {
  try {
    console.log('Updating user with ID:', userId);
    console.log('User payload being sent:', payload);
    
    // Filter payload to only include fields expected by controller
    const allowedFields = ['name', 'first_name', 'last_name', 'phone', 'address', 'email'];
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([key]) => allowedFields.includes(key))
    );
    
    console.log('Filtered user payload:', filteredPayload);
    
    const response = await axiosInstance.put(`/api/users/${userId}`, filteredPayload);
    console.log('User update successful:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error updating user:', err);
    
    // Log detailed error information
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
    
    throw err;
  }
}
