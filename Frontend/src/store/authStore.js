import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/authService';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      error: null,

      // Login actions
      loginTeacher: async (email, password) => {
        try {
          const data = await authService.loginTeacher(email, password);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            role: 'teacher',
            error: null,
          });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Login failed' });
          throw error;
        }
      },

      loginStudent: async (email, password) => {
        try {
          const data = await authService.loginStudent(email, password);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            role: 'student',
            error: null,
          });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Login failed' });
          throw error;
        }
      },

      // Register actions
      registerTeacher: async (name, email, password) => {
        try {
          const data = await authService.registerTeacher(name, email, password);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            role: 'teacher',
            error: null,
          });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Registration failed' });
          throw error;
        }
      },

      registerStudent: async (name, email, password) => {
        try {
          const data = await authService.registerStudent(name, email, password);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            role: 'student',
            error: null,
          });
          return data;
        } catch (error) {
          set({ error: error.response?.data?.message || 'Registration failed' });
          throw error;
        }
      },

      // Logout action
      logoutUser: () => {
        authService.logout(); // Clear localStorage
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: null,
          error: null,
        });
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);

export default useAuthStore;
