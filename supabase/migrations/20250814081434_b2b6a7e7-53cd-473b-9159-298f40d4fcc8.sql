-- Add role column to profiles table for admin access control
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user'));

-- Add approved column to reviews table for moderation
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;

-- Create index for better performance on role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Create index for reviews approval status
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved);

-- Update RLS policies for admin access
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) OR auth.uid() = id
);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) OR auth.uid() = id
);

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) OR auth.uid() = user_id
);

-- Allow admins to update all orders
CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) OR auth.uid() = user_id
);

-- Allow admins to manage products
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to moderate reviews
CREATE POLICY "Admins can update all reviews" 
ON public.reviews 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) OR auth.uid() = user_id
);

CREATE POLICY "Admins can delete all reviews" 
ON public.reviews 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) OR auth.uid() = user_id
);