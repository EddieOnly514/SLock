-- SLock Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  profile_photo_url TEXT,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  tree_growth DECIMAL(5,2) DEFAULT 0.00,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP WITH TIME ZONE,
  is_profile_public BOOLEAN DEFAULT true,
  allow_friend_requests BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRACKED APPS TABLE (App Catalog)
-- ============================================
CREATE TABLE IF NOT EXISTS tracked_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  package_name TEXT UNIQUE NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default apps
INSERT INTO tracked_apps (name, package_name, icon_name, category) VALUES
('Instagram', 'com.instagram.android', 'instagram', 'social'),
('TikTok', 'com.zhiliaoapp.musically', 'tiktok', 'social'),
('Twitter', 'com.twitter.android', 'twitter', 'social'),
('Snapchat', 'com.snapchat.android', 'snapchat', 'social'),
('Facebook', 'com.facebook.katana', 'facebook', 'social'),
('YouTube', 'com.google.android.youtube', 'youtube', 'video'),
('Reddit', 'com.reddit.frontpage', 'reddit', 'social'),
('WhatsApp', 'com.whatsapp', 'whatsapp', 'messaging'),
('Telegram', 'org.telegram.messenger', 'telegram', 'messaging'),
('Discord', 'com.discord', 'discord', 'messaging')
ON CONFLICT (package_name) DO NOTHING;

-- ============================================
-- USER APPS TABLE (User's tracked apps)
-- ============================================
CREATE TABLE IF NOT EXISTS user_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  app_id UUID REFERENCES tracked_apps(id) ON DELETE CASCADE,
  is_tracked BOOLEAN DEFAULT true,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- ============================================
-- SCREEN TIME TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS screen_time (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  app_id UUID REFERENCES tracked_apps(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, app_id, date)
);

-- ============================================
-- FOCUS SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  scheduled_duration INTEGER NOT NULL,
  actual_duration INTEGER,
  was_completed BOOLEAN DEFAULT false,
  points_earned INTEGER DEFAULT 0,
  tree_growth DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FOCUS SESSION APPS (Which apps were blocked)
-- ============================================
CREATE TABLE IF NOT EXISTS focus_session_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES focus_sessions(id) ON DELETE CASCADE,
  app_id UUID REFERENCES tracked_apps(id) ON DELETE CASCADE,
  UNIQUE(session_id, app_id)
);

-- ============================================
-- FRIENDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_required INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- APP SCHEDULES TABLE (For scheduled blocking)
-- ============================================
CREATE TABLE IF NOT EXISTS app_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  app_id UUID REFERENCES tracked_apps(id) ON DELETE CASCADE,
  days_of_week TEXT[], -- Array of days: ['monday', 'tuesday', etc]
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_session_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_schedules ENABLE ROW LEVEL SECURITY;

-- Users: Can read their own data and public profiles
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (is_profile_public = true);

-- User Apps: Users can only see and manage their own apps
CREATE POLICY "Users can view own apps" ON user_apps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own apps" ON user_apps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own apps" ON user_apps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own apps" ON user_apps FOR DELETE USING (auth.uid() = user_id);

-- Screen Time: Users can only see and manage their own data
CREATE POLICY "Users can view own screen time" ON screen_time FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own screen time" ON screen_time FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own screen time" ON screen_time FOR UPDATE USING (auth.uid() = user_id);

-- Focus Sessions: Users can only see and manage their own sessions
CREATE POLICY "Users can view own sessions" ON focus_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON focus_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON focus_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Friends: Users can view their own friendships
CREATE POLICY "Users can view own friends" ON friends FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can insert friendships" ON friends FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update friendships" ON friends FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can delete friendships" ON friends FOR DELETE USING (auth.uid() = user_id);

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- App Schedules: Users can manage their own schedules
CREATE POLICY "Users can view own schedules" ON app_schedules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own schedules" ON app_schedules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own schedules" ON app_schedules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own schedules" ON app_schedules FOR DELETE USING (auth.uid() = user_id);

-- Tracked Apps: Public read access
CREATE POLICY "Anyone can view tracked apps" ON tracked_apps FOR SELECT TO authenticated USING (true);

-- Achievements: Public read access
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT TO authenticated USING (true);

-- User Achievements: Users can view their own achievements
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_screen_time_updated_at BEFORE UPDATE ON screen_time
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friends_updated_at BEFORE UPDATE ON friends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_schedules_updated_at BEFORE UPDATE ON app_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, username)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(COALESCE(NEW.email, NEW.phone), '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_apps_user_id ON user_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_screen_time_user_id ON screen_time(user_id);
CREATE INDEX IF NOT EXISTS idx_screen_time_date ON screen_time(date);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_app_schedules_user_id ON app_schedules(user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage bucket for profile photos (run this in Supabase Storage UI or via SQL)
-- This is a note: You'll need to create a bucket named 'profile-photos' in Supabase Storage UI
-- Then set the bucket to be public for read access
