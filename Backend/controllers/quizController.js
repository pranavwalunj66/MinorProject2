const Quiz = require('../models/Quiz');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Teacher only)
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    // Validate input
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide title and at least one question' });
    }
    
    // Create quiz with teacher as creator
    const quiz = await Quiz.create({
      title,
      description,
      questions,
      createdBy: req.user.id,
      assignedClasses: []
    });
    
    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Assign quiz to class
// @route   POST /api/quizzes/:quizId/assign/:classId
// @access  Private (Teacher only)
exports.assignQuizToClass = async (req, res) => {
  try {
    const { quizId, classId } = req.params;
    
    // Find quiz and class
    const quiz = await Quiz.findById(quizId);
    const classObj = await Class.findById(classId);
    
    // Check if quiz and class exist
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    if (!classObj) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    
    // Verify teacher owns both the quiz and the class
    if (quiz.createdBy.toString() !== req.user.id || classObj.teacher.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to assign this quiz to this class' });
    }
    
    // Check if quiz is already assigned to class
    if (quiz.assignedClasses.includes(classId)) {
      return res.status(400).json({ success: false, message: 'Quiz already assigned to this class' });
    }
    
    // Update quiz and class
    quiz.assignedClasses.push(classId);
    await quiz.save();
    
    classObj.quizzes.push(quizId);
    await classObj.save();
    
    res.status(200).json({
      success: true,
      message: 'Quiz assigned to class successfully'
    });
  } catch (error) {
    console.error('Error assigning quiz to class:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all quizzes created by the teacher
// @route   GET /api/quizzes/teacher
// @access  Private (Teacher only)
exports.getQuizzesByTeacher = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id })
      .select('title description assignedClasses createdAt');
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    console.error('Error fetching teacher quizzes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get quizzes assigned to a specific class
// @route   GET /api/quizzes/class/:classId
// @access  Private (Teacher who owns the class or Student enrolled in the class)
exports.getQuizzesForClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const classObj = await Class.findById(classId);
    
    if (!classObj) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    
    // Check if user is authorized (teacher who owns the class or student enrolled in the class)
    const isTeacher = req.userType === 'teacher' && classObj.teacher.toString() === req.user.id;
    const isStudent = req.userType === 'student' && classObj.students.includes(req.user.id);
    
    if (!isTeacher && !isStudent) {
      return res.status(403).json({ success: false, message: 'Not authorized to access quizzes for this class' });
    }
    
    // Get quizzes for the class
    const quizzes = await Quiz.find({ _id: { $in: classObj.quizzes } })
      .select(isTeacher ? 'title description questions createdAt' : 'title description createdAt');
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    console.error('Error fetching quizzes for class:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get details of a specific quiz
// @route   GET /api/quizzes/:quizId
// @access  Private (Teacher who created the quiz or Student with access)
exports.getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    // Check if user is authorized
    const isTeacher = req.userType === 'teacher' && quiz.createdBy.toString() === req.user.id;
    
    let isStudent = false;
    if (req.userType === 'student') {
      // Check if student has access to any class this quiz is assigned to
      const classes = await Class.find({
        _id: { $in: quiz.assignedClasses },
        students: req.user.id
      });
      
      isStudent = classes.length > 0;
    }
    
    if (!isTeacher && !isStudent) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this quiz' });
    }
    
    // For students, hide the isCorrect flag
    if (isStudent) {
      // Create a deep copy to modify
      const studentQuiz = JSON.parse(JSON.stringify(quiz));
      
      // Hide correct answers
      studentQuiz.questions.forEach(question => {
        question.options.forEach(option => {
          delete option.isCorrect;
        });
      });
      
      return res.status(200).json({
        success: true,
        data: studentQuiz
      });
    }
    
    // For teachers, return full quiz details
    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 