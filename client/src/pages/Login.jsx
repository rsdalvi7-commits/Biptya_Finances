/**
 * SUMMARY:
 * This component renders the User Login page (/login):
 * - Clean branded form with Biptya Finances logo and Times New Roman typography.
 * - Form inputs for Email and Password with a show/hide password toggle.
 * - Calls `login(email, password)` via AuthContext on submission.
 * - Saves session token and redirects to /dashboard upon successful authentication.
 * - Shows an error banner if the server rejects the credentials.
 * - Includes a link to the registration page for new users.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  // Input and UI state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check that both inputs are provided
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Authenticate with the server
      await login(email, password);
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E092B] via-[#330F47] to-[#1E092B] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header with Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#581C87] text-[#FAF5EB] shadow-xl shadow-[#581C87]/40 mb-4 border border-[#7E22CE]/40">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FAF5EB] tracking-tight">
            Biptya <span className="text-[#D8B4FE]">Finances</span>
          </h1>
          <p className="text-[#D8C7E8] mt-2 text-sm font-medium">
            Personal Expense & Budget Tracker
          </p>
        </div>

        {/* Login Card (Warm Cream Background) */}
        <div className="bg-[#FBF7EE] rounded-2xl shadow-2xl p-8 border border-[#DDD0B8]">
          <h2 className="text-2xl font-bold text-[#260E36] mb-1">Welcome Back</h2>
          <p className="text-[#5B4469] text-sm mb-6 font-medium">
            Enter your credentials to access your financial dashboard
          </p>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-5 flex items-center gap-3 p-3.5 rounded-xl bg-[#F5E1E6] border border-[#E8D0D6] text-[#831843] text-sm font-bold">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#831843]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#5B4469] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E22CE]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#EFE7D6] border border-[#DDD0B8] rounded-xl text-[#260E36] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:bg-[#FAF5EB] transition placeholder-[#8A7397]"
                />
              </div>
            </div>

            {/* Password with Show/Hide toggle */}
            <div>
              <label className="block text-xs font-bold text-[#5B4469] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7E22CE]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 bg-[#EFE7D6] border border-[#DDD0B8] rounded-xl text-[#260E36] text-sm focus:outline-none focus:ring-2 focus:ring-[#7E22CE] focus:bg-[#FAF5EB] transition placeholder-[#8A7397]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5B4469] hover:text-[#260E36] transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#581C87] hover:bg-[#4A154B] text-[#FAF5EB] font-bold rounded-xl shadow-lg shadow-[#581C87]/30 focus:outline-none focus:ring-2 focus:ring-[#7E22CE] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#FAF5EB]" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link to Registration */}
          <div className="mt-6 pt-6 border-t border-[#EFE7D6] text-center">
            <p className="text-sm text-[#5B4469] font-medium">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[#581C87] hover:text-[#7E22CE] transition underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
