const TestRunner = require('./test-utils');
const runner = new TestRunner();

// Base URLs for API requests
const AUTH_URL = 'http://localhost:5000/api/auth';
const CLASS_URL = 'http://localhost:5000/api/classes';
const QUESTION_BANK_URL = 'http://localhost:5000/api/question-banks';

// Test data for teacher and student
const testTeacher = {
  name: 'QB Test Teacher',
  email: `qbteacher_${Date.now()}@test.com`,
  password: 'password123'
};

const testStudent = {
  name: 'QB Test Student',
  email: `qbstudent_${Date.now()}@test.com`,
  password: 'password123'
};

// Test data for class
const testClass = {
  className: `QB Test Class ${Date.now()}`
};

// Test data for question bank
const testQuestionBank = {
  title: `Test Question Bank ${Date.now()}`,
  description: 'A question bank created for testing purposes',
  questions: [
    {
      questionText: 'What is 2+2?',
      options: [
        { optionText: '3', isCorrect: false },
        { optionText: '4', isCorrect: true },
        { optionText: '5', isCorrect: false },
        { optionText: '6', isCorrect: false }
      ],
      multipleCorrectAnswers: false,
      difficultyLevel: 1
    },
    {
      questionText: 'Which of these are prime numbers?',
      options: [
        { optionText: '2', isCorrect: true },
        { optionText: '3', isCorrect: true },
        { optionText: '4', isCorrect: false },
        { optionText: '5', isCorrect: true }
      ],
      multipleCorrectAnswers: true,
      difficultyLevel: 3
    },
    {
      questionText: 'Solve for x: 2x + 5 = 15',
      options: [
        { optionText: '4', isCorrect: false },
        { optionText: '5', isCorrect: true },
        { optionText: '6', isCorrect: false },
        { optionText: '7', isCorrect: false }
      ],
      multipleCorrectAnswers: false,
      difficultyLevel: 2
    }
  ]
};

// Store tokens and IDs for authenticated requests
let teacherToken = '';
let studentToken = '';
let classId = '';
let questionBankId = '';

// Setup: Register a teacher and a student, create a class, and enroll the student
runner.test('Setup - Register Teacher', async () => {
  const response = await runner.request('POST', `${AUTH_URL}/teacher/register`, testTeacher);
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
  runner.assertTrue(response.body.token, 'JWT token should be returned');
  
  // Save token for future authenticated requests
  teacherToken = response.body.token;
});

runner.test('Setup - Register Student', async () => {
  const response = await runner.request('POST', `${AUTH_URL}/student/register`, testStudent);
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
  runner.assertTrue(response.body.token, 'JWT token should be returned');
  
  // Save token for future authenticated requests
  studentToken = response.body.token;
});

