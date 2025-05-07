import React from 'react';
import useAuthStore from '../../store/authStore';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/constants';

const TeacherDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Manage your classes, create quizzes, and track student progress.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to={ROUTES.TEACHER.CLASSES}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My Classes</h2>
          <p className="text-gray-600">Create and manage your classes</p>
        </Link>

        <Link
          to={ROUTES.TEACHER.QUIZZES}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My Quizzes</h2>
          <p className="text-gray-600">Create and manage quizzes</p>
        </Link>

        <Link
          to={ROUTES.TEACHER.QUESTION_BANKS}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Question Banks</h2>
          <p className="text-gray-600">Manage your question banks</p>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-gray-600 text-center py-8">
          Your recent activity will appear here
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 