import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // notice /api
  withCredentials: true,                // needed if using Sanctum cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
