const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  assignQuizToClass, 
  getQuizzesByTeacher, 
  getQuizzesForClass, 
  getQuizDetails 
} = require('../controllers/quizController');
const { protect, teacherOnly, authorizeRoles } = require('../middleware/authMiddleware');

// Teacher only routes
router.post('/', protect, teacherOnly, createQuiz);
router.post('/:quizId/assign/:classId', protect, teacherOnly, assignQuizToClass);
router.get('/teacher', protect, teacherOnly, getQuizzesByTeacher);

// Mixed access routes (teacher or student)
router.get('/class/:classId', protect, getQuizzesForClass);
router.get('/:quizId', protect, getQuizDetails);

module.exports = router; 