runner.test('Setup - Create Class', async () => {
  const response = await runner.request('POST', CLASS_URL, testClass, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
  runner.assertTrue(response.body._id, 'Response should contain class ID');
  
  // Save class ID and enrollment key for future tests
  classId = response.body._id;
  const enrollmentKey = response.body.enrollmentKey;
  
  // Join the class as a student
  const joinResponse = await runner.request('POST', `${CLASS_URL}/join`, { enrollmentKey }, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(joinResponse.statusCode, 200, 'Status code should be 200 OK');
});

// Test for creating a question bank - success case
runner.test('Create Question Bank - Success', async () => {
  const response = await runner.request('POST', QUESTION_BANK_URL, testQuestionBank, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertTrue(response.body.data._id, 'Response should contain question bank ID');
  runner.assertEquals(response.body.data.title, testQuestionBank.title, 'Response should contain correct question bank title');
  runner.assertEquals(response.body.data.questions.length, 3, 'Question bank should have 3 questions');
  
  // Save question bank ID for future tests
  questionBankId = response.body.data._id;
});

// Test for creating a question bank - student attempt (should fail)
runner.test('Create Question Bank - Student Attempt', async () => {
  const response = await runner.request('POST', QUESTION_BANK_URL, testQuestionBank, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
  runner.assertTrue(response.body.message && response.body.message.toLowerCase().includes('denied') || 
                    response.body.message && response.body.message.toLowerCase().includes('authorized'), 
                    'Should return access denied message');
});

// Test for creating a question bank - missing required fields
runner.test('Create Question Bank - Missing Required Fields', async () => {
  const incompleteQuestionBank = {
    title: 'Incomplete Question Bank'
    // Missing questions array
  };
  
  const response = await runner.request('POST', QUESTION_BANK_URL, incompleteQuestionBank, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 400, 'Status code should be 400 Bad Request');
  runner.assertTrue(response.body.message.includes('question'), 'Should mention missing questions');
});

// Test for creating a question bank - invalid difficulty level
runner.test('Create Question Bank - Invalid Difficulty Level', async () => {
  const invalidQuestionBank = {
    title: 'Invalid Question Bank',
    questions: [
      {
        questionText: 'Invalid question',
        options: [
          { optionText: 'Option 1', isCorrect: true },
          { optionText: 'Option 2', isCorrect: false }
        ],
        multipleCorrectAnswers: false,
        difficultyLevel: 6 // Invalid, should be 1-5
      }
    ]
  };
  
  const response = await runner.request('POST', QUESTION_BANK_URL, invalidQuestionBank, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 400, 'Status code should be 400 Bad Request');
  runner.assertTrue(response.body.message.includes('difficulty'), 'Should mention invalid difficulty level');
});

// Test for getting question banks created by teacher
runner.test('Get Question Banks by Teacher', async () => {
  const response = await runner.request('GET', `${QUESTION_BANK_URL}/teacher`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertTrue(Array.isArray(response.body.data), 'Response data should be an array');
  
  // The created question bank should be in the response
  const foundQuestionBank = response.body.data.find(qb => qb._id === questionBankId);
  runner.assertTrue(foundQuestionBank, 'Created question bank should be in the list');
  runner.assertEquals(foundQuestionBank.title, testQuestionBank.title, 'Question bank title should match');
});

// Test for getting a specific question bank by ID
runner.test('Get Question Bank by ID', async () => {
  const response = await runner.request('GET', `${QUESTION_BANK_URL}/${questionBankId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertEquals(response.body.data._id, questionBankId, 'Response should contain correct question bank ID');
  runner.assertEquals(response.body.data.title, testQuestionBank.title, 'Response should contain correct question bank title');
  runner.assertEquals(response.body.data.questions.length, 3, 'Question bank should have 3 questions');
});

// Test for getting a non-existent question bank
runner.test('Get Question Bank - Non-existent ID', async () => {
  const fakeId = '507f1f77bcf86cd799439011'; // Fake ObjectId
  
  const response = await runner.request('GET', `${QUESTION_BANK_URL}/${fakeId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 404, 'Status code should be 404 Not Found');
  runner.assertFalse(response.body.success, 'Response should indicate failure');
  runner.assertTrue(response.body.message.includes('not found'), 'Should return not found message');
});

// Test for updating a question bank
runner.test('Update Question Bank', async () => {
  const updates = {
    title: `Updated Question Bank ${Date.now()}`,
    description: 'This question bank has been updated'
  };
  
  const response = await runner.request('PUT', `${QUESTION_BANK_URL}/${questionBankId}`, updates, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertEquals(response.body.data.title, updates.title, 'Title should be updated');
  runner.assertEquals(response.body.data.description, updates.description, 'Description should be updated');
});

// Test for updating a question bank with new questions
runner.test('Update Question Bank - New Questions', async () => {
  const updates = {
    questions: [
      {
        questionText: 'What is the capital of France?',
        options: [
          { optionText: 'London', isCorrect: false },
          { optionText: 'Paris', isCorrect: true },
          { optionText: 'Berlin', isCorrect: false },
          { optionText: 'Madrid', isCorrect: false }
        ],
        multipleCorrectAnswers: false,
        difficultyLevel: 1
      },
      {
        questionText: 'Which planets are in our solar system?',
        options: [
          { optionText: 'Earth', isCorrect: true },
          { optionText: 'Mars', isCorrect: true },
          { optionText: 'Venus', isCorrect: true },
          { optionText: 'Alpha Centauri', isCorrect: false }
        ],
        multipleCorrectAnswers: true,
        difficultyLevel: 2
      }
    ]
  };
  
  const response = await runner.request('PUT', `${QUESTION_BANK_URL}/${questionBankId}`, updates, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertEquals(response.body.data.questions.length, 2, 'Question bank should now have 2 questions');
});

// Test for assigning a question bank to a class - success case
runner.test('Assign Question Bank to Class - Success', async () => {
  const response = await runner.request('POST', `${QUESTION_BANK_URL}/${questionBankId}/assign/${classId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertTrue(response.body.message.includes('assigned'), 'Message should indicate successful assignment');
  runner.assertTrue(response.body.data.assignedClasses.includes(classId), 'Class ID should be in assignedClasses array');
});

// Test for assigning a question bank to a class - student attempt (should fail)
runner.test('Assign Question Bank to Class - Student Attempt', async () => {
  const response = await runner.request('POST', `${QUESTION_BANK_URL}/${questionBankId}/assign/${classId}`, null, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
  runner.assertTrue(response.body.message && response.body.message.toLowerCase().includes('denied') || 
                    response.body.message && response.body.message.toLowerCase().includes('authorized'), 
                    'Should return access denied message');
});

// Test for assigning a question bank to a non-existent class
runner.test('Assign Question Bank to Class - Non-existent Class', async () => {
  const fakeClassId = '507f1f77bcf86cd799439011'; // Fake ObjectId
  
  const response = await runner.request('POST', `${QUESTION_BANK_URL}/${questionBankId}/assign/${fakeClassId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 404, 'Status code should be 404 Not Found');
  runner.assertFalse(response.body.success, 'Response should indicate failure');
  runner.assertTrue(response.body.message.includes('not found'), 'Should mention class not found');
});

// Test for deleting a question bank
runner.test('Delete Question Bank', async () => {
  const response = await runner.request('DELETE', `${QUESTION_BANK_URL}/${questionBankId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertTrue(response.body.message.includes('deleted'), 'Message should indicate successful deletion');
  
  // Verify the question bank is really deleted
  const verifyResponse = await runner.request('GET', `${QUESTION_BANK_URL}/${questionBankId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(verifyResponse.statusCode, 404, 'Status code should be 404 Not Found after deletion');
});

// Run the tests
if (require.main === module) {
  runner.runTests();
}

// Export the runner for use with the main test runner
module.exports = runner; 