import api from './api';

// Create a new class (Teacher only)
export const createClass = async (className) => {
  const response = await api.post('/classes', { className });
  return response.data;
};

// Join a class using enrollment key (Student only)
export const joinClass = async (enrollmentKey) => {
  const response = await api.post('/classes/join', { enrollmentKey });
  return response.data;
};

// Get all classes created by the logged-in teacher
export const getTeacherClasses = async () => {
  const response = await api.get('/classes/teacher');
  return response.data;
};

// Get all classes the logged-in student is enrolled in
export const getStudentClasses = async () => {
  const response = await api.get('/classes/student');
  return response.data;
};

// Get detailed information about a specific class
export const getClassDetails = async (classId) => {
  const response = await api.get(`/classes/${classId}`);
  return response.data;
};
