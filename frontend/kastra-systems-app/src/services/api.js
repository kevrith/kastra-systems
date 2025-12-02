// Base API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// API request helper with authentication
export const apiRequest = async (endpoint, options = {}) => {
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
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(data.detail || data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
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