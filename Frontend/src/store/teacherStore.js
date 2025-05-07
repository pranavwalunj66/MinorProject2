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

const useTeacherStore = create((set, get) => ({
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

  addClass: async (className) => {
    set({ isLoadingClasses: true });
    try {
      const newClass = await createClass(className);
      set((state) => ({
        classes: [...state.classes, newClass],
        isLoadingClasses: false,
      }));
      return newClass;
    } catch (err) {
      set({ isLoadingClasses: false });
      throw err;
    }
  },

  fetchClassDetails: async (classId) => {
    set({ isLoadingClasses: true });
    try {
      const classDetails = await getClassDetails(classId);
      set({ currentClass: classDetails, isLoadingClasses: false });
      return classDetails;
    } catch (err) {
      set({ isLoadingClasses: false });
      throw err;
    }
  },

  // Quiz Management
  fetchTeacherQuizzes: async () => {
    set({ isLoadingQuizzes: true });
    try {
      const response = await getQuizzesByTeacher();
      set({ quizzes: response.data, isLoadingQuizzes: false });
      return response.data;
    } catch (err) {
      set({ isLoadingQuizzes: false });
      throw err;
    }
  },

  addQuiz: async (quizData) => {
    set({ isLoadingQuizzes: true });
    try {
      const response = await createQuiz(quizData);
      set((state) => ({
        quizzes: [...state.quizzes, response.data],
        isLoadingQuizzes: false,
      }));
      return response.data;
    } catch (err) {
      set({ isLoadingQuizzes: false });
      throw err;
    }
  },

  fetchQuizDetailsForTeacher: async (quizId) => {
    set({ isLoadingQuizzes: true });
    try {
      const response = await getQuizDetails(quizId);
      set({ currentQuiz: response.data, isLoadingQuizzes: false });
      return response.data;
    } catch (err) {
      set({ isLoadingQuizzes: false });
      throw err;
    }
  },

  assignQuiz: async (quizId, classId) => {
    set({ isLoadingQuizzes: true });
    try {
      await assignQuizToClass(quizId, classId);
      // Optionally refresh classes or quizzes after assignment
      set({ isLoadingQuizzes: false });
      return true;
    } catch (err) {
      set({ isLoadingQuizzes: false });
      throw err;
    }
  },

  // Question Bank Management
  fetchTeacherQuestionBanks: async () => {
    set({ isLoadingQuestionBanks: true });
    try {
      const response = await getTeacherQuestionBanks();
      set({ questionBanks: response.data, isLoadingQuestionBanks: false });
      return response.data;
    } catch (err) {
      set({ isLoadingQuestionBanks: false });
      throw err;
    }
  },

  addQuestionBank: async (qbData) => {
    set({ isLoadingQuestionBanks: true });
    try {
      const response = await createQuestionBank(qbData);
      set((state) => ({
        questionBanks: [...state.questionBanks, response.data],
        isLoadingQuestionBanks: false,
      }));
      return response.data;
    } catch (err) {
      set({ isLoadingQuestionBanks: false });
      throw err;
    }
  },

  fetchQuestionBankDetails: async (qbId) => {
    set({ isLoadingQuestionBanks: true });
    try {
      const response = await getQuestionBankById(qbId);
      set({ currentQuestionBank: response.data, isLoadingQuestionBanks: false });
      return response.data;
    } catch (err) {
      set({ isLoadingQuestionBanks: false });
      throw err;
    }
  },

  updateQuestionBank: async (qbId, qbData) => {
    set({ isLoadingQuestionBanks: true });
    try {
      const response = await updateQuestionBank(qbId, qbData);

      // Update questionBanks list
      set((state) => ({
        questionBanks: state.questionBanks.map((qb) => (qb._id === qbId ? response.data : qb)),
        currentQuestionBank: response.data,
        isLoadingQuestionBanks: false,
      }));

      return response.data;
    } catch (err) {
      set({ isLoadingQuestionBanks: false });
      throw err;
    }
  },

  deleteQuestionBank: async (qbId) => {
    set({ isLoadingQuestionBanks: true });
    try {
      await deleteQuestionBank(qbId);

      // Remove from questionBanks list
      set((state) => ({
        questionBanks: state.questionBanks.filter((qb) => qb._id !== qbId),
        currentQuestionBank:
          state.currentQuestionBank?._id === qbId ? null : state.currentQuestionBank,
        isLoadingQuestionBanks: false,
      }));

      return true;
    } catch (err) {
      set({ isLoadingQuestionBanks: false });
      throw err;
    }
  },

  assignQuestionBank: async (qbId, classId) => {
    set({ isLoadingQuestionBanks: true });
    try {
      const response = await assignQuestionBankToClass(qbId, classId);

      // Update the question bank in the list with new assignedClasses
      const updatedQuestionBank = response.data;
      set((state) => ({
        questionBanks: state.questionBanks.map((qb) =>
          qb._id === qbId ? updatedQuestionBank : qb
        ),
        currentQuestionBank:
          state.currentQuestionBank?._id === qbId ? updatedQuestionBank : state.currentQuestionBank,
        isLoadingQuestionBanks: false,
      }));

      return updatedQuestionBank;
    } catch (err) {
      set({ isLoadingQuestionBanks: false });
      throw err;
    }
  },

  // Quiz Results
  fetchQuizSubmissions: async (quizId, classId) => {
    set({ isLoadingSubmissions: true });
    try {
      const response = await getQuizResultsForTeacher(quizId, classId);
      const submissionKey = `${quizId}_${classId}`;

      set((state) => ({
        quizSubmissions: {
          ...state.quizSubmissions,
          [submissionKey]: response.data,
        },
        isLoadingSubmissions: false,
      }));

      return response.data;
    } catch (err) {
      set({ isLoadingSubmissions: false });
      throw err;
    }
  },

  // Reset state (e.g., for logout)
  reset: () => {
    set({
      classes: [],
      currentClass: null,
      isLoadingClasses: false,

      quizzes: [],
      currentQuiz: null,
      isLoadingQuizzes: false,

      questionBanks: [],
      currentQuestionBank: null,
      isLoadingQuestionBanks: false,

      quizSubmissions: {},
      isLoadingSubmissions: false,
    });
  },
}));

export default useTeacherStore;
