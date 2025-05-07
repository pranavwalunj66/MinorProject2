# Frontend Workflow: Quizcraze (React)

## Phase 1: Project Setup & Basic Structure

-   [ ] **Initialize React Project**
    -   [ ] Use `create-react-app` or Vite: `npx create-react-app frontend` or `npm create vite@latest frontend -- --template react`
    -   [ ] `cd frontend`
-   [ ] **Install Core Dependencies**
    -   [ ] `react-router-dom` (for routing)
    -   [ ] `axios` (for API calls)
    -   [ ] State management library (optional, e.g., Redux Toolkit, Zustand, or Context API for simpler cases)
    -   [ ] Styling library (e.g., Tailwind CSS, Material-UI, Styled Components)
-   [ ] **Setup Folder Structure**
    -   [ ] `/src/components` (reusable UI components: Button, Input, Modal, Card, etc.)
        -   [ ] `/src/components/common` (general reusable components)
        -   [ ] `/src/components/auth` (registration/login forms)
        -   [ ] `/src/components/dashboard` (dashboard specific components)
        -   [ ] `/src/components/quiz` (quiz related components)
    -   [ ] `/src/pages` (top-level route components: LoginPage, RegisterPage, TeacherDashboard, StudentDashboard, etc.)
    -   [ ] `/src/services` (API call functions, e.g., `authService.js`, `classService.js`, `quizService.js`)
    -   [ ] `/src/contexts` or `/src/store` (for state management)
    -   [ ] `/src/hooks` (custom React hooks)
    -   [ ] `/src/utils` (helper functions, constants)
    -   [ ] `/src/assets` (images, global styles)
    -   [ ] `/src/routes` (route configuration, protected routes)
-   [ ] **Basic Routing Setup (`App.js` and `routes/index.js`)**
    -   [ ] Define initial public routes (Login, Register for Teacher and Student).
    -   [ ] Set up basic layout components (Navbar, Footer - if any).
-   [ ] **Global Styles & Theme**
    -   [ ] Implement basic global styling or theme setup if using a UI library.
-   [ ] **Environment Configuration**
    -   [ ] Create `.env` file for API base URL (e.g., `REACT_APP_API_URL=http://localhost:5000/api` for CRA, `VITE_API_URL` for Vite).
-   [ ] **Testing Phase 1**
    -   [ ] Ensure the React app runs.
    -   [ ] Basic navigation between placeholder pages for login/register works.

## Phase 2: User Authentication (Teacher & Student)

-   [ ] **Authentication Service (`services/authService.js`)**
    -   [ ] `registerTeacher(name, email, password)` function.
    -   [ ] `loginTeacher(email, password)` function.
    -   [ ] `registerStudent(name, email, password)` function.
    -   [ ] `loginStudent(email, password)` function.
    -   [ ] `logout()` function (clears token from storage).
-   [ ] **Authentication State Management (Context API or Redux/Zustand)**
    -   [ ] Store user info (token, role, name, email).
    -   [ ] Actions/reducers for login, register, logout.
    -   [ ] Persist auth state (e.g., in localStorage).
-   [ ] **Registration Pages**
    -   [ ] `TeacherRegisterPage.js` (`pages/TeacherRegisterPage.js`)
        -   Form with name, email, password fields.
        -   Call `authService.registerTeacher`.
        -   Handle success (redirect to login or dashboard) and errors.
    -   [ ] `StudentRegisterPage.js` (`pages/StudentRegisterPage.js`)
        -   Form with name, email, password fields.
        -   Call `authService.registerStudent`.
        -   Handle success and errors.
-   [ ] **Login Pages**
    -   [ ] `TeacherLoginPage.js` (`pages/TeacherLoginPage.js`)
        -   Form with email, password fields.
        -   Call `authService.loginTeacher`.
        -   On success, store token, user info, and redirect to Teacher Dashboard.
        -   Handle errors.
    -   [ ] `StudentLoginPage.js` (`pages/StudentLoginPage.js`)
        -   Form with email, password fields.
        -   Call `authService.loginStudent`.
        -   On success, store token, user info, and redirect to Student Dashboard.
        -   Handle errors.
-   [ ] **UI Components for Auth (`components/auth`)**
    -   [ ] Reusable `AuthForm` component (or separate `LoginForm`, `RegisterForm`).
    -   [ ] Input fields, buttons with appropriate styling.
-   [ ] **Protected Routes (`routes/ProtectedRoutes.js`)**
    -   [ ] Create components for `ProtectedRouteTeacher` and `ProtectedRouteStudent`.
    -   [ ] Check for valid token and correct user role from auth state.
    -   [ ] Redirect to login if not authenticated or wrong role.
-   [ ] **Update Routing (`App.js` or `routes/index.js`)**
    -   [ ] Implement routes for dashboards, protected by `ProtectedRouteTeacher` / `ProtectedRouteStudent`.
    -   [ ] Implement logout functionality (e.g., in a Navbar).
