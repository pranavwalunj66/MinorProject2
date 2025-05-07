import { create } from 'zustand';
import { createClass, getTeacherClasses, getClassDetails } from '../services/classService';
import {
  createQuiz,
  assignQuizToClass,
  getQuizzesByTeacher,
  getQuizDetails,
} from '../services/quizService';
import {
  createQuestionBank,
  getTeacherQuestionBanks,
  getQuestionBankById,
  updateQuestionBank,
  deleteQuestionBank,
  assignQuestionBankToClass,
} from '../services/questionBankService';
import { getQuizResultsForTeacher } from '../services/attemptService';

const useTeacherStore = create((set, _get) => ({
  // Classes
  classes: [],
  currentClass: null,
  isLoadingClasses: false,
  
  // Quizzes
  quizzes: [],
  currentQuiz: null,
  isLoadingQuizzes: false,
  
  // Question Banks
  questionBanks: [],
  currentQuestionBank: null,
  isLoadingQuestionBanks: false,
  
  // Quiz Results
  quizSubmissions: {},
  isLoadingSubmissions: false,
  
  // Class Management
  fetchTeacherClasses: async () => {
    set({ isLoadingClasses: true });
    try {
      const classes = await getTeacherClasses();
      set({ classes, isLoadingClasses: false });
      return classes;
    } catch (err) {
      set({ isLoadingClasses: false });
      throw err;
    }
  },
  
  // Add the rest of the existing code but use state instead of get() when needed
  // For example, instead of get().someValue use state => ({ ...state, newValue })
  // ... existing code ...
}));

export default useTeacherStore; 