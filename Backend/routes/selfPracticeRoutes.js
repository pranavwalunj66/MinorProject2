const express = require('express');
const router = express.Router();
const { protect, studentOnly } = require('../middleware/authMiddleware');
const {
  getAvailableQuestionBanks,
  startOrResumePracticeSession,
  submitPracticeBatchAnswers
} = require('../controllers/selfPracticeController');

// All routes are protected and student-only
router.use(protect);
router.use(studentOnly);

// Get available question banks for a student
router.get('/banks', getAvailableQuestionBanks);

// Start or resume a practice session
router.post('/start/:questionBankId', startOrResumePracticeSession);

// Submit practice batch answers
router.post('/submit/:questionBankId', submitPracticeBatchAnswers);

module.exports = router; 