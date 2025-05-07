const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: [true, 'Option text is required']
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required']
  },
  options: [optionSchema],
  multipleCorrectAnswers: {
    type: Boolean,
    default: false
  },
  difficultyLevel: {
    type: Number,
    required: [true, 'Difficulty level is required'],
    min: 1,
    max: 5
  }
});

const questionBankSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Question bank title is required']
  },
  description: {
    type: String
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function(questions) {
        return questions.length > 0;
      },
      message: 'At least one question is required for a question bank'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  assignedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }]
}, {
  timestamps: true
});

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);

module.exports = QuestionBank; 