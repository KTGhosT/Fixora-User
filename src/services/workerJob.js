import axiosInstance from './api';

// Get all bookings assigned to a specific worker
export async function getWorkerBookings(workerId) {
  try {
    const response = await axiosInstance.get(`/api/worker/${workerId}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker bookings:', error);
    throw error;
  }
}

// Get booking details by booking ID
export async function getBookingDetails(bookingId) {
  try {
    const response = await axiosInstance.get(`/api/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
}

// Start a service (update status to 'Ongoing')
export async function startService(serviceId) {
  try {
    const response = await axiosInstance.put(`/api/services/${serviceId}/start`, {
      status: 'Ongoing'
    });
    return response.data;
  } catch (error) {
    console.error('Error starting service:', error);
    throw error;
  }
}

// Complete a service (update status to 'Finished')
export async function completeService(serviceId) {
  try {
    const response = await axiosInstance.put(`/api/services/${serviceId}/complete`, {
      status: 'Finished'
    });
    return response.data;
  } catch (error) {
    console.error('Error completing service:', error);
    throw error;
  }
}

// Update service status
export async function updateServiceStatus(serviceId, status) {
  try {
    const response = await axiosInstance.put(`/api/services/${serviceId}/status`, {
      status: status
    });
    return response.data;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
}

// Get service details by booking ID
export async function getServiceByBookingId(bookingId) {
  try {
    const response = await axiosInstance.get(`/api/services/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service by booking ID:', error);
    throw error;
  }
}

// Create a new service for a booking
export async function createServiceForBooking(bookingId, serviceData) {
  try {
    const response = await axiosInstance.post(`/api/services`, {
      bookingId,
      ...serviceData
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service for booking:', error);
    throw error;
  }
}

// Get worker's service history
export async function getWorkerServiceHistory(workerId) {
  try {
    const response = await axiosInstance.get(`/api/worker/${workerId}/services`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker service history:', error);
    throw error;
  }
}
