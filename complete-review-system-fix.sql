-- COMPLETE FIX FOR REVIEW SYSTEM
-- This addresses both user review submission AND admin panel access
-- Run this in Supabase Dashboard > SQL Editor

-- ========================================
-- STEP 1: Clean up existing policies
-- ========================================

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "authenticated_users_can_insert_reviews" ON reviews;
DROP POLICY IF EXISTS "anyone_can_view_approved_reviews" ON reviews;
DROP POLICY IF EXISTS "users_can_view_own_reviews" ON reviews;
DROP POLICY IF EXISTS "users_can_update_own_reviews" ON reviews;
DROP POLICY IF EXISTS "service_role_all_access" ON reviews;

-- ========================================
-- STEP 2: Ensure RLS is enabled
-- ========================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 3: Create comprehensive RLS policies
-- ========================================

-- Policy 1: Allow authenticated users to INSERT their own reviews
CREATE POLICY "authenticated_users_can_insert_reviews" ON reviews
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow public to SELECT approved reviews (for product pages)
CREATE POLICY "public_can_view_approved_reviews" ON reviews
FOR SELECT 
USING (approved = true);

-- Policy 3: Allow authenticated users to SELECT their own reviews (approved or not)
CREATE POLICY "users_can_view_own_reviews" ON reviews
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy 4: Allow authenticated users to UPDATE their own reviews (if needed)
CREATE POLICY "users_can_update_own_reviews" ON reviews
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 5: Admin access - Allow service role to SELECT ALL reviews (for admin panel)
CREATE POLICY "admin_can_view_all_reviews" ON reviews
FOR SELECT 
TO service_role
USING (true);

-- Policy 6: Admin access - Allow service role to UPDATE any review (for approval)
CREATE POLICY "admin_can_update_any_review" ON reviews
FOR UPDATE 
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 7: Admin access - Allow service role to DELETE any review
CREATE POLICY "admin_can_delete_any_review" ON reviews
FOR DELETE 
TO service_role
USING (true);

-- ========================================
-- STEP 4: Verify policies are created
-- ========================================

SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd, 
    roles,
    CASE 
        WHEN qual IS NOT NULL THEN substring(qual for 50) 
        ELSE 'N/A' 
    END as condition_preview
FROM pg_policies 
WHERE tablename = 'reviews'
ORDER BY policyname;

-- ========================================
-- STEP 5: Insert test data for verification
-- ========================================

-- Insert a test review that should be blocked (no auth)
-- This should fail with RLS error - that's expected and good

-- Create a test user if needed (this might fail if user already exists - that's OK)
-- INSERT INTO auth.users (id, email) VALUES ('12345678-1234-1234-1234-123456789abc', 'test@example.com') ON CONFLICT DO NOTHING;

-- ========================================
-- STEP 6: Show current review stats
-- ========================================

SELECT 
    COUNT(*) as total_reviews,
    COUNT(CASE WHEN approved = true THEN 1 END) as approved_reviews,
    COUNT(CASE WHEN approved = false THEN 1 END) as pending_reviews,
    AVG(CASE WHEN approved = true THEN rating END) as avg_approved_rating
FROM reviews;

-- ========================================
-- NOTES FOR TESTING
-- ========================================

-- After running this SQL:
-- 1. User review submissions should work when authenticated
-- 2. Admin panel should see all reviews (approved + pending)
-- 3. Public users should only see approved reviews
-- 4. Users should see their own reviews regardless of approval status

-- If admin panel still doesn't work, you may need to:
-- 1. Check if admin authentication uses service_role key
-- 2. Or add a separate policy for admin role
-- 3. Or ensure admin has proper authentication context
