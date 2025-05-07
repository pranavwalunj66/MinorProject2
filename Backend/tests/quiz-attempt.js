const TestRunner = require('./test-utils');
const runner = new TestRunner();

// Base URLs for API requests - use environment variable or default
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const AUTH_URL = `${API_BASE_URL}/auth`;
const CLASS_URL = `${API_BASE_URL}/classes`;
const QUIZ_URL = `${API_BASE_URL}/quizzes`;
const ATTEMPT_URL = `${API_BASE_URL}/attempts`;

// Test data for teacher and student
const testTeacher = {
  name: 'Attempt Test Teacher',
  email: `attemptteacher_${Date.now()}@test.com`,
  password: 'password123'
};

const testStudent = {
  name: 'Attempt Test Student',
  email: `attemptstudent_${Date.now()}@test.com`,
  password: 'password123'
};

// Test data for class
const testClass = {
  className: `Attempt Test Class ${Date.now()}`
};

// Test data for quiz
const testQuiz = {
  title: `Attempt Test Quiz ${Date.now()}`,
  description: 'A quiz created for testing quiz attempts',
  questions: [
    {
      questionText: 'What is 2+2?',
      options: [
        { optionText: '3', isCorrect: false },
        { optionText: '4', isCorrect: true },
        { optionText: '5', isCorrect: false },
        { optionText: '6', isCorrect: false }
      ],
      multipleCorrectAnswers: false
    },
    {
      questionText: 'Which are primary colors?',
      options: [
        { optionText: 'Red', isCorrect: true },
        { optionText: 'Green', isCorrect: false },
        { optionText: 'Blue', isCorrect: true },
        { optionText: 'Yellow', isCorrect: true }
      ],
      multipleCorrectAnswers: true
    }
  ]
};

// Storage for IDs and tokens
let teacherToken = '';
let studentToken = '';
let classId = '';
let quizId = '';
let questionIds = [];
let optionIds = {};

// Setup: Register a teacher and a student, create a class, a quiz, and enroll the student
runner.test('Setup - Register Teacher', async () => {
  try {
    const response = await runner.request('POST', `${AUTH_URL}/teacher/register`, testTeacher);
    
    runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
    runner.assertTrue(response.body.token, 'JWT token should be returned');
    
    teacherToken = response.body.token;
  } catch (error) {
    console.error('Error in teacher registration:', error.message);
    throw error;
  }
});

runner.test('Setup - Register Student', async () => {
  try {
    const response = await runner.request('POST', `${AUTH_URL}/student/register`, testStudent);
    
    runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
    runner.assertTrue(response.body.token, 'JWT token should be returned');
    
    studentToken = response.body.token;
  } catch (error) {
    console.error('Error in student registration:', error.message);
    throw error;
  }
});

