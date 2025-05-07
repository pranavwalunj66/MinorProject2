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

## Environment Variables

The API requires the following environment variables to be set:

- `PORT`: The port the server will run on (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: Token expiration time (e.g., "30d")
- `CORS_ORIGIN`: Allowed origin for CORS (e.g., "http://localhost:3000")

## Next Steps

The following APIs are planned for future implementation:

1. Class Management (create, join, list classes)
2. Quiz Management (create, assign, attempt quizzes)
3. Result tracking and analytics 