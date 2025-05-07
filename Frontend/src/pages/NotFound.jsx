import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-medium text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
