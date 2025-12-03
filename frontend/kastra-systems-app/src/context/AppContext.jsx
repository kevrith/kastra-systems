import React, { createContext, useState, useContext, useEffect } from 'react';

// Create App Context
const AppContext = createContext(null);

// App Provider Component
export const AppProvider = ({ children }) => {
  // Global state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    const savedTheme = localStorage.getItem('theme');
    const savedActiveTab = localStorage.getItem('activeTab');

    if (savedSidebarState !== null) {
      setSidebarOpen(savedSidebarState === 'true');
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', newState);
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Change active tab
  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: notification.type || 'info', // success, error, warning, info
      message: notification.message,
      duration: notification.duration || 5000,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Show success message
  const showSuccess = (message, duration) => {
    addNotification({ type: 'success', message, duration });
  };

  // Show error message
  const showError = (message, duration) => {
    addNotification({ type: 'error', message, duration });
  };

  // Show warning message
  const showWarning = (message, duration) => {
    addNotification({ type: 'warning', message, duration });
  };

  // Show info message
  const showInfo = (message, duration) => {
    addNotification({ type: 'info', message, duration });
  };

  // Set global loading
  const startGlobalLoading = () => setGlobalLoading(true);
  const stopGlobalLoading = () => setGlobalLoading(false);

  const value = {
    // Sidebar
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,

    // Theme
    theme,
    setTheme,
    toggleTheme,

    // Active Tab
    activeTab,
    setActiveTab,
    changeTab,

    // Notifications
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Loading
    globalLoading,
    startGlobalLoading,
    stopGlobalLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      
      {/* Notification Display */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`
                max-w-md p-4 rounded-lg shadow-lg animate-slide-in
                ${notification.type === 'success' ? 'bg-green-500 text-white' : ''}
                ${notification.type === 'error' ? 'bg-red-500 text-white' : ''}
                ${notification.type === 'warning' ? 'bg-yellow-500 text-white' : ''}
                ${notification.type === 'info' ? 'bg-blue-500 text-white' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <p className="flex-1">{notification.message}</p>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-4 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Loading Overlay */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

// Custom hook to use App Context
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;