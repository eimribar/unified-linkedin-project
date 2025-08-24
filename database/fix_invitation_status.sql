-- Fix invitation status for linked accounts
UPDATE clients
SET 
    invitation_status = 'accepted',
    last_login_at = NOW(),
    updated_at = NOW()
WHERE 
    auth_user_id IS NOT NULL
    AND invitation_status != 'accepted';

-- Verify the update
SELECT 
    id,
    name,
    email,
    auth_user_id IS NOT NULL as is_linked,
    invitation_status,
    last_login_at
FROM clients
WHERE email = 'eimri@webloom.ai';