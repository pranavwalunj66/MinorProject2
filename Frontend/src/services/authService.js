import api from './api';
import { AUTH_ENDPOINTS } from '../config/endpoints';
import { STORAGE_KEYS } from '../config/constants';

// Teacher Authentication
export const registerTeacher = async (name, email, password) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.TEACHER_REGISTER, {
      name,
      email,
      password,
    });
    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Register Teacher Error:', error);
    throw error;
  }
};

export const loginTeacher = async (email, password) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.TEACHER_LOGIN, {
      email,
      password,
    });
    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Login Teacher Error:', error);
    throw error;
  }
};

// Student Authentication
export const registerStudent = async (name, email, password) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.STUDENT_REGISTER, {
      name,
      email,
      password,
    });
    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Register Student Error:', error);
    throw error;
  }
};

export const loginStudent = async (email, password) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS.STUDENT_LOGIN, {
      email,
      password,
    });
    // Store token and user data
    localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Login Student Error:', error);
    throw error;
  }
};

// Common function to store auth data
export const storeAuthData = (userData) => {
  localStorage.setItem('token', userData.token);
  localStorage.setItem(
    'user',
    JSON.stringify({
      id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    })
  );
};

// Logout - clear localStorage
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user data
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
