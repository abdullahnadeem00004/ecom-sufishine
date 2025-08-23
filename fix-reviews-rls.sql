-- Fix Review Submission Issue
-- The RLS policy might be too restrictive
-- Run these queries in your Supabase SQL Editor

-- First, let's check current policies
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'reviews';

-- Drop the existing insert policy and create a more permissive one
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;

-- Create a new policy that allows any authenticated user to insert reviews
CREATE POLICY "Authenticated users can create reviews" 
ON reviews 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Also ensure we have a policy for public access to approved reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
CREATE POLICY "Anyone can view approved reviews" 
ON reviews 
FOR SELECT 
TO public
USING (approved = true);

-- Add a policy for users to view their own reviews (approved or not)
DROP POLICY IF EXISTS "Users can view their own reviews" ON reviews;
CREATE POLICY "Users can view their own reviews" 
ON reviews 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Update policy for users to update their own reviews
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" 
ON reviews 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verify policies are created correctly
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'reviews'
ORDER BY policyname;
