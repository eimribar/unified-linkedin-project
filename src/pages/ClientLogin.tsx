// =====================================================
// CLIENT LOGIN PAGE
// PIN-based authentication for clients
// Mobile-first responsive design
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientAuth } from '@/contexts/ClientAuthContext';
import { Mail, Lock, Building, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const ClientLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, error: authError, isLoading } = useClientAuth();
  
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Basic validation
    if (!email || !pin) {
      setLocalError('Please enter both email and PIN');
      return;
    }

    if (pin.length < 4) {
      setLocalError('PIN must be at least 4 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await signIn(email, pin);
      if (success) {
        // Redirect to approval page after successful login
        navigate('/client-approve');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Logo/Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome Back</h1>
        <p className="text-zinc-600">Sign in to review your content</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {displayError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{displayError}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PIN Input */}
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-zinc-700 mb-2">
                Access PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  placeholder="Enter your PIN"
                  autoComplete="current-password"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Your PIN was provided by your content manager
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <p className="text-sm text-zinc-600 text-center">
              Having trouble signing in?{' '}
              <a href="mailto:support@yourcompany.com" className="font-medium text-zinc-900 hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </div>

        {/* Mobile App Prompt */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-600">
            For the best experience on mobile, add this site to your home screen
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;