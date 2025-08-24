# 🚨 CRITICAL: Fix Supabase OAuth Redirect URLs

## THE PROBLEM
Supabase is redirecting OAuth to `localhost:3000` because the redirect URLs are configured in the SUPABASE DASHBOARD, not in our code!

## IMMEDIATE FIX REQUIRED

### Step 1: Go to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**

### Step 2: Update Site URL
Change the **Site URL** from:
```
http://localhost:3000
```
TO:
```
https://unified-linkedin-project.vercel.app
```

### Step 3: Update Redirect URLs
In the **Redirect URLs** section, REMOVE all localhost entries and ADD:
```
https://unified-linkedin-project.vercel.app/**
https://unified-linkedin-project.vercel.app/auth/callback
https://unified-linkedin-project.vercel.app/client-approve
https://unified-linkedin-project.vercel.app/reset-password
```

### Step 4: Update OAuth Provider Settings
1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Make sure the callback URL shows:
   ```
   https://[YOUR-PROJECT].supabase.co/auth/v1/callback
   ```
4. Copy this URL

### Step 5: Update Google Cloud Console
1. Go to https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. In **Authorized redirect URIs**, make sure you have:
   - `https://[YOUR-PROJECT].supabase.co/auth/v1/callback`
   - Remove any localhost URLs

### Step 6: Clear and Test
1. Clear your browser cache and cookies
2. Try the OAuth flow again

## IMPORTANT NOTES

### Why This Happens
- Supabase stores redirect URLs in its dashboard configuration
- Our code sends the correct URL, but Supabase overrides it with dashboard settings
- The Site URL setting is the default redirect after authentication

### What We've Already Fixed in Code
✅ Created `urlHelpers.ts` to force production URLs
✅ Updated all auth redirects in `SupabaseAuthContext.tsx`
✅ Created proper OAuth callback handler
✅ Database function for linking accounts

### But None of That Matters If...
❌ Supabase Dashboard still has `localhost:3000` as Site URL!

## VERIFICATION
After updating, check these URLs in Supabase Dashboard:
- [ ] Site URL = `https://unified-linkedin-project.vercel.app`
- [ ] Redirect URLs include production domain
- [ ] NO localhost URLs anywhere
- [ ] Google provider callback URL is correct

## TEST AFTER FIXING
1. Open incognito/private browser
2. Go to https://unified-linkedin-project.vercel.app/auth
3. Click "Continue with Google"
4. Should redirect to production URL, NOT localhost!

---

**This is a DASHBOARD configuration issue, not a code issue!**