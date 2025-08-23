-- SQL Queries to Fix Database Schema for Review Functionality
-- Run these queries in your Supabase SQL Editor in the exact order shown

-- =====================================================
-- STEP 1: Update products table to use integer IDs
-- =====================================================

-- First, let's see what we're working with
SELECT id, name, price FROM products ORDER BY created_at;

-- Create a new products table with integer IDs
CREATE TABLE products_new (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Copy existing product data to new table (this will assign new integer IDs)
INSERT INTO products_new (name, description, price, stock, image_url, created_at, updated_at)
SELECT name, description, price, stock, image_url, created_at, updated_at 
FROM products 
ORDER BY created_at;

-- =====================================================
-- STEP 2: Update reviews table structure
-- =====================================================

-- Check current reviews table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reviews' 
ORDER BY ordinal_position;

-- If reviews table doesn't exist, create it
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- If reviews table exists but has wrong product_id type, fix it
-- First drop any existing foreign key constraints
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;

-- Update the column type (this will clear existing data if type conversion fails)
-- Note: If you have existing reviews with UUID product_ids, they will be lost
DELETE FROM reviews WHERE product_id::text ~ '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';

-- Change column type to integer
ALTER TABLE reviews ALTER COLUMN product_id TYPE INTEGER USING product_id::INTEGER;

-- =====================================================
-- STEP 3: Replace old products table with new one
-- =====================================================

-- Drop the old products table and rename new one
DROP TABLE products CASCADE;
ALTER TABLE products_new RENAME TO products;

-- =====================================================
-- STEP 4: Add constraints and policies
-- =====================================================

-- Add foreign key constraint for reviews
ALTER TABLE reviews 
ADD CONSTRAINT reviews_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for products (anyone can view)
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" 
ON products FOR SELECT 
USING (true);

-- Create policies for reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
CREATE POLICY "Anyone can view approved reviews" 
ON reviews FOR SELECT 
USING (approved = true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
CREATE POLICY "Authenticated users can create reviews" 
ON reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" 
ON reviews FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users can delete their own reviews" 
ON reviews FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- STEP 5: Add some sample products for testing
-- =====================================================

-- Insert sample products (these will get integer IDs automatically)
INSERT INTO products (name, description, price, stock, image_url) VALUES
('SUFI SHINE Hair Oil Premium', 'Premium herbal hair oil with natural ingredients for strong, shiny hair. Made with organic oils for deep nourishment and natural shine.', 25.00, 100, '/assets/hair-oil-bottle.png'),
('Natural Glow Face Cream', 'Organic face cream for radiant, healthy skin. Enriched with natural botanicals and vitamins for daily skincare.', 35.00, 50, '/assets/ChatGPT Image Aug 18, 2025, 11_27_32 PM.png'),
('Herbal Moisturizer', 'Daily moisturizer with herbal extracts. Perfect for all skin types, providing long-lasting hydration and softness.', 20.00, 75, '/placeholder.svg'),
('Organic Hair Mask', 'Deep conditioning mask with organic ingredients. Repairs damaged hair and adds intense moisture for silky smooth results.', 32.00, 50, '/placeholder.svg'),
('Vitamin E Serum', 'Lightweight serum packed with Vitamin E for anti-aging benefits. Reduces fine lines and promotes skin elasticity.', 28.00, 40, '/placeholder.svg')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STEP 6: Add sample reviews for testing
-- =====================================================

-- Insert sample reviews (you'll need to replace user_ids with actual user UUIDs from your auth.users table)
-- First, let's see if there are any users
SELECT id, email FROM auth.users LIMIT 3;

-- Add sample reviews (replace the user_id with actual UUIDs from above query)
-- You can run this after you have some users in your system
/*
INSERT INTO reviews (user_id, product_id, rating, comment, approved) VALUES
('YOUR_USER_UUID_HERE', 1, 5, 'Amazing hair oil! My hair feels so much healthier and shinier after just one week of use.', true),
('YOUR_USER_UUID_HERE', 1, 4, 'Good product, natural ingredients. Takes a few days to see results but worth it.', true),
('YOUR_USER_UUID_HERE', 2, 5, 'Love this face cream! My skin looks radiant and feels so soft. Highly recommend!', true),
('YOUR_USER_UUID_HERE', 3, 4, 'Nice moisturizer, not too heavy and absorbs well. Good for daily use.', true);
*/

-- =====================================================
-- STEP 7: Verify everything is working
-- =====================================================

-- Check products with integer IDs
SELECT id, name, price, stock FROM products ORDER BY id;

-- Check reviews table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reviews' 
ORDER BY ordinal_position;

-- Check if reviews can be linked to products
SELECT p.id, p.name, COUNT(r.id) as review_count 
FROM products p 
LEFT JOIN reviews r ON p.id = r.product_id 
GROUP BY p.id, p.name 
ORDER BY p.id;

-- Test review insertion (this should work without errors)
-- Note: Replace 'your-user-uuid' with an actual user UUID
/*
INSERT INTO reviews (user_id, product_id, rating, comment, approved) VALUES
('your-user-uuid', 1, 5, 'Test review for the hair oil product', false);
*/
