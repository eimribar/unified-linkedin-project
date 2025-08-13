import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarding = true }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  
  // For demo - also check localStorage
  const isAuthenticatedLocal = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated && !isAuthenticatedLocal) {
    return <Navigate to="/signup" replace />;
  }

  if (requireOnboarding && !user?.hasCompletedOnboarding && !isAuthenticatedLocal) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;