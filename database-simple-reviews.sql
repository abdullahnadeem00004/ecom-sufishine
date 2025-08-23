-- SIMPLE VERSION: Essential SQL Queries Only
-- Run these in your Supabase SQL Editor one by one

-- =====================================================
-- QUICK FIX: Update products to integer IDs
-- =====================================================

-- 1. Create new products table with integer IDs
CREATE TABLE products_temp AS 
SELECT 
  ROW_NUMBER() OVER (ORDER BY created_at) as id,
  name, 
  description, 
  price, 
  stock, 
  image_url, 
  created_at, 
  updated_at 
FROM products;

-- 2. Drop old table and rename
DROP TABLE products CASCADE;
ALTER TABLE products_temp RENAME TO products;

-- 3. Add primary key and constraints
ALTER TABLE products ADD PRIMARY KEY (id);
ALTER TABLE products ALTER COLUMN id SET DEFAULT nextval('products_id_seq');
CREATE SEQUENCE IF NOT EXISTS products_id_seq OWNED BY products.id;
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- =====================================================
-- FIX REVIEWS TABLE
-- =====================================================

-- 4. Update reviews table for integer product_ids
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Clear any conflicting data
DELETE FROM reviews;

-- =====================================================
-- ADD SECURITY POLICIES
-- =====================================================

-- 6. Enable RLS and add policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can view
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- Reviews: Anyone can view approved, users can manage their own
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- VERIFY THE FIX
-- =====================================================

-- 7. Check that products now have integer IDs
SELECT id, name, price FROM products ORDER BY id LIMIT 5;

-- 8. Test review insertion (replace 'test-user-id' with actual UUID)
-- INSERT INTO reviews (user_id, product_id, rating, comment, approved) 
-- VALUES ('test-user-id', 1, 5, 'Test review', false);
