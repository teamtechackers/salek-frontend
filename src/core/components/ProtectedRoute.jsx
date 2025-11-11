import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const adminId = localStorage.getItem('adminId');
      const authStatus = !!(token && adminId);
      
      setIsAuthenticated(authStatus);
      setIsLoading(false);
      
      // If no token or adminId, redirect to login
      if (!authStatus) {
        navigate('/login');
      }
    };

    checkAuth();

    // Listen for storage changes (in case of logout from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;