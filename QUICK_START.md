# 🚀 Quick Start Guide - Running SLock on Expo Go

## Step-by-Step Instructions

### 1. Install Expo Go App
Download Expo Go on your phone:
- **📱 iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
- **🤖 Android**: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2. Start the Development Server

In your terminal (you should already see this running):
```bash
npx expo start
```

Or specifically for Expo Go:
```bash
npx expo start --go
```

### 3. Connect Your Phone

Once Metro bundler starts, you'll see:
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▀█ █▄▄█ ▄▄▄▄▄ █
█ █   █ █▀▀▀▀ ▀█ █   █ █
█ █▄▄▄█ █▀ ▀ ██ █▄▄▄█ █
...
```

**Option A - Scan QR Code (Easiest)**
1. Open Expo Go app on your phone
2. Tap "Scan QR Code"
3. Point camera at the QR code in your terminal
4. Wait for the app to load

**Option B - Manual Connection**
1. Make sure your phone and computer are on the **same WiFi network**
2. Open Expo Go app
3. Look for "SLock" in the "Recently in Development" section
4. Tap it to connect

**Option C - Use the Link**
1. Look for the URL in terminal like: `exp://192.168.x.x:8081`
2. Type this URL in your phone's browser or share it to your phone
3. Open with Expo Go

### 4. Wait for Bundle to Load

First time will take 30-60 seconds to bundle the JavaScript:
- You'll see a progress bar
- "Downloading JavaScript bundle"
- The app will launch automatically when ready

### 5. Navigate the App

You should see the login screen first! Here's what to explore:

**Flow 1: Authentication**
- Login screen → Can type fake credentials
- Click "Log In" → Goes to onboarding

**Flow 2: Onboarding**
1. Welcome screen
2. Select apps to track (Instagram, TikTok, etc.)
3. Time analysis (mock data showing wasted time)
4. Create profile (enter username)
5. Add friends → Finish → Goes to main app

**Flow 3: Main App Tabs**
- **Social** ⭐ (default) - See leaderboard with trees
- **Me** - Your profile and stats
- **Apps** - Manage blocking and schedules
- **Settings** - Account and app settings

---

## Troubleshooting

### ❌ "Unable to connect to Metro bundler"
**Solution**: Make sure phone and computer are on same WiFi
```bash
# Stop the server (Ctrl+C) and restart:
npx expo start --tunnel
```
The `--tunnel` option works through internet instead of local network.

### ❌ QR code not showing
**Solution**:
```bash
# Press 'q' in the terminal to show QR again
# Or restart with:
npx expo start --clear
```

### ❌ "Uncaught Error: Firebase not configured"
This is **expected**! The app UI works fine, but you'll need to set up Firebase later for real authentication.

For now, the login button will still navigate you through the app.

### ❌ App crashes or white screen
**Solution**:
```bash
# Clear cache and restart:
npx expo start --clear
```

### ❌ "Network response timed out"
Your computer's firewall might be blocking it:
- On Mac: System Preferences → Security & Privacy → Firewall → Allow Expo
- Or use tunnel mode: `npx expo start --tunnel`

---

## Useful Commands

```bash
# Start normally
npx expo start

# Start with tunnel (works anywhere, slower)
npx expo start --tunnel

# Clear cache
npx expo start --clear

# Show QR code again (press in terminal)
q

# Restart Metro bundler (press in terminal)
r

# Open on iOS simulator (requires Xcode)
i

# Open on Android emulator (requires Android Studio)
a
```

---

## What You'll See

### 📱 Login Screen (First Screen)
- Email and password inputs
- "Log In" and "Sign Up" buttons
- Social login options

### 🎯 Onboarding Flow
1. **Welcome** - Big tree emoji, motivational text
2. **Select Apps** - Choose TikTok, Instagram, etc.
3. **Time Analysis** - "You spent 42h = watched 21 movies"
4. **Create Profile** - Enter username, add photo
5. **Add Friends** - Connect via Instagram/Contacts

### 🏠 Main App
- **Social Tab**: Leaderboard with tree heights (🥇🥈🥉)
- **Me Tab**: Your stats, app breakdown, streaks
- **Apps Tab**: Block apps, set schedules, timers
- **Settings Tab**: Privacy, notifications, logout

---

## Next Steps After Testing UI

Once you've explored the UI:

1. **Set up Firebase** (for real authentication)
   - See [README.md](README.md#getting-started) for Firebase setup

2. **Add Native Modules** (for screen time tracking)
   - iOS: Screen Time API
   - Android: UsageStatsManager

3. **Implement Backend**
   - Connect to Firestore for social features
   - Real-time friend updates
   - Actual app blocking logic

---

## Development Tips

### Live Reload
- Shake your phone to open developer menu
- Enable "Fast Refresh" for instant updates
- Changes to code auto-reload the app

### Debug Menu (Shake Phone)
- Reload JS
- Debug Remote JS
- Show Performance Monitor
- Toggle Element Inspector

### Hot Keys in Terminal
- `r` - Reload app
- `m` - Open developer menu on device
- `q` - Show QR code
- `c` - Clear bundler cache

---

## Current Status

✅ **Working**: All UI screens, navigation, design system
⏳ **Mock Data**: Uses fake data for demos
❌ **Not Connected**: Firebase auth, real screen time tracking, app blocking

**The app is ready to explore visually!** All screens and navigation work perfectly with mock data. You can click through the entire user journey from login to main app. 🎉

---

## Need Help?

If you encounter issues:
1. Check the terminal for error messages
2. Try clearing cache: `npx expo start --clear`
3. Use tunnel mode if WiFi issues: `npx expo start --tunnel`
4. Restart Expo Go app on phone
5. Check that you're on the same WiFi network

**Happy testing!** 🌳📱
