import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem('token');
    const adminId = localStorage.getItem('adminId');

    // If we're on the login page and have a valid token, redirect to dashboard
    if (window.location.pathname === '/login' && token && adminId) {
      navigate('/app/dashboard');
    }
  }, [navigate]);

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    
    // Force a full page reload to ensure all components re-render
    window.location.href = '/login';
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const adminId = localStorage.getItem('adminId');
    return !!(token && adminId);
  };

  return { logout, isAuthenticated };
};

export default useAuth;