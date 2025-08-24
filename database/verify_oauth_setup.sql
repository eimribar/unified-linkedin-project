-- =====================================================
-- VERIFY OAUTH SETUP
-- Check that everything is configured correctly
-- =====================================================

-- 1. Check if we have any auth users
SELECT 
    COUNT(*) as total_users,
    COUNT(DISTINCT email) as unique_emails
FROM auth.users;

-- 2. Check clients table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position;

-- 3. Check for any linked accounts
SELECT 
    c.id,
    c.name,
    c.email,
    c.auth_user_id,
    c.invitation_status,
    c.invitation_token IS NOT NULL as has_token,
    u.email as auth_email,
    u.created_at as auth_created
FROM clients c
LEFT JOIN auth.users u ON c.auth_user_id = u.id
ORDER BY c.created_at DESC
LIMIT 10;

-- 4. Check RLS policies on clients table
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
WHERE tablename = 'clients';

-- 5. Test invitation token linking (dry run)
-- This shows what would happen if user tries to link
SELECT 
    c.id,
    c.name,
    c.email,
    c.invitation_token,
    c.auth_user_id,
    CASE 
        WHEN c.auth_user_id IS NOT NULL THEN 'Already linked'
        WHEN c.invitation_token IS NULL THEN 'No invitation token'
        ELSE 'Ready to link'
    END as link_status
FROM clients c
WHERE c.invitation_status != 'accepted'
   OR c.invitation_status IS NULL;