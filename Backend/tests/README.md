# QuizCraze API Test Suite

This test suite provides a way to verify the functionality of the QuizCraze API without relying on external testing libraries.

## Test Structure

- `test-utils.js`: Contains the TestRunner class with assertion methods and HTTP request functionality
- `run-tests.js`: Main script that discovers and runs all test files
- `authentication.js`: Tests for authentication-related endpoints
- `class-management.js`: Tests for class management functionality
- `quiz-management.js`: Tests for quiz creation and management
- `quiz-attempt.js`: Tests for quiz attempts and results functionality
- `question-bank-management.js`: Tests for question bank creation, management, and assignment

## Running Tests

Make sure the backend server is running before executing tests:

1. Start the server:
   ```
   pnpm dev
   ```

2. In a separate terminal, run the tests:
   ```
   pnpm test
   ```

## Test Independence

The tests are designed to be completely independent of the main codebase. They only interact with the API endpoints and do not rely on any implementation details.

## Writing New Tests

To add new tests:

1. Create a new test file in the `tests` directory with a `.js` extension.
2. Import the TestRunner from `test-utils.js`.
3. Create a new instance of TestRunner.
4. Define your tests using the `test` method.
5. Use assertion methods like `assertEquals`, `assertTrue`, etc.
6. Export the TestRunner instance.

Example:

```javascript
const TestRunner = require('./test-utils');
const runner = new TestRunner();

runner.test('Example Test', async () => {
  // Test code here
  runner.assertTrue(true, 'This should pass');
});

module.exports = runner;
```

## Test Coverage

The current test suite covers:

- Teacher & Student registration (success and error cases)
- Teacher & Student login (success and error cases)
- Protected route access with valid tokens
- Protected route access denial with invalid or missing tokens
- Role-based access control for teacher and student specific routes
- Class creation by teachers
- Class enrollment by students with enrollment keys
- Listing classes for teachers and students
- Accessing class details with proper authorization
- Quiz creation by teachers
- Quiz assignment to classes
- Retrieving quizzes by teacher and by class
- Quiz attempt submission by students
- Score calculation based on student answers
- Retrieving student's quiz results
- Retrieving quiz results for teachers within their classes
- Question bank creation by teachers with various difficulty levels
- Retrieving, updating, and deleting question banks
- Assigning question banks to classes for self-practice 