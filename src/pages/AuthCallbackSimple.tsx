// =====================================================
// SIMPLE OAUTH CALLBACK HANDLER
// Handles OAuth return and links accounts
// =====================================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthCallbackSimple: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get the invitation token if present
      const invitationToken = searchParams.get('invitation');
      
      // Wait a bit for Supabase to process the OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        toast.error('Authentication failed');
        navigate('/auth');
        return;
      }

      if (!session) {
        console.error('No session found');
        toast.error('Authentication failed. Please try again.');
        navigate('/auth');
        return;
      }

      console.log('✅ Authenticated as:', session.user.email);

      // If we have an invitation token, link the account
      if (invitationToken) {
        setMessage('Linking your account...');
        
        try {
          // Simple direct database update
          const { data: clientData, error: updateError } = await supabase
            .from('clients')
            .update({
              auth_user_id: session.user.id,
              invitation_status: 'accepted',
              last_login_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('invitation_token', invitationToken)
            .eq('email', session.user.email) // Security: only link if emails match
            .select()
            .single();

          if (updateError) {
            console.error('Failed to link account:', updateError);
            // Still let them in - they're authenticated
            toast.warning('Account created but not linked to invitation');
          } else if (clientData) {
            console.log('✅ Account linked successfully:', clientData);
            toast.success(`Welcome, ${clientData.name || session.user.email}!`);
          }
        } catch (err) {
          console.error('Error linking account:', err);
          // Don't block - they're authenticated
        }
      }

      // Redirect to client portal
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