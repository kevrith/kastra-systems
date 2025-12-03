import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (storedUser && token) {
        setUser(storedUser);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login(username, password);
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
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
    setError(null);
  };

  // Update user
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated();
  };

  // Check user role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check multiple roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;