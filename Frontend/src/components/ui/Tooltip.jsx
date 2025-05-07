import { useState } from 'react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimer, setShowTimer] = useState(null);

  // Handle mouse enter
  const handleMouseEnter = () => {
    clearTimeout(showTimer);
    const timer = setTimeout(() => setIsVisible(true), delay);
    setShowTimer(timer);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    clearTimeout(showTimer);
    setIsVisible(false);
  };

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  // Arrow classes
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-800 text-white text-sm rounded px-2 py-1 whitespace-nowrap">
            {content}
            <span className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip; 