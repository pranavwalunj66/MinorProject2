const express = require('express');
const router = express.Router();
const { getQuizLeaderboardByClass } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/leaderboards/quiz/:quizId/class/:classId
// @desc    Get leaderboard for a specific quiz in a specific class
// @access  Private (Teacher/Student)
router.get('/quiz/:quizId/class/:classId', protect, getQuizLeaderboardByClass);

module.exports = router; 