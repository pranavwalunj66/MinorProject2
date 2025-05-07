const TestRunner = require('./test-utils');
const runner = new TestRunner();

// Base URLs for API requests
const AUTH_URL = 'http://localhost:5000/api/auth';
const CLASS_URL = 'http://localhost:5000/api/classes';
const QUIZ_URL = 'http://localhost:5000/api/quizzes';

// Test data for teacher and student
const testTeacher = {
  name: 'Quiz Test Teacher',
  email: `quizteacher_${Date.now()}@test.com`,
  password: 'password123'
};

const testStudent = {
  name: 'Quiz Test Student',
  email: `quizstudent_${Date.now()}@test.com`,
  password: 'password123'
};

// Test data for class
const testClass = {
  className: `Quiz Test Class ${Date.now()}`
};

// Test data for quiz
const testQuiz = {
  title: `Test Quiz ${Date.now()}`,
  description: 'A quiz created for testing purposes',
  questions: [
    {
      questionText: 'What is 1+1?',
      options: [
        { optionText: '1', isCorrect: false },
        { optionText: '2', isCorrect: true },
        { optionText: '3', isCorrect: false },
        { optionText: '4', isCorrect: false }
      ],
      multipleCorrectAnswers: false
    },
    {
      questionText: 'Which of these are programming languages?',
      options: [
        { optionText: 'JavaScript', isCorrect: true },
        { optionText: 'Python', isCorrect: true },
        { optionText: 'Elephant', isCorrect: false },
        { optionText: 'Java', isCorrect: true }
      ],
      multipleCorrectAnswers: true
    }
  ]
};

// Store tokens and IDs for authenticated requests
let teacherToken = '';
let studentToken = '';
let classId = '';
let quizId = '';

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

