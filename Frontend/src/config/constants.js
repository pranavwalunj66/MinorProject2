// API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// User Roles
export const ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    CLASSES: '/teacher/classes',
    QUIZZES: '/teacher/quizzes',
    CREATE_QUIZ: '/teacher/quizzes/create',
    QUESTION_BANKS: '/teacher/question-banks',
    CREATE_QUESTION_BANK: '/teacher/question-banks/create',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    CLASSES: '/student/classes',
    ATTEMPTS: '/student/attempts',
    PRACTICE: '/student/practice',
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
