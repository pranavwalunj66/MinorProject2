const TestRunner = require('./test-utils');
const runner = new TestRunner();

// Base URLs for API requests
const AUTH_URL = 'http://localhost:5000/api/auth';
const CLASS_URL = 'http://localhost:5000/api/classes';

// Test data
const testTeacher = {
  name: 'Debug Teacher',
  email: `debug_teacher_${Date.now()}@test.com`,
  password: 'password123'
};

const testStudent = {
  name: 'Debug Student',
  email: `debug_student_${Date.now()}@test.com`,
  password: 'password123'
};

const testClass = {
  className: `Debug Class ${Date.now()}`
};

// Store tokens and IDs
let teacherToken = '';
let studentToken = '';
let classId = '';
let enrollmentKey = '';

// Setup and test functions
runner.test('1. Register Teacher', async () => {
  console.log('Registering teacher...');
  const response = await runner.request('POST', `${AUTH_URL}/teacher/register`, testTeacher);
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201');
  runner.assertTrue(response.body.token, 'Token should be returned');
  
  teacherToken = response.body.token;
  console.log('Teacher registered with token:', teacherToken);
});

runner.test('2. Register Student', async () => {
  console.log('Registering student...');
  const response = await runner.request('POST', `${AUTH_URL}/student/register`, testStudent);
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201');
  runner.assertTrue(response.body.token, 'Token should be returned');
  
  studentToken = response.body.token;
  console.log('Student registered with token:', studentToken);
});

runner.test('3. Create Class', async () => {
  console.log('Creating class...');
  const response = await runner.request('POST', CLASS_URL, testClass, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  runner.assertEquals(response.statusCode, 201, 'Status code should be 201');
  
  classId = response.body._id;
  enrollmentKey = response.body.enrollmentKey;
  console.log('Class created with ID:', classId, 'and enrollment key:', enrollmentKey);
});

runner.test('4. Join Class', async () => {
  console.log('Student joining class...');
  const response = await runner.request('POST', `${CLASS_URL}/join`, { enrollmentKey }, {
    Authorization: `Bearer ${studentToken}`
  });
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200');
  console.log('Student joined class successfully');
});

runner.test('5. Get Class Details - Teacher Access', async () => {
  console.log('Getting class details as teacher...');
  console.log('ClassID:', classId);
  console.log('Teacher Token:', teacherToken);
  
  const response = await runner.request('GET', `${CLASS_URL}/${classId}`, null, {
    Authorization: `Bearer ${teacherToken}`
  });
  
  console.log('Response status:', response.statusCode);
  console.log('Response body:', JSON.stringify(response.body, null, 2));
  
  runner.assertEquals(response.statusCode, 200, 'Status code should be 200 OK');
  runner.assertEquals(response.body._id, classId, 'Class ID should match');
  runner.assertEquals(response.body.className, testClass.className, 'Class name should match');
  runner.assertTrue(response.body.students !== undefined, 'Students property should exist');
});

// Run the tests
module.exports = runner;