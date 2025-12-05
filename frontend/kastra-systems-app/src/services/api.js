// Base API configuration with fallback
const PRIMARY_API = import.meta.env.VITE_API_URL || 'https://kastra-systems.onrender.com/api';
const FALLBACK_API = 'http://localhost:8000/api';

// Track which API is currently being used
let currentAPI = PRIMARY_API;

// API request helper with automatic fallback
export const apiRequest = async (endpoint, options = {}, retryWithFallback = true) => {
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add authorization header if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${currentAPI}${endpoint}`, config);

    // If response is ok, parse and return data
    if (response.ok) {
      const data = await response.json();
      return data;
    }

    // Handle specific error cases
    const data = await response.json();

    if (response.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
      throw new Error('Session expired. Please login again.');
    }

    throw new Error(data.detail || data.error || 'Something went wrong');

  } catch (error) {
    console.error(`API Error (${currentAPI}):`, error);

    // If primary API fails and we haven't tried fallback yet
    if (currentAPI === PRIMARY_API && retryWithFallback) {
      console.warn('Primary API failed, trying fallback localhost...');
      currentAPI = FALLBACK_API;

      try {
        // Retry with fallback API
        return await apiRequest(endpoint, options, false);
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        // Reset to primary for next request
        currentAPI = PRIMARY_API;
        throw new Error('Both primary and fallback APIs are unavailable. Please check your connection.');
      }
    }

    throw error;
  }
};

// GET request
export const get = (endpoint) => {
  return apiRequest(endpoint, {
    method: 'GET',
  });
};

// POST request
export const post = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const put = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const del = (endpoint) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
};

export default {
  get,
  post,
  put,
  delete: del,
  apiRequest,
};