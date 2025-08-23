// =====================================================
// CLIENT AUTHENTICATION CONTEXT
// PIN-based authentication for clients to access their portal
// =====================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

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
  mobile_pin?: string;
}

interface ClientAuthContextType {
  client: Client | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, pin: string) => Promise<boolean>;
  signOut: () => void;
  refreshClient: () => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
};

interface ClientAuthProviderProps {
  children: ReactNode;
}

export const ClientAuthProvider: React.FC<ClientAuthProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load client from session on mount
  useEffect(() => {
    loadClientFromSession();
  }, []);

  const loadClientFromSession = async () => {
    setIsLoading(true);
    try {
      // Check localStorage for saved session
      const savedSession = localStorage.getItem('clientSession');
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        
        // Verify the session is still valid (not expired)
        const sessionExpiry = new Date(sessionData.expiresAt);
        if (sessionExpiry > new Date()) {
          // Refresh client data from database
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', sessionData.clientId)
            .eq('portal_access', true)
            .single();
          
          if (data && !error) {
            setClient(data);
            console.log('✅ Client session restored:', data.name);
          } else {
            // Session invalid, clear it
            localStorage.removeItem('clientSession');
            console.log('Session invalid, cleared');
          }
        } else {
          // Session expired
          localStorage.removeItem('clientSession');
          console.log('Session expired, cleared');
        }
      }
    } catch (err) {
      console.error('Error loading client session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, pin: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      // Query database for client with matching email and PIN
      const { data, error: queryError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('mobile_pin', pin)
        .eq('portal_access', true)
        .single();

      if (queryError || !data) {
        setError('Invalid email or PIN. Please try again.');
        console.error('Authentication failed:', queryError);
        return false;
      }

      // Authentication successful
      setClient(data);
      
      // Save session to localStorage (expires in 7 days)
      const session = {
        clientId: data.id,
        clientEmail: data.email,
        clientName: data.name,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      localStorage.setItem('clientSession', JSON.stringify(session));
      
      console.log('✅ Client authenticated:', data.name);
      return true;

    } catch (err) {
      console.error('Error during authentication:', err);
      setError('An error occurred during sign in. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setClient(null);
    localStorage.removeItem('clientSession');
    console.log('✅ Client signed out');
  };

  const refreshClient = async () => {
    if (!client) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', client.id)
        .single();

      if (data && !error) {
        setClient(data);
        console.log('✅ Client data refreshed');
      }
    } catch (err) {
      console.error('Error refreshing client data:', err);
    }
  };

  const value: ClientAuthContextType = {
    client,
    isAuthenticated: !!client,
    isLoading,
    error,
    signIn,
    signOut,
    refreshClient
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};

export default ClientAuthContext;