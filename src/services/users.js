import axiosInstance from './api';

export async function fetchUsersApi() {
  const response = await axiosInstance.get('/api/users');
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.users) return response.data.users;
  if (response.data?.data) return response.data.data;
  return [];
}

export async function createUserApi(payload) {
  const response = await axiosInstance.post('/api/users', payload);
  return response.data;
}

export async function updateUserApi(id, payload) {
  const response = await axiosInstance.put(`/api/users/${id}`, payload);
  return response.data;
}

export async function deleteUserApi(id) {
  const response = await axiosInstance.delete(`/api/users/${id}`);
  return response.data;
}


