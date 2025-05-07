const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const generateToken = require('../utils/generateToken');

// @desc    Register a teacher
// @route   POST /api/auth/teacher/register
// @access  Public
exports.registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new teacher
    const teacher = await Teacher.create({
      name,
      email,
      password
    });

    if (teacher) {
      res.status(201).json({
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        token: generateToken(teacher._id, 'teacher')
      });
    } else {
      res.status(400).json({ message: 'Invalid teacher data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login teacher
// @route   POST /api/auth/teacher/login
// @access  Public
exports.loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find teacher by email
    const teacher = await Teacher.findOne({ email }).select('+password');
    
    // Check if teacher exists and password matches
    if (teacher && (await teacher.matchPassword(password))) {
      res.json({
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        token: generateToken(teacher._id, 'teacher')
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a student
// @route   POST /api/auth/student/register
// @access  Public
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new student
    const student = await Student.create({
      name,
      email,
      password
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        token: generateToken(student._id, 'student')
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login student
// @route   POST /api/auth/student/login
// @access  Public
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ email }).select('+password');
    
    // Check if student exists and password matches
    if (student && (await student.matchPassword(password))) {
      res.json({
        _id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        token: generateToken(student._id, 'student')
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 