// =====================================================
// IMPERSONATION BANNER COMPONENT
// Shows when an admin is impersonating a client
// Provides exit impersonation functionality
// =====================================================

import React from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Shield, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImpersonationBanner: React.FC = () => {
  const { impersonationSession, isImpersonating, exitImpersonation } = useSupabaseAuth();

  // Don't show banner if not impersonating
  if (!isImpersonating || !impersonationSession) {
    return null;
  }

  const handleExit = async () => {
    if (confirm('Are you sure you want to exit impersonation mode?')) {
      await exitImpersonation();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Shield className="w-5 h-5" />
              <span className="font-semibold text-sm">ADMIN MODE</span>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-300" />
              <div className="text-sm">
                <span className="font-medium">Impersonating:</span>{' '}
                <span className="font-bold">{impersonationSession.client_name}</span>
                {' '}({impersonationSession.client_email})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-white/80">
              Admin: <span className="font-medium">{impersonationSession.admin_email}</span>
            </div>
            
            <Button
              onClick={handleExit}
              variant="ghost"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 gap-2"
            >
              <X className="w-4 h-4" />
              Exit Impersonation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpersonationBanner;