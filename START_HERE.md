# 🚀 START HERE - Run SLock on Expo Go

## Simple 3-Step Process

### Step 1: Open Your Terminal
In VS Code, open a new terminal:
- Menu: `Terminal` → `New Terminal`
- Or keyboard: `Ctrl + `` (backtick)

### Step 2: Run This Command
```bash
npx expo start
```

**That's it!** The command will:
1. Start the Metro bundler
2. Show a QR code in your terminal
3. Show connection options

You should see output like this:
```
› Metro waiting on exp://192.168.1.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
```

### Step 3: Connect Your Phone

**On iOS:**
1. Download "Expo Go" from App Store
2. Open your Camera app
3. Point at the QR code
4. Tap the notification to open in Expo Go

**On Android:**
1. Download "Expo Go" from Play Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan the QR code from terminal

---

## Alternative: If You Can't See QR Code

If the QR code doesn't appear:

### Option A: Use Tunnel Mode
```bash
npx expo start --tunnel
```
This works even if you're not on the same WiFi network.

### Option B: Clear Cache
```bash
npx expo start --clear
```
This clears Metro bundler cache and restarts fresh.

### Option C: Open in Web Browser (for testing)
```bash
npx expo start --web
```
This opens the app in your browser to test the UI (not all features work on web).

---

## Troubleshooting

### ❌ "Cannot find module" or build errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npx expo start --clear
```

### ❌ Port 8081 already in use
```bash
# Kill the process and restart
lsof -ti:8081 | xargs kill -9
npx expo start
```

### ❌ Still not working?
Try the web version to at least see the UI:
```bash
npx expo start --web
```
Then open http://localhost:8081 in your browser.

---

## What You'll See

Once connected, you'll see the **Login Screen** first.

**Try this flow:**
1. Click "Log In" button (no need to type anything)
2. You'll go through onboarding:
   - Welcome screen
   - Select apps (tap Instagram, TikTok, etc.)
   - See time analysis
   - Create profile
   - Add friends
3. Land on the main app with tabs:
   - **Social** - Leaderboard with trees 🌳
   - **Me** - Your profile
   - **Apps** - Block apps
   - **Settings**

---

## Quick Commands Reference

```bash
# Standard start
npx expo start

# With tunnel (works anywhere)
npx expo start --tunnel

# Clear cache
npx expo start --clear

# Web only
npx expo start --web

# iOS simulator (requires Xcode)
npx expo start --ios

# Android emulator (requires Android Studio)
npx expo start --android
```

---

## Next Steps

After you see it running:
1. Explore all the screens
2. Check out [QUICK_START.md](QUICK_START.md) for detailed guide
3. See [README.md](README.md) for Firebase setup

**Ready? Open your terminal and run:** `npx expo start`
