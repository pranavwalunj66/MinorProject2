import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ROUTES } from '../../config/constants';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { registerTeacher, registerStudent, error: authError, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (formData.role === 'teacher') {
        await registerTeacher(formData.name, formData.email, formData.password);
        navigate(ROUTES.TEACHER.DASHBOARD);
      } else {
        await registerStudent(formData.name, formData.email, formData.password);
        navigate(ROUTES.STUDENT.DASHBOARD);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setValidationError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {(validationError || authError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {validationError || authError}
        </div>
      )}

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Register as
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isLoading}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm; 