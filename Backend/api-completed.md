# QuizCraze API Documentation

This document contains information about all the completed API endpoints in the QuizCraze backend application.

## Base URL

```
http://localhost:5000
```

For production deployments, replace with your deployed URL.

## Authentication APIs

### Teacher Registration

Register a new teacher account.

- **URL**: `/api/auth/teacher/register`
- **Method**: `POST`
- **Authentication**: None

**Request Body**:
```json
{
  "name": "Teacher Name",
  "email": "teacher@example.com",
  "password": "password123"
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "_id": "teacher_id",
  "name": "Teacher Name",
  "email": "teacher@example.com",
  "role": "teacher",
  "token": "jwt_token_here"
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "message": "User already exists" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Error message here" }`

### Teacher Login

Log in to an existing teacher account.

- **URL**: `/api/auth/teacher/login`
- **Method**: `POST`
- **Authentication**: None

**Request Body**:
```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "_id": "teacher_id",
  "name": "Teacher Name",
  "email": "teacher@example.com",
  "role": "teacher",
  "token": "jwt_token_here"
}
```

**Error Responses**:
- **Code**: 401 Unauthorized
  - **Content**: `{ "message": "Invalid email or password" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Error message here" }`

### Student Registration

Register a new student account.

- **URL**: `/api/auth/student/register`
- **Method**: `POST`
- **Authentication**: None

**Request Body**:
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "password123"
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "_id": "student_id",
  "name": "Student Name",
  "email": "student@example.com",
  "role": "student",
  "token": "jwt_token_here"
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "message": "User already exists" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Error message here" }`

### Student Login

Log in to an existing student account.

