import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import PageLayout from './PageLayout';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';

const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const getSidebarLinks = () => {
    if (user?.role === 'teacher') {
      return [
        { name: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD, icon: '📊' },
        { name: 'My Classes', path: ROUTES.TEACHER.CLASSES, icon: '👥' },
        { name: 'My Quizzes', path: ROUTES.TEACHER.QUIZZES, icon: '📝' },
        { name: 'Question Banks', path: ROUTES.TEACHER.QUESTION_BANKS, icon: '📚' },
      ];
    }

    return [
      { name: 'Dashboard', path: ROUTES.STUDENT.DASHBOARD, icon: '📊' },
      { name: 'My Classes', path: ROUTES.STUDENT.CLASSES, icon: '👥' },
      { name: 'My Attempts', path: ROUTES.STUDENT.ATTEMPTS, icon: '✍️' },
      { name: 'Practice', path: ROUTES.STUDENT.PRACTICE, icon: '🎯' },
    ];
  };

  const sidebarLinks = getSidebarLinks();

  return (
    <PageLayout>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {sidebarLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="mr-3">{link.icon}</span>
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <main className="flex-1 relative focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardLayout; 