import { Link, Navigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';

const LoginPage = () => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={role === 'teacher' ? ROUTES.TEACHER.DASHBOARD : ROUTES.STUDENT.DASHBOARD} replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Sign in to your account
          </h2>
          <p className="text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 