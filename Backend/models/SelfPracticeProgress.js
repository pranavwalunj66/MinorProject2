const mongoose = require('mongoose');

const selfPracticeProgressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  questionBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionBank',
    required: true
  },
  currentAdaptiveDifficulty: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  questionsAttemptedInSession: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionBank.questions'
  }],
  lastAttemptedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add compound index for efficient lookups
selfPracticeProgressSchema.index({ student: 1, questionBank: 1 }, { unique: true });

const SelfPracticeProgress = mongoose.model('SelfPracticeProgress', selfPracticeProgressSchema);

module.exports = SelfPracticeProgress; 