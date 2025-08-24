// =====================================================
// PROTECTED ROUTE COMPONENT
// Auth guard for client portal pages
// Redirects to auth page if not authenticated
// =====================================================

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2, Building, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireClient?: boolean; // Whether client profile is required
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireClient = true 
}) => {
  const { isAuthenticated, isLoading, user, client } = useSupabaseAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Show loading spinner while checking auth (with timeout)
  if (isLoading && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-zinc-600 text-lg font-medium">Checking your access...</p>
          <p className="text-zinc-500 text-sm mt-2">This will only take a moment</p>
        </div>
      </div>
    );
  }

  // If loading times out, redirect to auth
  if (loadingTimeout) {
    console.warn('Auth check timed out, redirecting to login');
    return (
      <Navigate 
        to="/auth" 
        state={{ 
          redirect: location.pathname + location.search,
          message: 'Session check timed out. Please sign in.'
        }} 
        replace 
      />
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    return (
      <Navigate 
        to="/auth" 
        state={{ 
          redirect: location.pathname + location.search,
          message: 'Please sign in to access this page'
        }} 
        replace 
      />
    );
  }

  // If user exists but no client profile and client is required
  if (requireClient && !client) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Account Not Found</h1>
          <p className="text-zinc-600 mb-6">
            Your account exists but isn't linked to a client profile. 
            This might happen if:
          </p>
          <ul className="text-left text-zinc-600 space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-zinc-400">•</span>
              Your invitation hasn't been processed yet
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-400">•</span>
              Your account needs to be activated by an admin
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-400">•</span>
              There's a mismatch between your email addresses
            </li>
          </ul>
          <p className="text-zinc-600 text-sm">
            Please contact your administrator for assistance at{' '}
            <a href="mailto:support@yourcompany.com" className="text-zinc-900 font-medium">
              support@yourcompany.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;