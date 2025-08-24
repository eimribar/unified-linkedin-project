# OAuth Flow Testing Guide

## Production URLs
- Main App: https://unified-linkedin-project.vercel.app
- Ghostwriter Portal: https://ghostwriter-portal.vercel.app

## Test Steps

### 1. Direct Sign-In Test (No Invitation)
1. Go to https://unified-linkedin-project.vercel.app/auth
2. Click "Sign in with Google"
3. Complete Google OAuth
4. Should redirect to `/client-approve`
5. Verify you're logged in

### 2. Invitation Flow Test
1. **In Ghostwriter Portal:**
   - Go to https://ghostwriter-portal.vercel.app
   - Create a new client with a valid email
   - Copy the invitation link

2. **Test the Invitation Link:**
   - Open invitation link in incognito/private browser
   - Should see auth page with "You've been invited!" message
   - Click "Sign in with Google"
   - Use the SAME email as the invitation
   - Should redirect to `/client-approve` after OAuth
   - Check if account is linked

### 3. Database Verification
Run this SQL in Supabase SQL Editor after testing:

```sql
-- Check if account was linked
SELECT 
    c.id,
    c.name,
    c.email,
    c.auth_user_id,
    c.invitation_status,
    u.email as auth_email,
    u.last_sign_in_at
FROM clients c
LEFT JOIN auth.users u ON c.auth_user_id = u.id
WHERE c.email = 'YOUR_TEST_EMAIL@gmail.com';
```

## What Should Happen

### Success Flow:
1. User with invitation clicks link → Auth page shows invitation message
2. User signs in with Google → OAuth completes
3. Callback page links account → Updates client record
4. User redirected to `/client-approve` → Sees their posts

### Common Issues & Fixes:

**Issue: Redirect to localhost**
- Check browser console for redirect URL
- Should be: `https://unified-linkedin-project.vercel.app/auth/callback`

**Issue: "Not authenticated" after OAuth**
- Check if session exists in Application > Storage > Local Storage
- Look for `sb-ifwscuvbtdokljwwbvex-auth-token`

**Issue: Account not linked**
- Verify emails match exactly (case-insensitive)
- Check invitation_token is valid
- Ensure auth_user_id was NULL before linking

## Environment Variables to Verify

In Vercel Dashboard (unified-linkedin-project):
- `VITE_SUPABASE_URL`: https://ifwscuvbtdokljwwbvex.supabase.co
- `VITE_SUPABASE_ANON_KEY`: Should be set (long JWT string)

## Debug Commands

### Check Current User in Console:
```javascript
// Run in browser console on the app
const { data: { user } } = await window.supabase.auth.getUser();
console.log('Current user:', user);
```

### Check Client Link Status:
```javascript
// Run in browser console after auth
const { data } = await window.supabase
  .from('clients')
  .select('*')
  .eq('email', user.email)
  .single();
console.log('Client record:', data);
```