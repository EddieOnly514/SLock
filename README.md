# SLock

**A social, gamified tool to help people reduce screen time on addictive apps**

SLock makes self-control fun and motivating by combining app blocking with social accountability and gamification. Users can lock distracting apps, earn points to grow a virtual tree, and compete with friends—just like Snapchat streaks but for productivity.

---

## Features

### Core Features
- **App Locking** - Block distracting apps like TikTok, Instagram, Twitter during focus sessions
- **Gamification** - Grow a virtual tree by completing focus sessions without overriding
- **Social & Transparent** - See friends' screen time, streaks, and progress in real-time
- **Accountability** - Create friendly competition and encouragement with leaderboards
- **Smart Scheduling** - Set custom schedules for blocking apps on specific days/times

### Key Screens
1. **Authentication** - Login/Signup with email or social accounts (Apple, Google)
2. **Onboarding** - App selection, screen time analysis with AI analogies, profile creation, friend sync
3. **Social Tab** (Main) - Leaderboard showing friends' tree growth and screen time
4. **Me Tab** - Personal screen time breakdown, activity analysis, streak tracking
5. **Apps Tab** - Manage blocked apps, create schedules, start focus sessions
6. **Settings** - Privacy controls, notifications, theme, account management

---

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **UI**: Custom components with calm blue, rounded, minimalistic design
- **State Management**: React hooks and context (can add Zustand/Redux later)

---

## Project Structure

```
SLock/
├── app/                           # Expo Router app directory
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Entry/splash screen
│   ├── auth/                     # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── onboarding/               # Onboarding flow
│   │   ├── welcome.tsx
│   │   ├── select-apps.tsx
│   │   ├── time-analysis.tsx
│   │   ├── create-profile.tsx
│   │   └── add-friends.tsx
│   └── (tabs)/                   # Main app tabs
│       ├── _layout.tsx           # Tab navigator
│       ├── social.tsx            # Main social/leaderboard screen
│       ├── me.tsx                # Personal stats & profile
│       ├── apps.tsx              # App management & blocking
│       └── settings.tsx          # Settings & preferences
├── components/                    # Reusable UI components
│   ├── Button.tsx
│   └── Input.tsx
├── constants/                     # Design system
│   ├── Colors.ts
│   └── Theme.ts
├── services/                      # External services
│   └── firebase.ts
├── types/                         # TypeScript definitions
│   └── index.ts
└── hooks/                         # Custom React hooks (to be added)
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for Android)

### Installation

1. **Clone the repository**
   ```bash
   cd SLock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password, Google, Apple)
   - Create a Firestore database
   - Copy your Firebase config and update `services/firebase.ts`:
     ```typescript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

4. **Run the app**
   ```bash
   # Start Expo dev server
   npm start

   # Run on iOS
   npm run ios

   # Run on Android
   npm run android

   # Run on web (for testing UI)
   npm run web
   ```

---

## Design System

### Colors (Calm Blue Theme)
- **Primary**: `#2196F3` (Calm blue)
- **Success**: `#4CAF50` (Tree growth)
- **Warning**: `#FF9800` (Screen time alerts)
- **Danger**: `#F44336` (App blocking)
- **Background**: `#FAFBFC` (Light gray)

### Typography
- Font sizes: 12px (xs) to 32px (xxxl)
- Font weights: Regular (400), Medium (500), Semibold (600), Bold (700)

### Border Radius (Rounded Design)
- Small: 8px
- Medium: 12px
- Large: 16px
- Extra Large: 20-24px
- Full: 9999px (circular)

---

## Key Implementation TODOs

### High Priority
- [ ] Implement actual Firebase authentication
- [ ] Add screen time tracking (requires native modules for iOS/Android)
- [ ] Implement app blocking functionality
- [ ] Set up Firestore collections and real-time listeners for social features
- [ ] Add image picker for profile photos
- [ ] Implement friend search and friend request system

### Medium Priority
- [ ] Create focus timer with background mode
- [ ] Build tree growth animation
- [ ] Add push notifications for reminders and friend activity
- [ ] Implement weekly/monthly analytics charts
- [ ] Add achievements system
- [ ] Create AI-powered screen time analogies

### Low Priority
- [ ] Add dark mode theme
- [ ] Implement data export feature
- [ ] Add app usage widgets
- [ ] Create share/invite functionality
- [ ] Add customizable tree/pet options

---

## Screen Time APIs

### iOS
- Use `Screen Time API` (requires Family Controls framework)
- Requires special entitlements from Apple
- Alternative: Use `DeviceActivityMonitor` API

### Android
- Use `UsageStatsManager` API
- Requires `PACKAGE_USAGE_STATS` permission
- May need `AccessibilityService` for app blocking

---

## Firebase Firestore Collections

```
users/
  - id, username, email, profilePhoto, points, level, treeGrowth
  - isProfilePublic, allowFriendRequests

trackedApps/
  - id, name, packageName, icon, category

userApps/
  - userId, appId, isTracked, isBlocked, schedules

screenTime/
  - userId, appId, date, durationMinutes, sessions[]

focusSessions/
  - id, userId, appIds[], startTime, endTime, wasCompleted, pointsEarned

friends/
  - id, userId, friendId, status (pending/accepted/blocked)

streaks/
  - userId, currentStreak, longestStreak, lastActivityDate

achievements/
  - id, name, description, icon, pointsRequired, category

notifications/
  - userId, type, title, message, isRead, createdAt
```

---

## Contributing

This is an initial implementation. Key areas for improvement:

1. **State Management** - Add Zustand or Redux for global state
2. **Testing** - Add unit tests (Jest) and E2E tests (Detox)
3. **Performance** - Optimize re-renders, add memoization
4. **Accessibility** - Add proper ARIA labels and screen reader support
5. **Error Handling** - Add comprehensive error boundaries and logging
6. **Analytics** - Integrate analytics (Mixpanel, Amplitude)

---

## License

MIT License - feel free to use this for your own projects!

---

## Contact

For questions or feedback about SLock, please open an issue on GitHub.

**Let's build healthier phone habits together!** 🌳📱
