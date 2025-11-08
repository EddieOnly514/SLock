# 🎯 Auth Testing Guide

## ✅ What's Implemented (Enterprise-Grade Auth)

I've implemented the complete authentication system following the enterprise guide you provided. Here's what's ready:

### 1. UX Surface (Mobile App) ✅
- ✅ **Brand header** - "SLOCK IN" slogan
- ✅ **SSO buttons** - Apple, Google (grayed out for now)
- ✅ **"Or" divider**
- ✅ **Email/Phone form** with tab switcher
- ✅ **Continue button** with loading spinner
- ✅ **"Forgot password?" link**
- ✅ **Create account link**

### 2. Controls ✅
- ✅ **Password reveal toggle** (eye icon)
- ✅ **Country code selector** (full modal with search)
- ✅ **Inline errors** (field-level + toast)
- ✅ **Loading spinners** on buttons
- ✅ **Haptic feedback** on all interactions

### 3. States ✅
- ✅ **Idle** - Default state
- ✅ **Validating** - Loading spinner, button disabled
- ✅ **Error** - Red border on fields + error toast
- ✅ **Success** - Green success message + redirect
- ✅ **Step-up** - Ready for captcha (not triggered yet)

### 4. Validation ✅
- ✅ **Phone**: 10-15 digits
- ✅ **Email**: Valid email format
- ✅ **Password**: Min 6 characters
- ✅ **OTP**: Exactly 6 digits
- ✅ Clears errors as you type

### 5. Telemetry ✅
- ✅ All events tracked (see console logs):
  - `auth_view`
  - `tap_phone_login` / `tap_email_login`
  - `otp_sent` / `otp_verified`
  - `auth_success` / `auth_error_{reason}`
  - `password_reveal`
  - `country_code_changed`

### 6. Security ✅
- ✅ **Secure storage** (Keychain/Keystore)
- ✅ **Device fingerprinting**
- ✅ **JWT tokens** from Supabase
- ✅ **Session persistence**

---

## 🚀 How to Test

### Step 1: Run the SQL Schema (CRITICAL - Do this first!)

```bash
1. Go to: https://app.supabase.com/project/pcoirzokoirdonfpsxfv/sql
2. Click "New Query"
3. Copy ALL content from supabase_schema.sql
4. Paste and click "Run"
5. Verify: "Success. No rows returned"
```

### Step 2: Enable Phone Auth in Supabase

```bash
1. Go to: https://app.supabase.com/project/pcoirzokoirdonfpsxfv/auth/providers
2. Find "Phone" provider
3. Toggle it ON
4. Choose provider:
   - Option A: "Supabase" (for testing - add your test phone numbers)
   - Option B: "Twilio" (production - needs credentials)
```

### Step 3: Start the App

```bash
# In your terminal:
npx expo start
```

---

## 📱 Test Cases

### Test 1: Email/Password Signup

1. **Switch to Email tab**
   - Tap "Email" tab
   - Should see tab switch animation
   - Should feel haptic feedback

2. **Enter invalid email**
   - Type: "test"
   - Leave password empty
   - Tap "Continue"
   - Should see:
     - ❌ Red border on email field
     - ❌ "Please enter a valid email" error
     - ❌ "Password is required" error
     - 📳 Error haptic

3. **Enter valid credentials**
   - Email: `test@example.com`
   - Password: `password123`
   - Tap "Continue"
   - Should see:
     - ⏳ Loading spinner
     - ✅ "Success! Logging you in..."
     - 📳 Success haptic
     - → Redirects to app

4. **Test password toggle**
   - Type password
   - Tap eye icon
   - Should toggle visibility
   - 📳 Haptic feedback

### Test 2: Phone/OTP Flow

1. **Switch to Phone tab**
   - Tap "Phone" tab
   - Should see country code picker

2. **Change country code**
   - Tap country code (🇺🇸 +1)
   - Should see modal with:
     - Search bar
     - Country list
     - Flags & codes
   - Search "canada"
   - Select Canada (🇨🇦 +1)
   - Should close modal
   - 📳 Haptic feedback

3. **Enter invalid phone**
   - Type: "123"
   - Tap "Continue"
   - Should see:
     - ❌ "Please enter a valid phone number"
     - 📳 Error haptic

4. **Enter valid phone** (if you enabled Phone auth in Supabase)
   - Type your test phone number
   - Tap "Continue"
   - Should:
     - ⏳ Show loading
     - 📱 Send OTP via SMS
     - → Switch to OTP input screen

5. **Enter OTP**
   - Type the 6-digit code
   - Tap "Verify"
   - Should:
     - ⏳ Show loading
     - ✅ "Success! Logging you in..."
     - → Redirect to app

