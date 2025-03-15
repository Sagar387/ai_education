import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">StudyAI</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/dashboard" className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/tools" className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                Study Tools
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/signin" className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
              Sign In
            </Link>
            <Link to="/signup" className="ml-3 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;