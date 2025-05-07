const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { protect, teacherOnly, studentOnly } = require('../middleware/authMiddleware');

// Create a new class (Teacher only)
router.post('/', protect, teacherOnly, classController.createClass);

// Join a class (Student only)
router.post('/join', protect, studentOnly, classController.joinClass);

// Get all classes created by a teacher
router.get('/teacher', protect, teacherOnly, classController.getTeacherClasses);

// Get all classes a student is enrolled in
router.get('/student', protect, studentOnly, classController.getStudentClasses);

// Get details of a specific class (accessible to both but with different permissions)
router.get('/:classId', protect, classController.getClassDetails);

module.exports = router; 