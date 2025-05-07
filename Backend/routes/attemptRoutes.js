const express = require('express');
const { submitQuiz, getStudentResults, getQuizResultsForTeacher } = require('../controllers/attemptController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Student routes
router.route('/submit')
  .post(protect, authorize('student'), submitQuiz);

router.route('/student')
  .get(protect, authorize('student'), getStudentResults);

// Teacher routes
router.route('/teacher/:quizId/class/:classId')
  .get(protect, authorize('teacher'), getQuizResultsForTeacher);

module.exports = router; 