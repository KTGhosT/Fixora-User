import axiosInstance from './api';

/**
 * Worker Settings API Service
 * Handles all worker settings related API calls
 * 
 * Backend Routes Used:
 * - GET /workers - For fallback function (APIWorkerDashboardController::index)
 * - GET /users/{id} - For user data (APIUserController::show)
 * - PUT /users/{id} - For user updates (APIUserController::update)
 * - PUT /workers/{id} - For worker updates (APIWorkerDashboardController::updateWorker)
 */

/**
 * Get worker settings by user ID
 * Uses the fallback approach since there's no direct route for /workers/user/{userId}
 * @param {string|number} userId - The user ID
 * @returns {Promise<Object>} - Returns { user: {...}, worker: {...} }
 */
export async function getWorkerSettingsByUserId(userId) {
  console.log(`Fetching worker settings for user ID: ${userId}`);
  
  try {
    // Since there's no direct route for /workers/user/{userId}, use the fallback approach
    return await getWorkerSettingsFallback(userId);
  } catch (error) {
    console.error('Error fetching worker settings:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw error;
  }
}

/**
 * Get worker settings using available backend routes
 * Uses: GET /users/{id} and GET /workers (fallback)
 * @param {string|number} userId - The user ID
 * @returns {Promise<Object>} - Returns { user: {...}, worker: {...} }
 */
async function getWorkerSettingsFallback(userId) {
  try {
    console.log('Fetching worker settings using backend routes for user ID:', userId);
    
    // Get user data using: GET /users/{id}
    const userResponse = await axiosInstance.get(`/api/users/${userId}`);
    const user = userResponse.data;
    console.log('User data fetched:', user);
    
    // Try to find worker data by searching all workers using: GET /workers
    let worker = null;
    try {
      console.log('Fetching workers list to find matching worker...');
      const workersResponse = await axiosInstance.get('/api/workers');
      const workers = workersResponse.data;
      console.log('Workers list fetched:', workers);
      
      // Find worker with matching user_id
      if (Array.isArray(workers)) {
        worker = workers.find(w => w.user_id === userId);
      } else if (workers?.data && Array.isArray(workers.data)) {
        worker = workers.data.find(w => w.user_id === userId);
      }
      
      if (worker) {
        console.log('Matching worker found:', worker);
      } else {
        console.log('No matching worker found for user ID:', userId);
      }
    } catch (workerError) {
      console.log('Could not fetch workers list:', workerError.message);
      console.log('Worker will be null - this might be normal for new users');
    }
    
    // Return the expected format
    const result = {
      user: user,
      worker: worker || {}
    };
    
    console.log('Worker settings result:', result);
    return result;
  } catch (fallbackError) {
    console.error('Error in fallback approach:', fallbackError);
    
    // Return minimal structure to prevent complete failure
    return {
      user: { id: userId },
      worker: {}
    };
  }
}

/**
 * Update worker profile information
 * Uses: PUT /workers/{id} (APIWorkerDashboardController::updateWorker)
 * @param {string|number} workerId - The worker ID
 * @param {Object} workerData - The worker data to update
 * @param {string} [workerData.work_role] - Work role
 * @param {string} [workerData.bio] - Bio description
 * @param {string} [workerData.status] - Worker status (active, inactive, busy, available)
 * @param {string} [workerData.profile_photo] - Profile photo path
 * @param {string} [workerData.cv] - CV file path
 * @param {Object} [workerData.experiences] - Experiences JSON data
 * @param {Object} [workerData.verification] - Verification JSON data
 * @param {string} [workerData.experience_level] - Experience level
 * @param {string} [workerData.availability] - Availability information
 * @param {string} [workerData.short_info] - Short information
 * @param {string} [workerData.minimum_education] - Minimum education level (O/L, A/L, NVQ4, Diploma, Degree)
 * @returns {Promise<Object>} - Updated worker data
 */
export async function updateWorkerProfile(workerId, workerData) {
  try {
    console.log('Updating worker profile with ID:', workerId);
    console.log('Worker data being sent:', workerData);
    
    // Filter payload to only include fields that exist in the workers table
    const allowedFields = [
      'work_role', 
      'bio', 
      'status', 
      'profile_photo',
      'cv',
      'experiences',
      'verification',
      'experience_level', 
      'availability', 
      'short_info', 
      'minimum_education'
    ];
    
    const filteredData = Object.fromEntries(
      Object.entries(workerData).filter(([key]) => allowedFields.includes(key))
    );
    
    console.log('Filtered worker data:', filteredData);
    console.log('Sending PUT request to:', `/api/workers/${workerId}`);
    console.log('Request payload:', JSON.stringify(filteredData, null, 2));
    
    // Uses: PUT /workers/{id} -> APIWorkerDashboardController::updateWorker
    const response = await axiosInstance.put(`/api/workers/${workerId}`, filteredData);
    console.log('Worker profile update successful:', response.data);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Debug: Compare sent data with returned data
    console.log('🔍 DEBUG: Data comparison:');
    console.log('🔍 Sent data:', JSON.stringify(filteredData, null, 2));
    console.log('🔍 Returned worker data:', JSON.stringify(response.data?.worker || response.data, null, 2));
    
    // Check if the returned data matches what was sent
    if (response.data?.worker) {
      const returnedWorker = response.data.worker;
      Object.keys(filteredData).forEach(key => {
        if (filteredData[key] !== returnedWorker[key]) {
          console.warn(`⚠️ Field mismatch for '${key}': sent '${filteredData[key]}' but got '${returnedWorker[key]}'`);
        }
      });
    }
    
    return response.data;
  } catch (err) {
    console.error('Error updating worker profile:', err);
    
    // Log detailed error information
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
      console.error('Response headers:', err.response.headers);
    }
    
    throw err;
  }
}