-   [ ] **Testing Phase 2**
    -   [ ] Test Teacher registration and login flow.
    -   [ ] Test Student registration and login flow.
    -   [ ] Verify redirection after login/logout.
    -   [ ] Test access to protected dashboard routes (should fail if not logged in, or wrong role).
    -   [ ] Check error handling on forms (e.g., invalid email, incorrect password).

## Phase 3: Teacher Dashboard & Class Management

-   [ ] **Teacher Dashboard Page (`pages/TeacherDashboardPage.js`)**
    -   [ ] Layout for displaying created classes, options to create new class, view quizzes.
-   [ ] **Class Service (`services/classService.js`)**
    -   [ ] `createClass(className)` function (sends token in header).
    -   [ ] `getTeacherClasses()` function (sends token).
    -   [ ] `getClassDetails(classId)` function.
-   [ ] **Teacher Dashboard Components (`components/dashboard/teacher`)**
    -   [ ] `CreateClassModal.js` or `CreateClassForm.js`:
        -   Input for `className`.
        -   Submit button calls `classService.createClass`.
    -   [ ] `ClassList.js` / `ClassCard.js`:
        -   Display list of classes (name, enrollment key, number of students - future).
        -   Option to view class details/assigned quizzes.
-   [ ] **State Management for Teacher Classes**
    -   [ ] Fetch and store teacher's classes on dashboard load.
    -   [ ] Update list after creating a new class.
-   [ ] **Class Details View (Optional for now, or part of Quiz assignment)**
    -   [ ] Page/modal to show students in a class, quizzes assigned.
-   [ ] **Testing Phase 3**
    -   [ ] Teacher can view their dashboard.
    -   [ ] Teacher can create a new class.
        -   Verify the new class appears on the dashboard with an enrollment key.
    -   [ ] Data persistence for classes.

## Phase 4: Student Dashboard & Class Enrollment

-   [ ] **Student Dashboard Page (`pages/StudentDashboardPage.js`)**
    -   [ ] Layout for displaying enrolled classes, option to join new class, view available quizzes.
-   [ ] **Update Class Service (`services/classService.js`)**
    -   [ ] `joinClass(enrollmentKey)` function (sends token).
    -   [ ] `getStudentClasses()` function (sends token).
-   [ ] **Student Dashboard Components (`components/dashboard/student`)**
    -   [ ] `JoinClassModal.js` or `JoinClassForm.js`:
        -   Input for `enrollmentKey`.
        -   Submit button calls `classService.joinClass`.
    -   [ ] `EnrolledClassList.js` / `EnrolledClassCard.js`:
        -   Display list of enrolled classes (name, teacher name - future).
        -   Option to view available quizzes in that class.
-   [ ] **State Management for Student Classes**
    -   [ ] Fetch and store student's enrolled classes on dashboard load.
    -   [ ] Update list after joining a new class.
-   [ ] **Testing Phase 4**
    -   [ ] Student can view their dashboard.
    -   [ ] Student can join a class using a valid enrollment key.
        -   Verify the new class appears on their dashboard.
    -   [ ] Test joining with invalid/non-existent key.
    -   [ ] Test attempting to join a class already enrolled in.

## Phase 5: Quiz Creation & Assignment (Teacher)

-   [ ] **Quiz Service (`services/quizService.js`)**
    -   [ ] `createQuiz(quizData)` function.
    -   [ ] `assignQuizToClass(quizId, classId)` function.
    -   [ ] `getQuizzesByTeacher()` function.
    -   [ ] `getQuizDetailsForTeacher(quizId)` function.
-   [ ] **Quiz Creation Page/Modal (`pages/CreateQuizPage.js` or component within Teacher Dashboard)**
    -   [ ] Form for quiz `title`, `description`.
    -   [ ] Dynamic form for adding questions (Question Text).
    -   [ ] Dynamic form for adding options to each question (Option Text, `isCorrect` checkbox).
        -   Handle single/multiple correct answers selection logic if `multipleCorrectAnswers` is true.
    -   [ ] Submit button calls `quizService.createQuiz`.
-   [ ] **View Teacher's Quizzes (Component in Teacher Dashboard)**
    -   [ ] List quizzes created by the teacher (`QuizList.js`).
    -   [ ] Option to view/edit quiz (edit is future).
    -   [ ] Option to assign quiz to classes.
-   [ ] **Assign Quiz to Class UI**
    -   [ ] Modal or section when viewing a quiz or a class.
    -   [ ] Select from available classes to assign the quiz.
    -   [ ] Calls `quizService.assignQuizToClass`.
-   [ ] **State Management for Teacher's Quizzes**
    -   [ ] Fetch and store quizzes.
    -   [ ] Update list after creating a new quiz.
