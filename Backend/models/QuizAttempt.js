const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId
      },
      selectedOptionIds: [
        {
          type: mongoose.Schema.Types.ObjectId
        }
      ]
    }
  ],
  score: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  classContext: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }
});

// Create compound index for optimizing leaderboard queries
quizAttemptSchema.index({ quiz: 1, classContext: 1, score: -1, submittedAt: 1 });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = QuizAttempt; 