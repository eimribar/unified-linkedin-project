-- =====================================================
-- ENFORCE ACCESS CONTROL
-- Ensure only registered clients can access the platform
-- =====================================================

-- 1. Enable RLS on clients table if not already enabled
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any (clean slate)
DROP POLICY IF EXISTS "Clients can view own record" ON clients;
DROP POLICY IF EXISTS "Clients can update own record" ON clients;

-- 3. Create policy: Clients can only see their own record
CREATE POLICY "Clients can view own record" 
ON clients FOR SELECT 
USING (
    auth.uid() = auth_user_id 
    OR LOWER(auth.email()) = LOWER(email)
);

-- 4. Create policy: Clients can update their own record
CREATE POLICY "Clients can update own record" 
ON clients FOR UPDATE 
USING (
    auth.uid() = auth_user_id 
    OR LOWER(auth.email()) = LOWER(email)
)
WITH CHECK (
    auth.uid() = auth_user_id 
    OR LOWER(auth.email()) = LOWER(email)
);

-- 5. Enable RLS on generated_content table
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if any
DROP POLICY IF EXISTS "Clients can view own content" ON generated_content;

-- 7. Create policy: Clients can only see content for their client_id
CREATE POLICY "Clients can view own content" 
ON generated_content FOR SELECT 
USING (
    client_id IN (
        SELECT id FROM clients 
        WHERE auth.uid() = auth_user_id 
        OR LOWER(auth.email()) = LOWER(email)
    )
);

-- 8. Create a function to check if user is authorized
-- This can be used in the application for additional checks
CREATE OR REPLACE FUNCTION is_authorized_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF LOWER(auth.email()) = 'eimri@webloom.ai' THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user exists in clients table
    RETURN EXISTS (
        SELECT 1 FROM clients 
        WHERE LOWER(email) = LOWER(auth.email())
        OR auth_user_id = auth.uid()
    );
END;
$$;

-- 9. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_authorized_user TO authenticated;

-- 10. Test the function (optional - comment out in production)
-- SELECT is_authorized_user();

-- 11. Create a view for easy client lookup
CREATE OR REPLACE VIEW my_client_info AS
SELECT 
    id,
    name,
    email,
    company,
    auth_user_id,
    invitation_status,
    last_login_at
FROM clients
WHERE 
    auth.uid() = auth_user_id 
    OR LOWER(auth.email()) = LOWER(email);

-- Grant access to the view
GRANT SELECT ON my_client_info TO authenticated;

-- =====================================================
-- IMPORTANT: Admin bypass
-- The admin (eimri@webloom.ai) should use the 
-- Ghostwriter Portal which has service role access
-- =====================================================