import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({ children, requireOnboarding = true }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [adminBypass, setAdminBypass] = useState(false);
  
  // For demo - also check localStorage
  const isAuthenticatedLocal = localStorage.getItem('isAuthenticated') === 'true';
  
  // Check for admin bypass in URL or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const hasAdminParam = urlParams.get('admin') === 'true';
    const hasAdminBypass = localStorage.getItem('adminBypass') === 'true';
    
    if (hasAdminParam) {
      localStorage.setItem('adminBypass', 'true');
      setAdminBypass(true);
    } else if (hasAdminBypass) {
      setAdminBypass(true);
    }
    
    // Admin keyboard shortcut: Ctrl+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        localStorage.setItem('adminBypass', 'true');
        setAdminBypass(true);
        console.log('Admin bypass activated');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location]);

  if (!isAuthenticated && !isAuthenticatedLocal) {
    return <Navigate to="/signup" replace />;
  }

  // Skip onboarding check if admin bypass is active
  if (requireOnboarding && !user?.hasCompletedOnboarding && !isAuthenticatedLocal && !adminBypass) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;