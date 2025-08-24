-- =====================================================
-- FIX INVITATION TOKEN PROCESSING
-- The invitation token is a string, not a UUID
-- =====================================================

-- First, let's check what invitation tokens look like
SELECT 
    id,
    email,
    invitation_token,
    invitation_status,
    auth_user_id
FROM clients
WHERE invitation_token IS NOT NULL
LIMIT 5;

-- Drop the old function that expects UUID
DROP FUNCTION IF EXISTS complete_oauth_signup(UUID);

-- Create new function that accepts TEXT invitation token
CREATE OR REPLACE FUNCTION complete_oauth_signup(
    p_invitation_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_client_record RECORD;
    v_auth_user_id UUID;
    v_auth_user_email TEXT;
BEGIN
    -- Get the authenticated user ID and email
    v_auth_user_id := auth.uid();
    
    -- Get the user's email from auth.users
    SELECT email INTO v_auth_user_email
    FROM auth.users
    WHERE id = v_auth_user_id;
    
    -- Check if user is authenticated
    IF v_auth_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not authenticated',
            'code', 'AUTH_REQUIRED'
        );
    END IF;
    
    -- Find the client by invitation token (TEXT field)
    SELECT * INTO v_client_record
    FROM clients
    WHERE invitation_token = p_invitation_token
    LIMIT 1;
    
    -- Check if client exists
    IF v_client_record.id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid invitation token',
            'code', 'INVITATION_INVALID',
            'debug', jsonb_build_object(
                'token_provided', p_invitation_token,
                'auth_user_id', v_auth_user_id
            )
        );
    END IF;
    
    -- Check if emails match (case-insensitive)
    IF LOWER(v_client_record.email) != LOWER(v_auth_user_email) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'This invitation was sent to a different email address',
            'code', 'EMAIL_MISMATCH',
            'debug', jsonb_build_object(
                'client_email', v_client_record.email,
                'auth_email', v_auth_user_email
            )
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
        portal_access = true,
        auth_provider = 'google',
        last_login_at = NOW(),
        updated_at = NOW()
    WHERE id = v_client_record.id;
    
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
            'code', 'DATABASE_ERROR',
            'debug', jsonb_build_object(
                'error_detail', SQLERRM,
                'error_state', SQLSTATE
            )
        );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION complete_oauth_signup(TEXT) TO authenticated;

-- Test function to check invitation status
CREATE OR REPLACE FUNCTION check_invitation(p_token TEXT)
RETURNS TABLE(
    found BOOLEAN,
    client_name TEXT,
    client_email TEXT,
    invitation_status TEXT,
    is_linked BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TRUE as found,
        c.name as client_name,
        c.email as client_email,
        c.invitation_status,
        (c.auth_user_id IS NOT NULL) as is_linked
    FROM clients c
    WHERE c.invitation_token = p_token
    UNION ALL
    SELECT 
        FALSE as found,
        NULL as client_name,
        NULL as client_email,
        NULL as invitation_status,
        FALSE as is_linked
    WHERE NOT EXISTS (
        SELECT 1 FROM clients WHERE invitation_token = p_token
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission
GRANT EXECUTE ON FUNCTION check_invitation(TEXT) TO authenticated, anon;