/**
 * Update user profile information
 * Uses: PUT /users/{id} (APIUserController::update)
 * @param {string|number} userId - The user ID
 * @param {Object} userData - The user data to update
 * @param {string} [userData.name] - Full name
 * @param {string} [userData.first_name] - First name
 * @param {string} [userData.last_name] - Last name
 * @param {string} [userData.birthday] - Birthday (YYYY-MM-DD format)
 * @param {string} [userData.gender] - Gender
 * @param {string} [userData.phone] - Phone number
 * @param {string} [userData.address] - Address
 * @param {string} [userData.number] - House/unit number
 * @param {string} [userData.city] - City
 * @param {string} [userData.state] - State
 * @param {string} [userData.zip] - ZIP code
 * @param {string} [userData.profile_image] - Profile image path
 * @param {string} [userData.email] - Email address
 * @returns {Promise<Object>} - Updated user data
 */
export async function updateUserProfile(userId, userData) {
  try {
    console.log('Updating user profile with ID:', userId);
    console.log('User data being sent:', userData);
    
    // Filter payload to only include fields that exist in the users table
    const allowedFields = [
      'name', 
      'first_name', 
      'last_name', 
      'birthday',
      'gender',
      'phone', 
      'address',
      'number',
      'city',
      'state',
      'zip',
      'profile_image',
      'email'
    ];
    
    const filteredData = Object.fromEntries(
      Object.entries(userData).filter(([key]) => allowedFields.includes(key))
    );
    
    console.log('Filtered user data:', filteredData);
    console.log('Sending PUT request to:', `/api/users/${userId}`);
    console.log('Request payload:', JSON.stringify(filteredData, null, 2));
    
    // Uses: PUT /users/{id} -> APIUserController::update
    const response = await axiosInstance.put(`/api/users/${userId}`, filteredData);
    console.log('User profile update successful:', response.data);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    return response.data;
  } catch (err) {
    console.error('Error updating user profile:', err);
    
    // Log detailed error information
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
    
    throw err;
  }
}

/**
 * Update both user and worker profiles in a single operation
 * @param {string|number} userId - The user ID
 * @param {string|number} workerId - The worker ID
 * @param {Object} userData - The user data to update
 * @param {Object} workerData - The worker data to update
 * @returns {Promise<Object>} - Returns { user: updatedUser, worker: updatedWorker }
 */
export async function updateWorkerSettings(userId, workerId, userData, workerData) {
  try {
    console.log('Updating worker settings for user:', userId, 'worker:', workerId);
    
    const results = {
      user: null,
      worker: null
    };
    
    // Update user data if user ID exists and userData is provided
    if (userId && userData && Object.keys(userData).length > 0) {
      results.user = await updateUserProfile(userId, userData);
    }
    
    // Update worker data if worker ID exists and workerData is provided
    if (workerId && workerData && Object.keys(workerData).length > 0) {
      results.worker = await updateWorkerProfile(workerId, workerData);
    }
    
    console.log('Worker settings update completed:', results);
    return results;
  } catch (err) {
    console.error('Error updating worker settings:', err);
    throw err;
  }
}

/**
 * Get worker status options
 * @returns {Array<Object>} - Array of status options
 */
export function getWorkerStatusOptions() {
  return [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'busy', label: 'Busy' },
    { value: 'available', label: 'Available' }
  ];
}

/**
 * Get education level options
 * @returns {Array<Object>} - Array of education options
 */
