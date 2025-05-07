import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';
import { ROUTES } from '../config/constants';

/**
 * Hook for authentication-related functionality
 */
const useAuth = () => {
  const navigate = useNavigate();
  const showNotification = useUiStore((state) => state.showNotification);

  // Extract state and actions from authStore
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    registerUser,
    loginUser,
    logoutUser,
    clearError,
  } = useAuthStore();

  // Handle user registration
  const register = useCallback(
    async (userData, role) => {
      try {
        await registerUser(userData, role);
        showNotification(`Registration successful! Welcome ${userData.name}`, 'success');
        navigate(role === 'teacher' ? ROUTES.TEACHER.DASHBOARD : ROUTES.STUDENT.DASHBOARD);
        return true;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Registration failed. Please try again.';
        showNotification(errorMessage, 'error');
        return false;
      }
    },
    [registerUser, showNotification, navigate]
  );

  // Handle user login
  const login = useCallback(
    async (credentials, role) => {
      try {
        await loginUser(credentials, role);
        showNotification('Login successful!', 'success');
        navigate(role === 'teacher' ? ROUTES.TEACHER.DASHBOARD : ROUTES.STUDENT.DASHBOARD);
        return true;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Login failed. Please check your credentials.';
        showNotification(errorMessage, 'error');
        return false;
      }
    },
    [loginUser, showNotification, navigate]
  );

  // Handle user logout
  const logout = useCallback(() => {
    logoutUser();
    showNotification('You have been logged out.', 'info');
    navigate(ROUTES.LOGIN);
  }, [logoutUser, showNotification, navigate]);

  // Clear authentication errors when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    clearError,
  };
};

export default useAuth;
