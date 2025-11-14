import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { User } from '../types';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username?: string) => Promise<void>;
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

  // Listen to Supabase auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsOnboarded(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Fetch user profile from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const userProfile: User = {
          id: data.id,
          email: data.email,
          phone: data.phone,
          username: data.username,
          profilePhotoUrl: data.profile_photo_url,
          points: data.points,
          level: data.level,
          treeGrowth: data.tree_growth,
          currentStreak: data.current_streak,
          longestStreak: data.longest_streak,
          isProfilePublic: data.is_profile_public,
          allowFriendRequests: data.allow_friend_requests,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };
        setUser(userProfile);

        // Check onboarding status
        const onboardedStatus = await AsyncStorage.getItem('@onboarded');
        setIsOnboarded(onboardedStatus === 'true');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  const signup = async (email: string, password: string, username?: string) => {
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // The database trigger will automatically create the user profile
        await loadUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const loginWithPhone = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Phone login error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw new Error(error.message || 'Failed to verify OTP');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.multiRemove(['@onboarded']);
      setUser(null);
      setSession(null);
      setIsOnboarded(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarded', 'true');
      setIsOnboarded(true);
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;

      // Convert camelCase to snake_case for database
      const dbData: any = {};
      if (userData.username) dbData.username = userData.username;
      if (userData.profilePhotoUrl) dbData.profile_photo_url = userData.profilePhotoUrl;
      if (userData.points !== undefined) dbData.points = userData.points;
      if (userData.level !== undefined) dbData.level = userData.level;
      if (userData.treeGrowth !== undefined) dbData.tree_growth = userData.treeGrowth;
      if (userData.currentStreak !== undefined) dbData.current_streak = userData.currentStreak;
      if (userData.longestStreak !== undefined) dbData.longest_streak = userData.longestStreak;
      if (userData.isProfilePublic !== undefined) dbData.is_profile_public = userData.isProfilePublic;
      if (userData.allowFriendRequests !== undefined) dbData.allow_friend_requests = userData.allowFriendRequests;

      const { error } = await supabase
        .from('users')
        .update(dbData)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date(),
      };
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
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
