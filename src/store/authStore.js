import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  loginTeacher,
  loginStudent,
  registerTeacher,
  registerStudent,
  storeAuthData,
  logout as logoutService,
} from '../services/authService';

const useAuthStore = create(
  persist(
    (set, _get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Register a user (teacher or student)
      registerUser: async (userData, role) => {
        set({ isLoading: true, error: null });
        try {
          const registerFn = role === 'teacher' ? registerTeacher : registerStudent;
          const response = await registerFn(userData);

          storeAuthData(response);

          set({
            user: {
              id: response._id,
              name: response.name,
              email: response.email,
              role: response.role,
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (err) {
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Registration failed',
          });
          throw err;
        }
      },

      // Login a user (teacher or student)
      loginUser: async (credentials, role) => {
        set({ isLoading: true, error: null });
        try {
          const loginFn = role === 'teacher' ? loginTeacher : loginStudent;
          const response = await loginFn(credentials);

          storeAuthData(response);

          set({
            user: {
              id: response._id,
              name: response.name,
              email: response.email,
              role: response.role,
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (err) {
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Login failed',
          });
          throw err;
        }
      },

      // Logout user
      logoutUser: () => {
        logoutService();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Clear any errors
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // only persist these fields
    }
  )
);

export default useAuthStore; 