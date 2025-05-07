const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const config = require('../config/config');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Check if user is teacher or student based on role in token
      if (decoded.role === 'teacher') {
        // Set req.user to teacher
        req.user = await Teacher.findById(decoded.id).select('-password');
        req.userType = 'teacher';
      } else if (decoded.role === 'student') {
        // Set req.user to student
        req.user = await Student.findById(decoded.id).select('-password');
        req.userType = 'student';
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// General role-based authorization middleware
exports.authorize = (role) => {
  return (req, res, next) => {
    if (req.userType !== role) {
      return res.status(403).json({ 
        success: false,
        message: `Access denied: ${role} only` 
      });
    }
    next();
  };
};

// Teacher only middleware
exports.teacherOnly = (req, res, next) => {
  if (req.userType !== 'teacher') {
    return res.status(403).json({ message: 'Access denied: Teachers only' });
  }
  next();
};

// Student only middleware
exports.studentOnly = (req, res, next) => {
  if (req.userType !== 'student') {
    return res.status(403).json({ message: 'Access denied: Students only' });
  }
  next();
}; 