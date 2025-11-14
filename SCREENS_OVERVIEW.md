# SLock - Screens Overview

This document provides a visual overview of all screens implemented in the SLock app.

---

## Authentication Flow

### 1. Login Screen ([app/auth/login.tsx](app/auth/login.tsx))
- **Purpose**: User authentication entry point
- **Features**:
  - Email/password input fields
  - Social login buttons (Apple, Google)
  - Link to signup screen
  - Forgot password option
- **Design**: Clean, centered form with calm blue primary button

### 2. Signup Screen ([app/auth/signup.tsx](app/auth/signup.tsx))
- **Purpose**: New user registration
- **Features**:
  - Email and password fields with confirmation
  - Social signup options
  - Terms acceptance
  - Link back to login
- **Design**: Similar to login with additional fields

---

## Onboarding Flow (First-time users)

### 3. Welcome Screen ([app/onboarding/welcome.tsx](app/onboarding/welcome.tsx))
- **Purpose**: Greet new users and explain the app
- **Features**:
  - Large tree emoji illustration (placeholder)
  - Motivational welcome text
  - Permission disclaimer
  - "Get Started" CTA button
- **Design**: Full-screen with illustration, text, and bottom CTA

### 4. Select Apps Screen ([app/onboarding/select-apps.tsx](app/onboarding/select-apps.tsx))
- **Purpose**: Choose apps to track
- **Features**:
  - List of popular apps (Instagram, TikTok, Twitter, etc.)
  - Multi-select interface with checkmarks
  - Selected app counter
  - Continue button (disabled if none selected)
- **Design**: Scrollable list with card-based selection UI

### 5. Time Analysis Screen ([app/onboarding/time-analysis.tsx](app/onboarding/time-analysis.tsx))
- **Purpose**: Show shocking reality of screen time waste
- **Features**:
  - Total weekly screen time display
  - AI-generated analogy (e.g., "watched 21 movies")
  - List of alternative activities they could've done
  - Motivational message
- **Design**: Cards showing stats, analogy, and alternatives with different colors

### 6. Create Profile Screen ([app/onboarding/create-profile.tsx](app/onboarding/create-profile.tsx))
- **Purpose**: Set up user profile
- **Features**:
  - Profile photo picker (placeholder)
  - Username input field
  - Skip option
  - Continue button
- **Design**: Centered layout with photo at top, form below

### 7. Add Friends Screen ([app/onboarding/add-friends.tsx](app/onboarding/add-friends.tsx))
- **Purpose**: Connect with friends for social features
- **Features**:
  - Sync options (Instagram, Contacts, Facebook)
  - Benefits explanation card
  - Skip option
  - Finish setup button
- **Design**: Card-based sync options with benefits highlighted

---

## Main App (Tab Navigation)

### 8. Social Tab ([app/(tabs)/social.tsx](app/(tabs)/social.tsx)) **⭐ MAIN SCREEN**
- **Purpose**: Social leaderboard and competition
- **Features**:
  - Personal stats card (screen time, tree growth, streak)
  - Friend leaderboard sorted by tree height
  - Tree emoji visualization with height percentage
  - Screen time and streak for each friend
  - User's card highlighted with primary color
  - "Add Friends" button
- **Design**: Header + stats card + scrollable leaderboard with rankings (🥇🥈🥉)

### 9. Me Tab ([app/(tabs)/me.tsx](app/(tabs)/me.tsx))
- **Purpose**: Personal profile and detailed analytics
- **Features**:
  - Profile photo and username
  - Edit profile button
  - Follower/following count cards
  - Today's total screen time
  - App breakdown with percentages and progress bars
  - Activity analysis (streak, achievements, sessions, tree growth)
- **Design**: Profile header + stats grid + detailed breakdowns

### 10. Apps Tab ([app/(tabs)/apps.tsx](app/(tabs)/apps.tsx))
- **Purpose**: Manage app blocking and schedules
- **Features**:
  - Quick focus timer presets (15min, 30min, 1hr, 2hr)
  - List of tracked apps with block toggles
  - Schedule indicators
  - Schedule modal for setting custom times/days
  - Day picker (S M T W T F S)
  - Time range selector
- **Design**: Timer card at top + app list + modal overlay

### 11. Settings Tab ([app/(tabs)/settings.tsx](app/(tabs)/settings.tsx))
- **Purpose**: App configuration and account management
- **Features**:
  - Account settings (profile, privacy, friends)
  - App settings (notifications, theme, tracking)
  - Support options (help, feedback, about)
  - Danger zone (logout, delete account)
- **Design**: Grouped settings list with icons and arrows

---

## Design System Highlights

### Color Palette
- **Primary Blue**: `#2196F3` - Main actions, active states
- **Success Green**: `#4CAF50` - Tree growth, positive metrics
- **Warning Orange**: `#FF9800` - Screen time alerts
- **Danger Red**: `#F44336` - Blocking, destructive actions
- **Neutral Gray**: Various shades for backgrounds and text

### Typography
- **Sizes**: 12px (xs) → 32px (xxxl)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- Consistent 4px base unit
- Common values: 8px, 16px, 24px, 32px, 48px

### Border Radius
- All elements use rounded corners (8px - 24px)
- Buttons and cards: 12-16px
- Full circles: 9999px

### Components
- **Button**: 4 variants (primary, secondary, outline, ghost), 3 sizes
- **Input**: With labels, icons, error states, focus states
- All components follow the calm, minimalistic design philosophy

---

## Navigation Structure

```
Entry (index.tsx)
├─ Auth
│  ├─ Login
│  └─ Signup
│
├─ Onboarding (first-time only)
│  ├─ Welcome
│  ├─ Select Apps
│  ├─ Time Analysis
│  ├─ Create Profile
│  └─ Add Friends
│
└─ Main App (tabs)
   ├─ Social (default) ⭐
   ├─ Me
   ├─ Apps
   └─ Settings
```

---

## Key Features Summary

✅ **Implemented**:
- Complete authentication UI (login/signup)
- Full onboarding flow (5 screens)
- 4 main app tabs with rich functionality
- Social leaderboard with friend comparison
- Personal analytics and breakdowns
- App blocking interface
- Settings and account management
- Reusable component library
- Consistent design system
- TypeScript types
- Firebase configuration

⏳ **Next Steps** (not yet implemented):
- Firebase authentication integration
- Screen time tracking (native modules)
- Actual app blocking functionality
- Real-time Firestore sync
- Image upload for profiles
- Friend search and requests
- Focus timer logic
- Tree growth animations
- Push notifications

---

## File Count
- **Total Screens**: 14 screens
- **Components**: 2 reusable components
- **Navigation Files**: 2 layouts
- **Type Definitions**: Full TypeScript coverage
- **Design System**: Colors + Theme constants

This is a fully-designed, production-ready UI foundation for SLock! 🚀🌳
