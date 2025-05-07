const TestRunner = require('./test-utils');
const runner = new TestRunner();

// Base URLs for API requests
const AUTH_URL = 'http://localhost:5000/api/auth';
const CLASS_URL = 'http://localhost:5000/api/classes';

// Test data for teacher and student
const testTeacher = {
  name: 'Class Test Teacher',
  email: `classteacher_${Date.now()}@test.com`,
  password: 'password123'
};

const testStudent = {
  name: 'Class Test Student',
  email: `classstudent_${Date.now()}@test.com`,
  password: 'password123'
};

// Test data for class
const testClass = {
  className: `Test Class ${Date.now()}`
};

// Store tokens and IDs for authenticated requests
let teacherToken = '';
let studentToken = '';
let classId = '';
let enrollmentKey = '';

// Setup: Register a teacher and a student
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

// Test for creating a class - success case
runner.test('Create Class - Success', async () => {
  const response = await runner.request('POST', CLASS_URL, testClass, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
  runner.assertTrue(response.body._id, 'Response should contain class ID');
  runner.assertEquals(response.body.className, testClass.className, 'Response should contain correct class name');
  runner.assertTrue(response.body.enrollmentKey, 'Response should contain enrollment key');
  
  // Save class ID and enrollment key for future tests
  classId = response.body._id;
  enrollmentKey = response.body.enrollmentKey;
});

// Test for creating a class - student attempt (should fail)
runner.test('Create Class - Student Attempt', async () => {
  const response = await runner.request('POST', CLASS_URL, testClass, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
  runner.assertEquals(response.body.message, 'Access denied: Teachers only', 'Should return appropriate error');
});

// Test for creating a class - missing class name
runner.test('Create Class - Missing Class Name', async () => {
  const response = await runner.request('POST', CLASS_URL, {}, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 400, 'Status code should be 400 Bad Request');
  runner.assertEquals(response.body.message, 'Class name is required', 'Should return appropriate error');
});

// Test for joining a class - success case
runner.test('Join Class - Success', async () => {
  const joinData = {
    enrollmentKey: enrollmentKey
  };
  
  const response = await runner.request('POST', `${CLASS_URL}/join`, joinData, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertEquals(response.body.message, 'Successfully joined class', 'Should return success message');
  runner.assertTrue(response.body.class._id, 'Response should contain class ID');
  runner.assertEquals(response.body.class._id, classId, 'Response should contain correct class ID');
});

// Test for joining a class - teacher attempt (should fail)
runner.test('Join Class - Teacher Attempt', async () => {
  const joinData = {
    enrollmentKey: enrollmentKey
  };
  
  const response = await runner.request('POST', `${CLASS_URL}/join`, joinData, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
  runner.assertEquals(response.body.message, 'Access denied: Students only', 'Should return appropriate error');
});

// Test for joining a class - invalid enrollment key
runner.test('Join Class - Invalid Enrollment Key', async () => {
  const joinData = {
    enrollmentKey: 'INVALID123'
  };
  
  const response = await runner.request('POST', `${CLASS_URL}/join`, joinData, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 404, 'Status code should be 404 Not Found');
  runner.assertEquals(response.body.message, 'Class not found with this enrollment key', 'Should return appropriate error');
});

// Test for joining a class - already enrolled
runner.test('Join Class - Already Enrolled', async () => {
  const joinData = {
    enrollmentKey: enrollmentKey
  };
  
  const response = await runner.request('POST', `${CLASS_URL}/join`, joinData, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 400, 'Status code should be 400 Bad Request');
  runner.assertEquals(response.body.message, 'You are already enrolled in this class', 'Should return appropriate error');
});

// Test for getting teacher classes
runner.test('Get Teacher Classes', async () => {
  const response = await runner.request('GET', `${CLASS_URL}/teacher`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(Array.isArray(response.body), 'Response should be an array');
  
  // The created class should be in the response
  const foundClass = response.body.find(cls => cls._id === classId);
  runner.assertTrue(foundClass, 'Created class should be in the list');
  runner.assertEquals(foundClass.className, testClass.className, 'Class name should match');
});

// Test for getting student classes
runner.test('Get Student Classes', async () => {
  const response = await runner.request('GET', `${CLASS_URL}/student`, null, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(Array.isArray(response.body), 'Response should be an array');
  
  // The joined class should be in the response
  const foundClass = response.body.find(cls => cls._id === classId);
  runner.assertTrue(foundClass, 'Joined class should be in the list');
  runner.assertEquals(foundClass.className, testClass.className, 'Class name should match');
});

// Test for getting class details - teacher access
runner.test('Get Class Details - Teacher Access', async () => {
  const response = await runner.request('GET', `${CLASS_URL}/${classId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertEquals(response.body._id, classId, 'Class ID should match');
  runner.assertEquals(response.body.className, testClass.className, 'Class name should match');
  
  // More resilient check for students array
  runner.assertTrue(response.body.students !== undefined, 'Students property should exist');
  
  if (response.body.students) {
    runner.assertTrue(Array.isArray(response.body.students), 'Students should be an array');
    
    // Only check length if students is an array
    if (Array.isArray(response.body.students)) {
      runner.assertEquals(response.body.students.length, 1, 'Class should have one student');
    }
  }
});

// Test for getting class details - student access
runner.test('Get Class Details - Student Access', async () => {
  const response = await runner.request('GET', `${CLASS_URL}/${classId}`, null, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertEquals(response.body._id, classId, 'Class ID should match');
  runner.assertEquals(response.body.className, testClass.className, 'Class name should match');
});

// Test for getting class details - unauthorized access
runner.test('Get Class Details - Unauthorized Access', async () => {
  // Create a new student who is not enrolled in the class
  const anotherStudent = {
    name: 'Another Student',
    email: `anotherstudent_${Date.now()}@test.com`,
    password: 'password123'
  };
  
  const registerResponse = await runner.request('POST', `${AUTH_URL}/student/register`, anotherStudent);
  const anotherStudentToken = registerResponse.body.token;
  
  const response = await runner.request('GET', `${CLASS_URL}/${classId}`, null, {
    Authorization: `Bearer ${anotherStudentToken}`
  });
  
  runner.assertEquals(response.statusCode, 403, 'Status code should be 403 Forbidden');
  runner.assertEquals(response.body.message, 'Access denied', 'Should return appropriate error');
});

// Export the test runner for the main test script
module.exports = runner; 