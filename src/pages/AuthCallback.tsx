// =====================================================
// OAUTH CALLBACK HANDLER
// Processes OAuth returns and links accounts
// =====================================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      console.log('🔄 OAuth callback triggered');
      console.log('URL params:', Object.fromEntries(searchParams.entries()));
      
      // First, check if there's a code in the URL (OAuth callback)
      const code = searchParams.get('code');
      
      let session = null;
      
      if (code) {
        console.log('📝 OAuth code found, exchanging for session...');
        setMessage('Authenticating with Google...');
        
        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('❌ Error exchanging code for session:', exchangeError);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }
        
        console.log('✅ Code exchanged successfully, session:', data.session?.user?.email);
        session = data.session;
      } else {
        // No code, try to get existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }
        
        session = sessionData.session;
      }

      if (!session) {
        console.error('No session found after OAuth');
        // Instead of showing error, wait a moment for auth state to propagate
        setMessage('Completing sign in...');
        
        // Wait a bit and try once more
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        
        if (!retrySession) {
          setStatus('error');
          setMessage('No session found. Redirecting to login...');
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }
        
        session = retrySession;
      }

      console.log('✅ Session found:', {
        user: session.user.email,
        provider: session.user.app_metadata?.provider
      });

      // Check for invitation token in URL
      const invitationToken = searchParams.get('invitation');
      
      if (invitationToken) {
        console.log('🎟️ Processing invitation token from URL:', invitationToken);
        setMessage('Linking your account...');
        
        try {
          // Call the database function to complete OAuth signup
          const { data, error } = await supabase.rpc('complete_oauth_signup', {
            p_invitation_token: invitationToken
          });
          
          console.log('Database function response:', { data, error });
          
          if (error) {
            console.error('❌ Database function error:', error);
            // Check if it's a function not found error
            if (error.message?.includes('function') || error.message?.includes('does not exist')) {
              toast.error('System configuration error. Please contact support.');
              console.error('Function not found - run the SQL script to create it');
            } else {
              toast.error('Failed to link account. Please contact support.');
            }
            setStatus('error');
            setMessage('Failed to link account. Redirecting...');
            
            // Still redirect to client-approve as they're authenticated
            setTimeout(() => navigate('/client-approve'), 3000);
            return;
          }
        } catch (err) {
          console.error('❌ Unexpected error calling database function:', err);
          toast.error('An unexpected error occurred.');
          setStatus('error');
          setMessage('Failed to link account. Redirecting...');
          setTimeout(() => navigate('/client-approve'), 3000);
          return;
        }
        
        if (data && !data.success) {
          console.warn('⚠️ OAuth signup failed:', data);
          
          const errorMessages: Record<string, string> = {
            'EMAIL_MISMATCH': 'The invitation was sent to a different email address.',
            'ALREADY_LINKED': 'This account is already linked.',
            'INVITATION_INVALID': 'The invitation has expired or is invalid.',
            'AUTH_REQUIRED': 'Authentication is required.',
            'default': data.error || 'Failed to complete signup.'
          };
          
          const errorMsg = errorMessages[data.code] || errorMessages.default;
          toast.error(errorMsg);
          setStatus('error');
          setMessage(errorMsg);
          
          // Still redirect as they're authenticated
          setTimeout(() => navigate('/client-approve'), 3000);
          return;
        }
        
        if (data && data.success) {
          console.log('🎉 OAuth signup completed successfully:', data);
          toast.success(
            data.client_name 
              ? `Welcome to ${data.client_name}'s portal!` 
              : 'Account setup complete!'
          );
          setStatus('success');
          setMessage('Account linked successfully! Redirecting...');
          
          // Clear any stored invitation data
          localStorage.removeItem('pending_invitation');
          
          // Redirect to client portal
          setTimeout(() => navigate('/client-approve'), 1500);
          return;
        }
        
        // CRITICAL FIX: Handle null/undefined data response
        console.warn('⚠️ No valid response from complete_oauth_signup, data:', data);
        console.warn('User is authenticated but invitation linking may have failed');
        
        // Don't block the user - they're authenticated, let them in
        setStatus('success');
        setMessage('Authenticated! Redirecting...');
        toast.warning('Account linked with limited access. Contact support if you need assistance.');
        
        // Redirect to client portal anyway - they're authenticated
        setTimeout(() => navigate('/client-approve'), 1500);
        return;
      } else {
        // No invitation token - regular sign in
        console.log('ℹ️ Regular OAuth sign-in (no invitation)');
        
        // Check if this user has a linked client account
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();
        
        if (clientError || !clientData) {
          console.warn('⚠️ No client record found for user');
          toast.error('No client account found. Please contact your administrator.');
          setStatus('error');
          setMessage('No client account found. Please use your invitation link.');
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }
        
        console.log('✅ Client record found:', clientData.name);
        setStatus('success');
        setMessage('Welcome back! Redirecting...');
        toast.success('Welcome back!');
        
        // Redirect to client portal
        setTimeout(() => navigate('/client-approve'), 1500);
      }
    } catch (error) {
      console.error('❌ Unexpected error in OAuth callback:', error);
      toast.error('An unexpected error occurred');
      setStatus('error');
      setMessage('An error occurred. Redirecting...');
      setTimeout(() => navigate('/auth'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'processing' && (
            <Loader2 className="w-12 h-12 mx-auto text-zinc-600 animate-spin" />
          )}
          {status === 'success' && (
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          {status === 'processing' && 'Completing Sign In'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Something Went Wrong'}
        </h2>
        
        <p className="text-zinc-600">{message}</p>
        
        {status === 'processing' && (
          <p className="text-sm text-zinc-500 mt-4">Please wait while we set up your account...</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;