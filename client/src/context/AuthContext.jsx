/**
 * SUMMARY:
 * This file provides the central Authentication State for the entire React app.
 * It uses React Context so any component can easily:
 * - Check if a user is logged in (`isAuthenticated`).
 * - Access the current user's profile (`user`).
 * - Call `login(email, password)` to authenticate.
 * - Call `register(email, password)` to create an account.
 * - Call `logout()` to clear session and log out.
 * It also restores the user session from localStorage when the browser is refreshed.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

// Create the Context container
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Read saved user data from browser storage (if previously logged in)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('biptya_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Read saved JWT token from browser storage
  const [token, setToken] = useState(() => localStorage.getItem('biptya_token') || null);

  // Loading state while checking token validity on initial app boot
  const [loading, setLoading] = useState(true);

  // Verify the saved token with the backend upon opening or refreshing the app
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Ask server for fresh profile data
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('biptya_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Session verification failed:', err);
          // If token is invalid or expired, log out cleanly
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Handle user login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;

    // Save token and user in localStorage for persistence across reloads
    localStorage.setItem('biptya_token', newToken);
    localStorage.setItem('biptya_user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  // Handle new user registration
  const register = async (email, password) => {
    const res = await api.post('/auth/register', { email, password });
    const { token: newToken, user: userData } = res.data;

    // Save token and user in localStorage
    localStorage.setItem('biptya_token', newToken);
    localStorage.setItem('biptya_user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  // Handle user logout
  const logout = () => {
    // Remove stored credentials
    localStorage.removeItem('biptya_token');
    localStorage.removeItem('biptya_user');
    setToken(null);
    setUser(null);
  };

  // Expose state and functions to all child components
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom React hook to consume AuthContext cleanly in any component: const { user, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
