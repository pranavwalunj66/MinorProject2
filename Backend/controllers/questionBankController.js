const QuestionBank = require('../models/QuestionBank');
const Class = require('../models/Class');

// Create a new question bank
exports.createQuestionBank = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question is required' });
    }

    // Validate questions have valid difficulty levels
    for (const question of questions) {
      if (!question.difficultyLevel || question.difficultyLevel < 1 || question.difficultyLevel > 5) {
        return res.status(400).json({ message: 'Each question must have a difficulty level between 1 and 5' });
      }
    }

    // Create new question bank
    const questionBank = new QuestionBank({
      title,
      description,
      questions,
      createdBy: req.user.id
    });

    // Save question bank
    await questionBank.save();

    res.status(201).json({
      success: true,
      data: questionBank
    });

  } catch (error) {
    console.error('Error creating question bank:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question bank',
      error: error.message
    });
  }
};

// Get all question banks created by the teacher
exports.getTeacherQuestionBanks = async (req, res) => {
  try {
    const questionBanks = await QuestionBank.find({ createdBy: req.user.id })
      .select('title description createdAt assignedClasses')
      .populate('assignedClasses', 'className');

    res.status(200).json({
      success: true,
      count: questionBanks.length,
      data: questionBanks
    });

  } catch (error) {
    console.error('Error fetching question banks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question banks',
      error: error.message
    });
  }
};

// Get a question bank by ID (for a teacher)
exports.getQuestionBankById = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.questionBankId);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Check if the question bank belongs to the teacher
    if (questionBank.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this question bank'
      });
    }

    res.status(200).json({
      success: true,
      data: questionBank
    });

  } catch (error) {
    console.error('Error fetching question bank:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question bank',
      error: error.message
    });
  }
};

// Update a question bank
exports.updateQuestionBank = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    
    if (questions) {
      // Validate questions have valid difficulty levels
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'At least one question is required' });
      }

      for (const question of questions) {
        if (!question.difficultyLevel || question.difficultyLevel < 1 || question.difficultyLevel > 5) {
          return res.status(400).json({ message: 'Each question must have a difficulty level between 1 and 5' });
        }
      }
      
      updates.questions = questions;
    }

    // Find question bank and update it
    const questionBank = await QuestionBank.findById(req.params.questionBankId);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Check if the question bank belongs to the teacher
    if (questionBank.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this question bank'
      });
    }

    const updatedQuestionBank = await QuestionBank.findByIdAndUpdate(
      req.params.questionBankId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedQuestionBank
    });

  } catch (error) {
    console.error('Error updating question bank:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question bank',
      error: error.message
    });
  }
};

// Delete a question bank
exports.deleteQuestionBank = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.questionBankId);

    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    // Check if the question bank belongs to the teacher
    if (questionBank.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this question bank'
      });
    }

    await QuestionBank.findByIdAndDelete(req.params.questionBankId);

    res.status(200).json({
      success: true,
      message: 'Question bank deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting question bank:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question bank',
      error: error.message
    });
  }
};

// Assign a question bank to a class
exports.assignQuestionBankToClass = async (req, res) => {
  try {
    const { questionBankId, classId } = req.params;

    // Check if the question bank exists and belongs to the teacher
    const questionBank = await QuestionBank.findById(questionBankId);
    if (!questionBank) {
      return res.status(404).json({
        success: false,
        message: 'Question bank not found'
      });
    }

    if (questionBank.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to assign this question bank'
      });
    }

    // Check if the class exists and belongs to the teacher
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (classObj.teacher.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to assign question banks to this class'
      });
    }

    // Check if the question bank is already assigned to the class
    if (questionBank.assignedClasses.includes(classId)) {
      return res.status(400).json({
        success: false,
        message: 'Question bank is already assigned to this class'
      });
    }

    // Add the class to the question bank's assignedClasses
    questionBank.assignedClasses.push(classId);
    await questionBank.save();

    res.status(200).json({
      success: true,
      message: 'Question bank assigned to class successfully',
      data: questionBank
    });

  } catch (error) {
    console.error('Error assigning question bank to class:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign question bank to class',
      error: error.message
    });
  }
}; 