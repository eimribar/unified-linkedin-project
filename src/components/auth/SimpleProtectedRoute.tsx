import { Navigate, useLocation } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useEffect, useState } from "react";

interface SimpleProtectedRouteProps {
  children: React.ReactNode;
}

const SimpleProtectedRoute: React.FC<SimpleProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useSimpleAuth();
  const location = useLocation();
  const [checkingImpersonation, setCheckingImpersonation] = useState(true);
  const [hasImpersonation, setHasImpersonation] = useState(false);

  useEffect(() => {
    // Check for impersonation token in URL or localStorage
    const urlParams = new URLSearchParams(location.search);
    const impersonationToken = urlParams.get('impersonation') || localStorage.getItem('admin_impersonation_token');
    
    if (impersonationToken) {
      // Store token in localStorage for persistence
      localStorage.setItem('admin_impersonation_token', impersonationToken);
      setHasImpersonation(true);
    }
    setCheckingImpersonation(false);
  }, [location]);

  if (loading || checkingImpersonation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Allow access if user is authenticated OR if there's an impersonation token
  if (!user && !hasImpersonation) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default SimpleProtectedRoute;