// Test for creating a quiz - success case
runner.test('Create Quiz - Success', async () => {
  const response = await runner.request('POST', QUIZ_URL, testQuiz, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
  runner.assertTrue(response.body.data._id, 'Response should contain quiz ID');
  runner.assertEquals(response.body.data.title, testQuiz.title, 'Response should contain correct quiz title');
  runner.assertEquals(response.body.data.questions.length, 2, 'Quiz should have 2 questions');
  
  // Save quiz ID for future tests
  quizId = response.body.data._id;
});

// Test for creating a quiz - student attempt (should fail)
runner.test('Create Quiz - Student Attempt', async () => {
  const response = await runner.request('POST', QUIZ_URL, testQuiz, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
  runner.assertTrue(response.body.message.includes('denied'), 'Should return access denied message');
});

// Test for creating a quiz - missing required fields
runner.test('Create Quiz - Missing Required Fields', async () => {
  const incompleteQuiz = {
    title: 'Incomplete Quiz'
    // Missing questions array
  };
  
  const response = await runner.request('POST', QUIZ_URL, incompleteQuiz, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 400, 'Status code should be 400 Bad Request');
  runner.assertTrue(response.body.message.includes('question'), 'Should mention missing questions');
});

// Test for assigning a quiz to a class - success case
runner.test('Assign Quiz to Class - Success', async () => {
  const response = await runner.request('POST', `${QUIZ_URL}/${quizId}/assign/${classId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertTrue(response.body.message.includes('assigned'), 'Message should indicate successful assignment');
});

// Test for assigning a quiz to a class - student attempt (should fail)
runner.test('Assign Quiz to Class - Student Attempt', async () => {
  const response = await runner.request('POST', `${QUIZ_URL}/${quizId}/assign/${classId}`, null, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
  runner.assertTrue(response.body.message.includes('denied'), 'Should return access denied message');
});

// Test for assigning a quiz to a non-existent class
runner.test('Assign Quiz to Class - Non-existent Class', async () => {
  const fakeClassId = '507f1f77bcf86cd799439011'; // Fake ObjectId
  
  const response = await runner.request('POST', `${QUIZ_URL}/${quizId}/assign/${fakeClassId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 404, 'Status code should be 404 Not Found');
  runner.assertEquals(response.body.message, 'Class not found', 'Should return appropriate error');
});

// Test for assigning a non-existent quiz to a class
runner.test('Assign Quiz to Class - Non-existent Quiz', async () => {
  const fakeQuizId = '507f1f77bcf86cd799439011'; // Fake ObjectId
  
  const response = await runner.request('POST', `${QUIZ_URL}/${fakeQuizId}/assign/${classId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 404, 'Status code should be 404 Not Found');
  runner.assertEquals(response.body.message, 'Quiz not found', 'Should return appropriate error');
});

// Test for getting quizzes created by teacher
runner.test('Get Quizzes by Teacher', async () => {
  const response = await runner.request('GET', `${QUIZ_URL}/teacher`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertTrue(Array.isArray(response.body.data), 'Response data should be an array');
  
  // The created quiz should be in the response
  const foundQuiz = response.body.data.find(q => q._id === quizId);
  runner.assertTrue(foundQuiz, 'Created quiz should be in the list');
  runner.assertEquals(foundQuiz.title, testQuiz.title, 'Quiz title should match');
});

// Test for getting quizzes for a class - teacher view
runner.test('Get Quizzes for Class - Teacher View', async () => {
  const response = await runner.request('GET', `${QUIZ_URL}/class/${classId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertTrue(Array.isArray(response.body.data), 'Response data should be an array');
  
  // The assigned quiz should be in the response
  const foundQuiz = response.body.data.find(q => q._id === quizId);
  runner.assertTrue(foundQuiz, 'Assigned quiz should be in the list');
  runner.assertEquals(foundQuiz.title, testQuiz.title, 'Quiz title should match');
  
  // Teacher view should include questions
  runner.assertTrue(
    foundQuiz.questions !== undefined && Array.isArray(foundQuiz.questions),
    'Teacher view should include questions'
  );
});

// Test for getting quizzes for a class - student view
runner.test('Get Quizzes for Class - Student View', async () => {
  const response = await runner.request('GET', `${QUIZ_URL}/class/${classId}`, null, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertTrue(Array.isArray(response.body.data), 'Response data should be an array');
  
  // The assigned quiz should be in the response
  const foundQuiz = response.body.data.find(q => q._id === quizId);
  runner.assertTrue(foundQuiz, 'Assigned quiz should be in the list');
  runner.assertEquals(foundQuiz.title, testQuiz.title, 'Quiz title should match');
  
  // Student view should NOT include questions in the list view
  runner.assertTrue(foundQuiz.questions === undefined, 'Student view should not include questions in list view');
});

// Test for getting quiz details - teacher view
runner.test('Get Quiz Details - Teacher View', async () => {
  const response = await runner.request('GET', `${QUIZ_URL}/${quizId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertEquals(response.body.data._id, quizId, 'Quiz ID should match');
  runner.assertEquals(response.body.data.title, testQuiz.title, 'Quiz title should match');
  
  // Teacher should see the correct answers
  const question = response.body.data.questions[0];
  runner.assertTrue(question.options.some(opt => opt.isCorrect === true), 'Teacher should see correct answers');
});

// Test for getting quiz details - student view
runner.test('Get Quiz Details - Student View', async () => {
  const response = await runner.request('GET', `${QUIZ_URL}/${quizId}`, null, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body.success, 'Response should indicate success');
  runner.assertEquals(response.body.data._id, quizId, 'Quiz ID should match');
  runner.assertEquals(response.body.data.title, testQuiz.title, 'Quiz title should match');
  
  // Student should not see the correct answers
  const question = response.body.data.questions[0];
  runner.assertTrue(
    !question.options.some(opt => opt.hasOwnProperty('isCorrect')),
    'Student should not see correct answers'
  );
});

// Test for unauthorized access to quiz details
runner.test('Get Quiz Details - Unauthorized Access', async () => {
  // Create another teacher who doesn't own the quiz or class
  const anotherTeacher = {
    name: 'Another Teacher',
    email: `anotherteacher_${Date.now()}@test.com`,
    password: 'password123'
  };
  
  const registerResponse = await runner.request('POST', `${AUTH_URL}/teacher/register`, anotherTeacher);
  const anotherTeacherToken = registerResponse.body.token;
  
  // Try to access quiz details with the new teacher
  const response = await runner.request('GET', `${QUIZ_URL}/${quizId}`, null, {
    Authorization: `Bearer ${anotherTeacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
  runner.assertFalse(response.body.success, 'Response should indicate failure');
  runner.assertTrue(response.body.message.includes('authorized'), 'Should return unauthorized message');
});

// Export the test runner for the main test script
module.exports = runner; 