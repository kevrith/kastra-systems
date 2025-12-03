import { useState, useEffect } from 'react';
import authService from '../services/authService';

//  Custom hook for authentication
//  Provides authentication state and methods

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();

      if (currentUser && token) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(username, password);
      
      setUser(response.user);
      setIsAuthenticated(true);

      return { success: true, user: response.user };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      await authService.register(userData);

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Update user data
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if user is teacher
  const isTeacher = () => {
    return user?.role === 'teacher';
  };

  // Check if user is student
  const isStudent = () => {
    return user?.role === 'student';
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus,
    hasRole,
    hasAnyRole,
    isAdmin,
    isTeacher,
    isStudent
  };
};

export default useAuth;