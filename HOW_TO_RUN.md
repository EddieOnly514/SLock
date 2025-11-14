# How to Run SLock - Standalone Guide

## Prerequisites (One-time Setup)

### 1. Install Node.js
- Download from https://nodejs.org
- Version 18 or higher required
- Verify: `node --version`

### 2. Install Expo Go on Your Phone
- **iPhone**: App Store → Search "Expo Go" → Install
- **Android**: Google Play → Search "Expo Go" → Install

---

## Running the App (Every Time)

### Step 1: Open Terminal
```bash
cd /Users/eddiewang/Desktop/SLock/SLock
```

### Step 2: Start the Dev Server
```bash
npm start
```

**That's it!** Wait 10-30 seconds and you'll see:
- A QR code in the terminal
- Menu with keyboard shortcuts
- Connection URL

### Step 3: Connect Your Phone

**iPhone:**
1. Open Camera app (not Expo Go)
2. Point at the QR code
3. Tap the banner that appears
4. Opens in Expo Go automatically

**Android:**
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Scan the QR code from terminal

**Both phones must be on the same WiFi as your computer!**

### Step 4: Wait for Bundle
- First time: 30-60 seconds
- You'll see "Downloading JavaScript bundle"
- App launches automatically when ready

---

## Common Commands

```bash
# Start normally
npm start

# Start and open web browser
npm run web

# Start on iOS simulator (Mac only, requires Xcode)
npm run ios

# Start on Android emulator (requires Android Studio)
npm run android

# Clear cache if something breaks
npm start -- --clear
```

---

## If Something Goes Wrong

### "Cannot find module" or weird errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### "Port 8081 already in use"
```bash
# Kill whatever is using the port
lsof -ti:8081 | xargs kill -9
npm start
```

### "Unable to connect" on phone
```bash
# Use tunnel mode (slower but works anywhere)
npm start -- --tunnel
```

### Just want to see it in browser (quick test)
```bash
npm run web
```
Opens at http://localhost:8081

### Metro bundler seems stuck
Press `r` in the terminal to reload
Or `Ctrl+C` to stop, then `npm start` again

---

## Terminal Keyboard Shortcuts

Once the dev server is running, you can press:

- `r` - Reload the app
- `m` - Open dev menu on phone
- `a` - Open on Android emulator
- `i` - Open on iOS simulator
- `w` - Open in web browser
- `?` - Show all commands
- `Ctrl+C` - Stop the server

---

## Phone Shortcuts

**Shake your phone** while the app is running to open:
- Reload
- Debug menu
- Performance monitor
- Element inspector

---

## Project Structure (What You're Running)

```
SLock/
├── app/                    # All screens
│   ├── auth/              # Login/Signup
│   ├── onboarding/        # First-time user flow
│   └── (tabs)/            # Main app (Social, Me, Apps, Settings)
├── components/            # Reusable UI components
├── constants/             # Colors, theme
├── package.json           # Dependencies
└── app.json              # Expo config
```

---

## Normal Development Workflow

### 1. Start Server
```bash
npm start
```

### 2. Make Changes
- Edit any `.tsx` file in `app/` folder
- Save the file
- App automatically reloads on your phone (Fast Refresh)

### 3. Test on Phone
- Changes appear instantly
- Shake phone to debug if needed

### 4. Stop Server
- Press `Ctrl+C` in terminal

---

## Quick Reference Card

| Task | Command |
|------|---------|
| **Start dev server** | `npm start` |
| **Open in browser** | `npm run web` |
| **Clear cache** | `npm start -- --clear` |
| **Reload app** | Press `r` in terminal |
| **Stop server** | `Ctrl+C` |
| **Open debug menu** | Shake phone |
| **Reinstall everything** | `rm -rf node_modules && npm install` |

---

## Common Issues & Fixes

### ❌ QR code not showing
**Fix:** Wait 30 seconds. Still nothing? Try `npm start -- --clear`

### ❌ Phone can't connect
**Fix:** Make sure phone and computer on same WiFi. Try `npm start -- --tunnel`

### ❌ White screen on phone
**Fix:** Shake phone → "Reload". Still broken? Stop server (Ctrl+C) and `npm start -- --clear`

### ❌ "Unable to resolve module"
**Fix:**
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### ❌ Expo Go shows error
**Fix:** Check the terminal - there's usually a detailed error message there

---

## File to Edit for Changes

Want to modify the app? Edit these files:

**Login Screen:**
```
app/auth/login.tsx
```

**Main Social Tab:**
```
app/(tabs)/social.tsx
```

**Colors/Theme:**
```
constants/Colors.ts
constants/Theme.ts
```

**Buttons/Components:**
```
components/Button.tsx
components/Input.tsx
```

Just edit, save, and the app reloads automatically!

---

## What If I Close Everything?

Next time you want to run it:

```bash
# 1. Navigate to project
cd /Users/eddiewang/Desktop/SLock/SLock

# 2. Start server
npm start

# 3. Scan QR with phone
```

That's it! No need to reinstall or reconfigure.

---

## Testing Without a Phone

Don't have a phone handy? Use web:

```bash
npm run web
```

Opens in browser. Most UI works, but some native features won't.

---

## Need Help?

- Check terminal for error messages
- Try `npm start -- --clear` (fixes 90% of issues)
- Delete `node_modules` and `npm install` again
- See [QUICK_START.md](QUICK_START.md) for detailed troubleshooting

---

## Summary - The 3 Commands You Need

```bash
# 1. Start the app
npm start

# 2. Clear cache if broken
npm start -- --clear

# 3. Fix everything (last resort)
rm -rf node_modules && npm install && npm start
```

**That's all you need to know!** 🚀
