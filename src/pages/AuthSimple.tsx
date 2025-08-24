// =====================================================
// SIMPLE AUTHENTICATION PAGE
// Clean, simple auth with Google OAuth
// =====================================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Chrome, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

const AuthSimple: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const invitationToken = searchParams.get('invitation');
  const errorType = searchParams.get('error');

  // Check if already authenticated
  useEffect(() => {
    checkAuth();
    
    // Show error message if redirected with error
    if (errorType === 'unauthorized') {
      toast.error('You are not authorized to access this platform. Please contact your administrator.');
    }
  }, [errorType]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Already logged in, redirect
      navigate('/client-approve');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      // Build redirect URL with invitation if present
      let redirectUrl = `${window.location.origin}/auth/callback`;
      if (invitationToken) {
        redirectUrl += `?invitation=${invitationToken}`;
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('OAuth error:', error);
      toast.error('Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      
      let redirectUrl = `${window.location.origin}/auth/callback`;
      if (invitationToken) {
        redirectUrl += `?invitation=${invitationToken}`;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;
      
      toast.success('Check your email for the magic link!');
      setEmail('');
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast.error('Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            {invitationToken 
              ? 'Sign in to accept your invitation and access your content'
              : 'Sign in to access your LinkedIn content dashboard'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Google Sign In - Primary Option */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Chrome className="w-4 h-4 mr-2" />
            )}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500">Or</span>
            </div>
          </div>

          {/* Magic Link - Alternative */}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleMagicLink()}
            />
            <Button
              onClick={handleMagicLink}
              disabled={loading || !email}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Magic Link
            </Button>
          </div>

          {invitationToken && (
            <div className="text-xs text-center text-zinc-500 mt-4">
              Invitation detected. Sign in to link your account.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSimple;