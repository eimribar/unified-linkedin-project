// =====================================================
// SIMPLE AUTHENTICATION PAGE - REDESIGNED
// Beautiful animated auth with dot matrix effect
// =====================================================

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { SignInPage } from '@/components/ui/sign-in-flow-with-canvas';
import toast from 'react-hot-toast';

const AuthSimple: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [clientName, setClientName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const invitationToken = searchParams.get('invitation');
  const errorType = searchParams.get('error');

  // Check if already authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch client name if invitation token present
  useEffect(() => {
    if (invitationToken) {
      fetchClientName();
    } else {
      setLoading(false);
    }
  }, [invitationToken]);

  // Show error message if redirected with error
  useEffect(() => {
    if (errorType === 'unauthorized') {
      toast.error('You are not authorized to access this platform. Please contact your administrator.');
    }
  }, [errorType]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Already logged in, redirect
      window.location.href = '/client-approve';
    }
  };

  const fetchClientName = async () => {
    if (!invitationToken) {
      setLoading(false);
      return;
    }

    try {
      // Fetch client data by invitation token
      const { data, error } = await supabase
        .from('clients')
        .select('name, company')
        .eq('invitation_token', invitationToken)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        // Don't show error to user - just don't display name
      } else if (data) {
        setClientName(data.name || data.company || null);
      }
    } catch (err) {
      console.error('Error in fetchClientName:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading briefly while fetching client name
  if (loading && invitationToken) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <SignInPage 
      invitationToken={invitationToken}
      clientName={clientName}
    />
  );
};

export default AuthSimple;