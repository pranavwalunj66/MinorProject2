import api from './api';

// Get quiz leaderboard for a specific class
export const getQuizLeaderboardByClass = async (quizId, classId, page = 1, limit = 10) => {
  const response = await api.get(`/leaderboards/quiz/${quizId}/class/${classId}`, {
    params: { page, limit },
  });
  return response.data;
};