export function getEducationOptions() {
  return [
    { value: '', label: 'Select Education' },
    { value: 'O/L', label: 'O/L' },
    { value: 'A/L', label: 'A/L' },
    { value: 'NVQ4', label: 'NVQ4' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Degree', label: 'Degree' }
  ];
}

/**
 * Get gender options
 * @returns {Array<Object>} - Array of gender options
 */
export function getGenderOptions() {
  return [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];
}

/**
 * Debug function to check if data was actually saved
 * @param {string|number} userId - The user ID
 * @param {string|number} workerId - The worker ID
 * @returns {Promise<Object>} - Current data from database
 */
export async function debugWorkerSettings(userId, workerId) {
  try {
    console.log('🔍 Debug: Checking current data in database...');
    
    // Fetch current data to see if changes were saved
    const currentData = await getWorkerSettingsByUserId(userId);
    console.log('🔍 Current user data:', currentData.user);
    console.log('🔍 Current worker data:', currentData.worker);
    
    return currentData;
  } catch (error) {
    console.error('🔍 Debug: Error fetching current data:', error);
    throw error;
  }
}

/**
 * Test function to verify backend is working correctly
 * @param {string|number} workerId - The worker ID
 * @param {Object} testData - Test data to send
 * @returns {Promise<Object>} - Response from backend
 */
export async function testWorkerUpdate(workerId, testData) {
  try {
    console.log('🧪 Testing worker update with data:', testData);
    
    const response = await axiosInstance.put(`/api/workers/${workerId}`, testData);
    console.log('🧪 Test response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('🧪 Test failed:', error);
    throw error;
  }
}

/**
 * Simple test to verify backend is actually updating data
 * @param {string|number} workerId - The worker ID
 * @returns {Promise<void>}
 */
export async function verifyBackendUpdate(workerId) {
  try {
    const timestamp = new Date().toISOString();
    const testBio = `TEST UPDATE ${timestamp}`;
    
    console.log('🧪 Testing backend with bio:', testBio);
    
    // Send a simple update
    const response = await axiosInstance.put(`/api/workers/${workerId}`, {
      bio: testBio
    });
    
    console.log('🧪 Backend response:', response.data);
    
    // Check if the returned data matches what we sent
    if (response.data?.worker?.bio === testBio) {
      console.log('✅ Backend is working correctly - data matches');
    } else {
      console.log('❌ Backend issue - returned bio:', response.data?.worker?.bio, 'expected:', testBio);
    }
    
  } catch (error) {
    console.error('🧪 Backend test failed:', error);
    throw error;
  }
}

/**
 * Validate worker data before sending to API
 * @param {Object} workerData - The worker data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export function validateWorkerData(workerData) {
  const errors = {};
  
  // Validate required fields if they exist
  if (workerData.work_role && workerData.work_role.trim().length === 0) {
    errors.work_role = 'Work role cannot be empty';
  }
  
  if (workerData.bio && workerData.bio.trim().length === 0) {
    errors.bio = 'Bio cannot be empty';
  }
  
  if (workerData.status && !['active', 'inactive', 'busy', 'available'].includes(workerData.status)) {
    errors.status = 'Invalid status value';
  }
  
  if (workerData.minimum_education && !['', 'O/L', 'A/L', 'NVQ4', 'Diploma', 'Degree'].includes(workerData.minimum_education)) {
    errors.minimum_education = 'Invalid education level';
  }
  
  // Validate JSON fields
  if (workerData.experiences && typeof workerData.experiences !== 'object') {
    errors.experiences = 'Experiences must be a valid JSON object';
  }
  
  if (workerData.verification && typeof workerData.verification !== 'object') {
    errors.verification = 'Verification must be a valid JSON object';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate user data before sending to API
 * @param {Object} userData - The user data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export function validateUserData(userData) {
  const errors = {};
  
  // Validate email format if provided
  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Validate phone format if provided (basic validation)
  if (userData.phone && !/^[\d\s\-\+\(\)]+$/.test(userData.phone)) {
    errors.phone = 'Invalid phone number format';
  }
  
  // Validate birthday format if provided
  if (userData.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(userData.birthday)) {
    errors.birthday = 'Birthday must be in YYYY-MM-DD format';
  }
  
  // Validate gender if provided
  if (userData.gender && !['male', 'female', 'other'].includes(userData.gender.toLowerCase())) {
    errors.gender = 'Invalid gender value';
  }
  
  // Validate ZIP code format if provided
  if (userData.zip && !/^\d{5}(-\d{4})?$/.test(userData.zip)) {
    errors.zip = 'Invalid ZIP code format';
  }
  
  // Validate required fields if they exist
  if (userData.first_name && userData.first_name.trim().length === 0) {
    errors.first_name = 'First name cannot be empty';
  }
  
  if (userData.last_name && userData.last_name.trim().length === 0) {
    errors.last_name = 'Last name cannot be empty';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
