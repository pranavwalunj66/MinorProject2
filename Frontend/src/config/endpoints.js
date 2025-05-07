// Endpoints for API calls

export const AUTH_ENDPOINTS = {
  TEACHER_REGISTER: '/auth/teacher/register',
  TEACHER_LOGIN: '/auth/teacher/login',
  STUDENT_REGISTER: '/auth/student/register',
  STUDENT_LOGIN: '/auth/student/login',
};

export const CLASS_ENDPOINTS = {
  CREATE_CLASS: '/classes',
  GET_TEACHER_CLASSES: '/classes/teacher',
  GET_STUDENT_CLASSES: '/classes/student',
  JOIN_CLASS: '/classes/join',
  GET_CLASS_DETAILS: (classId) => `/classes/${classId}`,
};

export const QUIZ_ENDPOINTS = {
  CREATE_QUIZ: '/quizzes',
  GET_TEACHER_QUIZZES: '/quizzes/teacher',
  GET_QUIZZES_FOR_CLASS: (classId) => `/quizzes/class/${classId}`,
  GET_QUIZ_DETAILS: (quizId) => `/quizzes/${quizId}`,
  ASSIGN_QUIZ: (quizId, classId) => `/quizzes/${quizId}/assign/${classId}`,
};

export const ATTEMPT_ENDPOINTS = {
  SUBMIT_ATTEMPT: '/attempts/submit',
  GET_STUDENT_ATTEMPTS: '/attempts/student',
  GET_QUIZ_RESULTS_FOR_TEACHER: (quizId, classId) => `/attempts/teacher/${quizId}/class/${classId}`,
};

export const QUESTION_BANK_ENDPOINTS = {
  CREATE_QUESTION_BANK: '/question-banks',
  GET_TEACHER_QUESTION_BANKS: '/question-banks/teacher',
  GET_QUESTION_BANK: (questionBankId) => `/question-banks/${questionBankId}`,
  UPDATE_QUESTION_BANK: (questionBankId) => `/question-banks/${questionBankId}`,
  DELETE_QUESTION_BANK: (questionBankId) => `/question-banks/${questionBankId}`,
  ASSIGN_QUESTION_BANK: (questionBankId, classId) => `/question-banks/${questionBankId}/assign/${classId}`,
};

export const SELF_PRACTICE_ENDPOINTS = {
  GET_AVAILABLE_QUESTION_BANKS: '/self-practice/banks',
  START_PRACTICE_SESSION: (questionBankId) => `/self-practice/start/${questionBankId}`,
  SUBMIT_PRACTICE_BATCH: (questionBankId) => `/self-practice/submit/${questionBankId}`,
};

export const LEADERBOARD_ENDPOINTS = {
  GET_QUIZ_LEADERBOARD: (quizId, classId) => `/leaderboards/quiz/${quizId}/class/${classId}`,
}; 