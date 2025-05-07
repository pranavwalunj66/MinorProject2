import React from 'react';

const Card = ({ children, title, subtitle, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'bg-white rounded-lg overflow-hidden';

  const variantStyles = {
    default: 'shadow-md',
    bordered: 'border border-gray-200',
    flat: '',
    elevated: 'shadow-xl',
  };

  const cardClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>
    </div>
  );
};

export default Card;
