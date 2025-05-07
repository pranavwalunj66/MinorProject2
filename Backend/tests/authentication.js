const TestRunner = require('./test-utils');
const runner = new TestRunner();

// Base URL for API requests
const BASE_URL = 'http://localhost:5000/api/auth';

// Test data for teacher
const testTeacher = {
  name: 'Test Teacher',
  email: `teacher_${Date.now()}@test.com`,
  password: 'password123'
};

// Test data for student
const testStudent = {
  name: 'Test Student',
  email: `student_${Date.now()}@test.com`,
  password: 'password123'
};

// Store tokens for authenticated requests
let teacherToken = '';
let studentToken = '';

// Test for teacher registration - success case
runner.test('Teacher Registration - Success', async () => {
  const response = await runner.request('POST', `${BASE_URL}/teacher/register`, testTeacher);
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
  runner.assertTrue(response.body._id, 'Response should contain teacher ID');
  runner.assertEquals(response.body.name, testTeacher.name, 'Response should contain correct teacher name');
  runner.assertEquals(response.body.email, testTeacher.email, 'Response should contain correct teacher email');
  runner.assertEquals(response.body.role, 'teacher', 'Role should be set to teacher');
  runner.assertTrue(response.body.token, 'JWT token should be returned');
  
  // Save token for future authenticated requests
  teacherToken = response.body.token;
});

// Test for teacher registration - duplicate email
runner.test('Teacher Registration - Duplicate Email', async () => {
  const response = await runner.request('POST', `${BASE_URL}/teacher/register`, testTeacher);
  
  runner.assertEquals(response.statusCode, 400, 'Status code should be 400 Bad Request');
  runner.assertEquals(response.body.message, 'User already exists', 'Should return user exists message');
});

// Test for teacher registration - missing fields
runner.test('Teacher Registration - Missing Fields', async () => {
  const response = await runner.request('POST', `${BASE_URL}/teacher/register`, { email: 'incomplete@test.com' });
  
  runner.assertEquals(response.statusCode, 500, 'Status code should be 500 Server Error');
  runner.assertTrue(response.body.message, 'Error message should be returned');
});

// Test for teacher login - success case
runner.test('Teacher Login - Success', async () => {
  const loginData = {
    email: testTeacher.email,
    password: testTeacher.password
  };
  
  const response = await runner.request('POST', `${BASE_URL}/teacher/login`, loginData);
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body._id, 'Response should contain teacher ID');
  runner.assertEquals(response.body.email, testTeacher.email, 'Response should contain correct teacher email');
  runner.assertEquals(response.body.role, 'teacher', 'Role should be set to teacher');
  runner.assertTrue(response.body.token, 'JWT token should be returned');
});

// Test for teacher login - invalid credentials
runner.test('Teacher Login - Invalid Credentials', async () => {
  const loginData = {
    email: testTeacher.email,
    password: 'wrongpassword'
  };
  
  const response = await runner.request('POST', `${BASE_URL}/teacher/login`, loginData);
  
  runner.assertEquals(response.statusCode, 401, 'Status code should be 401 Unauthorized');
  runner.assertEquals(response.body.message, 'Invalid email or password', 'Should return invalid credentials message');
});

// Test for teacher login - non-existent user
runner.test('Teacher Login - Non-existent User', async () => {
  const loginData = {
    email: 'nonexistent@test.com',
    password: 'password123'
  };
  
  const response = await runner.request('POST', `${BASE_URL}/teacher/login`, loginData);
  
  runner.assertEquals(response.statusCode, 401, 'Status code should be 401 Unauthorized');
  runner.assertEquals(response.body.message, 'Invalid email or password', 'Should return invalid credentials message');
});

// Student Registration Tests

// Test for student registration - success case
runner.test('Student Registration - Success', async () => {
  const response = await runner.request('POST', `${BASE_URL}/student/register`, testStudent);
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201 Created');
  runner.assertTrue(response.body._id, 'Response should contain student ID');
  runner.assertEquals(response.body.name, testStudent.name, 'Response should contain correct student name');
  runner.assertEquals(response.body.email, testStudent.email, 'Response should contain correct student email');
  runner.assertEquals(response.body.role, 'student', 'Role should be set to student');
  runner.assertTrue(response.body.token, 'JWT token should be returned');
  
  // Save token for future authenticated requests
  studentToken = response.body.token;
});

// Test for student registration - duplicate email
runner.test('Student Registration - Duplicate Email', async () => {
  const response = await runner.request('POST', `${BASE_URL}/student/register`, testStudent);
  
  runner.assertEquals(response.statusCode, 400, 'Status code should be 400 Bad Request');
  runner.assertEquals(response.body.message, 'User already exists', 'Should return user exists message');
});

// Test for student registration - missing fields
runner.test('Student Registration - Missing Fields', async () => {
  const response = await runner.request('POST', `${BASE_URL}/student/register`, { email: 'incomplete@test.com' });
  
  runner.assertEquals(response.statusCode, 500, 'Status code should be 500 Server Error');
  runner.assertTrue(response.body.message, 'Error message should be returned');
});

// Test for student login - success case
runner.test('Student Login - Success', async () => {
  const loginData = {
    email: testStudent.email,
    password: testStudent.password
  };
  
  const response = await runner.request('POST', `${BASE_URL}/student/login`, loginData);
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertTrue(response.body._id, 'Response should contain student ID');
  runner.assertEquals(response.body.email, testStudent.email, 'Response should contain correct student email');
  runner.assertEquals(response.body.role, 'student', 'Role should be set to student');
  runner.assertTrue(response.body.token, 'JWT token should be returned');
});

// Test for student login - invalid credentials
runner.test('Student Login - Invalid Credentials', async () => {
  const loginData = {
    email: testStudent.email,
    password: 'wrongpassword'
  };
  
  const response = await runner.request('POST', `${BASE_URL}/student/login`, loginData);
  
  runner.assertEquals(response.statusCode, 401, 'Status code should be 401 Unauthorized');
  runner.assertEquals(response.body.message, 'Invalid email or password', 'Should return invalid credentials message');
});

// Test for student login - non-existent user
runner.test('Student Login - Non-existent User', async () => {
  const loginData = {
    email: 'nonexistent@test.com',
    password: 'password123'
  };
  
  const response = await runner.request('POST', `${BASE_URL}/student/login`, loginData);
  
  runner.assertEquals(response.statusCode, 401, 'Status code should be 401 Unauthorized');
  runner.assertEquals(response.body.message, 'Invalid email or password', 'Should return invalid credentials message');
});

// Export the test runner for the main test script
module.exports = runner; 