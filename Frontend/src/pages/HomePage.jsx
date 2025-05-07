import React from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { ROUTES } from '../config/constants';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to QuizCraze
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            An interactive platform for teachers and students
          </p>
          <div className="flex justify-center space-x-8 mb-12">
            <div className="text-center">
              <div className="bg-primary-100 p-6 rounded-full inline-block mb-4">
                <FaChalkboardTeacher className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">For Teachers</h2>
              <p className="text-gray-600 mt-2">Create and manage quizzes</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary-100 p-6 rounded-full inline-block mb-4">
                <FaUserGraduate className="w-12 h-12 text-secondary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">For Students</h2>
              <p className="text-gray-600 mt-2">Learn and practice</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-md mx-auto space-y-4">
          <Link
            to={ROUTES.LOGIN}
            className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