- **URL**: `/api/auth/student/login`
- **Method**: `POST`
- **Authentication**: None

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "_id": "student_id",
  "name": "Student Name",
  "email": "student@example.com",
  "role": "student",
  "token": "jwt_token_here"
}
```

**Error Responses**:
- **Code**: 401 Unauthorized
  - **Content**: `{ "message": "Invalid email or password" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Error message here" }`

## Class Management APIs

### Create Class (Teacher Only)

Create a new class with an automatically generated enrollment key.

- **URL**: `/api/classes`
- **Method**: `POST`
- **Authentication**: Required (Teacher only)

**Request Body**:
```json
{
  "className": "Mathematics 101"
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "_id": "class_id",
  "className": "Mathematics 101",
  "enrollmentKey": "ABC123"
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "message": "Class name is required" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Teachers only" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Server error", "error": "Error message here" }`

### Join Class (Student Only)

Join an existing class using the enrollment key.

- **URL**: `/api/classes/join`
- **Method**: `POST`
- **Authentication**: Required (Student only)

**Request Body**:
```json
{
  "enrollmentKey": "ABC123"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "message": "Successfully joined class",
  "class": {
    "_id": "class_id",
    "className": "Mathematics 101"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "message": "Enrollment key is required" }`
  - **Content**: `{ "message": "You are already enrolled in this class" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Students only" }`
- **Code**: 404 Not Found
  - **Content**: `{ "message": "Class not found with this enrollment key" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Server error", "error": "Error message here" }`

### Get Teacher Classes

Get all classes created by the logged-in teacher.

- **URL**: `/api/classes/teacher`
- **Method**: `GET`
- **Authentication**: Required (Teacher only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
[
  {
    "_id": "class_id_1",
    "className": "Mathematics 101",
    "enrollmentKey": "ABC123",
    "students": [
      {
        "_id": "student_id_1",
        "name": "Student Name",
        "email": "student@example.com"
      }
    ]
  },
  {
    "_id": "class_id_2",
    "className": "Physics 202",
    "enrollmentKey": "DEF456",
    "students": []
  }
]
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Teachers only" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Server error", "error": "Error message here" }`

### Get Student Classes

Get all classes the logged-in student is enrolled in.

- **URL**: `/api/classes/student`
- **Method**: `GET`
- **Authentication**: Required (Student only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
[
  {
    "_id": "class_id_1",
    "className": "Mathematics 101",
    "teacher": {
      "_id": "teacher_id",
      "name": "Teacher Name"
    }
  },
  {
    "_id": "class_id_2",
    "className": "Physics 202",
    "teacher": {
      "_id": "teacher_id",
      "name": "Teacher Name"
    }
  }
]
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Students only" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Server error", "error": "Error message here" }`

### Get Class Details

Get detailed information about a specific class.

- **URL**: `/api/classes/:classId`
- **Method**: `GET`
- **Authentication**: Required (Teacher who created the class or enrolled Student)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "_id": "class_id",
  "className": "Mathematics 101",
  "enrollmentKey": "ABC123",
  "teacher": {
    "_id": "teacher_id",
    "name": "Teacher Name",
    "email": "teacher@example.com"
  },
  "students": [
    {
      "_id": "student_id_1",
      "name": "Student Name",
      "email": "student@example.com"
    }
  ],
  "quizzes": [
    {
      "_id": "quiz_id",
      "title": "Quiz Title",
      "description": "Quiz Description"
    }
  ]
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied" }`
- **Code**: 404 Not Found
  - **Content**: `{ "message": "Class not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Server error", "error": "Error message here" }`

## Authentication Token

All API endpoints beyond the authentication routes require a JWT token for authorization. The token is returned in the response of the login and registration endpoints.

### How to Use the Token

Include the token in the `Authorization` header of your requests:

```
Authorization: Bearer <your_token_here>
```

## Error Handling

All API endpoints return appropriate status codes and error messages in case of failures:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Valid authentication but insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

Error responses have the following format:
```json
{
  "message": "Error message explaining what went wrong"
}
```

## Testing the APIs

You can test these APIs using tools like:

1. Postman
2. cURL
3. Frontend application

**Example cURL Request for Teacher Login**:
```bash
curl -X POST http://localhost:5000/api/auth/teacher/login \
  -H "Content-Type: application/json" \
  -d '{"email": "teacher@example.com", "password": "password123"}'
```

**Example cURL Request for Creating a Class**:
```bash
curl -X POST http://localhost:5000/api/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token_here>" \
  -d '{"className": "Mathematics 101"}'
```

## Environment Variables

The API requires the following environment variables to be set:

- `PORT`: The port the server will run on (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: Token expiration time (e.g., "30d")
- `CORS_ORIGIN`: Allowed origin for CORS (e.g., "http://localhost:3000")

## Next Steps

The following APIs are planned for future implementation:

1. Result tracking and analytics 

## Quiz Management APIs

### Create Quiz (Teacher Only)

Create a new quiz with questions and answer options.

- **URL**: `/api/quizzes`
- **Method**: `POST`
- **Authentication**: Required (Teacher only)

**Request Body**:
```json
{
  "title": "Math Quiz",
  "description": "Basic arithmetic quiz",
  "questions": [
    {
      "questionText": "What is 2+2?",
      "options": [
        { "optionText": "3", "isCorrect": false },
        { "optionText": "4", "isCorrect": true },
        { "optionText": "5", "isCorrect": false },
        { "optionText": "22", "isCorrect": false }
      ],
      "multipleCorrectAnswers": false
    },
    {
      "questionText": "Which of these are even numbers?",
      "options": [
        { "optionText": "2", "isCorrect": true },
        { "optionText": "4", "isCorrect": true },
        { "optionText": "5", "isCorrect": false },
        { "optionText": "8", "isCorrect": true }
      ],
      "multipleCorrectAnswers": true
    }
  ]
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "quiz_id",
    "title": "Math Quiz",
    "description": "Basic arithmetic quiz",
    "questions": [
      {
        "questionText": "What is 2+2?",
        "options": [
          { "optionText": "3", "isCorrect": false },
          { "optionText": "4", "isCorrect": true },
          { "optionText": "5", "isCorrect": false },
          { "optionText": "22", "isCorrect": false }
        ],
        "multipleCorrectAnswers": false
      },
      {
        "questionText": "Which of these are even numbers?",
        "options": [
          { "optionText": "2", "isCorrect": true },
          { "optionText": "4", "isCorrect": true },
          { "optionText": "5", "isCorrect": false },
          { "optionText": "8", "isCorrect": true }
        ],
        "multipleCorrectAnswers": true
      }
    ],
    "createdBy": "teacher_id",
    "assignedClasses": [],
    "createdAt": "2023-07-20T12:34:56.789Z",
    "updatedAt": "2023-07-20T12:34:56.789Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Please provide title and at least one question" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Teachers only" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Assign Quiz to Class (Teacher Only)

Assign a quiz to a specific class.

- **URL**: `/api/quizzes/:quizId/assign/:classId`
- **Method**: `POST`
- **Authentication**: Required (Teacher only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Quiz assigned to class successfully"
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Quiz already assigned to this class" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Not authorized to assign this quiz to this class" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Quiz not found" }` or
  - **Content**: `{ "success": false, "message": "Class not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Get Teacher's Quizzes (Teacher Only)

Get all quizzes created by the logged-in teacher.

- **URL**: `/api/quizzes/teacher`
- **Method**: `GET`
- **Authentication**: Required (Teacher only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "quiz_id_1",
      "title": "Math Quiz",
      "description": "Basic arithmetic quiz",
      "assignedClasses": ["class_id_1", "class_id_2"],
      "createdAt": "2023-07-20T12:34:56.789Z"
    },
    {
      "_id": "quiz_id_2",
      "title": "Science Quiz",
      "description": "Basic science concepts",
      "assignedClasses": [],
      "createdAt": "2023-07-21T12:34:56.789Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Teachers only" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Get Quizzes for Class

Get all quizzes assigned to a specific class. For teachers, the response includes question details; for students, it includes only basic quiz information.

- **URL**: `/api/quizzes/class/:classId`
- **Method**: `GET`
- **Authentication**: Required (Teacher who owns the class or Student enrolled in the class)

**Success Response (Teacher)**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "quiz_id_1",
      "title": "Math Quiz",
      "description": "Basic arithmetic quiz",
      "questions": [
        {
          "questionText": "What is 2+2?",
          "options": [
            { "optionText": "3", "isCorrect": false },
            { "optionText": "4", "isCorrect": true },
            { "optionText": "5", "isCorrect": false },
            { "optionText": "22", "isCorrect": false }
          ],
          "multipleCorrectAnswers": false
        }
      ],
      "createdAt": "2023-07-20T12:34:56.789Z"
    },
    {
      "_id": "quiz_id_2",
      "title": "Science Quiz",
      "description": "Basic science concepts",
      "questions": [
        {
          "questionText": "Which of these is a planet?",
          "options": [
            { "optionText": "Sun", "isCorrect": false },
            { "optionText": "Earth", "isCorrect": true },
            { "optionText": "Moon", "isCorrect": false }
          ],
          "multipleCorrectAnswers": false
        }
      ],
      "createdAt": "2023-07-21T12:34:56.789Z"
    }
  ]
}
```

**Success Response (Student)**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "quiz_id_1",
      "title": "Math Quiz",
      "description": "Basic arithmetic quiz",
      "createdAt": "2023-07-20T12:34:56.789Z"
    },
    {
      "_id": "quiz_id_2",
      "title": "Science Quiz",
      "description": "Basic science concepts",
      "createdAt": "2023-07-21T12:34:56.789Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Not authorized to access quizzes for this class" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Class not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Get Quiz Details

Get detailed information about a specific quiz. For teachers, the response includes correct answers; for students, the correct answers are hidden.

- **URL**: `/api/quizzes/:quizId`
- **Method**: `GET`
- **Authentication**: Required (Teacher who created the quiz or Student with access through a class)

**Success Response (Teacher)**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "quiz_id",
    "title": "Math Quiz",
    "description": "Basic arithmetic quiz",
    "questions": [
      {
        "questionText": "What is 2+2?",
        "options": [
          { "optionText": "3", "isCorrect": false },
          { "optionText": "4", "isCorrect": true },
          { "optionText": "5", "isCorrect": false },
          { "optionText": "22", "isCorrect": false }
        ],
        "multipleCorrectAnswers": false
      }
    ],
    "createdBy": "teacher_id",
    "assignedClasses": ["class_id_1", "class_id_2"],
    "createdAt": "2023-07-20T12:34:56.789Z",
    "updatedAt": "2023-07-20T12:34:56.789Z"
  }
}
```

**Success Response (Student)**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "quiz_id",
    "title": "Math Quiz",
    "description": "Basic arithmetic quiz",
    "questions": [
      {
        "questionText": "What is 2+2?",
        "options": [
          { "optionText": "3" },
          { "optionText": "4" },
          { "optionText": "5" },
          { "optionText": "22" }
        ],
        "multipleCorrectAnswers": false
      }
    ],
    "createdBy": "teacher_id",
    "assignedClasses": ["class_id_1", "class_id_2"],
    "createdAt": "2023-07-20T12:34:56.789Z",
    "updatedAt": "2023-07-20T12:34:56.789Z"
  }
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Not authorized to access this quiz" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Quiz not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

## Quiz Attempt & Results APIs

### Submit Quiz Attempt (Student Only)

Submit answers for a quiz attempt.

- **URL**: `/api/attempts/submit`
- **Method**: `POST`
- **Authentication**: Required (Student only)

**Request Body**:
```json
{
  "quizId": "quiz_id",
  "answers": [
    {
      "questionId": "question_id_1",
      "selectedOptionIds": ["option_id_1"]
    },
    {
      "questionId": "question_id_2",
      "selectedOptionIds": ["option_id_3", "option_id_4"]
    }
  ],
  "classId": "class_id" // Optional
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "success": true,
  "data": {
    "score": 1,
    "totalMarks": 2,
    "percentage": 50
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Please provide quizId and answers array" }`
  - **Content**: `{ "success": false, "message": "You have already attempted this quiz" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Student is not enrolled in this class or class does not exist" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Quiz not found" }`
  - **Content**: `{ "success": false, "message": "Student not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Get Student Results (Student Only)

Get all quiz attempts for the logged-in student.

- **URL**: `/api/attempts/student`
- **Method**: `GET`
- **Authentication**: Required (Student only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "attempt_id_1",
      "quiz": {
        "_id": "quiz_id_1",
        "title": "Math Quiz",
        "description": "Basic arithmetic quiz"
      },
      "classContext": {
        "_id": "class_id",
        "className": "Mathematics 101"
      },
      "score": 4,
      "totalMarks": 5,
      "submittedAt": "2023-07-24T15:30:45.789Z"
    },
    {
      "_id": "attempt_id_2",
      "quiz": {
        "_id": "quiz_id_2",
        "title": "Science Quiz",
        "description": "Basic science concepts"
      },
      "classContext": {
        "_id": "class_id",
        "className": "Science 101"
      },
      "score": 3,
      "totalMarks": 5,
      "submittedAt": "2023-07-25T16:30:45.789Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Access denied: Student only" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Get Quiz Results for Teacher

Get all quiz attempts for a specific quiz within a specific class.

- **URL**: `/api/attempts/teacher/:quizId/class/:classId`
- **Method**: `GET`
- **Authentication**: Required (Teacher only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "averageScore": 3.5,
  "data": [
    {
      "_id": "attempt_id_1",
      "student": {
        "_id": "student_id_1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "score": 4,
      "totalMarks": 5,
      "answers": [
        {
          "questionId": "question_id_1",
          "selectedOptionIds": ["option_id_1"]
        },
        {
          "questionId": "question_id_2",
          "selectedOptionIds": ["option_id_3", "option_id_4"]
        }
      ],
      "submittedAt": "2023-07-24T15:30:45.789Z"
    },
    {
      "_id": "attempt_id_2",
      "student": {
        "_id": "student_id_2",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "score": 3,
      "totalMarks": 5,
      "answers": [
        {
          "questionId": "question_id_1",
          "selectedOptionIds": ["option_id_1"]
        },
        {
          "questionId": "question_id_2",
          "selectedOptionIds": ["option_id_4"]
        }
      ],
      "submittedAt": "2023-07-25T16:30:45.789Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Access denied: Teacher only" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Quiz not found or you are not authorized to access this quiz" }`
  - **Content**: `{ "success": false, "message": "Class not found or you are not authorized to access this class" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

## Question Bank Management APIs

### Create Question Bank (Teacher Only)

Create a new question bank with difficulty-leveled questions.

- **URL**: `/api/question-banks`
- **Method**: `POST`
- **Authentication**: Required (Teacher only)

**Request Body**:
```json
{
  "title": "Mathematics Question Bank",
  "description": "Questions for practice in mathematics",
  "questions": [
    {
      "questionText": "What is 2+2?",
      "options": [
        { "optionText": "3", "isCorrect": false },
        { "optionText": "4", "isCorrect": true },
        { "optionText": "5", "isCorrect": false },
        { "optionText": "22", "isCorrect": false }
      ],
      "multipleCorrectAnswers": false,
      "difficultyLevel": 1
    },
    {
      "questionText": "Solve for x: 2x + 5 = 15",
      "options": [
        { "optionText": "4", "isCorrect": false },
        { "optionText": "5", "isCorrect": true },
        { "optionText": "6", "isCorrect": false },
        { "optionText": "7", "isCorrect": false }
      ],
      "multipleCorrectAnswers": false,
      "difficultyLevel": 2
    }
  ]
}
```

**Success Response**:
- **Code**: 201 Created
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "question_bank_id",
    "title": "Mathematics Question Bank",
    "description": "Questions for practice in mathematics",
    "questions": [
      {
        "_id": "question_id_1",
        "questionText": "What is 2+2?",
        "options": [
          { "_id": "option_id_1", "optionText": "3", "isCorrect": false },
          { "_id": "option_id_2", "optionText": "4", "isCorrect": true },
          { "_id": "option_id_3", "optionText": "5", "isCorrect": false },
          { "_id": "option_id_4", "optionText": "22", "isCorrect": false }
        ],
        "multipleCorrectAnswers": false,
        "difficultyLevel": 1
      },
      {
        "_id": "question_id_2",
        "questionText": "Solve for x: 2x + 5 = 15",
        "options": [
          { "_id": "option_id_5", "optionText": "4", "isCorrect": false },
          { "_id": "option_id_6", "optionText": "5", "isCorrect": true },
          { "_id": "option_id_7", "optionText": "6", "isCorrect": false },
          { "_id": "option_id_8", "optionText": "7", "isCorrect": false }
        ],
        "multipleCorrectAnswers": false,
        "difficultyLevel": 2
      }
    ],
    "createdBy": "teacher_id",
    "assignedClasses": [],
    "createdAt": "2023-07-28T14:25:30.789Z",
    "updatedAt": "2023-07-28T14:25:30.789Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Title and at least one question are required" }`
  - **Content**: `{ "success": false, "message": "Difficulty level must be between 1 and 5" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Access denied: Teachers only" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Get Teacher's Question Banks

Get all question banks created by the logged-in teacher.

- **URL**: `/api/question-banks/teacher`
- **Method**: `GET`
- **Authentication**: Required (Teacher only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "question_bank_id_1",
      "title": "Mathematics Question Bank",
      "description": "Questions for practice in mathematics",
      "assignedClasses": ["class_id_1", "class_id_2"],
      "createdAt": "2023-07-28T14:25:30.789Z"
    },
    {
      "_id": "question_bank_id_2",
      "title": "Science Question Bank",
      "description": "Questions for practice in science",
      "assignedClasses": ["class_id_1"],
      "createdAt": "2023-07-29T10:15:22.456Z"
    }
  ]
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Access denied: Teachers only" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Get Question Bank Details

Get detailed information about a specific question bank.

- **URL**: `/api/question-banks/:questionBankId`
- **Method**: `GET`
- **Authentication**: Required (Teacher only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "question_bank_id",
    "title": "Mathematics Question Bank",
    "description": "Questions for practice in mathematics",
    "questions": [
      {
        "_id": "question_id_1",
        "questionText": "What is 2+2?",
        "options": [
          { "_id": "option_id_1", "optionText": "3", "isCorrect": false },
          { "_id": "option_id_2", "optionText": "4", "isCorrect": true },
          { "_id": "option_id_3", "optionText": "5", "isCorrect": false },
          { "_id": "option_id_4", "optionText": "22", "isCorrect": false }
        ],
        "multipleCorrectAnswers": false,
        "difficultyLevel": 1
      },
      {
        "_id": "question_id_2",
        "questionText": "Solve for x: 2x + 5 = 15",
        "options": [
          { "_id": "option_id_5", "optionText": "4", "isCorrect": false },
          { "_id": "option_id_6", "optionText": "5", "isCorrect": true },
          { "_id": "option_id_7", "optionText": "6", "isCorrect": false },
          { "_id": "option_id_8", "optionText": "7", "isCorrect": false }
        ],
        "multipleCorrectAnswers": false,
        "difficultyLevel": 2
      }
    ],
    "createdBy": "teacher_id",
    "assignedClasses": ["class_id_1", "class_id_2"],
    "createdAt": "2023-07-28T14:25:30.789Z",
    "updatedAt": "2023-07-28T14:25:30.789Z"
  }
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Access denied: Teachers only" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Question bank not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Update Question Bank

Update an existing question bank.

- **URL**: `/api/question-banks/:questionBankId`
- **Method**: `PUT`
- **Authentication**: Required (Teacher only)

**Request Body**:
```json
{
  "title": "Updated Mathematics Question Bank",
  "description": "Updated description for mathematics practice",
  "questions": [
    {
      "questionText": "What is 3+3?",
      "options": [
        { "optionText": "5", "isCorrect": false },
        { "optionText": "6", "isCorrect": true },
        { "optionText": "7", "isCorrect": false }
      ],
      "multipleCorrectAnswers": false,
      "difficultyLevel": 1
    }
  ]
}
```
Note: You can update any combination of these fields (title, description, questions).

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "_id": "question_bank_id",
    "title": "Updated Mathematics Question Bank",
    "description": "Updated description for mathematics practice",
    "questions": [
      {
        "_id": "question_id_3",
        "questionText": "What is 3+3?",
        "options": [
          { "_id": "option_id_9", "optionText": "5", "isCorrect": false },
          { "_id": "option_id_10", "optionText": "6", "isCorrect": true },
          { "_id": "option_id_11", "optionText": "7", "isCorrect": false }
        ],
        "multipleCorrectAnswers": false,
        "difficultyLevel": 1
      }
    ],
    "createdBy": "teacher_id",
    "assignedClasses": ["class_id_1", "class_id_2"],
    "createdAt": "2023-07-28T14:25:30.789Z",
    "updatedAt": "2023-07-30T09:18:45.123Z"
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "At least one question is required if updating questions" }`
  - **Content**: `{ "success": false, "message": "Difficulty level must be between 1 and 5" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Not authorized to update this question bank" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Question bank not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Delete Question Bank

Delete a question bank.

- **URL**: `/api/question-banks/:questionBankId`
- **Method**: `DELETE`
- **Authentication**: Required (Teacher only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Question bank deleted successfully"
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Not authorized to delete this question bank" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Question bank not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

### Assign Question Bank to Class

Assign a question bank to a specific class, making it available for self-practice to students in that class.

- **URL**: `/api/question-banks/:questionBankId/assign/:classId`
- **Method**: `POST`
- **Authentication**: Required (Teacher only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "message": "Question bank assigned to class successfully",
  "data": {
    "_id": "question_bank_id",
    "title": "Mathematics Question Bank",
    "assignedClasses": ["class_id_1", "class_id_2", "class_id_3"]
  }
}
```

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Question bank already assigned to this class" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "Not authorized to assign this question bank" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Question bank not found" }` or
  - **Content**: `{ "success": false, "message": "Class not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }`

## Self-Practice APIs

### Get Available Question Banks (Student Only)

Get all question banks assigned to classes the student is enrolled in.

- **URL**: `/api/self-practice/banks`
- **Method**: `GET`
- **Authentication**: Required (Student only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "question_bank_id_1",
      "title": "Mathematics Question Bank",
      "description": "Questions for practice in mathematics",
      "assignedClasses": [
        {
          "_id": "class_id_1",
          "className": "Mathematics 101"
        }
      ]
    },
    {
      "_id": "question_bank_id_2",
      "title": "Science Question Bank",
      "description": "Questions for practice in science",
      "assignedClasses": [
        {
          "_id": "class_id_1",
          "className": "Mathematics 101"
        }
      ]
    }
  ]
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Student only" }`
- **Code**: 404 Not Found
  - **Content**: `{ "message": "Student not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Server error", "error": "Error message here" }`

### Start or Resume Practice Session

Start a new practice session or resume an existing one for a specific question bank.

- **URL**: `/api/self-practice/start/:questionBankId`
- **Method**: `POST`
- **Authentication**: Required (Student only)

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "sessionId": "session_id",
    "currentDifficulty": 1,
    "questions": [
      {
        "_id": "question_id_1",
        "questionText": "What is 2+2?",
        "options": [
          { "_id": "option_id_1", "optionText": "3" },
          { "_id": "option_id_2", "optionText": "4" },
          { "_id": "option_id_3", "optionText": "5" },
          { "_id": "option_id_4", "optionText": "22" }
        ],
        "multipleCorrectAnswers": false,
        "difficultyLevel": 1
      },
      {
        "_id": "question_id_2",
        "questionText": "What is 3+3?",
        "options": [
          { "_id": "option_id_5", "optionText": "5" },
          { "_id": "option_id_6", "optionText": "6" },
          { "_id": "option_id_7", "optionText": "7" }
        ],
        "multipleCorrectAnswers": false,
        "difficultyLevel": 1
      }
    ]
  }
}
```
Note: The `isCorrect` flag is not included in the options to prevent students from seeing the correct answers.

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Student only" }` or
  - **Content**: `{ "message": "You do not have access to this question bank" }`
