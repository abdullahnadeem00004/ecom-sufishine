-- Check current RLS policies and create proper ones for reviews
-- This will help us understand what's blocking review submissions

-- First, let's see current policies
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'reviews';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity, forcerowsecurity 
FROM pg_tables 
WHERE tablename = 'reviews';

-- Create a proper RLS policy for authenticated users to insert reviews
CREATE POLICY "Users can insert their own reviews" ON reviews
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view approved reviews
CREATE POLICY "Anyone can view approved reviews" ON reviews
FOR SELECT 
USING (approved = true);

-- Allow users to view their own reviews (even if not approved)
CREATE POLICY "Users can view their own reviews" ON reviews
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);
