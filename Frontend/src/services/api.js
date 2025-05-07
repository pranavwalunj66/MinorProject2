import axios from 'axios';
import { STORAGE_KEYS } from '../config/constants';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle 401 Unauthorized - Token expired or invalid
    if (response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }

    // Handle network errors
    if (!response) {
      console.error('Network Error:', error);
      throw new Error('Network error. Please check your connection.');
    }

    // Handle other errors
    const errorMessage = response.data?.message || 'An unexpected error occurred';
    console.error('API Error:', errorMessage);
    throw error;
  }
);

export default api;
