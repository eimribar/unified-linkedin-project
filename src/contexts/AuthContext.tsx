import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SampleProfile } from '@/data/sampleProfile';
import { OnboardingQA } from '@/data/sampleOnboarding';

interface User {
  email: string;
  linkedinUrl?: string;
  profile?: SampleProfile;
  onboardingAnswers?: OnboardingQA[];
  hasCompletedOnboarding?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signUp: (email: string, linkedinUrl?: string) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  updateProfile: (profile: Partial<SampleProfile>) => void;
  saveOnboardingAnswers: (answers: OnboardingQA[]) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('linkedinPortalUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('linkedinPortalUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('linkedinPortalUser');
    }
  }, [user]);

  const signUp = (email: string, linkedinUrl?: string) => {
    const newUser: User = {
      email,
      linkedinUrl,
      hasCompletedOnboarding: false,
    };
    setUser(newUser);
  };

  const signIn = (email: string) => {
    // In a real app, this would validate credentials
    const storedUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const existingUser = storedUsers.find((u: User) => u.email === email);
    
    if (existingUser) {
      setUser(existingUser);
    } else {
      // For demo purposes, create a new user
      signUp(email);
    }
  };

  const signOut = () => {
    setUser(null);
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
      
      // Save to all users list for persistence
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const updatedUsers = allUsers.filter((u: User) => u.email !== user.email);
      updatedUsers.push({ ...user, hasCompletedOnboarding: true });
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    saveOnboardingAnswers,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};