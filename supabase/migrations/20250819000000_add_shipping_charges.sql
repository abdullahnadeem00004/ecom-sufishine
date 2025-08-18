-- Add shipping charge support to guest_orders table
-- This migration adds a shipping_charge column to track delivery charges

DO $$ 
BEGIN
    -- Create guest_orders table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'guest_orders') THEN
        CREATE TABLE public.guest_orders (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            order_number TEXT UNIQUE NOT NULL,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            guest_name TEXT,
            guest_email TEXT,
            guest_phone TEXT,
            customer_name TEXT,
            customer_email TEXT,
            customer_phone TEXT,
            items JSONB NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            shipping_charge DECIMAL(10,2) DEFAULT 0,
            status TEXT DEFAULT 'pending',
            payment_method TEXT NOT NULL,
            shipping_address JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE public.guest_orders ENABLE ROW LEVEL SECURITY;

        -- Create policies for guest_orders
        CREATE POLICY "Anyone can create guest orders" 
        ON public.guest_orders 
        FOR INSERT 
        WITH CHECK (true);

        CREATE POLICY "Users can view their own orders" 
        ON public.guest_orders 
        FOR SELECT 
        USING (auth.uid() = user_id OR auth.uid() IS NULL);

        CREATE POLICY "Admins can view all guest orders" 
        ON public.guest_orders 
        FOR ALL
        USING (public.is_admin(auth.uid()));

        -- Create indexes
        CREATE INDEX idx_guest_orders_user_id ON public.guest_orders(user_id);
        CREATE INDEX idx_guest_orders_guest_email ON public.guest_orders(guest_email);
        CREATE INDEX idx_guest_orders_status ON public.guest_orders(status);
        CREATE INDEX idx_guest_orders_created_at ON public.guest_orders(created_at);

    ELSE
        -- Add shipping_charge column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'guest_orders' AND column_name = 'shipping_charge') THEN
            ALTER TABLE public.guest_orders ADD COLUMN shipping_charge DECIMAL(10,2) DEFAULT 0;
        END IF;
    END IF;

    -- Also add shipping_charge to the regular orders table if it exists and doesn't have it
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'orders' AND column_name = 'shipping_charge') THEN
            ALTER TABLE public.orders ADD COLUMN shipping_charge DECIMAL(10,2) DEFAULT 0;
        END IF;
    END IF;

    -- Add constraint to ensure guest orders have either user_id or guest_email
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'guest_orders' AND constraint_name = 'check_user_or_guest') THEN
        ALTER TABLE public.guest_orders ADD CONSTRAINT check_user_or_guest 
        CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);
    END IF;

END $$;

-- Create or replace function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to guest_orders if it doesn't exist
DROP TRIGGER IF EXISTS update_guest_orders_updated_at ON public.guest_orders;
CREATE TRIGGER update_guest_orders_updated_at
  BEFORE UPDATE ON public.guest_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
