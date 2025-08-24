// =====================================================
// MODERN SSO AUTHENTICATION PAGE
// Multiple authentication methods with beautiful UI
// Replaces PIN-based authentication
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { errorTracker, trackOAuthFlow } from '@/utils/errorTracking';
import { 
  Mail, 
  Lock, 
  Building, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  Sparkles,
  CheckCircle,
  Github,
  Chrome // For Google
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    signIn, 
    signUp, 
    signInWithProvider, 
    signInWithMagicLink,
    resetPassword,
    isAuthenticated, 
    loading,
    client
  } = useSupabaseAuth();
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [invitationData, setInvitationData] = useState<any>(null);
  const [processingInvitation, setProcessingInvitation] = useState(false);

  // Check for invitation token on page load
  useEffect(() => {
    const invitationToken = searchParams.get('invitation');
    if (invitationToken) {
      handleInvitationToken(invitationToken);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && client) {
      const redirectTo = searchParams.get('redirect') || '/client-approve';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, client, navigate, searchParams]);

  const handleInvitationToken = async (token: string) => {
    setProcessingInvitation(true);
    try {
      console.log('🎟️ Processing invitation token:', token);
      
      // Get invitation details from database
      const { data, error } = await supabase
        .from('client_invitations')
        .select(`
          *,
          clients!inner (
            id,
            name,
            email,
            company
          )
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        toast.error('Invalid or expired invitation link');
        console.error('Invitation validation error:', error);
        return;
      }

      const invitation = data;
      const client = invitation.clients;
      
      console.log('✅ Valid invitation found for:', client.name);
      setInvitationData({ invitation, client });
      
      // Pre-fill email and show signup form
      setFormData(prev => ({ ...prev, email: client.email }));
      setActiveTab('signup');
      
      toast.success(`Welcome ${client.name}! Please complete your account setup.`);
      
    } catch (err) {
      console.error('Error processing invitation:', err);
      toast.error('Failed to process invitation link');
    } finally {
      setProcessingInvitation(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLocalError(''); // Clear errors when user types
  };

  const validateForm = () => {
    if (!formData.email) {
      setLocalError('Email address is required');
      return false;
    }
    
    if (activeTab === 'signup' || activeTab === 'signin') {
      if (!formData.password) {
        setLocalError('Password is required');
        return false;
      }
      
      if (activeTab === 'signup') {
        if (formData.password.length < 8) {
          setLocalError('Password must be at least 8 characters');
          return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setLocalError('Passwords do not match');
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setLocalError('');

    try {
      let result;
      
      switch (activeTab) {
        case 'signin':
          result = await signIn(formData.email, formData.password);
          break;
          
        case 'signup':
          result = await signUp(formData.email, formData.password);
          
          // If this was an invitation signup and it was successful, mark invitation as accepted
          if (result && result.success && invitationData) {
            try {
              await supabase
                .from('client_invitations')
                .update({
                  status: 'accepted',
                  accepted_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .eq('id', invitationData.invitation.id);
                
              console.log('✅ Invitation marked as accepted');
            } catch (err) {
              console.error('Error updating invitation status:', err);
            }
          }
          break;
          
        case 'reset':
          result = await resetPassword(formData.email);
          break;
      }

      if (result && !result.success && result.error) {
        setLocalError(result.error);
      } else if (result && result.success && result.error) {
        // Success message in error field (for signup/reset confirmations)
        toast.success(result.error);
        if (activeTab === 'signup') {
          setActiveTab('signin');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setLocalError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderAuth = async (provider: 'google' | 'github' | 'microsoft') => {
    const oauthTracker = trackOAuthFlow('provider');
    
    try {
      // The signInWithProvider function now handles passing the invitation token
      // via the redirect URL, so we don't need localStorage anymore
      console.log('🔐 Initiating OAuth with provider:', provider);
      
      if (invitationData) {
        console.log('📧 OAuth with invitation for:', invitationData.client.email);
      }
      
      await signInWithProvider(provider);
      
      // Track successful OAuth initiation
      oauthTracker.success(provider, {
        hasInvitation: !!invitationData
      });
    } catch (err) {
      // Track OAuth error
      oauthTracker.error(err, {
        provider,
        hasInvitation: !!invitationData
      });
      
      toast.error(`Failed to sign in with ${provider}`);
      
      // Production error tracking
      errorTracker.trackError(err as Error, {
        action: 'oauth_provider_auth',
        metadata: { provider, hasInvitation: !!invitationData }
      });
    }
  };

  const handleMagicLink = async () => {
    if (!formData.email) {
      setLocalError('Please enter your email address first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await signInWithMagicLink(formData.email);
      if (result && !result.success && result.error) {
        setLocalError(result.error);
      } else if (result && result.success && result.error) {
        toast.success(result.error);
      }
    } catch (err) {
      toast.error('Failed to send magic link');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-zinc-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-3xl flex items-center justify-center shadow-lg">
            <Building className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {invitationData ? (
          <>
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">Welcome, {invitationData.client.name}!</h1>
            <p className="text-zinc-600 text-lg mb-2">Complete your account setup for {invitationData.client.company}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Valid invitation from your team
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">Welcome to Your Portal</h1>
            <p className="text-zinc-600 text-lg">Access your personalized content dashboard</p>
          </>
        )}
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            {activeTab === 'signin' && 'Sign In'}
            {activeTab === 'signup' && 'Create Account'}
            {activeTab === 'reset' && 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === 'signin' && 'Welcome back! Please sign in to continue.'}
            {activeTab === 'signup' && 'Join your team\'s content portal today.'}
            {activeTab === 'reset' && 'Enter your email to receive reset instructions.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          {(activeTab === 'signin' || activeTab === 'signup') && (
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-12 text-base font-medium"
                onClick={() => handleProviderAuth('google')}
                disabled={isSubmitting}
              >
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-12 text-base font-medium"
                onClick={() => handleProviderAuth('github')}
                disabled={isSubmitting}
              >
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-zinc-500">Or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {localError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{localError}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 h-12"
                  placeholder="you@company.com"
                  autoComplete="email"
                  disabled={!!invitationData}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            {(activeTab === 'signin' || activeTab === 'signup') && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-12 h-12"
                    placeholder={activeTab === 'signup' ? 'Create a secure password' : 'Enter your password'}
                    autoComplete={activeTab === 'signup' ? 'new-password' : 'current-password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            {activeTab === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 h-12"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <>
                  {activeTab === 'signin' && 'Sign In'}
                  {activeTab === 'signup' && 'Create Account'}
                  {activeTab === 'reset' && 'Send Reset Link'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {/* Magic Link Option */}
            {activeTab === 'signin' && (
              <Button 
                type="button"
                variant="ghost" 
                size="lg" 
                className="w-full h-12 text-base font-medium"
                onClick={handleMagicLink}
                disabled={isSubmitting}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Send Magic Link Instead
              </Button>
            )}
          </form>

          {/* Tab Switching */}
          <div className="pt-4 border-t">
            {activeTab === 'signin' && (
              <div className="text-center space-y-2">
                <p className="text-sm text-zinc-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-sm text-zinc-600">
                  Forgot your password?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('reset')}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    Reset it
                  </button>
                </p>
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="text-center">
                <p className="text-sm text-zinc-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}

            {activeTab === 'reset' && (
              <div className="text-center">
                <p className="text-sm text-zinc-600">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('signin')}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-zinc-500 max-w-md">
        <p>
          By signing in, you agree to our terms of service and privacy policy.
          Need help? Contact your administrator.
        </p>
      </div>
    </div>
  );
};

export default Auth;