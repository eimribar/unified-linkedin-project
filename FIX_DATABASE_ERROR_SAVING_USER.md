# CRITICAL: Fix "Database error saving new user"

## The Real Problem
The error URL shows: `error_description=Database+error+saving+new+user`

This means Supabase OAuth is working, but it can't save the user to the database!

## Immediate SQL Fixes to Run in Supabase

### 1. Check if user already exists
```sql
-- Check if your email already exists in auth.users
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
WHERE email = 'YOUR_EMAIL@gmail.com';
```

### 2. If user exists, delete it to start fresh
```sql
-- Replace USER_ID with the actual ID from above query
DELETE FROM auth.users WHERE id = 'USER_ID';
```

### 3. Check for blocking triggers
```sql
-- List all triggers on auth.users table
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';
```

### 4. Check RLS policies on auth.users
```sql
-- Check if there are any RLS policies blocking user creation
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'auth' 
AND tablename = 'users';
```

### 5. Create a proper user creation function
```sql
-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create client record if email matches existing client
  IF EXISTS (SELECT 1 FROM public.clients WHERE email = new.email) THEN
    UPDATE public.clients
    SET 
      auth_user_id = new.id,
      portal_access = true,
      invitation_status = 'accepted',
      last_login_at = NOW(),
      updated_at = NOW()
    WHERE email = new.email
    AND auth_user_id IS NULL;  -- Only update if not already linked
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 6. Fix the auth.users table permissions
```sql
-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, service_role;
```

### 7. Check for email uniqueness constraint
```sql
-- Check constraints on auth.users
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'auth.users'::regclass;
```

## Alternative Solution: Reset Supabase Auth

If the above doesn't work, you may need to:

1. **Export your clients data**:
```sql
-- Export clients table
SELECT * FROM clients;
```

2. **Reset auth.users table** (DANGEROUS - backup first!):
```sql
-- Only do this if you're okay losing all auth users
TRUNCATE auth.users CASCADE;
```

3. **Re-import clients data** and try OAuth again

## Test After Fixes

1. Clear all cookies and cache
2. Try OAuth sign in again
3. Check browser console for new errors

## Why This Happens

Common causes:
- Email already exists in auth.users but not linked to client
- Trigger preventing user creation
- RLS policy blocking inserts
- Database constraint violations
- Supabase project misconfiguration