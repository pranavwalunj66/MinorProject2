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
    console.log('getClassDetails called with classId:', req.params.classId);
    console.log('User ID:', req.user.id, 'User Type:', req.userType);
    
    const { classId } = req.params;
    
    // First try to find the class by ID to make sure it exists
    console.log('Finding class by ID...');
    const classExists = await Class.findById(classId);
    
    if (!classExists) {
      console.log('Class not found with ID:', classId);
      return res.status(404).json({ message: 'Class not found' });
    }
    
    console.log('Class found:', classExists._id, 'Teacher:', classExists.teacher, 'Students:', classExists.students);
    
    // Convert to a simple JS object with populated references
    const classDetails = {
      _id: classExists._id.toString(),
      className: classExists.className,
      enrollmentKey: classExists.enrollmentKey,
      teacher: null,
      students: [],
      quizzes: []
    };
    
    // Get the teacher information
    if (classExists.teacher) {
      const teacher = await Teacher.findById(classExists.teacher).select('name email').lean();
      if (teacher) {
        classDetails.teacher = {
          _id: teacher._id.toString(),
          name: teacher.name,
          email: teacher.email
        };
      }
    }
    
    // Get the students information
    if (classExists.students && classExists.students.length > 0) {
      const students = await Student.find({
        _id: { $in: classExists.students }
      }).select('name email').lean();
      
      classDetails.students = students.map(student => ({
        _id: student._id.toString(),
        name: student.name,
        email: student.email
      }));
    }
    
    // Get the quizzes information if they exist
    if (classExists.quizzes && classExists.quizzes.length > 0) {
      try {
        const Quiz = require('../models/Quiz');
        const quizzes = await Quiz.find({
          _id: { $in: classExists.quizzes }
        }).select('title description').lean();
        
        classDetails.quizzes = quizzes.map(quiz => ({
          _id: quiz._id.toString(),
          title: quiz.title,
          description: quiz.description
        }));
      } catch (e) {
        console.log('Quiz model not available yet, skipping quizzes population');
      }
    }

    console.log('Class details prepared:', JSON.stringify(classDetails, null, 2));

    // Check if user is teacher of this class
    let isTeacher = false;
    if (classDetails.teacher && classDetails.teacher._id) {
      isTeacher = classDetails.teacher._id === req.user.id;
      console.log('Teacher check:', isTeacher);
    } else {
      console.log('Teacher object is missing or incomplete:', classDetails.teacher);
      // Fallback to raw comparison
      isTeacher = classExists.teacher.toString() === req.user.id;
      console.log('Fallback teacher check:', isTeacher);
    }
    
    // Check if user is a student in this class
    let isStudent = false;
    if (Array.isArray(classDetails.students) && classDetails.students.length > 0) {
      isStudent = classDetails.students.some(student => {
        const hasStudent = student && student._id === req.user.id;
        console.log('Checking student:', student?._id, 'against user:', req.user.id, 'Result:', hasStudent);
        return hasStudent;
      });
    } else {
      console.log('Students array is empty or not an array, checking raw students array');
      isStudent = classExists.students.some(studentId => 
        studentId.toString() === req.user.id
      );
      console.log('Raw students check result:', isStudent);
    }

    console.log('Access check - isTeacher:', isTeacher, 'isStudent:', isStudent);
    if (!isTeacher && !isStudent) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Sending class details response');
    res.status(200).json(classDetails);
  } catch (error) {
    console.error('Error in getClassDetails:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 