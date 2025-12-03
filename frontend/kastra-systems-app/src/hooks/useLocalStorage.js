import { useState, useEffect } from 'react';

//  Custom hook for localStorage with state synchronization
//  Automatically syncs state with localStorage
 
const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save to state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

//   Custom hook for session storage
//   Similar to useLocalStorage but uses sessionStorage

export const useSessionStorage = (key, initialValue) => {
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Custom hook to check if a key exists in localStorage

export const useLocalStorageExists = (key) => {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const checkExists = () => {
      if (typeof window === 'undefined') return false;
      return window.localStorage.getItem(key) !== null;
    };

    setExists(checkExists());

    const handleStorageChange = (e) => {
      if (e.key === key) {
        setExists(e.newValue !== null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return exists;
};

// Custom hook to get multiple localStorage items

export const useMultipleLocalStorage = (keys) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    const loadValues = () => {
      const loadedValues = {};
      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          loadedValues[key] = item ? JSON.parse(item) : null;
        } catch (error) {
          console.warn(`Error reading localStorage key "${key}":`, error);
          loadedValues[key] = null;
        }
      });
      setValues(loadedValues);
    };

    loadValues();
  }, [keys.join(',')]);

  const updateValue = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setValues(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [values, updateValue];
};

// Custom hook for localStorage with expiration
 
export const useLocalStorageWithExpiry = (key, initialValue, expiryInMinutes = 60) => {
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const itemStr = window.localStorage.getItem(key);
      if (!itemStr) {
        return initialValue;
      }

      const item = JSON.parse(itemStr);
      const now = new Date();

      // Check if expired
      if (now.getTime() > item.expiry) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return item.value;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = (value) => {
    try {
      const now = new Date();
      const item = {
        value: value instanceof Function ? value(storedValue) : value,
        expiry: now.getTime() + expiryInMinutes * 60 * 1000
      };

      setStoredValue(item.value);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(item));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Custom hook to clear all localStorage

export const useClearLocalStorage = () => {
  const clearAll = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  };

  return clearAll;
};

export default useLocalStorage;