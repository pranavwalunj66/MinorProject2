import api from './api';

// Create a new question bank (Teacher only)
export const createQuestionBank = async (qbData) => {
  const response = await api.post('/question-banks', qbData);
  return response.data;
};

// Get all question banks created by the logged-in teacher
export const getTeacherQuestionBanks = async () => {
  const response = await api.get('/question-banks/teacher');
  return response.data;
};

// Get details of a specific question bank
export const getQuestionBankById = async (qbId) => {
  const response = await api.get(`/question-banks/${qbId}`);
  return response.data;
};

// Update a question bank (Teacher only)
export const updateQuestionBank = async (qbId, qbData) => {
  const response = await api.put(`/question-banks/${qbId}`, qbData);
  return response.data;
};

// Delete a question bank (Teacher only)
export const deleteQuestionBank = async (qbId) => {
  const response = await api.delete(`/question-banks/${qbId}`);
  return response.data;
};

// Assign a question bank to a class (Teacher only)
export const assignQuestionBankToClass = async (qbId, classId) => {
  const response = await api.post(`/question-banks/${qbId}/assign/${classId}`);
  return response.data;
};
