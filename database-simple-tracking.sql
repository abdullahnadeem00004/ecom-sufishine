-- SIMPLE VERSION - Run these one by one in Supabase SQL Editor

-- Step 1: Add tracking_id column
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(255);

-- Step 2: Add tracking_status column  
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS tracking_status VARCHAR(50) DEFAULT 'pending';

-- Step 3: Add shipped_at column
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE;

-- Step 4: Add delivery_notes column
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- Step 5: Update existing orders
UPDATE guest_orders SET tracking_status = 'pending' WHERE tracking_status IS NULL;

-- Step 6: Verify columns were created
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'guest_orders' 
  AND column_name IN ('tracking_id', 'tracking_status', 'shipped_at', 'delivery_notes')
ORDER BY column_name;
