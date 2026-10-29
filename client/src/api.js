/**
 * SUMMARY:
 * This file creates and configures the Axios HTTP client used by the React app.
 * It provides two critical automated features:
 * 1. Request Interceptor: Automatically grabs the stored JWT token from localStorage
 *    and attaches it to the "Authorization: Bearer <token>" header of every outgoing request.
 * 2. Response Interceptor: If any request fails with a 401 Unauthorized (e.g. expired token),
 *    it automatically clears the old token and redirects the user to the /login page.
 * 3. Base URL Normalizer: Ensures that the API URL correctly ends with "/api".
 */

import axios from 'axios';

// Helper function: Reads the backend API URL from environment variables or defaults to localhost.
// It trims trailing slashes and ensures the URL ends with "/api".
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

// Create the configured Axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// REQUEST INTERCEPTOR: ATTACH AUTH TOKEN
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Check if the user is currently logged in with a saved token
    const token = localStorage.getItem('biptya_token');
    if (token) {
      // Attach the token as a Bearer authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR: HANDLE 401 ERRORS
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 (Unauthorized or token expired)
    if (error.response && error.response.status === 401) {
      // Clear invalid login credentials from browser storage
      localStorage.removeItem('biptya_token');
      localStorage.removeItem('biptya_user');

      // Redirect the user to the login page if they are not already there
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
