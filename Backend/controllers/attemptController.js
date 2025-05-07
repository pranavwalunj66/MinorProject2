const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const Student = require('../models/Student');
const Class = require('../models/Class');

// @desc    Submit a quiz attempt
// @route   POST /api/attempts/submit
// @access  Private (Student only)
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, classId } = req.body;
    
    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide quizId and answers array' 
      });
    }
    
    // Verify student exists
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    // Fetch the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    // Check if class context is provided and valid
    if (classId) {
      const classExists = await Class.findOne({ 
        _id: classId, 
        students: req.user.id 
      });
      
      if (!classExists) {
        return res.status(403).json({ 
          success: false, 
          message: 'Student is not enrolled in this class or class does not exist' 
        });
      }
    }
    
    // Check if student has already attempted this quiz
    const existingAttempt = await QuizAttempt.findOne({
      quiz: quizId,
      student: req.user.id,
      ...(classId && { classContext: classId })
    });
    
    if (existingAttempt) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already attempted this quiz' 
      });
    }
    
    // Calculate score
    let score = 0;
    const totalMarks = quiz.questions.length;
    
    answers.forEach(answer => {
      const question = quiz.questions.id(answer.questionId);
      if (!question) return;
      
      // For multiple correct answers, all selected options must be correct
      if (question.multipleCorrectAnswers) {
        const correctOptionIds = question.options
          .filter(option => option.isCorrect)
          .map(option => option._id.toString());
          
        const selectedIds = answer.selectedOptionIds.map(id => id.toString());
        
        // Check if selected options match exactly with correct options
        const isCorrect = 
          correctOptionIds.length === selectedIds.length && 
          correctOptionIds.every(id => selectedIds.includes(id)) &&
          selectedIds.every(id => correctOptionIds.includes(id));
          
        if (isCorrect) score++;
      } 
      // For single correct answer
      else {
        const selectedId = answer.selectedOptionIds[0]?.toString();
        const correctOption = question.options.find(option => option.isCorrect);
        
        if (correctOption && selectedId === correctOption._id.toString()) {
          score++;
        }
      }
    });
    
    // Create quiz attempt
    const quizAttempt = await QuizAttempt.create({
      quiz: quizId,
      student: req.user.id,
      answers,
      score,
      totalMarks,
      classContext: classId || undefined
    });
    
    // Update student's quiz attempts
    await Student.findByIdAndUpdate(
      req.user.id,
      { $push: { quizAttempts: quizAttempt._id } }
    );
    
    // Return result
    res.status(201).json({
      success: true,
      data: {
        score,
        totalMarks,
        percentage: (score / totalMarks) * 100
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student's quiz attempts
// @route   GET /api/attempts/student
// @access  Private (Student only)
exports.getStudentResults = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user.id })
      .populate('quiz', 'title description')
      .populate('classContext', 'className')
      .sort('-submittedAt');
    
    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get quiz results for a teacher
// @route   GET /api/attempts/teacher/:quizId/class/:classId
// @access  Private (Teacher only)
exports.getQuizResultsForTeacher = async (req, res) => {
  try {
    const { quizId, classId } = req.params;
    
    // Verify the teacher owns the quiz
    const quiz = await Quiz.findOne({
      _id: quizId,
      createdBy: req.user.id
    });
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found or you are not authorized to access this quiz'
      });
    }
    
    // Verify the teacher owns the class
    const classObj = await Class.findOne({
      _id: classId,
      teacher: req.user.id
    });
    
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found or you are not authorized to access this class'
      });
    }
    
    // Get all attempts for this quiz in this class
    const attempts = await QuizAttempt.find({
      quiz: quizId,
      classContext: classId
    }).populate('student', 'name email');
    
    // Calculate statistics
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0 
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts 
      : 0;
    
    res.status(200).json({
      success: true,
      count: totalAttempts,
      averageScore,
      data: attempts
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 