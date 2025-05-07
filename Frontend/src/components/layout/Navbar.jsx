import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { isAuthenticated, logout, getCurrentUser } from '../../services/authService';
import { ROUTES } from '../../config/constants';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  const user = getCurrentUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const getNavLinks = () => {
    if (!isAuth) {
      return [
        { name: 'Home', path: ROUTES.HOME },
        { name: 'Login', path: ROUTES.LOGIN },
        { name: 'Register', path: ROUTES.REGISTER },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        { name: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD },
        { name: 'My Classes', path: ROUTES.TEACHER.CLASSES },
        { name: 'My Quizzes', path: ROUTES.TEACHER.QUIZZES },
        { name: 'Question Banks', path: ROUTES.TEACHER.QUESTION_BANKS },
      ];
    }

    if (user?.role === 'student') {
      return [
        { name: 'Dashboard', path: ROUTES.STUDENT.DASHBOARD },
        { name: 'My Classes', path: ROUTES.STUDENT.CLASSES },
        { name: 'My Attempts', path: ROUTES.STUDENT.ATTEMPTS },
        { name: 'Practice', path: ROUTES.STUDENT.PRACTICE },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600">QuizCraze</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              >
                {link.name}
              </Link>
            ))}

            {isAuth && (
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 flex items-center"
              >
                <FaSignOutAlt className="mr-1" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isAuth && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
