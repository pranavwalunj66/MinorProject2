import React from 'react';

const Input = React.forwardRef(({
  type = 'text',
  className = '',
  error,
  ...props
}, ref) => {
  const baseStyles = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm';
  const errorStyles = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '';

  return (
    <div>
      <input
        ref={ref}
        type={type}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
