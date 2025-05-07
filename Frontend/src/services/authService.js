import api from './api';

// Teacher registration
export const registerTeacher = async (userData) => {
  const response = await api.post('/auth/teacher/register', userData);
  return response.data;
};

// Teacher login
export const loginTeacher = async (credentials) => {
  const response = await api.post('/auth/teacher/login', credentials);
  return response.data;
};

// Student registration
export const registerStudent = async (userData) => {
  const response = await api.post('/auth/student/register', userData);
  return response.data;
};

// Student login
export const loginStudent = async (credentials) => {
  const response = await api.post('/auth/student/login', credentials);
  return response.data;
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
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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
