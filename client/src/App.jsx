/**
 * SUMMARY:
 * This is the root React component that configures client-side routing:
 * 1. Wraps the whole application with `AuthProvider` so authentication state is available everywhere.
 * 2. Uses `BrowserRouter` and `Routes` from React Router:
 *    - Public Route: `/login` renders Login page.
 *    - Public Route: `/register` renders Register page.
 *    - Protected Route: `/dashboard` guarded by `ProtectedRoute` (requires valid JWT session).
 *    - Redirects: Any unknown path (`*`) or root (`/`) automatically redirects to `/dashboard`.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    // Provide authentication state (user, token, login, logout) to all pages
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ==========================================
              PUBLIC ROUTES (Accessible by anyone)
              ========================================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ==========================================
              PROTECTED ROUTE (Requires valid login)
              ========================================== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ==========================================
              REDIRECTS (Root and unknown URLs -> Dashboard)
              ========================================== */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
