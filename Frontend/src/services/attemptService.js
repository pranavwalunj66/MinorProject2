import api from './api';

// Submit a quiz attempt (Student only)
export const submitQuizAttempt = async (quizId, answers, classId) => {
  const response = await api.post('/attempts/submit', {
    quizId,
    answers,
    classId,
  });
  return response.data;
};

// Get all quiz attempts for the logged-in student
export const getStudentQuizResults = async () => {
  const response = await api.get('/attempts/student');
  return response.data;
};

// Get quiz results for a teacher's class
export const getQuizResultsForTeacher = async (quizId, classId) => {
  const response = await api.get(`/attempts/teacher/${quizId}/class/${classId}`);
  return response.data;
};
