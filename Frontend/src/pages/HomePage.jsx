import React from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaQuestionCircle } from 'react-icons/fa';
import { ROUTES } from '../config/constants';

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to <span className="text-primary-600">QuizCraze</span>
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            An interactive learning platform for creating and taking quizzes, tracking progress, and
            enhancing education.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Get Started
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-100"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Teacher Feature */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaChalkboardTeacher className="text-5xl text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">For Teachers</h3>
              <p className="text-gray-500">
                Create classes, design quizzes, and track student performance with detailed
                analytics.
              </p>
            </div>

            {/* Student Feature */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaUserGraduate className="text-5xl text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">For Students</h3>
              <p className="text-gray-500">
                Take quizzes, view your results, and track your progress across all your classes.
              </p>
            </div>

            {/* Question Bank Feature */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaQuestionCircle className="text-5xl text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Question Banks</h3>
              <p className="text-gray-500">
                Practice with adaptive difficulty question banks to improve your knowledge.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <Link
            to={ROUTES.REGISTER}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
