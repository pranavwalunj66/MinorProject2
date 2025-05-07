import { create } from 'zustand';
import { joinClass, getStudentClasses, getClassDetails } from '../services/classService';
import { getQuizzesForClass, getQuizDetails } from '../services/quizService';
import { submitQuizAttempt, getStudentQuizResults } from '../services/attemptService';
import {
  getAvailableQuestionBanks,
  startOrResumePracticeSession,
  submitPracticeBatchAnswers,
} from '../services/selfPracticeService';

const useStudentStore = create((set, get) => ({
  // Classes
  enrolledClasses: [],
  currentClass: null,
  isLoadingEnrolledClasses: false,

  // Quizzes
  quizzesForClass: {},
  currentQuizAttempt: null,
  isLoadingQuizAttempt: false,

  // Attempts
  quizAttemptsHistory: [],
  lastAttemptResult: null,
  isLoadingHistory: false,

  // Practice Sessions
  availableQuestionBanks: [],
  currentPracticeSession: null,
  isLoadingPractice: false,

  // Class Management
  fetchStudentClasses: async () => {
    set({ isLoadingEnrolledClasses: true });
    try {
      const classes = await getStudentClasses();
      set({ enrolledClasses: classes, isLoadingEnrolledClasses: false });
      return classes;
    } catch (err) {
      set({ isLoadingEnrolledClasses: false });
      throw err;
    }
  },

  joinNewClass: async (enrollmentKey) => {
    set({ isLoadingEnrolledClasses: true });
    try {
      const response = await joinClass(enrollmentKey);
      set((state) => ({
        enrolledClasses: [...state.enrolledClasses, response.class],
        isLoadingEnrolledClasses: false,
      }));
      return response.class;
    } catch (err) {
      set({ isLoadingEnrolledClasses: false });
      throw err;
    }
  },

  fetchClassDetails: async (classId) => {
    set({ isLoadingEnrolledClasses: true });
    try {
      const classDetails = await getClassDetails(classId);
      set({ currentClass: classDetails, isLoadingEnrolledClasses: false });
      return classDetails;
    } catch (err) {
      set({ isLoadingEnrolledClasses: false });
      throw err;
    }
  },

  // Quiz Management
  fetchQuizzesForClass: async (classId) => {
    set((state) => ({
      isLoadingQuizAttempt: true,
      quizzesForClass: {
        ...state.quizzesForClass,
        [classId]: state.quizzesForClass[classId] || { loading: true, data: [] },
      },
    }));

    try {
      const response = await getQuizzesForClass(classId);
      set((state) => ({
        quizzesForClass: {
          ...state.quizzesForClass,
          [classId]: { loading: false, data: response.data },
        },
        isLoadingQuizAttempt: false,
      }));
      return response.data;
    } catch (err) {
      set((state) => ({
        quizzesForClass: {
          ...state.quizzesForClass,
          [classId]: { loading: false, data: [], error: err.message },
        },
        isLoadingQuizAttempt: false,
      }));
      throw err;
    }
  },

  startQuizAttempt: async (quizId) => {
    set({ isLoadingQuizAttempt: true });
    try {
      const response = await getQuizDetails(quizId);

      // When a student gets quiz details, initialize the student answers
      const quizData = response.data;
      const studentAnswers = quizData.questions.reduce((acc, question) => {
        acc[question._id] = [];
        return acc;
      }, {});

      set({
        currentQuizAttempt: {
          quizData,
          studentAnswers,
          startTime: new Date(),
        },
        isLoadingQuizAttempt: false,
      });

      return quizData;
    } catch (err) {
      set({ isLoadingQuizAttempt: false });
      throw err;
    }
  },

  updateStudentAnswer: (questionId, selectedOptionIds) => {
    set((state) => ({
      currentQuizAttempt: {
        ...state.currentQuizAttempt,
        studentAnswers: {
          ...state.currentQuizAttempt.studentAnswers,
          [questionId]: selectedOptionIds,
        },
      },
    }));
  },

  submitAttempt: async (classId = null) => {
    set({ isLoadingQuizAttempt: true });

    const { currentQuizAttempt } = get();
    if (!currentQuizAttempt) {
      set({ isLoadingQuizAttempt: false });
      throw new Error('No active quiz attempt');
    }

    const { quizData, studentAnswers } = currentQuizAttempt;

    // Format answers for API
    const answers = Object.entries(studentAnswers).map(([questionId, selectedOptionIds]) => ({
      questionId,
      selectedOptionIds,
    }));

    try {
      const response = await submitQuizAttempt(quizData._id, answers, classId);
      set({
        lastAttemptResult: response.data,
        currentQuizAttempt: null,
        isLoadingQuizAttempt: false,
      });
      return response.data;
    } catch (err) {
      set({ isLoadingQuizAttempt: false });
      throw err;
    }
  },

  // Attempt History
  fetchStudentAttemptsHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const response = await getStudentQuizResults();
      set({
        quizAttemptsHistory: response.data,
        isLoadingHistory: false,
      });
      return response.data;
    } catch (err) {
      set({ isLoadingHistory: false });
      throw err;
    }
  },

  // Self Practice
  fetchAvailableQBs: async () => {
    set({ isLoadingPractice: true });
    try {
      const response = await getAvailableQuestionBanks();
      set({
        availableQuestionBanks: response.data,
        isLoadingPractice: false,
      });
      return response.data;
    } catch (err) {
      set({ isLoadingPractice: false });
      throw err;
    }
  },

  startPractice: async (questionBankId) => {
    set({ isLoadingPractice: true });
    try {
      const response = await startOrResumePracticeSession(questionBankId);

      const { sessionId, currentDifficulty, questions } = response.data;
      // Initialize student answers for this batch
      const batchAnswers = questions.reduce((acc, question) => {
        acc[question._id] = [];
        return acc;
      }, {});

      set({
        currentPracticeSession: {
          sessionId,
          questionBankId,
          currentDifficulty,
          questions,
          batchAnswers,
        },
        isLoadingPractice: false,
      });

      return response.data;
    } catch (err) {
      set({ isLoadingPractice: false });
      throw err;
    }
  },

  updatePracticeBatchAnswer: (questionId, selectedOptionIds) => {
    set((state) => ({
      currentPracticeSession: {
        ...state.currentPracticeSession,
        batchAnswers: {
          ...state.currentPracticeSession.batchAnswers,
          [questionId]: selectedOptionIds,
        },
      },
    }));
  },

  submitPracticeBatch: async () => {
    set({ isLoadingPractice: true });

    const { currentPracticeSession } = get();
    if (!currentPracticeSession) {
      set({ isLoadingPractice: false });
      throw new Error('No active practice session');
    }

    const { questionBankId, sessionId, batchAnswers } = currentPracticeSession;

    // Format answers for API
    const answers = Object.entries(batchAnswers).map(([questionId, selectedOptionIds]) => ({
      questionId,
      selectedOptionIds,
    }));

    try {
      const response = await submitPracticeBatchAnswers(questionBankId, sessionId, answers);

      const { score, newDifficulty, nextBatch } = response.data;

      // If there's a next batch, prepare for it
      if (nextBatch && nextBatch.length > 0) {
        // Initialize student answers for next batch
        const newBatchAnswers = nextBatch.reduce((acc, question) => {
          acc[question._id] = [];
          return acc;
        }, {});

        set({
          currentPracticeSession: {
            sessionId,
            questionBankId,
            currentDifficulty: newDifficulty,
            questions: nextBatch,
            batchAnswers: newBatchAnswers,
            lastBatchScore: score,
          },
          isLoadingPractice: false,
        });
      } else {
        // No more questions, practice session complete
        set({
          currentPracticeSession: {
            ...currentPracticeSession,
            isComplete: true,
            lastBatchScore: score,
          },
          isLoadingPractice: false,
        });
      }

      return response.data;
    } catch (err) {
      set({ isLoadingPractice: false });
      throw err;
    }
  },

  // Reset state (e.g., for logout)
  reset: () => {
    set({
      enrolledClasses: [],
      currentClass: null,
      isLoadingEnrolledClasses: false,

      quizzesForClass: {},
      currentQuizAttempt: null,
      isLoadingQuizAttempt: false,

      quizAttemptsHistory: [],
      lastAttemptResult: null,
      isLoadingHistory: false,

      availableQuestionBanks: [],
      currentPracticeSession: null,
      isLoadingPractice: false,
    });
  },
}));

export default useStudentStore;
