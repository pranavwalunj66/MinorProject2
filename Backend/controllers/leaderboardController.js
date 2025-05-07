const QuizAttempt = require('../models/QuizAttempt');
const Quiz = require('../models/Quiz');
const Class = require('../models/Class');
const Student = require('../models/Student');

// @desc    Get leaderboard for a specific quiz in a specific class
// @route   GET /api/leaderboards/quiz/:quizId/class/:classId
// @access  Private (Teacher/Student)
exports.getQuizLeaderboardByClass = async (req, res) => {
  try {
    const { quizId, classId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate existence of quizId and classId
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Check permissions based on user role
    if (req.userType === 'student') {
      // Check if student is enrolled in this class
      const student = await Student.findById(req.user.id);
      const isEnrolled = student.enrolledClasses.includes(classId);
      if (!isEnrolled) {
        return res.status(403).json({ 
          success: false, 
          message: 'You are not enrolled in this class' 
        });
      }

      // Check if quiz is assigned to this class
      const isQuizAssigned = classObj.quizzes.includes(quizId);
      if (!isQuizAssigned) {
        return res.status(404).json({ 
          success: false, 
          message: 'Quiz not found in this class' 
        });
      }
    } else if (req.userType === 'teacher') {
      // Check if teacher owns this quiz
      if (quiz.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'You do not have permission to view this quiz' 
        });
      }

      // Check if teacher owns this class
      if (classObj.teacher.toString() !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'You do not have permission to view this class' 
        });
      }
    }

    // Data Fetching: Get all attempts for this quiz in this class
    const totalAttempts = await QuizAttempt.countDocuments({
      quiz: quizId,
      classContext: classId
    });

    const quizAttempts = await QuizAttempt.find({
      quiz: quizId,
      classContext: classId
    })
      .populate('student', 'name')
      .sort({ score: -1, submittedAt: 1 }) // Primary: score (desc), Secondary: submittedAt (asc)
      .skip(skip)
      .limit(limit);

    // If no attempts exist
    if (quizAttempts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No attempts for this quiz in this class yet',
        data: {
          leaderboard: [],
          pagination: {
            page,
            limit,
            totalAttempts: 0,
            totalPages: 0
          }
        }
      });
    }

    // Data Formatting: Transform into ranked list
    // Calculate the base rank for the current page
    const baseRank = (page - 1) * limit;

    const leaderboard = quizAttempts.map((attempt, index) => {
      return {
        rank: baseRank + index + 1,
        studentName: attempt.student.name,
        studentId: attempt.student._id,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        submittedAt: attempt.submittedAt
      };
    });

    // Send Response with pagination
    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          page,
          limit,
          totalAttempts,
          totalPages: Math.ceil(totalAttempts / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error in getQuizLeaderboardByClass:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 