import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-secondary-600">401</h1>
        <h2 className="text-3xl font-medium text-gray-900 mt-4">Unauthorized Access</h2>
        <p className="text-gray-500 mt-2 mb-6">
          Sorry, you don't have permission to access this page.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Go Home
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
