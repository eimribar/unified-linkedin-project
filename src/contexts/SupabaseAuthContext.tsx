// =====================================================
// SUPABASE AUTHENTICATION CONTEXT
// SSO authentication with multiple providers
// Replaces PIN-based authentication system
// =====================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

// Import admin auth service for impersonation
interface AdminAuthService {
  getCurrentImpersonationSession(): Promise<any>;
  exitImpersonation(): Promise<void>;
  validateImpersonationToken(token: string): Promise<any>;
}

// Simple implementation for client portal
const adminAuthService: AdminAuthService = {
  async getCurrentImpersonationSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('impersonation') || localStorage.getItem('admin_impersonation_token');
    
    if (!token) return null;
    
    try {
      const { data, error } = await supabase
        .rpc('validate_impersonation_token', { p_token: token });
      
      if (error || !data || data.length === 0) {
        localStorage.removeItem('admin_impersonation_token');
        return null;
      }
      
      localStorage.setItem('admin_impersonation_token', token);
      return {
        token,
        client_id: data[0].client_id,
        client_email: data[0].client_email,
        client_name: data[0].client_name,
        admin_email: data[0].admin_email
      };
    } catch (err) {
      console.error('Error validating impersonation token:', err);
      return null;
    }
  },

  async exitImpersonation() {
    const token = localStorage.getItem('admin_impersonation_token');
    if (token) {
      try {
        await supabase.rpc('end_impersonation_session', { p_token: token });
      } catch (err) {
        console.error('Error ending impersonation:', err);
      }
      localStorage.removeItem('admin_impersonation_token');
    }
    window.location.href = 'https://ghostwriter-portal.vercel.app';
  },

  async validateImpersonationToken(token: string) {
    const { data, error } = await supabase
      .rpc('validate_impersonation_token', { p_token: token });
    
    if (error || !data || data.length === 0) {
      return { success: false, error: 'Invalid or expired token' };
    }
    
    return { success: true, session: data[0] };
  }
};

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  role?: string;
  phone?: string;
  linkedin_url?: string;
  linkedin_bio?: string;
  industry?: string;
  posting_frequency?: string;
  content_preferences?: any;
  status?: string;
  portal_access: boolean;
  auth_user_id?: string;
  invitation_status?: 'pending' | 'accepted' | 'expired';
  last_login_at?: string;
  auth_provider?: string;
}

interface SupabaseAuthContextType {
  // Auth state
  user: User | null;
  session: Session | null;
  client: Client | null;
  loading: boolean;
  
  // Impersonation state
  impersonationSession: any | null;
  isImpersonating: boolean;
  
  // Auth methods
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithProvider: (provider: 'google' | 'github' | 'microsoft') => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  
  // Client methods
  refreshClient: () => Promise<void>;
  updateLastLogin: () => Promise<void>;
  
  // Impersonation methods
  exitImpersonation: () => Promise<void>;
  
  // Legacy compatibility
  isAuthenticated: boolean;
  isLoading: boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: ReactNode;
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [impersonationSession, setImpersonationSession] = useState<any | null>(null);

