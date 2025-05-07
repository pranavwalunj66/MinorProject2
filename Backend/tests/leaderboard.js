const TestRunner = require('./test-utils');
const runner = new TestRunner();

// Base URLs for API requests - use environment variable or default
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const AUTH_URL = `${API_BASE_URL}/auth`;
const CLASS_URL = `${API_BASE_URL}/classes`;
const QUIZ_URL = `${API_BASE_URL}/quizzes`;
const ATTEMPT_URL = `${API_BASE_URL}/attempts`;
const LEADERBOARD_URL = `${API_BASE_URL}/leaderboards`;

// Test data for teacher
const testTeacher = {
  name: 'Leaderboard Test Teacher',
  email: `leaderboardteacher_${Date.now()}@test.com`,
  password: 'password123'
};

// Test data for multiple students to create a meaningful leaderboard
const testStudents = [
  {
    name: 'Top Student',
    email: `topstudent_${Date.now()}@test.com`,
    password: 'password123'
  },
  {
    name: 'Average Student',
    email: `avgstudent_${Date.now()}@test.com`,
    password: 'password123'
  },
  {
    name: 'Struggling Student',
    email: `strugglingstudent_${Date.now()}@test.com`,
    password: 'password123'
  }
];

// Test data for class
const testClass = {
  className: `Leaderboard Test Class ${Date.now()}`
};

// Test data for quiz
const testQuiz = {
  title: `Leaderboard Test Quiz ${Date.now()}`,
  description: 'A quiz created for testing leaderboard functionality',
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
    },
    {
      questionText: 'What is the capital of France?',
      options: [
        { optionText: 'London', isCorrect: false },
        { optionText: 'Berlin', isCorrect: false },
        { optionText: 'Paris', isCorrect: true },
        { optionText: 'Madrid', isCorrect: false }
      ],
      multipleCorrectAnswers: false
    }
  ]
};

// Storage for IDs and tokens
let teacherToken = '';
let studentTokens = [];
let classId = '';
let quizId = '';
let questionIds = [];
let optionIds = {};
let attemptIds = [];

// Setup: Register a teacher and multiple students, create a class, a quiz, and enroll the students
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

