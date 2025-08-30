// =====================================================
// SIMPLE OAUTH CALLBACK HANDLER
// Handles OAuth return and links accounts
// =====================================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { isAdmin, isAuthorizedUser, getAuthRedirect } from '@/utils/authHelpers';

const AuthCallbackSimple: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Log the full URL for debugging
      console.log('📍 Callback URL:', window.location.href);
      console.log('📍 Search params:', searchParams.toString());
      
      // Get the invitation token if present
      const invitationToken = searchParams.get('invitation');
      
      // Wait a bit for Supabase to process the OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          details: error
        });
        toast.error(`Authentication failed: ${error.message || 'Unknown error'}`);
        navigate('/auth');
        return;
      }

      if (!session) {
        console.error('❌ No session found after OAuth callback');
        console.log('🔄 Attempting to refresh session...');
        
        // Try to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshData?.session) {
          console.log('✅ Session refreshed successfully');
          // Continue with the refreshed session
        } else {
          console.error('❌ Failed to refresh session:', refreshError);
          toast.error('Authentication failed. Please try signing in again.');
          navigate('/auth');
          return;
        }
      }

      console.log('✅ Authenticated as:', session.user.email);
      
      setMessage('Verifying access...');
      
      // Check if user is admin - admin can access everything
      const isAdminUser = isAdmin(session.user.email);
      if (isAdminUser) {
        console.log('Admin user detected - granting full access');
      }
      
      // Check if user is a registered client
      let isRegisteredClient = false;
      let clientData = null;
      
      // First check if they exist in clients table
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      if (existingClient) {
        isRegisteredClient = true;
        clientData = existingClient;
        
        // Update auth_user_id if not set
        if (!existingClient.auth_user_id) {
          await supabase
            .from('clients')
            .update({
              auth_user_id: session.user.id,
              last_login_at: new Date().toISOString()
            })
            .eq('id', existingClient.id);
        }
      }
      
      // If we have an invitation token, try to link the account
      if (invitationToken && !isRegisteredClient) {
        setMessage('Linking your account...');
        
        try {
          const { data: inviteClient, error: updateError } = await supabase
            .from('clients')
            .update({
              auth_user_id: session.user.id,
              invitation_status: 'accepted',
              last_login_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('invitation_token', invitationToken)
            .eq('email', session.user.email)
            .select()
            .single();

          if (!updateError && inviteClient) {
            console.log('✅ Account linked successfully:', inviteClient);
            toast.success(`Welcome, ${inviteClient.name || session.user.email}!`);
            isRegisteredClient = true;
            clientData = inviteClient;
          }
        } catch (err) {
          console.error('Error linking account:', err);
        }
      }
      
      // Check if user is authorized (admin always authorized)
      if (!isAdminUser && !isAuthorizedUser(session.user.email, isRegisteredClient)) {
        console.error('Unauthorized user:', session.user.email);
        toast.error('You are not authorized to access this platform. Please contact your administrator.');
        
        // Sign them out
        await supabase.auth.signOut();
        
        // Redirect to auth with error
        navigate('/auth?error=unauthorized');
        return;
      }
      
      // User is authorized - check if mobile and redirect appropriately
      if (clientData) {
        toast.success(`Welcome back, ${clientData.name || session.user.email}!`);
      }
      
      // Check if mobile device accessing via mobile path
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Navigate to unified client approval page
      navigate('/client-approve');
      
    } catch (error) {
      console.error('Callback error:', error);
      toast.error('Something went wrong');
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <Loader2 className="w-12 h-12 mx-auto text-zinc-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Completing Sign In
        </h2>
        <p className="text-zinc-600">{message}</p>
        <p className="text-sm text-zinc-500 mt-4">
          Please wait while we set up your account...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackSimple;