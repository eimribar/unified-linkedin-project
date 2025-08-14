-- IMPORTANT: Run this SQL in your Supabase Dashboard SQL Editor
-- This fixes RLS policies so User Portal can see admin-approved content

-- Step 1: Enable RLS on the table
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable all for authenticated users" ON generated_content;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON generated_content;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON generated_content;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON generated_content;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON generated_content;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON generated_content;
DROP POLICY IF EXISTS "Public read access" ON generated_content;
DROP POLICY IF EXISTS "Authenticated users can read all content" ON generated_content;
DROP POLICY IF EXISTS "authenticated_read_all_content" ON generated_content;
DROP POLICY IF EXISTS "authenticated_insert_content" ON generated_content;
DROP POLICY IF EXISTS "authenticated_update_all_content" ON generated_content;
DROP POLICY IF EXISTS "authenticated_delete_content" ON generated_content;
DROP POLICY IF EXISTS "public_read_admin_approved" ON generated_content;

-- Step 3: Create new comprehensive policies

-- Allow ALL users (even anonymous) to READ admin-approved content
CREATE POLICY "anyone_read_admin_approved" 
ON generated_content 
FOR SELECT 
TO public 
USING (status IN ('admin_approved', 'client_approved', 'published'));

-- Allow authenticated users to read ALL content
CREATE POLICY "authenticated_read_all" 
ON generated_content 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to INSERT content
CREATE POLICY "authenticated_insert" 
ON generated_content 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to UPDATE any content
CREATE POLICY "authenticated_update" 
ON generated_content 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Allow authenticated users to DELETE content
CREATE POLICY "authenticated_delete" 
ON generated_content 
FOR DELETE 
TO authenticated 
USING (true);

-- Step 4: Test query - this should return your admin-approved content
SELECT 
    id,
    substring(content_text, 1, 50) as content_preview,
    status,
    created_at
FROM generated_content
WHERE status = 'admin_approved'
ORDER BY created_at DESC
LIMIT 10;