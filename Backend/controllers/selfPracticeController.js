const QuestionBank = require('../models/QuestionBank');
const SelfPracticeProgress = require('../models/SelfPracticeProgress');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get available question banks for a student
 * @route   GET /api/self-practice/banks
 * @access  Private (Student)
 */
const getAvailableQuestionBanks = asyncHandler(async (req, res) => {
  // Get the student's enrolled classes
  const student = await Student.findById(req.user.id);
  
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Find all question banks assigned to classes the student is enrolled in
  const questionBanks = await QuestionBank.find({
    assignedClasses: { $in: student.enrolledClasses }
  })
  .select('title description') // Only send required fields
  .populate('assignedClasses', 'className');

  res.status(200).json({
    success: true,
    count: questionBanks.length,
    data: questionBanks
  });
});

/**
 * @desc    Start or resume a practice session
 * @route   POST /api/self-practice/start/:questionBankId
 * @access  Private (Student)
 */
const startOrResumePracticeSession = asyncHandler(async (req, res) => {
  const { questionBankId } = req.params;
  const studentId = req.user.id;

  // Check if question bank exists
  const questionBank = await QuestionBank.findById(questionBankId);
  if (!questionBank) {
    res.status(404);
    throw new Error('Question bank not found');
  }

  // Check if student is enrolled in at least one class that has this question bank
  const student = await Student.findById(studentId).populate('enrolledClasses');
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Verify student has access to this question bank
  const hasAccess = questionBank.assignedClasses.some(classId => 
    student.enrolledClasses.some(c => c._id.toString() === classId.toString())
  );

  if (!hasAccess) {
    res.status(403);
    throw new Error('You do not have access to this question bank');
  }

  // Find or create a practice progress record
  let practiceProgress = await SelfPracticeProgress.findOne({
    student: studentId,
    questionBank: questionBankId
  });

  const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (!practiceProgress) {
    // Create new practice progress if first time
    practiceProgress = await SelfPracticeProgress.create({
      student: studentId,
      questionBank: questionBankId,
      currentAdaptiveDifficulty: 1,
      questionsAttemptedInSession: [],
      lastAttemptedAt: new Date()
    });
  } else if (new Date() - practiceProgress.lastAttemptedAt > ONE_DAY_MS) {
    // If it's been more than 24 hours since last attempt, reset the session
    practiceProgress.questionsAttemptedInSession = [];
    practiceProgress.lastAttemptedAt = new Date();
    await practiceProgress.save();
  }

  // Get a batch of practice questions
  const questionBatch = await getPracticeQuizBatch(
    studentId,
    questionBankId,
    practiceProgress.currentAdaptiveDifficulty,
    practiceProgress.questionsAttemptedInSession
  );

  res.status(200).json({
    success: true,
    data: {
      sessionId: practiceProgress._id,
      currentDifficulty: practiceProgress.currentAdaptiveDifficulty,
      questions: questionBatch
    }
  });
});

/**
 * Helper function to get a batch of practice questions
 */
const getPracticeQuizBatch = async (
  studentId,
  questionBankId,
  currentDifficulty,
  questionsAttemptedInSession
) => {
  const BATCH_SIZE = 5;
  
  // Get the question bank with all questions
  const questionBank = await QuestionBank.findById(questionBankId);
  
  if (!questionBank) {
    throw new Error('Question bank not found');
  }
  
  // Filter questions by current difficulty level
  let eligibleQuestions = questionBank.questions.filter(q => 
    q.difficultyLevel === currentDifficulty
  );
  
  // Filter out questions already attempted in this session
  const attemptedQuestionIds = questionsAttemptedInSession.map(id => id.toString());
  let unseenQuestions = eligibleQuestions.filter(q => 
    !attemptedQuestionIds.includes(q._id.toString())
  );
  
  // If we don't have enough unseen questions at the current difficulty level
  if (unseenQuestions.length < BATCH_SIZE) {
    // Try to get questions from adjacent difficulty levels
    const remainingNeeded = BATCH_SIZE - unseenQuestions.length;
    
    // Try difficulty+1 first, then difficulty-1 if needed
    if (currentDifficulty < 5) {
      const higherDifficultyQuestions = questionBank.questions.filter(q => 
        q.difficultyLevel === currentDifficulty + 1 && 
        !attemptedQuestionIds.includes(q._id.toString())
      );
      
      unseenQuestions = unseenQuestions.concat(
        higherDifficultyQuestions.slice(0, remainingNeeded)
      );
    }
    
    // If we still need more questions, try lower difficulty
    if (unseenQuestions.length < BATCH_SIZE && currentDifficulty > 1) {
      const lowerDifficultyQuestions = questionBank.questions.filter(q => 
        q.difficultyLevel === currentDifficulty - 1 && 
        !attemptedQuestionIds.includes(q._id.toString())
      );
      
      unseenQuestions = unseenQuestions.concat(
        lowerDifficultyQuestions.slice(0, BATCH_SIZE - unseenQuestions.length)
      );
    }
    
    // If we still don't have enough, just use questions already seen in this session
    if (unseenQuestions.length < BATCH_SIZE) {
      const additionalQuestions = eligibleQuestions.filter(q => 
        attemptedQuestionIds.includes(q._id.toString())
      );
      
      unseenQuestions = unseenQuestions.concat(
        additionalQuestions.slice(0, BATCH_SIZE - unseenQuestions.length)
      );
    }
  }
  
  // Limit to BATCH_SIZE and prepare response
  const questionBatch = unseenQuestions.slice(0, BATCH_SIZE).map(q => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options.map(opt => ({
      _id: opt._id,
      optionText: opt.optionText
      // Exclude isCorrect flag so students can't see correct answers
    })),
    multipleCorrectAnswers: q.multipleCorrectAnswers,
    difficultyLevel: q.difficultyLevel
  }));
  
  return questionBatch;
};

