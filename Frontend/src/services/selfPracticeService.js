import api from './api';

// Get available question banks for practice (Student only)
export const getAvailableQuestionBanks = async () => {
  const response = await api.get('/self-practice/banks');
  return response.data;
};

// Start or resume a practice session (Student only)
export const startOrResumePracticeSession = async (questionBankId) => {
  const response = await api.post(`/self-practice/start/${questionBankId}`);
  return response.data;
};

// Submit answers for a batch of practice questions (Student only)
export const submitPracticeBatchAnswers = async (questionBankId, sessionId, answers) => {
  const response = await api.post(`/self-practice/submit/${questionBankId}`, {
    sessionId,
    answers,
  });
  return response.data;
};