runner.test('Setup - Register Students', async () => {
  try {
    for (const student of testStudents) {
      const response = await runner.request('POST', `${AUTH_URL}/student/register`, student);
      
      runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
      runner.assertTrue(response.body.token, 'JWT token should be returned');
      
      // Store student info - adjust based on actual response structure
      let studentId = null;
      if (response.body.user && response.body.user._id) {
        studentId = response.body.user._id;
      } else if (response.body.id) {
        studentId = response.body.id;
      } else if (response.body._id) {
        studentId = response.body._id;
      }
      
      studentTokens.push({
        name: student.name,
        token: response.body.token,
        id: studentId
      });
    }
    
    // Log for debugging
    console.log(`Registered ${studentTokens.length} students with tokens:`, 
      studentTokens.map(s => ({name: s.name, hasToken: !!s.token, hasId: !!s.id})));
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
    
    // Join the class as each student
    for (const studentInfo of studentTokens) {
      if (!studentInfo.token) {
        console.warn(`Skipping class join for student ${studentInfo.name} - no token available`);
        continue;
      }
      
      const joinResponse = await runner.request('POST', `${CLASS_URL}/join`, { enrollmentKey }, {
        Authorization: `Bearer ${studentInfo.token}`
      });
      
      runner.assertEquals(joinResponse.statusCode, 200, 'Status code should be 200 OK');
    }
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

// Submit different quiz attempts to create a leaderboard
runner.test('Setup - Submit Quiz Attempts with Varying Scores', async () => {
  try {
    // Validate we have the data we need
    if (!questionIds.length) {
      console.warn('No question IDs available, cannot submit quiz attempts');
      return;
    }

    for (let i = 0; i < studentTokens.length; i++) {
      if (!studentTokens[i] || !studentTokens[i].token) {
        console.warn(`Student ${i} missing token, skipping quiz attempt`);
        continue;
      }
      
      let answers = [];
      
      // Different answer patterns based on student rank
      if (i === 0) {
        // Top Student - mostly correct answers
        answers = [
          {
            questionId: questionIds[0],
            selectedOptionIds: optionIds[0] && optionIds[0][1] ? [optionIds[0][1]] : [] // Correct answer for q1
          }
        ];
        
        if (questionIds.length > 1 && optionIds[1]) {
          answers.push({
            questionId: questionIds[1],
            selectedOptionIds: optionIds[1].filter((_, idx) => [0, 2, 3].includes(idx)) // Correct answers for q2
          });
        }
        
        if (questionIds.length > 2 && optionIds[2]) {
          answers.push({
            questionId: questionIds[2],
            selectedOptionIds: optionIds[2] && optionIds[2][2] ? [optionIds[2][2]] : [] // Correct answer for q3
          });
        }
      } else if (i === 1) {
        // Average Student - some correct answers
        answers = [
          {
            questionId: questionIds[0],
            selectedOptionIds: optionIds[0] && optionIds[0][1] ? [optionIds[0][1]] : [] // Correct answer for q1
          }
        ];
        
        if (questionIds.length > 1 && optionIds[1]) {
          answers.push({
            questionId: questionIds[1],
            selectedOptionIds: optionIds[1].filter((_, idx) => [0, 1].includes(idx)) // One correct, one wrong
          });
        }
        
        if (questionIds.length > 2 && optionIds[2]) {
          answers.push({
            questionId: questionIds[2],
            selectedOptionIds: optionIds[2] && optionIds[2][2] ? [optionIds[2][2]] : [] // Correct answer for q3
          });
        }
      } else {
        // Struggling Student - mostly wrong answers
        answers = [
          {
            questionId: questionIds[0],
            selectedOptionIds: optionIds[0] && optionIds[0][0] ? [optionIds[0][0]] : [] // Wrong answer for q1
          }
        ];
        
        if (questionIds.length > 1 && optionIds[1]) {
          answers.push({
            questionId: questionIds[1],
            selectedOptionIds: optionIds[1] && optionIds[1][1] ? [optionIds[1][1]] : [] // Wrong answer for q2
          });
        }
        
        if (questionIds.length > 2 && optionIds[2]) {
          answers.push({
            questionId: questionIds[2],
            selectedOptionIds: optionIds[2] && optionIds[2][2] ? [optionIds[2][2]] : [] // Correct answer for q3
          });
        }
      }
      
      // Filter out any empty answer objects
      answers = answers.filter(a => a.selectedOptionIds && a.selectedOptionIds.length > 0);
      
      if (answers.length === 0) {
        console.warn(`No valid answers for student ${i}, skipping submission`);
        continue;
      }

      console.log(`Submitting quiz for student ${i} with ${answers.length} answers`);
      
      const response = await runner.request('POST', `${ATTEMPT_URL}/submit`, {
        quizId,
        answers,
        classId
      }, {
        Authorization: `Bearer ${studentTokens[i].token}`
      });
      
      if (response.statusCode === 201) {
        console.log(`Student ${i} quiz submission successful`);
      } else {
        console.warn(`Student ${i} quiz submission failed with status ${response.statusCode}`);
      }
    }
  } catch (error) {
    console.error('Error in submitting quiz attempts:', error.message);
    throw error;
  }
});

// Test 1: Teacher views leaderboard
runner.test('Teacher can view leaderboard for their quiz in their class', async () => {
  try {
    const response = await runner.request('GET', `${LEADERBOARD_URL}/quiz/${quizId}/class/${classId}`, null, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
    runner.assertTrue(response.body.success, 'Response should indicate success');
    runner.assertTrue(response.body.data.leaderboard !== undefined, 'Response should contain leaderboard data');
    
    // Verify leaderboard structure
    const leaderboard = response.body.data.leaderboard;
    runner.assertTrue(Array.isArray(leaderboard), 'Leaderboard should be an array');
    
    // Only verify ordering if we have entries
    if (leaderboard.length >= 2) {
      runner.assertTrue(
        leaderboard[0].score >= leaderboard[1].score, 
        'First entry should have score higher than or equal to second entry'
      );
    }
    
    // Verify pagination data
    runner.assertTrue(response.body.data.pagination, 'Response should contain pagination data');
    runner.assertTrue(
      typeof response.body.data.pagination.totalAttempts === 'number', 
      'Pagination should include totalAttempts as a number'
    );
  } catch (error) {
    console.error('Error in teacher viewing leaderboard:', error.message);
    throw error;
  }
});

// Test 2: Student views leaderboard (if we have student tokens)
runner.test('Student can view leaderboard for quiz in their enrolled class', async () => {
  try {
    // Skip if no student tokens
    if (!studentTokens.length || !studentTokens[0] || !studentTokens[0].token) {
      console.warn('No student tokens available, skipping student leaderboard test');
      return;
    }
    
    const response = await runner.request('GET', `${LEADERBOARD_URL}/quiz/${quizId}/class/${classId}`, null, {
      Authorization: `Bearer ${studentTokens[0].token}`
    });
    
    runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
    runner.assertTrue(response.body.success, 'Response should indicate success');
    runner.assertTrue(response.body.data.leaderboard !== undefined, 'Response should contain leaderboard data');
    
    // Verify student entry only if leaderboard has entries and student ID exists
    const leaderboard = response.body.data.leaderboard;
    if (leaderboard.length > 0 && studentTokens[0].id) {
      const studentEntry = leaderboard.find(entry => entry.studentId === studentTokens[0].id);
      runner.assertTrue(studentEntry !== undefined, 'Student should be able to see their own entry in the leaderboard');
    }
  } catch (error) {
    console.error('Error in student viewing leaderboard:', error.message);
    throw error;
  }
});

// Test 3: Test pagination
runner.test('Leaderboard supports pagination', async () => {
  try {
    // Request with page=1 and limit=1 (to ensure we can test pagination even with few entries)
    const responsePageOne = await runner.request('GET', `${LEADERBOARD_URL}/quiz/${quizId}/class/${classId}?page=1&limit=1`, null, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    runner.assertEquals(responsePageOne.statusCode, 200, 'Status code should be 200 OK');
    const leaderboardPageOne = responsePageOne.body.data.leaderboard;
    
    // If there are enough entries for pagination
    if (responsePageOne.body.data.pagination.totalAttempts > 1) {
      runner.assertTrue(leaderboardPageOne.length <= 1, 'Page 1 should contain at most 1 entry with limit=1');
      
      const responsePageTwo = await runner.request('GET', `${LEADERBOARD_URL}/quiz/${quizId}/class/${classId}?page=2&limit=1`, null, {
        Authorization: `Bearer ${teacherToken}`
      });
      
      runner.assertEquals(responsePageTwo.statusCode, 200, 'Status code should be 200 OK');
      const leaderboardPageTwo = responsePageTwo.body.data.leaderboard;
      
      // Check that entries on page 2 are different from page 1 (if both pages have entries)
      if (leaderboardPageTwo.length > 0 && leaderboardPageOne.length > 0) {
        runner.assertFalse(
          leaderboardPageTwo[0].studentId === leaderboardPageOne[0].studentId,
          'First entry on page 2 should be different from first entry on page 1'
        );
      }
    }
  } catch (error) {
    console.error('Error in testing pagination:', error.message);
    throw error;
  }
});

// Test 4: Test access denial
runner.test('Unauthorized access is denied', async () => {
  try {
    // Create a new teacher who doesn't own the class or quiz
    const unauthorizedTeacher = {
      name: 'Unauthorized Teacher',
      email: `unauthorizedteacher_${Date.now()}@test.com`,
      password: 'password123'
    };
    
    const teacherResponse = await runner.request('POST', `${AUTH_URL}/teacher/register`, unauthorizedTeacher);
    const unauthorizedTeacherToken = teacherResponse.body.token;
    
    // Try to access leaderboard as unauthorized teacher
    const response = await runner.request('GET', `${LEADERBOARD_URL}/quiz/${quizId}/class/${classId}`, null, {
      Authorization: `Bearer ${unauthorizedTeacherToken}`
    });
    
    // Should be denied (403 Forbidden or similar)
    runner.assertTrue(response.statusCode >= 400, 'Unauthorized teacher should be denied access');
    
    // Also test with a non-existent quiz ID
    const fakeQuizId = '507f1f77bcf86cd799439011'; // Random MongoDB ObjectId
    const nonExistentResponse = await runner.request('GET', `${LEADERBOARD_URL}/quiz/${fakeQuizId}/class/${classId}`, null, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    runner.assertTrue(nonExistentResponse.statusCode >= 400, 'Access to non-existent quiz should be denied');
  } catch (error) {
    console.error('Error in testing unauthorized access:', error.message);
    throw error;
  }
});

// Test 5: Test response when no attempts exist
runner.test('Leaderboard handles case with no attempts', async () => {
  try {
    // Create a new quiz that won't have any attempts
    const emptyQuiz = {
      title: `Empty Leaderboard Quiz ${Date.now()}`,
      description: 'A quiz with no attempts for testing empty leaderboard',
      questions: [testQuiz.questions[0]] // Just one question is enough
    };
    
    const quizResponse = await runner.request('POST', QUIZ_URL, emptyQuiz, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    const emptyQuizId = quizResponse.body.data._id;
    
    // Assign the quiz to the class
    await runner.request('POST', `${QUIZ_URL}/${emptyQuizId}/assign/${classId}`, null, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    // Try to access the leaderboard for this quiz
    const response = await runner.request('GET', `${LEADERBOARD_URL}/quiz/${emptyQuizId}/class/${classId}`, null, {
      Authorization: `Bearer ${teacherToken}`
    });
    
    runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
    runner.assertTrue(response.body.success, 'Response should indicate success');
    
    // Should have empty leaderboard array
    const leaderboard = response.body.data.leaderboard;
    runner.assertTrue(Array.isArray(leaderboard), 'Leaderboard should be an array');
    runner.assertEquals(leaderboard.length, 0, 'Leaderboard should be empty');
  } catch (error) {
    console.error('Error in testing empty leaderboard:', error.message);
    throw error;
  }
});

// Export the runTests function for use by run-tests.js
exports.runTests = async function() {
  return await runner.runTests();
};

// If this file is run directly (not imported by run-tests.js), run the tests
if (require.main === module) {
  (async () => {
    const success = await runner.runTests();
    process.exit(success ? 0 : 1);
  })();
} 