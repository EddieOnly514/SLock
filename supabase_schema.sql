-- SLock Database Schema for Supabase PostgreSQL
-- Additional commented tables below for future additions

-- ============================================
-- ACHIEVEMENTS TABLE
-- ============================================
-- CREATE TABLE IF NOT EXISTS achievements (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   name TEXT NOT NULL,
--   description TEXT,
--   icon TEXT,
--   points_required INTEGER DEFAULT 0,
--   category TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- ============================================
-- CREATE TABLE IF NOT EXISTS user_achievements (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--   achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
--   unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE(user_id, achievement_id)
-- );

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
-- CREATE TABLE IF NOT EXISTS notifications (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--   type TEXT NOT NULL,
--   title TEXT NOT NULL,
--   message TEXT,
--   is_read BOOLEAN DEFAULT false,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage bucket for profile photos (run this in Supabase Storage UI or via SQL)
-- This is a note: You'll need to create a bucket named 'profile-photos' in Supabase Storage UI
-- Then set the bucket to be public for read access

-- Actually what I have so far
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  username VARCHAR(16) NOT NULL, 
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT, 
  privacy_preset TEXT NOT NULL DEFAULT 'totals_only',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


CREATE TYPE FRIEND_STATUS AS ENUM ('pending', 'accepted', 'blocked');

CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status FRIEND_STATUS NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

CREATE TABLE circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE circle_members (
  circle_id UUID NOT NULL,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (circle_id, user_id),
  FOREIGN KEY (circle_id) REFERENCES circles(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TYPE SESSION_STATUS AS ENUM ('active', 'completed', 'overridden');

CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE DEFAULT CURRENT_DATE, 
  total_minutes INTEGER DEFAULT 0,
  per_app_data JSON,
  UNIQUE (user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TYPE ACTIVITY_TYPE AS ENUM ('session_completed', 'session_override', 'streak_milestone', 'friend_joined');

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  circle_id UUID,
  type ACTIVITY_TYPE NOT NULL,
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (circle_id) REFERENCES circles(id),
  FOREIGN KEY (session_id) REFERENCES focus_sessions(id)
);

CREATE TABLE tracked_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  package_name TEXT UNIQUE NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE user_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES tracked_apps(id) ON DELETE CASCADE,
  is_tracked BOOLEAN DEFAULT true,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

CREATE TABLE app_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES tracked_apps(id) ON DELETE CASCADE,
  days_of_week TEXT[] NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  scheduled_duration INTEGER,
  actual_duration INTEGER,
  status SESSION_STATUS DEFAULT 'active',
  points_earned INTEGER DEFAULT 0,
  tree_growth DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE focus_session_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES focus_sessions(id) ON DELETE CASCADE,
  app_id UUID REFERENCES tracked_apps(id) ON DELETE CASCADE,
  UNIQUE(session_id, app_id)
);

CREATE TABLE app_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES tracked_apps(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  sessions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, app_id, date)
);

CREATE INDEX idx_activities_user_id ON activities (user_id);
CREATE INDEX idx_activities_circle_id ON activities (circle_id);
CREATE INDEX idx_circle_members_user_id ON circle_members (user_id);
CREATE INDEX idx_circle_members_circle_id ON circle_members (circle_id);
CREATE INDEX idx_daily_summaries_user_id ON daily_summaries (user_id);
CREATE INDEX idx_daily_summaries_date ON daily_summaries (date);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_apps_user_id ON user_apps(user_id);
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_start_time ON focus_sessions(start_time);

CREATE INDEX idx_app_usage_user_id ON app_usage(user_id);
CREATE INDEX idx_app_usage_app_id ON app_usage(app_id);
CREATE INDEX idx_app_usage_date ON app_usage(date);
CREATE INDEX idx_app_usage_user_date ON app_usage(user_id, date);

CREATE INDEX idx_app_schedules_user_id ON app_schedules(user_id);
CREATE INDEX idx_app_schedules_app_id ON app_schedules(app_id);
CREATE INDEX idx_app_schedules_is_active ON app_schedules(is_active);

CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_friend_id ON friends(friend_id);
CREATE INDEX idx_friends_status ON friends(status);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_session_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own user record"
ON users FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update their own user record"
ON users FOR UPDATE 
USING (id = auth.uid());

CREATE POLICY "Users can view their own circle data"
ON circles FOR SELECT 
USING (id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view their own memberships"
ON circle_members FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can be added into circles"
ON circle_members FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can be removed from circles"
ON circle_members FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY "Users can read activities only from their own circles"
ON activities FOR SELECT 
USING (
  (circle_id IS NULL AND user_id = auth.uid())
  OR
  (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid())));

CREATE POLICY "Users can create own activities"
ON activities FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their own daily summaries"
ON daily_summaries FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own daily summaries"
ON daily_summaries FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view tracked apps" 
  ON tracked_apps FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can view own apps" 
  ON user_apps FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own apps" 
  ON user_apps FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own apps" 
  ON user_apps FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own apps" 
  ON user_apps FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON focus_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON focus_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON focus_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own session apps" ON focus_session_apps FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM focus_sessions 
      WHERE focus_sessions.id = focus_session_apps.session_id 
      AND focus_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own session apps" ON focus_session_apps FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM focus_sessions 
      WHERE focus_sessions.id = focus_session_apps.session_id 
      AND focus_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own session apps" ON focus_session_apps FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM focus_sessions 
      WHERE focus_sessions.id = focus_session_apps.session_id 
      AND focus_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own session apps" ON focus_session_apps FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM focus_sessions 
      WHERE focus_sessions.id = focus_session_apps.session_id 
      AND focus_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own app usage" 
ON app_usage FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own app usage" 
ON app_usage FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own app usage" 
ON app_usage FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can view own friendships" 
ON friends FOR SELECT 
USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friendships" 
ON friends FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own friendships" 
ON friends FOR UPDATE 
USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can delete own friendships" 
ON friends FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY "Users can view own app schedules" 
ON app_schedules FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create own app schedules" 
ON app_schedules FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own app schedules" 
ON app_schedules FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own app schedules" 
ON app_schedules FOR DELETE 
USING (user_id = auth.uid());
