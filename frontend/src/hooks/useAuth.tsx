import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index';
import type { Session } from '@supabase/supabase-js';
import { registerUser, loginUser, refreshSession, logoutUser } from '../services/backendApi';
import { 
  saveAccessToken, 
  saveRefreshToken, 
  getAccessToken, 
  getRefreshToken,
  clearTokens } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const oldAccessToken = await getAccessToken();
        const oldRefreshToken = await getRefreshToken();

        if (!oldAccessToken || !oldRefreshToken) {
          await clearTokens();
          setIsLoading(false);
          return;
        }

        const { refreshToken, accessToken, user } = await refreshSession(oldRefreshToken);

        await saveAccessToken(accessToken);
        await saveRefreshToken(refreshToken);
        setUser(user);

      } catch (err) {
        await clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();  
  }, []);

  const loadUserProfile = async (userId: string) => {
    return;
  };

  const login = async (email: string, password: string) => {
    try {
      const { accessToken, refreshToken, user } = await loginUser(email, password);

      await saveAccessToken(accessToken);
      await saveRefreshToken(refreshToken);

      setUser(user);
    } catch (err) {
      console.error('Login User error:', err);
      const message = err instanceof Error ? err.message : 'Failed to log in, please try again';
      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      await registerUser(email, username, password);
      
      const {accessToken, refreshToken, user} = await loginUser(email, password);

      await saveAccessToken(accessToken);
      await saveRefreshToken(refreshToken);

      setUser(user);
    } catch (err) {
      console.error('Register User error:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign in, please try again';
      throw new Error(message);
    }
  };

  const loginWithPhone = async (phone: string) => {
    return;
  };

  const verifyOTP = async (phone: string, token: string) => {
    return;
  };

  const logout = async () => {
    try {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (!accessToken || !refreshToken) {
        return;
      }

      await logoutUser(accessToken, refreshToken);

    } catch (err) {
      console.error('Logout User error:', err);
    } finally {
      await clearTokens();
      setUser(null);
    }
  };

  const completeOnboarding = async () => {
    return;
  };

  const updateUser = async (userData: Partial<User>) => {
    return;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isOnboarded,
        login,
        signup,
        loginWithPhone,
        verifyOTP,
        logout,
        completeOnboarding,
        updateUser,
      }}
    >
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
