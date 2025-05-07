const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const crypto = require('crypto');

// Generate a unique enrollment key
const generateEnrollmentKey = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Create a new class (Teacher only)
exports.createClass = async (req, res) => {
  try {
    const { className } = req.body;
    
    if (!className) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    // Generate a unique enrollment key
    let enrollmentKey = generateEnrollmentKey();
    let keyExists = await Class.findOne({ enrollmentKey });
    
    // Keep generating until we find a unique key
    while (keyExists) {
      enrollmentKey = generateEnrollmentKey();
      keyExists = await Class.findOne({ enrollmentKey });
    }

    const newClass = new Class({
      className,
      enrollmentKey,
      teacher: req.user.id
    });

    const savedClass = await newClass.save();

    // Update teacher's createdClasses array
    await Teacher.findByIdAndUpdate(
      req.user.id,
      { $push: { createdClasses: savedClass._id } }
    );

    res.status(201).json({
      _id: savedClass._id,
      className: savedClass.className,
      enrollmentKey: savedClass.enrollmentKey
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join a class (Student only)
exports.joinClass = async (req, res) => {
  try {
    const { enrollmentKey } = req.body;
    
    if (!enrollmentKey) {
      return res.status(400).json({ message: 'Enrollment key is required' });
    }

    const classToJoin = await Class.findOne({ enrollmentKey });
    
    if (!classToJoin) {
      return res.status(404).json({ message: 'Class not found with this enrollment key' });
    }

    // Check if student is already enrolled
    if (classToJoin.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this class' });
    }

    // Add student to class
    classToJoin.students.push(req.user.id);
    await classToJoin.save();

    // Add class to student's enrolledClasses
    await Student.findByIdAndUpdate(
      req.user.id,
      { $push: { enrolledClasses: classToJoin._id } }
    );

    res.status(200).json({
      message: 'Successfully joined class',
      class: {
        _id: classToJoin._id,
        className: classToJoin.className
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all classes created by a teacher
exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user.id })
      .select('className enrollmentKey students')
      .populate('students', 'name email');

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all classes a student is enrolled in
exports.getStudentClasses = async (req, res) => {
  try {
    const classes = await Class.find({ students: req.user.id })
      .select('className teacher')
      .populate('teacher', 'name');

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get details of a specific class
exports.getClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;
    
    // First try to find the class by ID to make sure it exists
    const classExists = await Class.findById(classId);
    
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Use lean() to get plain JavaScript objects which are easier to work with
    const classDetails = await Class.findById(classId)
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .populate('quizzes', 'title description')
      .lean();
    
    // Ensure we have a valid classDetails object
    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Ensure students is an array
    if (!classDetails.students) {
      classDetails.students = [];
    }

    // Check if user is teacher of this class
    let isTeacher = false;
    if (classDetails.teacher && classDetails.teacher._id) {
      isTeacher = classDetails.teacher._id.toString() === req.user.id;
    }
    
    // Check if user is a student in this class
    let isStudent = false;
    if (Array.isArray(classDetails.students)) {
      isStudent = classDetails.students.some(student => 
        student && student._id && student._id.toString() === req.user.id
      );
    } else {
      // If students is not populated properly, check against the raw array of IDs
      isStudent = classExists.students.includes(req.user.id);
    }

    if (!isTeacher && !isStudent) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(classDetails);
  } catch (error) {
    console.error('Error in getClassDetails:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 