
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: Error }>;
  signIn: (email: string, password: string) => Promise<{ error?: Error }>;
  signUp: (email: string, password: string) => Promise<{ error?: Error }>;
  resetPassword: (email: string) => Promise<{ error?: Error }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed', { event, userId: session?.user?.id });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only set loading to false after we've processed the auth state
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('AuthProvider: Error getting session:', error);
      } else {
        console.log('AuthProvider: Initial session check', { userId: session?.user?.id });
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider: Sign up attempt for:', email);
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('AuthProvider: Sign up error:', error);
        return { error };
      }

      console.log('AuthProvider: Sign up successful for:', email);
      return {};
    } catch (error) {
      console.error('AuthProvider: Sign up exception:', error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Sign in attempt for:', email);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthProvider: Sign in error:', error);
        return { error };
      }

      console.log('AuthProvider: Sign in successful for:', email);
      return {};
    } catch (error) {
      console.error('AuthProvider: Sign in exception:', error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Alias for signIn to maintain compatibility
  const login = signIn;

  const resetPassword = async (email: string) => {
    console.log('AuthProvider: Password reset request for:', email);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('AuthProvider: Password reset error:', error);
        return { error };
      }

      console.log('AuthProvider: Password reset email sent to:', email);
      return {};
    } catch (error) {
      console.error('AuthProvider: Password reset exception:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Sign out initiated');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      } else {
        console.log('AuthProvider: Sign out successful');
        // State will be updated by the auth state listener
      }
    } catch (error) {
      console.error('AuthProvider: Sign out exception:', error);
    } finally {
      setLoading(false);
    }
  };

  // Alias for signOut to maintain compatibility
  const logout = signOut;

  const isAuthenticated = !!user && !!session;

  console.log('AuthProvider: Current state', {
    isAuthenticated,
    userId: user?.id,
    loading,
    hasSession: !!session
  });

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      signIn,
      signUp,
      resetPassword,
      logout,
      signOut,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
