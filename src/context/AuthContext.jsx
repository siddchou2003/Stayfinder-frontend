import { createContext, useState, useEffect, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component wraps your app and provides auth state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  // On initial load, check localStorage for existing auth info
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(storedRole || '');
  }, []);

  // Login function: save token and role to localStorage + update state
  const login = (token, userRole) => {
    const roleLower = userRole.toLowerCase();
    localStorage.setItem('token', token);
    localStorage.setItem('role', roleLower);
    setIsLoggedIn(true);
    setRole(roleLower);
  };

  // Logout function: clear everything and reset state
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole('');
  };

  // Provide auth state and functions to the entire app
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming AuthContext in components
export const useAuth = () => useContext(AuthContext);