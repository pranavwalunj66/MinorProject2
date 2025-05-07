import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ProtectedRoute from './ProtectedRoute';
import PageLayout from '../components/layout/PageLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';
import Unauthorized from '../pages/Unauthorized';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <PageLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
          {
            path: 'unauthorized',
            element: <Unauthorized />,
          },
        ],
      },
      {
        path: 'teacher',
        element: (
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <TeacherDashboard />,
          },
          // More teacher routes will be added here
        ],
      },
      {
        path: 'student',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <StudentDashboard />,
          },
          // More student routes will be added here
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
