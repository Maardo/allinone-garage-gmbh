
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session && session.user) {
            // Map Supabase user to our user model
            const appUser: User = {
              id: session.user.id,
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: 'admin' as UserRole // Default role for now
            };
            
            setCurrentUser(appUser);
          } else {
            setCurrentUser(null);
          }
        }
      );
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        // Map Supabase user to our user model
        const appUser: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: 'admin' as UserRole // Default role for now
        };
        
        setCurrentUser(appUser);
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        setIsLoading(false);
        return false;
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error.message);
        setIsLoading(false);
        return false;
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration exception:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
