import api from './api';

// Create a new quiz (Teacher only)
export const createQuiz = async (quizData) => {
  const response = await api.post('/quizzes', quizData);
  return response.data;
};

// Assign a quiz to a class (Teacher only)
export const assignQuizToClass = async (quizId, classId) => {
  const response = await api.post(`/quizzes/${quizId}/assign/${classId}`);
  return response.data;
};

// Get all quizzes created by the logged-in teacher
export const getQuizzesByTeacher = async () => {
  const response = await api.get('/quizzes/teacher');
  return response.data;
};

// Get quizzes for a specific class (role-based content)
export const getQuizzesForClass = async (classId) => {
  const response = await api.get(`/quizzes/class/${classId}`);
  return response.data;
};

// Get quiz details (role-based content)
export const getQuizDetails = async (quizId) => {
  const response = await api.get(`/quizzes/${quizId}`);
  return response.data;
};
