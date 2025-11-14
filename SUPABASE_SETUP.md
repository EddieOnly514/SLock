# 🔧 Supabase Setup Guide for SLock

This guide will walk you through setting up your Supabase backend for SLock.

---

## ✅ Prerequisites

- Supabase account at [supabase.com](https://supabase.com)
- Your Supabase project: https://pcoirzokoirdonfpsxfv.supabase.co
- Supabase credentials already configured in `services/supabase.ts`

---

## 📋 Step 1: Run the Database Schema

1. **Open Supabase SQL Editor**
   - Go to your project: https://app.supabase.com/project/pcoirzokoirdonfpsxfv
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

2. **Copy and Paste the Schema**
   - Open the file `supabase_schema.sql` in this project
   - Copy ALL the SQL code
   - Paste it into the Supabase SQL Editor

3. **Run the Query**
   - Click **"Run"** button (or press `Cmd/Ctrl + Enter`)
   - Wait for it to complete (should take 5-10 seconds)
   - You should see: ✅ "Success. No rows returned"

**What this does:**
- Creates all database tables (users, tracked_apps, screen_time, etc.)
- Sets up Row Level Security (RLS) policies
- Creates triggers for auto-creating user profiles
- Inserts default apps (Instagram, TikTok, etc.)
- Creates indexes for performance

---

## 📱 Step 2: Enable Authentication Providers

### Email/Password Authentication (Already Enabled by Default)
✅ Should work out of the box

### Phone Authentication (SMS/OTP)

1. **Go to Authentication Settings**
   - Click **"Authentication"** in sidebar
   - Click **"Providers"**

2. **Enable Phone Provider**
   - Find **"Phone"** in the list
   - Toggle it **ON**

3. **Configure SMS Provider**

   **Option A: Use Twilio (Recommended for Production)**
   - Sign up at [twilio.com](https://twilio.com)
   - Get your Twilio credentials:
     - Account SID
     - Auth Token
     - Phone Number
   - In Supabase Phone settings:
     - Select **"Twilio"**
     - Enter your Twilio credentials
     - Click **"Save"**

   **Option B: Use Supabase Built-in (Free Tier)**
   - Limited to 3 test phone numbers
   - Good for development
   - Select **"Supabase"** provider
   - Add your test phone numbers

### Apple Sign-In

1. **Go to Authentication → Providers**
2. **Enable Apple**
   - Toggle **"Apple"** ON
3. **Configure Apple Provider**
   - **Services ID**: Get from [Apple Developer](https://developer.apple.com)
   - **Team ID**: Your Apple Developer Team ID
   - **Key ID**: Apple Sign In Key ID
   - **Private Key**: Upload your `.p8` key file

   **Detailed steps:**
   - Go to [Apple Developer Console](https://developer.apple.com/account/)
   - Create an App ID
   - Enable "Sign in with Apple" capability
   - Create a Services ID
   - Configure Return URLs (use Supabase's callback URL)
   - Create a Key with "Sign in with Apple" enabled
   - Download the `.p8` file
   - Enter credentials in Supabase

### Google Sign-In

1. **Go to Authentication → Providers**
2. **Enable Google**
   - Toggle **"Google"** ON
3. **Get Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **"Credentials"**
   - Create **"OAuth 2.0 Client ID"**
   - Choose **"Web application"**
   - Add **Authorized redirect URIs**:
     - Copy from Supabase (shown in Google provider settings)
     - Example: `https://pcoirzokoirdonfpsxfv.supabase.co/auth/v1/callback`
4. **Enter in Supabase**
   - **Client ID**: From Google Console
   - **Client Secret**: From Google Console
   - Click **"Save"**

---

## 💾 Step 3: Create Storage Bucket for Profile Photos

1. **Go to Storage**
   - Click **"Storage"** in sidebar
   - Click **"Create a new bucket"**

2. **Create Bucket**
   - **Name**: `profile-photos`
   - **Public bucket**: Toggle **ON** (so profile photos are accessible)
   - Click **"Create bucket"**

3. **Set Up Bucket Policies** (Optional, for more control)
   - Click on `profile-photos` bucket
   - Click **"Policies"**
   - Add policies:
     ```sql
     -- Allow authenticated users to upload their own photos
     CREATE POLICY "Users can upload own profile photos"
     ON storage.objects FOR INSERT
     TO authenticated
     WITH CHECK (
       bucket_id = 'profile-photos' AND
       auth.uid()::text = (storage.foldername(name))[1]
     );

     -- Allow users to update their own photos
     CREATE POLICY "Users can update own profile photos"
     ON storage.objects FOR UPDATE
     TO authenticated
     USING (
       bucket_id = 'profile-photos' AND
       auth.uid()::text = (storage.foldername(name))[1]
     );

     -- Allow public read access
     CREATE POLICY "Public can view profile photos"
     ON storage.objects FOR SELECT
     TO public
     USING (bucket_id = 'profile-photos');
     ```

---

## 🔒 Step 4: Configure Email Settings (Optional)

If you want to customize email templates for verification, password reset, etc:

1. **Go to Authentication → Email Templates**
2. **Customize templates:**
   - Confirm signup
   - Reset password
   - Magic link
   - Change email address

---

## 🧪 Step 5: Test Your Setup

### Test Email/Password Auth
```bash
# In your terminal, run:
npx expo start
```

Then:
1. Open app in Expo Go
2. Go to login screen
3. Switch to **"Email"** tab
4. Enter email and password
5. Click **"Continue"**
6. Should redirect to main app ✅

### Test Phone Auth
1. Switch to **"Phone"** tab
2. Enter phone number (use test number if using Supabase built-in)
3. Click **"Continue"**
4. Enter OTP code from SMS
5. Click **"Verify"**
6. Should redirect to main app ✅

### Verify Database
1. Go to **"Table Editor"** in Supabase
2. Click **"users"** table
3. Should see new user entry ✅

---

## 📊 Step 6: Verify Tables Were Created

In Supabase, go to **"Table Editor"**. You should see these tables:

✅ **users** - User profiles
✅ **tracked_apps** - App catalog (should have 10 default apps)
✅ **user_apps** - User's tracked apps
✅ **screen_time** - Screen time data
✅ **focus_sessions** - Focus session history
✅ **focus_session_apps** - Apps blocked in sessions
✅ **friends** - Friend relationships
✅ **achievements** - Achievement definitions
✅ **user_achievements** - User's unlocked achievements
✅ **notifications** - User notifications
✅ **app_schedules** - Scheduled app blocking

### Verify Default Apps
1. Click **"tracked_apps"** table
2. Should see 10 apps:
   - Instagram
   - TikTok
   - Twitter
   - Snapchat
   - Facebook
   - YouTube
   - Reddit
   - WhatsApp
   - Telegram
   - Discord

---

## 🚨 Troubleshooting

### "relation does not exist" error
- The schema didn't run properly
- Go back to Step 1 and run the SQL again

### "No rows returned" after signup
- The trigger might not be working
- Check if you ran the entire schema (including triggers)
- Manually check if `handle_new_user()` function exists

### Phone auth not working
- Make sure you enabled Phone provider
- Check Twilio credentials if using Twilio
- Test with a whitelisted number first

### Apple/Google login shows error
- Double-check redirect URIs match exactly
- Make sure credentials are correct
- Check that providers are enabled in Supabase

### Storage bucket errors
- Make sure bucket is public
- Verify bucket name is exactly `profile-photos`

---

## 🎉 You're Done!

Your Supabase backend is now fully configured! The app now has:

✅ PostgreSQL database with all tables
✅ Email/password authentication
✅ Phone authentication (SMS OTP)
✅ Apple Sign-In (if configured)
✅ Google Sign-In (if configured)
✅ Profile photo storage
✅ Row-level security
✅ Auto-user profile creation

You can now:
- Create accounts
- Login with multiple methods
- Store user data
- Track apps
- Record focus sessions
- Add friends
- View leaderboards

---

## 📝 Next Steps

1. **Run the app**: `npx expo start`
2. **Create an account** using any method
3. **Go through onboarding**
4. **Test all features**
5. **Invite friends** to test social features

---

## 🔐 Security Notes

- ✅ All credentials are stored in `services/supabase.ts`
- ✅ The anon key is safe to expose (it's in your client app)
- ✅ Row Level Security protects user data
- ✅ Users can only access their own data
- ⚠️ For production: Enable email verification
- ⚠️ For production: Set up custom SMTP for emails
- ⚠️ For production: Enable 2FA for sensitive actions

---

## 📞 Need Help?

If you run into issues:
1. Check Supabase docs: https://supabase.com/docs
2. Check logs in Supabase Dashboard → Logs
3. Enable detailed logging in `services/supabase.ts`
4. Check browser console for errors

**Happy coding! 🚀**