- **Code**: 404 Not Found
  - **Content**: `{ "message": "Question bank not found" }` or
  - **Content**: `{ "message": "Student not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Server error", "error": "Error message here" }`

### Submit Practice Batch Answers

Submit answers for a batch of practice questions and get the next batch.

- **URL**: `/api/self-practice/submit/:questionBankId`
- **Method**: `POST`
- **Authentication**: Required (Student only)

**Request Body**:
```json
{
  "sessionId": "session_id",
  "answers": [
    {
      "questionId": "question_id_1",
      "selectedOptionIds": ["option_id_2"]
    },
    {
      "questionId": "question_id_2",
      "selectedOptionIds": ["option_id_6"]
    }
  ]
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "score": {
      "correct": 2,
      "total": 2,
      "percentage": 100
    },
    "newDifficulty": 2,
    "nextBatch": [
      {
        "_id": "question_id_3",
        "questionText": "Solve for x: 2x + 5 = 15",
        "options": [
          { "_id": "option_id_8", "optionText": "4" },
          { "_id": "option_id_9", "optionText": "5" },
          { "_id": "option_id_10", "optionText": "6" },
          { "_id": "option_id_11", "optionText": "7" }
        ],
        "multipleCorrectAnswers": false,
        "difficultyLevel": 2
      }
    ]
  }
}
```
Note: The difficulty level increases because the student performed well (scored 100%).

