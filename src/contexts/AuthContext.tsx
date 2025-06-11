import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logAuthFailure, logSuspiciousActivity } from '@/utils/securityMonitoring';
import { authRateLimit, getClientIdentifier } from '@/utils/advancedRateLimiting';
import { validateEmail } from '@/utils/inputValidation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up secure cross-domain auth state listener');
    
    // Set up auth state listener with security monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Secure auth state changed:', event, session?.user?.email, 'on domain:', window.location.hostname);
        console.log('Auth session details:', {
          userId: session?.user?.id,
          email: session?.user?.email,
          hasSession: !!session,
          event
        });
        
        // Monitor for suspicious auth events
        if (event === 'SIGNED_OUT' && session) {
          logSuspiciousActivity({
            event: 'unexpected_signout',
            user_id: session.user.id,
            timestamp: Date.now()
          });
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session with error handling
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
        logAuthFailure({ error: error.message, context: 'initial_session' });
      } else {
        console.log('Secure initial session:', session?.user?.email, 'on domain:', window.location.hostname);
        console.log('Initial session details:', {
          userId: session?.user?.id,
          email: session?.user?.email,
          hasSession: !!session
        });
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up secure auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const clientId = getClientIdentifier();
    
    // Rate limiting check
    const rateLimitResult = authRateLimit.check(clientId);
    if (!rateLimitResult.allowed) {
      const error = { message: 'Too many login attempts. Please try again later.' };
      logAuthFailure({ error: error.message, email, rate_limited: true });
      return { error };
    }

    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      const error = { message: 'Invalid email format' };
      logAuthFailure({ error: error.message, email });
      return { error };
    }

    if (!password || password.length < 6) {
      const error = { message: 'Password must be at least 6 characters' };
      logAuthFailure({ error: error.message, email });
      return { error };
    }

    console.log('Secure sign in attempt for:', emailValidation.sanitized, 'on domain:', window.location.hostname);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: emailValidation.sanitized!,
      password,
    });
    
    if (error) {
      console.error('Secure sign in error:', error);
      logAuthFailure({ 
        error: error.message, 
        email: emailValidation.sanitized!,
        client_id: clientId 
      });
    } else {
      console.log('Secure sign in successful');
      // Reset rate limit on successful login
      authRateLimit.reset(clientId);
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const clientId = getClientIdentifier();
    
    // Rate limiting check
    const rateLimitResult = authRateLimit.check(clientId);
    if (!rateLimitResult.allowed) {
      const error = { message: 'Too many signup attempts. Please try again later.' };
      logAuthFailure({ error: error.message, email, rate_limited: true });
      return { error };
    }

    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      const error = { message: 'Invalid email format' };
      logAuthFailure({ error: error.message, email });
      return { error };
    }

    if (!password || password.length < 8) {
      const error = { message: 'Password must be at least 8 characters' };
      logAuthFailure({ error: error.message, email });
      return { error };
    }

    // Check password complexity
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasUpper || !hasLower || !hasNumber) {
      const error = { message: 'Password must contain uppercase, lowercase, and number' };
      logAuthFailure({ error: error.message, email });
      return { error };
    }

    console.log('Secure sign up attempt for:', emailValidation.sanitized, 'on domain:', window.location.hostname);
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email: emailValidation.sanitized!,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || '',
        },
      },
    });
    
    if (error) {
      console.error('Secure sign up error:', error);
      logAuthFailure({ 
        error: error.message, 
        email: emailValidation.sanitized!,
        client_id: clientId 
      });
    } else {
      console.log('Secure sign up successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('Secure sign out initiated from domain:', window.location.hostname);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Secure sign out error:', error);
      logAuthFailure({ error: error.message, context: 'signout' });
    } else {
      console.log('Secure sign out successful');
    }
    
    return { error };
  };

  const resetPassword = async (email: string) => {
    const clientId = getClientIdentifier();
    
    // Rate limiting check
    const rateLimitResult = authRateLimit.check(clientId);
    if (!rateLimitResult.allowed) {
      const error = { message: 'Too many reset attempts. Please try again later.' };
      logAuthFailure({ error: error.message, email, rate_limited: true });
      return { error };
    }

    // Input validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      const error = { message: 'Invalid email format' };
      logAuthFailure({ error: error.message, email });
      return { error };
    }

    console.log('Secure password reset request for:', emailValidation.sanitized, 'on domain:', window.location.hostname);
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(emailValidation.sanitized!, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('Secure password reset error:', error);
      logAuthFailure({ 
        error: error.message, 
        email: emailValidation.sanitized!,
        context: 'password_reset' 
      });
    } else {
      console.log('Secure password reset email sent');
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
