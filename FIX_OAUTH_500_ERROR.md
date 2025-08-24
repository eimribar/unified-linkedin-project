# Fix OAuth 500 Error

## The Error
You're getting a 500 error when trying to log in with Google OAuth. This is typically caused by misconfigured OAuth settings in Supabase.

## Solution Steps

### 1. Check Supabase OAuth Configuration

Go to your Supabase Dashboard:
1. Navigate to **Authentication** → **Providers**
2. Click on **Google**
3. Ensure it's **Enabled**

### 2. Verify Google Cloud Console Settings

In [Google Cloud Console](https://console.cloud.google.com/):

1. Go to **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID
3. Check **Authorized JavaScript origins** includes:
   - `https://ifwscuvbtdokljwwbvex.supabase.co`
   - `https://unified-linkedin-project.vercel.app`
   - `http://localhost:5173` (for local testing)

4. Check **Authorized redirect URIs** includes:
   - `https://ifwscuvbtdokljwwbvex.supabase.co/auth/v1/callback`
   - `https://unified-linkedin-project.vercel.app/auth/callback`

### 3. Update Supabase Google Provider Settings

In Supabase Dashboard → Authentication → Providers → Google:

1. **Client ID**: Your Google OAuth client ID
2. **Client Secret**: Your Google OAuth client secret
3. **Redirect URL**: Copy the URL shown (should be `https://ifwscuvbtdokljwwbvex.supabase.co/auth/v1/callback`)

### 4. Check Environment Variables

In Vercel Dashboard for unified-linkedin-project:

```
VITE_SUPABASE_URL=https://ifwscuvbtdokljwwbvex.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Common Fixes

#### If you're getting "Redirect URI mismatch":
The redirect URL in your code doesn't match what's configured in Google Cloud Console.

**Fix in code** - Update `/src/components/ui/sign-in-flow-1.tsx`:
```javascript
const handleGoogleSignIn = async () => {
  try {
    setLoading(true);
    
    // Use the callback without the full URL for Supabase to handle it
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: invitationToken 
          ? `${window.location.origin}/auth/callback?invitation=${invitationToken}`
          : `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('OAuth error:', error);
    toast.error('Failed to sign in with Google: ' + error.message);
    setLoading(false);
  }
};
```

#### If the error persists:

1. **Clear browser cookies** for your domain
2. **Regenerate** your Google OAuth credentials
3. **Check Supabase logs**:
   - Go to Supabase Dashboard → **Logs** → **Auth Logs**
   - Look for error details

### 6. Test OAuth Flow

1. Open browser console (F12)
2. Try to sign in with Google
3. Check for errors in:
   - Console tab
   - Network tab (look for failed requests)

### 7. Alternative: Use Magic Link

If OAuth continues to fail, the magic link option still works:
1. Enter your email
2. Click the arrow button
3. Check your email for the magic link

## Debug Information to Collect

Run this in browser console when on the sign-in page:
```javascript
console.log('Supabase URL:', window.supabase._supabaseUrl);
console.log('Current origin:', window.location.origin);
console.log('Callback URL:', `${window.location.origin}/auth/callback`);
```

## If Nothing Works

1. **Create a new OAuth app** in Google Cloud Console
2. **Update Supabase** with new credentials
3. **Check Supabase Status**: https://status.supabase.com/

## Contact Support

If the issue persists:
- **Supabase Support**: Include your project ID (ifwscuvbtdokljwwbvex)
- **Error details**: Include the full error message and any console logs