const express = require('express');
const router = express.Router();
const questionBankController = require('../controllers/questionBankController');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

// Apply teacher protection to all routes
router.use(protect);
router.use(teacherOnly);

// Routes for teacher to manage question banks
router.post('/', questionBankController.createQuestionBank);
router.get('/teacher', questionBankController.getTeacherQuestionBanks);
router.get('/:questionBankId', questionBankController.getQuestionBankById);
router.put('/:questionBankId', questionBankController.updateQuestionBank);
router.delete('/:questionBankId', questionBankController.deleteQuestionBank);
router.post('/:questionBankId/assign/:classId', questionBankController.assignQuestionBankToClass);

module.exports = router; 