/**
 * @desc    Submit practice batch answers and get next batch
 * @route   POST /api/self-practice/submit/:questionBankId
 * @access  Private (Student)
 */
const submitPracticeBatchAnswers = asyncHandler(async (req, res) => {
  const { questionBankId } = req.params;
  const { sessionId, answers } = req.body;
  const studentId = req.user.id;
  
  if (!answers || !Array.isArray(answers)) {
    res.status(400);
    throw new Error('Please provide answers array');
  }
  
  // Find the practice session
  const practiceProgress = await SelfPracticeProgress.findOne({
    _id: sessionId,
    student: studentId,
    questionBank: questionBankId
  });
  
  if (!practiceProgress) {
    res.status(404);
    throw new Error('Practice session not found');
  }
  
  // Get the question bank with correct answers
  const questionBank = await QuestionBank.findById(questionBankId);
  if (!questionBank) {
    res.status(404);
    throw new Error('Question bank not found');
  }
  
  // Calculate score for this batch
  let correctAnswers = 0;
  const totalQuestions = answers.length;
  
  // Track question IDs that were attempted in this batch
  const attemptedQuestionIds = [];
  
  // Process each answer
  for (const answer of answers) {
    const { questionId, selectedOptionIds } = answer;
    
    // Find the question in the question bank
    const question = questionBank.questions.id(questionId);
    if (!question) continue;
    
    // Add to attempted questions
    attemptedQuestionIds.push(questionId);
    
    // Check if answer is correct
    const correctOptionIds = question.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt._id.toString());
    
    // For single correct answer questions
    if (!question.multipleCorrectAnswers) {
      if (selectedOptionIds.length === 1 && 
          correctOptionIds.includes(selectedOptionIds[0])) {
        correctAnswers++;
      }
    } 
    // For multiple correct answer questions
    else {
      const isCorrect = 
        // All selected options must be correct
        selectedOptionIds.every(id => correctOptionIds.includes(id)) &&
        // All correct options must be selected
        correctOptionIds.length === selectedOptionIds.length;
      
      if (isCorrect) {
        correctAnswers++;
      }
    }
  }
  
  // Calculate score percentage
  const scorePercentage = totalQuestions > 0 
    ? (correctAnswers / totalQuestions) * 100 
    : 0;
  
  // Update adaptive difficulty based on score
  let newDifficulty = practiceProgress.currentAdaptiveDifficulty;
  
  if (scorePercentage >= 80) {
    // Increase difficulty if score is high (≥80%)
    newDifficulty = Math.min(5, practiceProgress.currentAdaptiveDifficulty + 1);
  } else if (scorePercentage <= 20) {
    // Decrease difficulty if score is low (≤20%)
    newDifficulty = Math.max(1, practiceProgress.currentAdaptiveDifficulty - 1);
  }
  
  // Update progress
  practiceProgress.currentAdaptiveDifficulty = newDifficulty;
  practiceProgress.questionsAttemptedInSession = [
    ...practiceProgress.questionsAttemptedInSession,
    ...attemptedQuestionIds
  ];
  practiceProgress.lastAttemptedAt = new Date();
  await practiceProgress.save();
  
  // Get next batch of questions
  const nextQuestionBatch = await getPracticeQuizBatch(
    studentId,
    questionBankId,
    newDifficulty,
    practiceProgress.questionsAttemptedInSession
  );
  
  // Return results and next batch
  res.status(200).json({
    success: true,
    data: {
      score: {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: scorePercentage
      },
      newDifficulty,
      nextBatch: nextQuestionBatch
    }
  });
});

module.exports = {
  getAvailableQuestionBanks,
  startOrResumePracticeSession,
  submitPracticeBatchAnswers
}; 