  useEffect(() => {
    // Check for impersonation session first
    checkImpersonationSession();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadClientProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth event:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Check for pending invitation after OAuth callback
          const pendingInvitation = localStorage.getItem('pending_invitation');
          if (pendingInvitation) {
            try {
              const inviteData = JSON.parse(pendingInvitation);
              console.log('🔐 Processing OAuth signup with invitation:', {
                hasToken: !!inviteData.token,
                userEmail: session.user.email
              });
              
              // Call secure database function to complete OAuth signup
              const { data, error } = await supabase.rpc('complete_oauth_signup', {
                p_invitation_token: inviteData.token
              });
              
              if (error) {
                console.error('Database function error:', error);
                toast.error('Failed to complete account setup. Please contact support.');
                
                // Log detailed error for debugging (production would use proper error tracking)
                console.error('OAuth signup error details:', {
                  error,
                  user: session.user.email,
                  provider: session.user.app_metadata?.provider
                });
              } else if (data && !data.success) {
                // Handle specific error codes from the function
                console.warn('OAuth signup failed:', data);
                
                const errorMessages: Record<string, string> = {
                  'EMAIL_MISMATCH': 'The invitation was sent to a different email address.',
                  'ALREADY_LINKED': 'This account is already linked to another user.',
                  'INVITATION_INVALID': 'The invitation link has expired or is invalid.',
                  'AUTH_REQUIRED': 'Authentication is required to complete signup.',
                  'default': data.error || 'Failed to complete signup. Please contact support.'
                };
                
                toast.error(errorMessages[data.code] || errorMessages.default);
                
                // Clear invalid invitation data
                localStorage.removeItem('pending_invitation');
              } else if (data && data.success) {
                console.log('✅ OAuth signup completed successfully:', data);
                
                // Clear the pending invitation
                localStorage.removeItem('pending_invitation');
                
                // Show success message with client name
                toast.success(
                  data.client_name 
                    ? `Welcome to ${data.client_name}'s portal!` 
                    : 'Account setup complete! Welcome aboard!'
                );
              }
            } catch (err) {
              console.error('Unexpected error processing invitation:', err);
              toast.error('An unexpected error occurred. Please try again.');
              
              // Clear potentially corrupted data
              localStorage.removeItem('pending_invitation');
            }
          }
          
          // Always try to load the client profile after sign in
          await loadClientProfile(session.user.id);
          await updateLastLogin();
          
          // Only show generic welcome if not processing invitation
          if (!pendingInvitation) {
            toast.success(`Welcome back!`);
          }
        } else if (event === 'SIGNED_OUT') {
          setClient(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Silently refresh client data
          if (session?.user) {
            await loadClientProfile(session.user.id);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkImpersonationSession = async () => {
    try {
      const impSession = await adminAuthService.getCurrentImpersonationSession();
      if (impSession) {
        console.log('🎭 Active impersonation session detected:', impSession);
        setImpersonationSession(impSession);
        
        // Load the client being impersonated
        const { data: impersonatedClient } = await supabase
          .from('clients')
          .select('*')
          .eq('id', impSession.client_id)
          .single();
          
        if (impersonatedClient) {
          setClient(impersonatedClient);
          console.log('✅ Loaded impersonated client:', impersonatedClient.name);
        }
        
        setLoading(false);
        return true; // Impersonation active
      }
      return false; // No impersonation
    } catch (err) {
      console.error('Error checking impersonation session:', err);
      return false;
    }
  };

  const loadClientProfile = async (authUserId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('auth_user_id', authUserId)
        .eq('portal_access', true)
        .single();

      if (error) {
        console.error('Error loading client profile:', error);
        
        // If no client record found, this might be a new signup
        if (error.code === 'PGRST116') {
          console.log('No client record found for auth user:', authUserId);
          toast.error('Account not found. Please contact your administrator.');
        }
        setClient(null);
      } else {
        setClient(data);
        console.log('✅ Client profile loaded:', data.name);
      }
    } catch (err) {
      console.error('Error in loadClientProfile:', err);
      setClient(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Check if client exists with this email
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id, name, invitation_status')
        .eq('email', email)
        .single();

      if (!existingClient) {
        return {
          success: false,
          error: 'No invitation found for this email address. Please contact your administrator.'
        };
      }

      if (existingClient.invitation_status !== 'pending') {
        return {
          success: false,
          error: 'Invitation has already been used or has expired.'
        };
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/client-approve',
          data: {
            client_name: existingClient.name
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        error: 'Please check your email and click the confirmation link to complete your registration.'
      };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'github' | 'microsoft') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/client-approve'
        }
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error('Failed to sign in with provider');
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      setLoading(true);
      
      // Check if client exists with this email
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id, name')
        .eq('email', email)
        .single();

      if (!existingClient) {
        return {
          success: false,
          error: 'No account found for this email address.'
        };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/client-approve'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        error: 'Check your email for the magic link!'
      };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Signed out successfully');
      }
    } catch (err) {
      toast.error('Error signing out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        error: 'Password reset email sent!'
      };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const refreshClient = async () => {
    if (user) {
      await loadClientProfile(user.id);
    }
  };

  const updateLastLogin = async () => {
    if (client) {
      try {
        await supabase
          .from('clients')
          .update({ 
            last_login_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', client.id);
      } catch (err) {
        console.error('Error updating last login:', err);
      }
    }
  };

  const exitImpersonation = async () => {
    try {
      await adminAuthService.exitImpersonation();
    } catch (err) {
      console.error('Error exiting impersonation:', err);
      // Force redirect even if ending session failed
      window.location.href = 'https://ghostwriter-portal.vercel.app';
    }
  };

  const value: SupabaseAuthContextType = {
    user,
    session,
    client,
    loading,
    
    // Impersonation state
    impersonationSession,
    isImpersonating: !!impersonationSession,
    
    signUp,
    signIn,
    signInWithProvider,
    signInWithMagicLink,
    signOut,
    resetPassword,
    refreshClient,
    updateLastLogin,
    
    // Impersonation methods
    exitImpersonation,
    
    // Legacy compatibility - authentication includes impersonation
    isAuthenticated: !!(user && client) || !!impersonationSession,
    isLoading: loading
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};