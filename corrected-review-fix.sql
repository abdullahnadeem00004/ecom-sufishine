-- CORRECTED FIX FOR REVIEW SYSTEM
-- This works with regular admin users (not service role)
-- Run this in Supabase Dashboard > SQL Editor

-- ========================================
-- STEP 1: Clean up existing policies
-- ========================================

DROP POLICY IF EXISTS "authenticated_users_can_insert_reviews" ON reviews;
DROP POLICY IF EXISTS "anyone_can_view_approved_reviews" ON reviews;
DROP POLICY IF EXISTS "public_can_view_approved_reviews" ON reviews;
DROP POLICY IF EXISTS "users_can_view_own_reviews" ON reviews;
DROP POLICY IF EXISTS "users_can_update_own_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_can_view_all_reviews" ON reviews;
DROP POLICY IF EXISTS "admin_can_update_any_review" ON reviews;
DROP POLICY IF EXISTS "admin_can_delete_any_review" ON reviews;

-- ========================================
-- STEP 2: Ensure RLS is enabled
-- ========================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 3: Create helper function to check admin role
-- ========================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- ========================================
-- STEP 4: Create comprehensive RLS policies
-- ========================================

-- Policy 1: Allow authenticated users to INSERT their own reviews
CREATE POLICY "authenticated_users_can_insert_reviews" ON reviews
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow anyone to SELECT approved reviews (for public product pages)
CREATE POLICY "public_can_view_approved_reviews" ON reviews
FOR SELECT 
USING (approved = true);

-- Policy 3: Allow authenticated users to SELECT their own reviews
CREATE POLICY "users_can_view_own_reviews" ON reviews
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy 4: Allow authenticated users to UPDATE their own reviews
CREATE POLICY "users_can_update_own_reviews" ON reviews
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 5: Allow ADMIN users to SELECT ALL reviews (for admin panel)
CREATE POLICY "admin_can_view_all_reviews" ON reviews
FOR SELECT 
TO authenticated
USING (is_admin());

-- Policy 6: Allow ADMIN users to UPDATE any review (for approval/rejection)
CREATE POLICY "admin_can_update_any_review" ON reviews
FOR UPDATE 
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Policy 7: Allow ADMIN users to DELETE any review
CREATE POLICY "admin_can_delete_any_review" ON reviews
FOR DELETE 
TO authenticated
USING (is_admin());

-- ========================================
-- STEP 5: Ensure profiles table exists and has admin users
-- ========================================

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY IF NOT EXISTS "users_can_view_own_profile" ON profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

-- Allow users to update their own profile (but not role)
CREATE POLICY IF NOT EXISTS "users_can_update_own_profile" ON profiles
FOR UPDATE TO authenticated USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- ========================================
-- STEP 6: Create an admin user for testing
-- ========================================

-- Insert or update an admin user (replace with actual admin email)
INSERT INTO profiles (id, email, role) 
SELECT 
    id, 
    email, 
    'admin'
FROM auth.users 
WHERE email = 'admin@sufishine.com'  -- Change this to your admin email
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';

-- If you don't have an admin user yet, you can manually create one:
-- First sign up normally in your app, then run this with your user's email:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- ========================================
-- STEP 7: Verify setup
-- ========================================

-- Show all policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd, 
    roles
FROM pg_policies 
WHERE tablename IN ('reviews', 'profiles')
ORDER BY tablename, policyname;

-- Show current reviews
SELECT 
    COUNT(*) as total_reviews,
    COUNT(CASE WHEN approved = true THEN 1 END) as approved_reviews,
    COUNT(CASE WHEN approved = false THEN 1 END) as pending_reviews
FROM reviews;

-- Show profiles
SELECT id, email, role, created_at FROM profiles ORDER BY created_at;

-- ========================================
-- TESTING NOTES
-- ========================================

/*
After running this SQL:

1. USERS can:
   - Submit reviews when authenticated (auth.uid() = user_id)
   - View their own reviews
   - View approved reviews on product pages

2. ADMINS can:
   - View ALL reviews (approved + pending) 
   - Approve/reject any review
   - Delete any review

3. To test:
   - Sign up as regular user -> submit review -> should work
   - Sign in as admin -> go to admin panel -> should see all reviews
   - Admin can approve pending reviews

4. If admin panel still doesn't show reviews:
   - Make sure the admin user has role='admin' in profiles table
   - Check browser console for any errors
   - Verify admin authentication is working
*/
