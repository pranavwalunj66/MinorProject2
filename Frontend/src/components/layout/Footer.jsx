import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-white">
              QuizCraze
            </Link>
            <p className="text-sm text-gray-300 mt-1">Making learning interactive and engaging</p>
          </div>

          <div className="text-sm text-gray-300">
            &copy; {currentYear} QuizCraze. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
