-- Add support for guest orders
-- This migration adds fields to store guest customer information and cart-style orders

-- First, let's ensure the orders table has all necessary columns
-- Add guest-specific columns if they don't exist
DO $$ 
BEGIN
    -- Add guest customer information columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'guest_name') THEN
        ALTER TABLE public.orders ADD COLUMN guest_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'guest_email') THEN
        ALTER TABLE public.orders ADD COLUMN guest_email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'guest_phone') THEN
        ALTER TABLE public.orders ADD COLUMN guest_phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'guest_address') THEN
        ALTER TABLE public.orders ADD COLUMN guest_address JSONB;
    END IF;
    
    -- Add payment method column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE public.orders ADD COLUMN payment_method TEXT;
    END IF;
    
    -- Add order items column to store cart contents as JSON
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'order_items') THEN
        ALTER TABLE public.orders ADD COLUMN order_items JSONB;
    END IF;
    
    -- Add total_amount column if it doesn't exist (different from total_price which might be per item)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'total_amount') THEN
        ALTER TABLE public.orders ADD COLUMN total_amount DECIMAL(10,2);
    END IF;
    
    -- Add order_type to distinguish between single product and cart orders
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'order_type') THEN
        ALTER TABLE public.orders ADD COLUMN order_type TEXT DEFAULT 'single';
    END IF;
    
    -- Make user_id nullable for guest orders
    ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
    
END $$;

-- Update RLS policies to allow guest orders
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- New policy for registered users to view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- New policy to allow guest order creation (no user_id required)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Policy for users to update only their own orders
CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add check constraint to ensure either user_id or guest_email is provided
ALTER TABLE public.orders ADD CONSTRAINT check_user_or_guest 
CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);

-- Create index for better performance on guest orders
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON public.orders(guest_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON public.orders(order_type);
