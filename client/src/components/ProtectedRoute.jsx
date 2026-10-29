/**
 * SUMMARY:
 * This component acts as a security wrapper for private pages (like /dashboard).
 * It checks if the user is authenticated:
 * 1. While checking credentials: Shows a loading spinner on a cream background.
 * 2. If NOT logged in: Automatically redirects the user to the /login page.
 * 3. If logged in: Renders the protected page normally (children).
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // 1. Show loading screen while checking if a saved token is valid
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F0E4]">
        <Loader2 className="w-10 h-10 animate-spin text-[#6B21A8] mb-3" />
        <p className="text-[#4C2860] font-medium text-base">Verifying authentication...</p>
      </div>
    );
  }

  // 2. If user is not logged in, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. User is authorized, render the requested component
  return children;
};

export default ProtectedRoute;
