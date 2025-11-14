/**
 * SLock TypeScript Type Definitions
 */

export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  profilePhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  // Gamification
  points: number;
  level: number;
  treeGrowth: number;

  // Streak tracking
  currentStreak?: number;
  longestStreak?: number;
  lastActivityDate?: Date;

  // Privacy settings
  isProfilePublic: boolean;
  allowFriendRequests: boolean;
}

export interface TrackedApp {
  id: string;
  name: string;
  packageName: string;  // bundle ID on iOS, package name on Android
  icon?: string;
  category?: string;
  isBlocked: boolean;
}

export interface UserApp {
  userId: string;
  appId: string;
  isTracked: boolean;
  isBlocked: boolean;
  schedules?: BlockSchedule[];
  addedAt: Date;
}

export interface BlockSchedule {
  id: string;
  appId: string;
  userId: string;
  days: number[];  // 0-6 (Sunday-Saturday)
  startTime: string;  // "HH:MM" format
  endTime: string;    // "HH:MM" format
  isActive: boolean;
}

export interface ScreenTimeData {
  userId: string;
  appId: string;
  date: string;  // YYYY-MM-DD
  durationMinutes: number;
  sessions: ScreenTimeSession[];
}

export interface ScreenTimeSession {
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  wasOverridden: boolean;
}

export interface FocusSession {
  id: string;
  userId: string;
  appIds: string[];
  startTime: Date;
  endTime?: Date;
  scheduledDuration: number;  // minutes
  actualDuration?: number;    // minutes
  wasCompleted: boolean;
  pointsEarned: number;
  treeGrowth: number;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
}

export interface FriendProfile {
  id: string;
  username: string;
  profilePhoto?: string;
  treeGrowth: number;
  currentStreak: number;
  totalScreenTimeToday: number;  // minutes
}

export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;  // YYYY-MM-DD
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  category: 'focus' | 'streak' | 'social' | 'milestone';
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'achievement' | 'streak_reminder' | 'app_blocked' | 'session_complete';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// Navigation types
export type RootStackParamList = {
  auth: undefined;
  onboarding: undefined;
  '(tabs)': undefined;
};

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
};

export type OnboardingStackParamList = {
  welcome: undefined;
  'select-apps': undefined;
  'time-analysis': undefined;
  'create-profile': undefined;
  'add-friends': undefined;
};

export type TabsParamList = {
  social: undefined;
  me: undefined;
  apps: undefined;
  settings: undefined;
};
