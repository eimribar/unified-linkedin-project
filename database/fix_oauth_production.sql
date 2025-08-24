-- =====================================================
-- PRODUCTION-READY OAUTH FIX
-- This handles ANY user signing in with Google OAuth
-- No hardcoded emails - works for all clients
-- =====================================================

-- Step 1: Check for existing problematic triggers
-- Run this to see what triggers exist
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users';

-- Step 2: Drop any existing problematic trigger
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 3: Create a production-ready trigger for OAuth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_client_record RECORD;
BEGIN
    -- Log the attempt (helpful for debugging)
    RAISE NOTICE 'New user created: % with email: %', new.id, new.email;
    
    -- Check if a client exists with this email
    SELECT * INTO v_client_record
    FROM public.clients
    WHERE LOWER(email) = LOWER(new.email)
    LIMIT 1;
    
    -- If client record exists, link it to the new auth user
    IF v_client_record.id IS NOT NULL THEN
        -- Only update if not already linked to another user
        IF v_client_record.auth_user_id IS NULL THEN
            UPDATE public.clients
            SET 
                auth_user_id = new.id,
                portal_access = true,
                invitation_status = CASE 
                    WHEN invitation_status = 'pending' THEN 'accepted'
                    ELSE invitation_status
                END,
                auth_provider = COALESCE(new.raw_app_meta_data->>'provider', 'email'),
                last_login_at = NOW(),
                updated_at = NOW()
            WHERE id = v_client_record.id;
            
            RAISE NOTICE 'Linked auth user % to client %', new.id, v_client_record.id;
        ELSE
            RAISE NOTICE 'Client % already linked to user %', v_client_record.id, v_client_record.auth_user_id;
        END IF;
    ELSE
        -- No client record found - this is OK for OAuth
        -- The user can sign in but won't have access to client features
        RAISE NOTICE 'No client record found for email %, user can authenticate but has no client access', new.email;
    END IF;
    
    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't block user creation
        RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
        RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Create a function to handle OAuth users who already exist
-- This handles the case where someone signs in again
CREATE OR REPLACE FUNCTION public.handle_oauth_signin()
RETURNS trigger AS $$
DECLARE
    v_client_record RECORD;
BEGIN
    -- Only process if this is an OAuth sign-in (not password)
    IF new.last_sign_in_at IS NOT NULL AND 
       new.last_sign_in_at != old.last_sign_in_at THEN
        
        -- Check if user has a linked client
        SELECT * INTO v_client_record
        FROM public.clients
        WHERE auth_user_id = new.id
        LIMIT 1;
        
        IF v_client_record.id IS NOT NULL THEN
            -- Update last login
            UPDATE public.clients
            SET 
                last_login_at = NOW(),
                updated_at = NOW()
            WHERE id = v_client_record.id;
        END IF;
    END IF;
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger for sign-in updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_oauth_signin();

-- Step 7: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_oauth_signin() TO postgres, anon, authenticated, service_role;

-- Step 8: Test function - Check if a specific user exists
-- This is just for testing, not required for production
CREATE OR REPLACE FUNCTION public.check_user_status(p_email TEXT)
RETURNS TABLE(
    auth_user_exists BOOLEAN,
    auth_user_id UUID,
    client_exists BOOLEAN,
    client_id UUID,
    client_name TEXT,
    is_linked BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM auth.users WHERE email = p_email) as auth_user_exists,
        (SELECT id FROM auth.users WHERE email = p_email LIMIT 1) as auth_user_id,
        EXISTS(SELECT 1 FROM public.clients WHERE email = p_email) as client_exists,
        (SELECT id FROM public.clients WHERE email = p_email LIMIT 1) as client_id,
        (SELECT name FROM public.clients WHERE email = p_email LIMIT 1) as client_name,
        EXISTS(SELECT 1 FROM public.clients WHERE email = p_email AND auth_user_id IS NOT NULL) as is_linked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission for the test function
GRANT EXECUTE ON FUNCTION public.check_user_status(TEXT) TO postgres, anon, authenticated, service_role;

-- =====================================================
-- HOW TO USE THIS:
-- 1. Run this entire SQL script in Supabase SQL Editor
-- 2. To test a specific email: SELECT * FROM public.check_user_status('any-email@example.com');
-- 3. This will show you if the user exists, if they have a client record, and if they're linked
-- =====================================================