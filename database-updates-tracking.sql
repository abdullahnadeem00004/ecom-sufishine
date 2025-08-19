-- Database updates for Order Tracking functionality

-- 1. Add tracking_id column to guest_orders table
ALTER TABLE guest_orders ADD COLUMN tracking_id VARCHAR(255);

-- 2. Add tracking_status column to track shipping status
ALTER TABLE guest_orders ADD COLUMN tracking_status VARCHAR(50) DEFAULT 'pending';

-- 3. Add shipped_at timestamp for when tracking ID is added
ALTER TABLE guest_orders ADD COLUMN shipped_at TIMESTAMP WITH TIME ZONE;

-- 4. Add delivery_notes column for admin notes about shipping
ALTER TABLE guest_orders ADD COLUMN delivery_notes TEXT;

-- 5. Create indexes for better performance
CREATE INDEX idx_guest_orders_tracking_id ON guest_orders(tracking_id);
CREATE INDEX idx_guest_orders_tracking_status ON guest_orders(tracking_status);

-- 6. Update existing orders with default tracking status
UPDATE guest_orders SET tracking_status = 'pending' WHERE tracking_status IS NULL;
UPDATE guest_orders SET tracking_status = 'shipped' WHERE status = 'shipped' AND tracking_id IS NOT NULL;
UPDATE guest_orders SET tracking_status = 'delivered' WHERE status = 'delivered';

-- 7. Optional: Create a tracking_logs table for detailed tracking history
CREATE TABLE IF NOT EXISTS tracking_logs (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES guest_orders(id) ON DELETE CASCADE,
    tracking_id VARCHAR(255),
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by VARCHAR(255) -- admin user who made the update
);

-- 8. Create index for tracking logs
CREATE INDEX idx_tracking_logs_order_id ON tracking_logs(order_id);
CREATE INDEX idx_tracking_logs_tracking_id ON tracking_logs(tracking_id);

-- 9. Insert sample tracking log entries for existing shipped orders (optional)
-- INSERT INTO tracking_logs (order_id, tracking_id, status, notes, updated_by)
-- SELECT id, tracking_id, 'shipped', 'Order shipped with tracking', 'system'
-- FROM guest_orders 
-- WHERE status = 'shipped' AND tracking_id IS NOT NULL;