-   [ ] **Testing Phase 5**
    -   [ ] Teacher can access the quiz creation interface.
    -   [ ] Teacher can create a quiz with multiple questions and MCQs (text-only).
    -   [ ] Teacher can mark correct option(s) for each question.
    -   [ ] Created quiz appears in the teacher's list of quizzes.
    -   [ ] Teacher can assign a quiz to one or more of their created classes.

## Phase 6: Student Quiz Taking & Results

-   [ ] **Update Quiz Service (`services/quizService.js`)**
    -   [ ] `getQuizzesForClassStudent(classId)` function (to list quizzes for a student in a class).
    -   [ ] `getQuizForAttempt(quizId)` function (fetches quiz without answers for student to attempt).
-   [ ] **Attempt Service (`services/attemptService.js`)**
    -   [ ] `submitQuizAttempt(quizId, answers, classId)` function.
    -   [ ] `getStudentQuizResults()` function.
-   [ ] **View Available Quizzes (Student Dashboard/Class View)**
    -   [ ] When a student views an enrolled class, list assigned quizzes (`AvailableQuizzesList.js`).
    -   [ ] Each quiz should have a "Start Quiz" or "View Quiz" button.
-   [ ] **Quiz Attempt Page (`pages/AttemptQuizPage.js`)**
    -   [ ] Fetch quiz data (questions, options) using `quizService.getQuizForAttempt`.
    -   [ ] Display one question at a time or all questions on a page.
    -   [ ] For each question, display options (radio buttons for single correct, checkboxes for multiple correct).
    -   [ ] Collect student's answers.
    -   [ ] Submit button calls `attemptService.submitQuizAttempt`.
    -   [ ] Implement "once per attempt" logic (disable re-attempt or check on backend).
-   [ ] **Quiz Result Display Page/Modal (`pages/QuizResultPage.js` or component)**
    -   [ ] After submission, display score, total marks.
    -   [ ] Show questions, selected answers, and correct answers for review.
-   [ ] **Student Results History (Component in Student Dashboard)**
    -   [ ] List of attempted quizzes with scores (`AttemptHistory.js`).
    -   [ ] Option to view detailed results of a past attempt.
-   [ ] **State Management for Student Quiz Attempts & Results**
    -   [ ] Store current quiz being attempted.
    -   [ ] Store results after submission.
    -   [ ] Fetch and store past attempt history.
-   [ ] **Testing Phase 6**
    -   [ ] Student can see quizzes assigned to their enrolled classes.
    -   [ ] Student can attempt a quiz.
        -   Verify questions and options are displayed correctly.
        -   Student can select answers.
    -   [ ] Student can submit the quiz.
    -   [ ] Student sees their score and detailed results immediately after submission.
    -   [ ] Student can view their history of attempted quizzes and scores on their dashboard.
    -   [ ] Test the "attempt once" rule.

## Phase 7: Teacher Viewing Student Results

-   [ ] **Update Attempt Service (`services/attemptService.js`)**
    -   [ ] `getQuizResultsForTeacher(quizId, classId)` function.
-   [ ] **View Quiz Results in Class (Teacher Dashboard)**
    -   [ ] In Teacher's view of a class, or a specific quiz, provide an option to "View Results".
    -   [ ] Fetch results using `attemptService.getQuizResultsForTeacher`.
    -   [ ] Display a list/table of students who attempted the quiz, their scores, and submission times (`StudentResultsTable.js`).
    -   [ ] Option to view individual student's answers (future enhancement).
-   [ ] **State Management for Teacher Viewing Results**
    -   [ ] Fetch and display results for a selected quiz and class.
-   [ ] **Testing Phase 7**
    -   [ ] Teacher can select a quiz within a class they own.
    -   [ ] Teacher can view a summary of results for that quiz (list of students, scores).
    -   [ ] Verify correct data is displayed for the correct quiz and class.

## Phase 8: UI/UX Refinements & Advanced Features (Future)

-   [ ] **Consistent UI/UX**
    -   [ ] Ensure consistent design, colors, typography.
    -   [ ] Responsive design for different screen sizes.
-   [ ] **Error Handling & Notifications**
    -   [ ] Implement user-friendly error messages and success notifications (e.g., using toast notifications).
-   [ ] **Loading States**
    -   [ ] Add loading indicators for API calls.
-   [ ] **Accessibility (a11y)**
    -   [ ] Ensure the application is accessible (semantic HTML, ARIA attributes, keyboard navigation).
-   [ ] **Quiz Taking Enhancements**
    -   [ ] Timer for quizzes.
    -   [ ] Confirmation before submitting.
-   [ ] **Code Splitting/Lazy Loading**
    -   [ ] Optimize performance by lazy loading routes/components.
-   [ ] **Form Validation**
    -   [ ] Implement client-side form validation (e.g., with Formik, React Hook Form, or Yup).
-   [ ] **Testing**
    -   [ ] Write unit tests (Jest, React Testing Library).
    -   [ ] Consider end-to-end tests (Cypress, Playwright). 