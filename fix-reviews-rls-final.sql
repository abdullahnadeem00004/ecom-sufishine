-- Fix RLS policies for reviews table to allow authenticated users to submit reviews
-- Run this in Supabase Dashboard > SQL Editor

-- First, drop any existing policies that might be blocking us
DROP POLICY IF EXISTS "authenticated_users_insert" ON reviews;
DROP POLICY IF EXISTS "public_approved_reviews" ON reviews;
DROP POLICY IF EXISTS "users_own_reviews" ON reviews;
DROP POLICY IF EXISTS "authenticated_users_can_insert_reviews" ON reviews;
DROP POLICY IF EXISTS "anyone_can_view_approved_reviews" ON reviews;
DROP POLICY IF EXISTS "users_can_view_own_reviews" ON reviews;

-- Ensure RLS is enabled on the reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to insert their own reviews
CREATE POLICY "authenticated_users_can_insert_reviews" ON reviews
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow anyone (including anonymous users) to view approved reviews
CREATE POLICY "anyone_can_view_approved_reviews" ON reviews
FOR SELECT 
USING (approved = true);

-- Policy 3: Allow authenticated users to view their own reviews (even if not approved)
CREATE POLICY "users_can_view_own_reviews" ON reviews
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy 4: Allow authenticated users to update their own reviews (if needed later)
CREATE POLICY "users_can_update_own_reviews" ON reviews
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'reviews'
ORDER BY policyname;