6. **Change number**
   - Tap "Change number"
   - Should go back to phone input

### Test 3: Validation & Errors

1. **Email validation**
   - Try: "test" → ❌ Invalid
   - Try: "test@" → ❌ Invalid
   - Try: "test@example" → ❌ Invalid
   - Try: "test@example.com" → ✅ Valid

2. **Password validation**
   - Try: "" → ❌ Required
   - Try: "12345" → ❌ Too short
   - Try: "123456" → ✅ Valid

3. **Phone validation**
   - Try: "123" → ❌ Invalid
   - Try: "123456789" → ❌ Too short
   - Try: "1234567890" → ✅ Valid

### Test 4: States & Feedback

1. **Check all states work**:
   - **Idle**: Default, everything enabled
   - **Validating**: Spinner visible, buttons disabled
   - **Error**: Red borders, error messages
   - **Success**: Green success message

2. **Check haptic feedback**:
   - Tap tab switcher → 📳 Light impact
   - Toggle password → 📳 Light impact
   - Error → 📳 Error notification
   - Success → 📳 Success notification

3. **Check console logs**:
   - Open React Native Debugger or terminal
   - Should see analytics events:
     ```
     📊 [Analytics] auth_view
     📊 [Analytics] tap_email_login
     📊 [Analytics] auth_success { provider: 'email', duration_ms: 1234 }
     ```

---

## 🎨 What You'll See

### Design Features:
- ✅ **"SLOCK IN"** large slogan (48px, bold)
- ✅ **Faded blue gradient** background
- ✅ **Phone/Email tab switcher** (smooth toggle)
- ✅ **Country code picker** (modal with flags)
- ✅ **Password toggle** (eye icon)
- ✅ **Inline errors** (red borders + text)
- ✅ **Loading states** (spinners)
- ✅ **Success states** (green message)
- ✅ **Rounded cards** with shadows
- ✅ **Haptic feedback** everywhere

### Console Output:
```
📊 [Analytics] auth_view
📊 [Analytics] tap_email_login
📊 [Analytics] auth_success { provider: 'email', duration_ms: 1234 }
📈 [Metric] auth_duration_ms 1234 { provider: 'email' }
```

---

## ⚠️ Known Limitations (Expected)

### Apple/Google Sign-In
- **Status**: UI ready, grayed out
- **Why**: You haven't configured providers yet
- **To enable**: Follow SUPABASE_SETUP.md

### Phone Auth
- **Status**: Fully implemented
- **Works if**: You enabled Phone provider in Supabase
- **Test numbers**: Add in Supabase if using built-in provider

### Forgot Password
- **Status**: Link exists, screen not created yet
- **Next step**: Create forgot-password screen

---

## ✅ Success Criteria

After testing, you should have:

1. ✅ Seen the "SLOCK IN" login screen
2. ✅ Switched between Phone/Email tabs
3. ✅ Opened country code picker
4. ✅ Toggled password visibility
5. ✅ Seen validation errors (red borders + messages)
6. ✅ Felt haptic feedback
7. ✅ Seen loading spinners
8. ✅ Seen success message
9. ✅ Created an account (if DB is set up)
10. ✅ Logged in successfully

---

## 🐛 Troubleshooting

### "Failed to send OTP"
- **Fix**: Enable Phone auth in Supabase
- **Or**: Use Email login instead

### "Failed to login"
- **Fix**: Make sure SQL schema ran successfully
- **Fix**: Check Supabase dashboard for errors

### No haptic feedback
- **Expected**: Haptics don't work in web/simulators
- **Test on**: Real iOS/Android device

### Console errors
- **Check**: React Native debugger
- **Look for**: Network errors, Supabase errors

---

## 📊 What's Being Tracked

All these events are logged (check console):

| Event | When | Data |
|-------|------|------|
| `auth_view` | Screen loads | - |
| `tap_phone_login` | Tap Continue (phone) | - |
| `tap_email_login` | Tap Continue (email) | - |
| `otp_sent` | OTP sent | phone (masked) |
| `otp_verified` | OTP verified | duration_ms |
| `auth_success` | Login successful | provider, duration_ms |
| `auth_error` | Login failed | provider, reason, error |
| `password_reveal` | Toggle password | - |
| `country_code_changed` | Switch tabs/code | - |

---

## 🎯 Next Steps

Once testing works:

1. ✅ Test email login
2. ✅ Test phone login
3. ✅ Test all validation
4. ✅ Test all states
5. ✅ Check analytics logs
6. 🔄 Create signup screen (similar to login)
7. 🔄 Create forgot-password screen
8. 🔄 Add Apple/Google (when ready)

---

**Ready to test!** Run `npx expo start` and try it out! 🚀
