import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// ProtectedRoute component that checks authentication and optional role
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to unauthorized page if role is not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