**Error Responses**:
- **Code**: 400 Bad Request
  - **Content**: `{ "message": "Please provide answers array" }`
- **Code**: 403 Forbidden
  - **Content**: `{ "message": "Access denied: Student only" }`
- **Code**: 404 Not Found
  - **Content**: `{ "message": "Practice session not found" }` or
  - **Content**: `{ "message": "Question bank not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "message": "Server error", "error": "Error message here" }`

## Leaderboard APIs

### Get Quiz Leaderboard by Class

Get a ranked list of students who have attempted a specific quiz in a specific class, sorted by score (highest first).

- **URL**: `/api/leaderboards/quiz/:quizId/class/:classId`
- **Method**: `GET`
- **Authentication**: Required (Teacher who owns the quiz/class or Student enrolled in the class)
- **Query Parameters**:
  - `page`: Page number for pagination (default: 1)
  - `limit`: Number of results per page (default: 10)

**Success Response**:
- **Code**: 200 OK
- **Content** (With attempts):
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "studentName": "Top Student",
        "studentId": "student_id_1",
        "score": 95,
        "totalMarks": 100,
        "submittedAt": "2023-07-01T12:30:45Z"
      },
      {
        "rank": 2,
        "studentName": "Average Student",
        "studentId": "student_id_2",
        "score": 75,
        "totalMarks": 100,
        "submittedAt": "2023-07-01T14:15:30Z"
      },
      {
        "rank": 3,
        "studentName": "Struggling Student",
        "studentId": "student_id_3",
        "score": 60,
        "totalMarks": 100,
        "submittedAt": "2023-07-01T10:45:20Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalAttempts": 3,
      "totalPages": 1
    }
  }
}
```

- **Content** (No attempts):
```json
{
  "success": true,
  "message": "No attempts for this quiz in this class yet",
  "data": {
    "leaderboard": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalAttempts": 0,
      "totalPages": 0
    }
  }
}
```

**Error Responses**:
- **Code**: 403 Forbidden
  - **Content**: `{ "success": false, "message": "You are not enrolled in this class" }` or
  - **Content**: `{ "success": false, "message": "You do not have permission to view this quiz" }` or
  - **Content**: `{ "success": false, "message": "You do not have permission to view this class" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Quiz not found" }` or
  - **Content**: `{ "success": false, "message": "Class not found" }` or
  - **Content**: `{ "success": false, "message": "Quiz not found in this class" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error", "error": "Error message here" }` 