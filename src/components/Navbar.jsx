import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const { isLoggedIn, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isHome = location.pathname === '/';

  return (
    <nav className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {!isHome && (
            <button onClick={handleBack} className="text-gray-600 hover:text-black flex items-center">
              {/* Optional: replace with your own icon or emoji */}
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          )}
          <Link to="/" className="text-xl font-bold">StayFinder</Link>
        </div>

        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              {role === 'seller' && (
                <Link to="/host-listing" className="hover:text-blue-600">Host a Listing</Link>
              )}
              <Link to="/profile" className="hover:text-blue-600">Profile</Link>
              <button onClick={handleLogout} className="hover:text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}