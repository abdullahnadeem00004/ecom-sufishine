-- Update products table to use integer IDs instead of UUIDs
-- This will fix the frontend compatibility issue

-- First, drop the existing products table (since there's only one test product)
DROP TABLE IF EXISTS public.products CASCADE;

-- Recreate products table with integer ID
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read access)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Insert test products
INSERT INTO public.products (name, description, price, stock, image_url) VALUES
('SUFI SHINE Hair Oil Premium', 'Premium herbal hair oil with natural ingredients for strong, shiny hair', 25.00, 100, '/assets/hair-oil-bottle.png'),
('Natural Glow Face Cream', 'Organic face cream for radiant, healthy skin', 35.00, 50, '/assets/ChatGPT Image Aug 18, 2025, 11_27_32 PM.png'),
('Herbal Moisturizer', 'Daily moisturizer with herbal extracts', 20.00, 75, '/placeholder.svg'),
('Organic Hair Mask', 'Deep conditioning mask with organic ingredients', 32.00, 50, '/placeholder.svg');

-- Update reviews table to reference integer product IDs
ALTER TABLE public.reviews 
DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;

ALTER TABLE public.reviews 
ALTER COLUMN product_id TYPE INTEGER USING product_id::text::integer;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
