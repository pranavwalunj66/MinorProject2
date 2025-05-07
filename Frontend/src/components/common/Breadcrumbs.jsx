import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items = [], separator = '/' }) => {
  return (
    <nav className="flex text-sm text-gray-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            {isLast ? (
              <span className="font-medium text-gray-700">{item.label}</span>
            ) : (
              <>
                <Link
                  to={item.path}
                  className="hover:text-blue-600 hover:underline"
                >
                  {item.label}
                </Link>
                <span className="mx-2 text-gray-400">{separator}</span>
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs; 