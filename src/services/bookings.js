import axiosInstance from './api';

export async function fetchBookingsApi() {
  try {
    const response = await axiosInstance.get('/api/bookings/list');
    const raw = Array.isArray(response.data)
      ? response.data
      : response.data?.bookings || response.data?.data || [];
    return raw.map((b) => ({
      id: b.id ?? b.booking_id ?? b.uuid ?? b._id ?? b.code,
      ...b,
    }));
  } catch (err) {
    if (err?.response?.status === 404) {
      const fallback = await axiosInstance.get('/bookings/list');
      const raw = Array.isArray(fallback.data)
        ? fallback.data
        : fallback.data?.bookings || fallback.data?.data || [];
      return raw.map((b) => ({
        id: b.id ?? b.booking_id ?? b.uuid ?? b._id ?? b.code,
        ...b,
      }));
    }
    throw err;
  }
}

export async function getBookingApi(id) {
  const response = await axiosInstance.get(`/api/bookings/${id}`);
  return response.data;
}

export async function updateBookingApi(id, payload) {
  const response = await axiosInstance.put(`/api/bookings/${id}`, payload);
  return response.data;
}

export async function setBookingStatusApi(id, status) {
  const response = await axiosInstance.post(`/api/bookings/${id}/status`, { status });
  return response.data;
}

export async function assignBookingApi(id, payload) {
  // payload may contain { worker_id } or similar depending on backend
  const response = await axiosInstance.post(`/api/bookings/${id}/assign`, payload);
  return response.data;
}

export async function deleteBookingApi(id) {
  const response = await axiosInstance.delete(`/api/bookings/${id}`);
  return response.data;
}


