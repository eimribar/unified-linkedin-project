# Fix Supabase OAuth Callback Error

## The Current Issue
You're now getting an "unexpected_failure" error at the Supabase callback URL. This is PROGRESS - you're no longer redirecting to localhost!

## Step 1: Verify Redirect URLs in Supabase Dashboard

Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**

Make sure you have ALL of these URLs in the **Redirect URLs** field (one per line):
```
https://unified-linkedin-project.vercel.app/**
https://unified-linkedin-project.vercel.app/auth/callback
https://unified-linkedin-project.vercel.app/auth/callback?*
https://unified-linkedin-project.vercel.app/auth/callback#*
https://unified-linkedin-project.vercel.app/client-approve
https://unified-linkedin-project.vercel.app
```

## Step 2: Check Database Function

Run this SQL in Supabase SQL Editor to check if the function exists:

```sql
-- Check if the function exists
SELECT 
    proname as function_name,
    pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname = 'complete_oauth_signup';
```

If it doesn't exist, create it:

```sql
-- Create the OAuth signup completion function
CREATE OR REPLACE FUNCTION complete_oauth_signup(
    p_invitation_token UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_client_record RECORD;
    v_auth_user_id UUID;
    v_result JSONB;
BEGIN
    -- Get the authenticated user ID
    v_auth_user_id := auth.uid();
    
    -- Check if user is authenticated
    IF v_auth_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not authenticated',
            'code', 'AUTH_REQUIRED'
        );
    END IF;
    
    -- Find the client by invitation token
    SELECT * INTO v_client_record
    FROM clients
    WHERE id = p_invitation_token
    LIMIT 1;
    
    -- Check if client exists
    IF v_client_record.id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid invitation token',
            'code', 'INVITATION_INVALID'
        );
    END IF;
    
    -- Check if already linked
    IF v_client_record.auth_user_id IS NOT NULL THEN
        -- If it's the same user, that's fine
        IF v_client_record.auth_user_id = v_auth_user_id THEN
            RETURN jsonb_build_object(
                'success', true,
                'client_id', v_client_record.id,
                'client_name', v_client_record.name,
                'already_linked', true
            );
        ELSE
            RETURN jsonb_build_object(
                'success', false,
                'error', 'This invitation has already been used',
                'code', 'ALREADY_LINKED'
            );
        END IF;
    END IF;
    
    -- Update the client record
    UPDATE clients
    SET 
        auth_user_id = v_auth_user_id,
        invitation_status = 'accepted',
        auth_provider = 'google',
        last_login_at = NOW(),
        updated_at = NOW()
    WHERE id = p_invitation_token;
    
    -- Return success
    RETURN jsonb_build_object(
        'success', true,
        'client_id', v_client_record.id,
        'client_name', v_client_record.name,
        'email', v_client_record.email
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'code', 'DATABASE_ERROR'
        );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION complete_oauth_signup TO authenticated;
```

## Step 3: Test Simple OAuth Flow (Without Invitation)

1. Clear browser cache and cookies
2. Go to https://unified-linkedin-project.vercel.app/auth
3. Click "Continue with Google" (WITHOUT an invitation link)
4. See what happens

## Step 4: Check Browser Console

Open browser DevTools (F12) and look for:
- Network tab: Check the callback URL
- Console tab: Look for any error messages

## Step 5: Verify Google OAuth Settings

In Google Cloud Console:
1. Go to **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Make sure **Authorized redirect URIs** includes:
   - Your Supabase callback: `https://[YOUR-PROJECT].supabase.co/auth/v1/callback`

## Common Issues and Solutions

### Issue: "unexpected_failure" error
**Cause**: Usually a redirect URL mismatch
**Fix**: Add all URL variations to Supabase redirect URLs

### Issue: Function not found
**Cause**: Database function not created
**Fix**: Run the SQL above to create it

### Issue: Still getting errors after fixing
**Cause**: Browser cache
**Fix**: Clear all site data for both domains:
- unified-linkedin-project.vercel.app
- Your Supabase project URL

## What's Working Now
✅ No more localhost redirects!
✅ OAuth is reaching Supabase
✅ Redirect URLs are hitting production

## What Needs Fixing
⚠️ Supabase callback processing
⚠️ Possible redirect URL whitelist issue
⚠️ Database function may need to be created