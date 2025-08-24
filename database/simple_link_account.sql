-- =====================================================
-- SIMPLE ACCOUNT LINKING
-- Links OAuth user to client record
-- =====================================================

-- Simple function to link an authenticated user to their client record
CREATE OR REPLACE FUNCTION link_client_account(
    p_invitation_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_user_email TEXT;
    v_client RECORD;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;
    
    -- Get user email
    SELECT email INTO v_user_email
    FROM auth.users
    WHERE id = v_user_id;
    
    -- Update client record if invitation token and email match
    UPDATE clients
    SET 
        auth_user_id = v_user_id,
        invitation_status = 'accepted',
        last_login_at = NOW(),
        updated_at = NOW()
    WHERE 
        invitation_token = p_invitation_token
        AND LOWER(email) = LOWER(v_user_email)
        AND auth_user_id IS NULL  -- Only if not already linked
    RETURNING * INTO v_client;
    
    IF v_client.id IS NOT NULL THEN
        RETURN jsonb_build_object(
            'success', true,
            'client_id', v_client.id,
            'client_name', v_client.name
        );
    ELSE
        -- Check why it failed
        IF NOT EXISTS (SELECT 1 FROM clients WHERE invitation_token = p_invitation_token) THEN
            RETURN jsonb_build_object('success', false, 'error', 'Invalid invitation');
        ELSIF NOT EXISTS (SELECT 1 FROM clients WHERE invitation_token = p_invitation_token AND LOWER(email) = LOWER(v_user_email)) THEN
            RETURN jsonb_build_object('success', false, 'error', 'Email mismatch');
        ELSE
            RETURN jsonb_build_object('success', false, 'error', 'Already linked');
        END IF;
    END IF;
END;
$$;

-- Grant permission
GRANT EXECUTE ON FUNCTION link_client_account TO authenticated;