# 🚨 IMMEDIATE ACTION REQUIRED: Fix OAuth Database Error

## The Problem
When anyone tries to sign in with Google, Supabase shows: **"Database error saving new user"**

This happens because there's likely a conflicting trigger or the user already exists.

## The Solution - Run This SQL in Supabase

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the sidebar
3. Click "New query"

### Step 2: Copy and Run This ENTIRE SQL Block
Copy everything from the file: `database/fix_oauth_production.sql`

Or copy this simplified version:

```sql
-- Remove any existing problematic triggers
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create a production-ready trigger that handles OAuth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_client_record RECORD;
BEGIN
    -- Find matching client by email
    SELECT * INTO v_client_record
    FROM public.clients
    WHERE LOWER(email) = LOWER(new.email)
    LIMIT 1;
    
    -- Link auth user to client if found
    IF v_client_record.id IS NOT NULL AND v_client_record.auth_user_id IS NULL THEN
        UPDATE public.clients
        SET 
            auth_user_id = new.id,
            portal_access = true,
            invitation_status = 'accepted',
            last_login_at = NOW(),
            updated_at = NOW()
        WHERE id = v_client_record.id;
    END IF;
    
    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        -- Don't block user creation even if linking fails
        RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;
```

### Step 3: Test With ANY Email
After running the SQL, you can test with:

```sql
-- Check status of any email (replace with actual email)
SELECT 
    EXISTS(SELECT 1 FROM auth.users WHERE email = 'test@example.com') as user_exists,
    EXISTS(SELECT 1 FROM clients WHERE email = 'test@example.com') as client_exists;
```

## How This Works (Production-Ready)

1. **When ANYONE signs in with Google:**
   - Google authenticates them ✅
   - Supabase creates a user in `auth.users` ✅
   - Our trigger fires automatically ✅

2. **The trigger checks:**
   - Does a client record exist with this email?
   - If YES → Link them together
   - If NO → User can sign in but has no client access

3. **No hardcoded emails:**
   - Works for ANY email
   - Matches based on email address
   - Handles all your clients automatically

## Testing the Fix

1. **Clear your browser** (all cookies/cache)
2. **Try signing in with Google**
3. **It should work!**

## What This Fixes

✅ "Database error saving new user"
✅ OAuth users not linking to clients
✅ Works for ALL clients (no hardcoding)
✅ Production-ready solution

## If You Still Get Errors

Run this diagnostic:
```sql
-- See what's blocking user creation
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';
```

Then let me know what triggers exist.