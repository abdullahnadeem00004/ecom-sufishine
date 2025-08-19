-- Database modifications for JazzCash payment functionality

-- 1. Add transaction_id column to guest_orders table
ALTER TABLE guest_orders ADD COLUMN transaction_id VARCHAR(255);

-- 2. Add payment_status column to guest_orders table  
ALTER TABLE guest_orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending';

-- 3. Add payment_verification_notes column for admin notes
ALTER TABLE guest_orders ADD COLUMN payment_verification_notes TEXT;

-- 4. Add jazzcash_account_details table for storing account information
CREATE TABLE IF NOT EXISTS jazzcash_account_details (
    id SERIAL PRIMARY KEY,
    account_title VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_type VARCHAR(50) NOT NULL DEFAULT 'mobile_wallet',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Insert default JazzCash account details (modify these values as needed)
INSERT INTO jazzcash_account_details (account_title, account_number, account_type) 
VALUES ('SUFI SHINE STORE', '03001234567', 'mobile_wallet');

-- 6. Create indexes for better performance
CREATE INDEX idx_guest_orders_transaction_id ON guest_orders(transaction_id);
CREATE INDEX idx_guest_orders_payment_status ON guest_orders(payment_status);
CREATE INDEX idx_guest_orders_payment_method ON guest_orders(payment_method);

-- 7. Update existing orders to have default payment_status
UPDATE guest_orders SET payment_status = 'completed' WHERE payment_method = 'cash_on_delivery';
UPDATE guest_orders SET payment_status = 'pending' WHERE payment_method != 'cash_on_delivery' AND payment_status IS NULL;
