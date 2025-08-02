
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { testSupabaseConnection, testSupabaseAuth } from '@/utils/testSupabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test Supabase connection
    console.log('AuthProvider: Initializing, testing Supabase connection...');
    console.log('Supabase URL:', supabase.supabaseUrl);

    // Run connection tests
    testSupabaseConnection();
    testSupabaseAuth();

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthProvider: Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('AuthProvider: Error getting session:', error);
        } else {
          console.log('AuthProvider: Initial session:', session?.user?.email || 'No session');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('AuthProvider: Failed to get initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, session?.user?.email || 'No user');
        console.log('AuthProvider: Session details:', {
          access_token: session?.access_token ? 'Present' : 'Missing',
          refresh_token: session?.refresh_token ? 'Present' : 'Missing',
          expires_at: session?.expires_at,
          user_id: session?.user?.id
        });

        setSession(session);
        setUser(session?.user ?? null);

        // Only set loading to false if we're not in the middle of a sign in/up process
        if (event !== 'SIGNED_IN' && event !== 'SIGNED_UP') {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('AuthProvider: Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthProvider: Sign in error:', error);
        throw error;
      }

      console.log('AuthProvider: Sign in successful:', data.user?.email);
      // The auth state change listener will handle setting the user
      // Don't set loading to false here, let the auth state change handle it
    } catch (error) {
      console.error('AuthProvider: Sign in failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('AuthProvider: Attempting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('AuthProvider: Sign up error:', error);
        throw error;
      }

      console.log('AuthProvider: Sign up successful:', data.user?.email);
      console.log('AuthProvider: User confirmation required:', !data.user?.email_confirmed_at);

      // If email confirmation is disabled, the user should be signed in immediately
      if (data.user?.email_confirmed_at) {
        console.log('AuthProvider: User email already confirmed');
      } else {
        console.log('AuthProvider: User needs to confirm email');
        setLoading(false); // Set loading to false for email confirmation flow
      }
    } catch (error) {
      console.error('AuthProvider: Sign up failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
