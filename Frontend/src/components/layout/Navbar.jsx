import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../config/constants';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutUser } = useAuthStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    navigate(ROUTES.LOGIN);
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', path: ROUTES.HOME },
        { name: 'Login', path: ROUTES.LOGIN },
        { name: 'Register', path: ROUTES.REGISTER },
      ];
    }

    const commonLinks = [
      { name: 'Home', path: ROUTES.HOME },
      { name: 'Dashboard', path: user?.role === 'teacher' ? ROUTES.TEACHER.DASHBOARD : ROUTES.STUDENT.DASHBOARD },
    ];

    if (user?.role === 'teacher') {
      commonLinks.push(
        { name: 'My Classes', path: ROUTES.TEACHER.CLASSES },
        { name: 'My Quizzes', path: ROUTES.TEACHER.QUIZZES },
        { name: 'Question Banks', path: ROUTES.TEACHER.QUESTION_BANKS },
      );
    }

    if (user?.role === 'student') {
      commonLinks.push(
        { name: 'My Classes', path: ROUTES.STUDENT.CLASSES },
        { name: 'My Attempts', path: ROUTES.STUDENT.ATTEMPTS },
        { name: 'Practice', path: ROUTES.STUDENT.PRACTICE },
      );
    }

    return commonLinks;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-primary-600">QuizCraze</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              {getNavLinks().map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
