import axiosInstance from './api';

// 🔹 Worker overview
export const getWorkerBookings = async (workerId) => {
  const res = await axiosInstance.get(`/api/worker/${workerId}/bookings`);
  return res.data;
};

export const getWorkerServiceHistory = async (workerId) => {
  const res = await axiosInstance.get(`/api/worker/${workerId}/services`);
  return res.data;
};

export const getWorkerJobStats = async (workerId) => {
  const res = await axiosInstance.get(`/api/worker/${workerId}/stats`);
  return res.data;
};

export const getWorkerRecentActivity = async (workerId) => {
  const res = await axiosInstance.get(`/api/worker/${workerId}/activity`);
  return res.data;
};

// 🔹 Booking details
export const getBookingDetails = async (bookingId) => {
  const res = await axiosInstance.get(`/api/worker/booking/${bookingId}`);
  return res.data;
};

// 🔹 Service actions
export const getServiceByBookingId = async (bookingId) => {
  const res = await axiosInstance.get(`/api/worker/service/booking/${bookingId}`);
  return res.data;
};

export const createServiceForBooking = async (data) => {
  const res = await axiosInstance.post(`/api/worker/service`, data);
  return res.data;
};

export const startService = async (serviceId) => {
  const res = await axiosInstance.put(`/api/worker/service/${serviceId}/start`);
  return res.data;
};

export const completeService = async (serviceId) => {
  const res = await axiosInstance.put(`/api/worker/service/${serviceId}/complete`);
  return res.data;
};

export const updateServiceStatus = async (serviceId, data) => {
  const res = await axiosInstance.put(`/api/worker/service/${serviceId}/status`, data);
  return res.data;
};

export const updateServiceDuration = async (serviceId, data) => {
  const res = await axiosInstance.put(`/api/worker/service/${serviceId}/duration`, data);
  return res.data;
};
