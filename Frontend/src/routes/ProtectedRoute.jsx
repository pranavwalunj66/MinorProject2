import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../services/authService';

// ProtectedRoute component that checks authentication and optional role
const ProtectedRoute = ({ allowedRoles }) => {
  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user's role is not in the allowed roles, redirect to unauthorized
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
