import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// Placeholder Pages
const LoginPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold">Login Page</h1>
  </div>
);
const RegisterPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold">Register Page</h1>
  </div>
);
const TeacherDashboardPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
  </div>
);
const StudentDashboardPage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold">Student Dashboard</h1>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
        {/* Additional teacher routes will go here */}
      </Route>

      {/* Protected Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        {/* Additional student routes will go here */}
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
