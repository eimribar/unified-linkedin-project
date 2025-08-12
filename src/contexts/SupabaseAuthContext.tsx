import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, clientService } from '@/services/database.service';
import type { User as SupabaseUser, Client } from '@/lib/supabase';
import { SampleProfile } from '@/data/sampleProfile';
import { OnboardingQA } from '@/data/sampleOnboarding';

interface User extends SupabaseUser {
  email: string;
  linkedinUrl?: string;
  profile?: SampleProfile;
  onboardingAnswers?: OnboardingQA[];
  hasCompletedOnboarding?: boolean;
  client?: Client;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<SampleProfile>) => void;
  saveOnboardingAnswers: (answers: OnboardingQA[]) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const SupabaseAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            // Get client data if user is a client
            let clientData = null;
            if (currentUser.role === 'client' && currentUser.email) {
              clientData = await clientService.getClientByEmail(currentUser.email);
            }
            
            // Merge with localStorage data if available
            const storedUser = localStorage.getItem('linkedinPortalUser');
            const localData = storedUser ? JSON.parse(storedUser) : {};
            
            setUser({
              ...currentUser,
              ...localData,
              client: clientData
            } as User);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const dataToStore = {
        email: user.email,
        linkedinUrl: user.linkedinUrl,
        profile: user.profile,
        onboardingAnswers: user.onboardingAnswers,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      };
      localStorage.setItem('linkedinPortalUser', JSON.stringify(dataToStore));
    } else {
      localStorage.removeItem('linkedinPortalUser');
    }
  }, [user]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { user: newUser } = await authService.signUp(email, password, fullName, 'client');
      if (newUser) {
        // Check if there's a client with this email
        const clientData = await clientService.getClientByEmail(email);
        
        setUser({
          id: newUser.id,
          email: newUser.email!,
          full_name: fullName,
          role: 'client',
          created_at: new Date(),
          updated_at: new Date(),
          hasCompletedOnboarding: false,
          client: clientData
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authUser, userData } = await authService.signIn(email, password);
      if (authUser) {
        // Get client data if user is a client
        let clientData = null;
        if (userData?.role === 'client') {
          clientData = await clientService.getClientByEmail(email);
        }
        
        // Merge with localStorage data if available
        const storedUser = localStorage.getItem('linkedinPortalUser');
        const localData = storedUser ? JSON.parse(storedUser) : {};
        
        setUser({
          id: authUser.id,
          email: authUser.email!,
          full_name: userData?.full_name,
          role: userData?.role || 'client',
          created_at: userData?.created_at || new Date(),
          updated_at: userData?.updated_at || new Date(),
          ...localData,
          client: clientData
        });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = (profile: Partial<SampleProfile>) => {
    if (user) {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          ...profile,
        } as SampleProfile,
      });
    }
  };

  const saveOnboardingAnswers = (answers: OnboardingQA[]) => {
    if (user) {
      setUser({
        ...user,
        onboardingAnswers: answers,
      });
    }
  };

  const completeOnboarding = () => {
    if (user) {
      setUser({
        ...user,
        hasCompletedOnboarding: true,
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    saveOnboardingAnswers,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};