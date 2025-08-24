-- =====================================================
-- PRODUCTION-READY OAUTH SIGNUP COMPLETION
-- Secure function to link OAuth users to client records
-- With comprehensive validation and audit logging
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.complete_oauth_signup(TEXT);

-- Create secure function for completing OAuth signup
CREATE OR REPLACE FUNCTION public.complete_oauth_signup(
  p_invitation_token TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with function owner's privileges
SET search_path = public -- Prevent search path injection
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_client_id UUID;
  v_client_name TEXT;
  v_invitation_id UUID;
  v_provider TEXT;
  v_result json;
BEGIN
  -- Get current authenticated user details
  v_user_id := auth.uid();
  
  -- Extract email from JWT claims
  SELECT 
    COALESCE(
      auth.jwt() -> 'user_metadata' ->> 'email',
      auth.jwt() ->> 'email',
      (auth.jwt() -> 'identities' -> 0 ->> 'email')
    ) INTO v_user_email;
  
  -- Extract provider from JWT
  SELECT 
    COALESCE(
      auth.jwt() -> 'app_metadata' ->> 'provider',
      auth.jwt() -> 'identities' -> 0 ->> 'provider',
      'email'
    ) INTO v_provider;
  
  -- VALIDATION: Ensure user is authenticated
  IF v_user_id IS NULL THEN
    RAISE WARNING 'OAuth signup attempted without authentication';
    RETURN json_build_object(
      'success', false, 
      'error', 'Authentication required',
      'code', 'AUTH_REQUIRED'
    );
  END IF;
  
  -- VALIDATION: Ensure we have user email
  IF v_user_email IS NULL THEN
    RAISE WARNING 'OAuth signup: No email found for user %', v_user_id;
    RETURN json_build_object(
      'success', false, 
      'error', 'Email not found in authentication data',
      'code', 'EMAIL_MISSING'
    );
  END IF;
  
  -- VALIDATION: Check invitation token validity
  SELECT ci.id, ci.client_id, c.name
  INTO v_invitation_id, v_client_id, v_client_name
  FROM client_invitations ci
  JOIN clients c ON c.id = ci.client_id
  WHERE ci.token = p_invitation_token
    AND ci.status = 'pending'
    AND ci.expires_at > NOW()
    AND c.email = v_user_email;
  
  IF v_invitation_id IS NULL THEN
    -- Check if invitation exists but doesn't match
    IF EXISTS (SELECT 1 FROM client_invitations WHERE token = p_invitation_token) THEN
      RAISE WARNING 'OAuth signup: Invalid invitation token or email mismatch for user %', v_user_email;
      RETURN json_build_object(
        'success', false, 
        'error', 'Invitation does not match your email address',
        'code', 'EMAIL_MISMATCH'
      );
    ELSE
      RAISE WARNING 'OAuth signup: Invitation not found for token';
      RETURN json_build_object(
        'success', false, 
        'error', 'Invalid or expired invitation',
        'code', 'INVITATION_INVALID'
      );
    END IF;
  END IF;
  
  -- SAFETY CHECK: Ensure client isn't already linked to another user
  IF EXISTS (
    SELECT 1 FROM clients 
    WHERE id = v_client_id 
    AND auth_user_id IS NOT NULL 
    AND auth_user_id != v_user_id
  ) THEN
    RAISE WARNING 'OAuth signup: Client % already linked to another user', v_client_id;
    RETURN json_build_object(
      'success', false, 
      'error', 'This account is already linked to another user',
      'code', 'ALREADY_LINKED'
    );
  END IF;
  
  -- MAIN OPERATION: Link the OAuth user to the client record
  UPDATE clients 
  SET 
    auth_user_id = v_user_id,
    invitation_status = 'accepted',
    auth_status = 'active',
    last_login_at = NOW(),
    auth_provider = v_provider,
    updated_at = NOW()
  WHERE id = v_client_id
    AND (auth_user_id IS NULL OR auth_user_id = v_user_id); -- Allow re-linking same user
  
  -- Verify the update was successful
  IF NOT FOUND THEN
    RAISE WARNING 'OAuth signup: Failed to update client record %', v_client_id;
    RETURN json_build_object(
      'success', false, 
      'error', 'Failed to link account. Please contact support.',
      'code', 'UPDATE_FAILED'
    );
  END IF;
  
  -- Update invitation status
  UPDATE client_invitations
  SET 
    status = 'accepted',
    accepted_at = NOW(),
    updated_at = NOW()
  WHERE id = v_invitation_id;
  
  -- Create audit log entry (if table exists)
  BEGIN
    INSERT INTO auth_audit_log (
      event_type, 
      user_id, 
      client_id, 
      ip_address,
      user_agent,
      details,
      created_at
    ) VALUES (
      'oauth_signup_completed', 
      v_user_id, 
      v_client_id,
      COALESCE(current_setting('request.headers', true)::json ->> 'x-forwarded-for', 'unknown'),
      COALESCE(current_setting('request.headers', true)::json ->> 'user-agent', 'unknown'),
      json_build_object(
        'provider', v_provider,
        'email', v_user_email,
        'invitation_id', v_invitation_id
      ),
      NOW()
    );
  EXCEPTION WHEN OTHERS THEN
    -- Silently continue if audit log doesn't exist
    NULL;
  END;
  
  -- Return success with client details
  RAISE NOTICE 'OAuth signup successful for user % linked to client %', v_user_email, v_client_id;
  
  RETURN json_build_object(
    'success', true,
    'client_id', v_client_id,
    'client_name', v_client_name,
    'message', 'Account successfully linked'
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Log the error and return a safe error message
  RAISE WARNING 'OAuth signup error: % - %', SQLERRM, SQLSTATE;
  RETURN json_build_object(
    'success', false,
    'error', 'An unexpected error occurred. Please contact support.',
    'code', 'INTERNAL_ERROR'
  );
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.complete_oauth_signup(TEXT) TO authenticated;

-- Revoke execute from anon for security
REVOKE EXECUTE ON FUNCTION public.complete_oauth_signup(TEXT) FROM anon;

-- Add helpful comment
COMMENT ON FUNCTION public.complete_oauth_signup(TEXT) IS 
'Production-ready function to complete OAuth signup by linking authenticated user to client record via invitation token. 
Includes comprehensive validation, error handling, and audit logging.';