runner.test('Setup - Create Class', async () => {
  try {
    const response = await runner.request('POST', CLASS_URL, testClass, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
    runner.assertTrue(response.body._id, 'Response should contain class ID');
    
    classId = response.body._id;
    const enrollmentKey = response.body.enrollmentKey;
    
    // Join the class as a student
    const joinResponse = await runner.request('POST', `${CLASS_URL}/join`, { enrollmentKey }, {
      Authorization: `Bearer ${studentToken}`
    });
    
    runner.assertEquals(joinResponse.statusCode, 200, 'Status code should be 200 OK');
  } catch (error) {
    console.error('Error in class creation/joining:', error.message);
    throw error;
  }
});

runner.test('Setup - Create Quiz', async () => {
  try {
    const response = await runner.request('POST', QUIZ_URL, testQuiz, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
    runner.assertTrue(response.body.data._id, 'Response should contain quiz ID');
    
    quizId = response.body.data._id;
    
    // Store question IDs and option IDs for later use in quiz attempts
    if (response.body.data.questions && Array.isArray(response.body.data.questions)) {
      questionIds = response.body.data.questions.map(q => q._id);
      
      // Ensure optionIds is properly initialized
      response.body.data.questions.forEach((question, qIndex) => {
        if (question.options && Array.isArray(question.options)) {
          optionIds[qIndex] = question.options.map(opt => opt._id);
        } else {
          optionIds[qIndex] = []; // Ensure empty array if no options
        }
      });
    }
    
    console.log('Quiz created with ID:', quizId);
    console.log('Questions:', questionIds);
    console.log('Option IDs structure:', JSON.stringify(optionIds));
  } catch (error) {
    console.error('Error in quiz creation:', error.message);
    throw error;
  }
});

runner.test('Setup - Assign Quiz to Class', async () => {
  try {
    const response = await runner.request('POST', `${QUIZ_URL}/${quizId}/assign/${classId}`, null, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
    runner.assertTrue(response.body.success, 'Response should indicate success');
  } catch (error) {
    console.error('Error in quiz assignment:', error.message);
    throw error;
  }
});

// Test for submitting a quiz attempt - success case with some correct answers
runner.test('Submit Quiz Attempt - Success', async () => {
  try {
    // Defensive check to ensure we have all the data we need
    if (!questionIds.length || !optionIds[0] || !optionIds[1]) {
      console.error('Missing question or option IDs, cannot proceed with test');
      throw new Error('Missing question or option IDs for quiz attempt');
    }
    
    // Prepare the student's answers
    // For question 1: Select the correct answer (option index 1 which is "4")
    // For question 2: Select one correct and one incorrect answer (partial credit)
    const answers = [
      {
        questionId: questionIds[0],
        selectedOptionIds: [optionIds[0][1]] // Selecting "4" which is correct
      },
      {
        questionId: questionIds[1],
        selectedOptionIds: [optionIds[1][0], optionIds[1][1]] // Selecting "Red" (correct) and "Green" (incorrect)
      }
    ];

    console.log('Submitting quiz attempt with answers:', JSON.stringify(answers, null, 2));

    const response = await runner.request('POST', `${ATTEMPT_URL}/submit`, {
      quizId,
      answers,
      classId
    }, {
      Authorization: `Bearer ${studentToken}`
    });

    runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
    runner.assertTrue(response.body.success, 'Response should indicate success');
    runner.assertTrue(response.body.data.score !== undefined, 'Response should include score');
    runner.assertTrue(response.body.data.totalMarks !== undefined, 'Response should include total marks');
    runner.assertTrue(response.body.data.percentage !== undefined, 'Response should include percentage');
    
    // In this case, the student should get 1 out of 2 questions correct (50%)
    runner.assertEquals(response.body.data.score, 1, 'Score should be 1 out of 2');
    runner.assertEquals(response.body.data.totalMarks, 2, 'Total marks should be 2');
    runner.assertEquals(response.body.data.percentage, 50, 'Percentage should be 50%');
  } catch (error) {
    console.error('Error in quiz attempt submission:', error.message);
    throw error;
  }
});

// Test for submitting a quiz attempt - attempt already exists
runner.test('Submit Quiz Attempt - Already Attempted', async () => {
  try {
    // Skip test if we don't have the required IDs
    if (!questionIds.length || !optionIds[0] || !optionIds[1]) {
      console.error('Missing question or option IDs, cannot proceed with test');
      throw new Error('Missing question or option IDs for quiz attempt');
    }
    
    // Try to submit the same quiz again
    const answers = [
      {
        questionId: questionIds[0],
        selectedOptionIds: [optionIds[0][1]]
      },
      {
        questionId: questionIds[1],
        selectedOptionIds: [optionIds[1][0], optionIds[1][2]]
      }
    ];

    const response = await runner.request('POST', `${ATTEMPT_URL}/submit`, {
      quizId,
      answers,
      classId
    }, {
      Authorization: `Bearer ${studentToken}`
    });

    runner.assertEquals(response.statusCode, 400, 'Status code should be 400 Bad Request');
    runner.assertFalse(response.body.success, 'Response should indicate failure');
    runner.assertTrue(response.body.message.includes('already attempted'), 'Error should mention already attempted');
  } catch (error) {
    console.error('Error in already attempted test:', error.message);
    throw error;
  }
});

// Test for getting student results
runner.test('Get Student Results', async () => {
  try {
    const response = await runner.request('GET', `${ATTEMPT_URL}/student`, null, {
      Authorization: `Bearer ${studentToken}`
    });

    runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
    runner.assertTrue(response.body.success, 'Response should indicate success');
    runner.assertTrue(Array.isArray(response.body.data), 'Response data should be an array');
    runner.assertTrue(response.body.data.length > 0, 'Student should have at least one quiz attempt');
    
    // Verify the attempt has the correct quiz ID
    const attempt = response.body.data[0];
    runner.assertEquals(attempt.quiz._id, quizId, 'Attempt should reference the correct quiz');
    runner.assertEquals(attempt.classContext._id, classId, 'Attempt should reference the correct class');
    runner.assertEquals(attempt.score, 1, 'Score should match the expected value');
  } catch (error) {
    console.error('Error in getting student results:', error.message);
    throw error;
  }
});

// Test for getting student results - teacher attempt (should fail)
runner.test('Get Student Results - Teacher Attempt', async () => {
  try {
    const response = await runner.request('GET', `${ATTEMPT_URL}/student`, null, {
      Authorization: `Bearer ${teacherToken}`
    });

    runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
    runner.assertFalse(response.body.success, 'Response should indicate failure');
  } catch (error) {
    console.error('Error in teacher attempt to get student results:', error.message);
    throw error;
  }
});

// Test for getting quiz results for a teacher
runner.test('Get Quiz Results for Teacher', async () => {
  try {
    const response = await runner.request('GET', `${ATTEMPT_URL}/teacher/${quizId}/class/${classId}`, null, {
      Authorization: `Bearer ${teacherToken}`
    });

    runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
    runner.assertTrue(response.body.success, 'Response should indicate success');
    runner.assertTrue(response.body.count > 0, 'Should have at least one attempt');
    runner.assertTrue(Array.isArray(response.body.data), 'Response data should be an array');
    
    // Verify the teacher can see student information
    const attempt = response.body.data[0];
    runner.assertTrue(attempt.student, 'Attempt should include student information');
    runner.assertEquals(attempt.student.name, testStudent.name, 'Student name should match');
    runner.assertEquals(attempt.score, 1, 'Score should match the expected value');
  } catch (error) {
    console.error('Error in getting teacher quiz results:', error.message);
    throw error;
  }
});

// Test for getting quiz results for a teacher - student attempt (should fail)
runner.test('Get Quiz Results for Teacher - Student Attempt', async () => {
  try {
    const response = await runner.request('GET', `${ATTEMPT_URL}/teacher/${quizId}/class/${classId}`, null, {
      Authorization: `Bearer ${studentToken}`
    });

    runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
    runner.assertFalse(response.body.success, 'Response should indicate failure');
  } catch (error) {
    console.error('Error in student attempt to get teacher results:', error.message);
    throw error;
  }
});

// Test for getting quiz results for invalid quiz ID
runner.test('Get Quiz Results - Invalid Quiz ID', async () => {
  try {
    const fakeQuizId = '507f1f77bcf86cd799439011'; // Fake ObjectId
    
    const response = await runner.request('GET', `${ATTEMPT_URL}/teacher/${fakeQuizId}/class/${classId}`, null, {
      Authorization: `Bearer ${teacherToken}`
    });

    runner.assertEquals(response.statusCode, 404, 'Status code should be 404 Not Found');
    runner.assertFalse(response.body.success, 'Response should indicate failure');
  } catch (error) {
    console.error('Error in invalid quiz ID test:', error.message);
    throw error;
  }
});

module.exports = runner; 