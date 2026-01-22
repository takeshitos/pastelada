-- Add 'completed' status to valid order statuses
-- This represents orders that have been delivered to the customer

-- Drop existing constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_order_status;

-- Add new constraint with 'completed' status
ALTER TABLE orders ADD CONSTRAINT valid_order_status 
  CHECK (status IN ('created', 'paid', 'completed', 'cancelled'));

-- Add comment explaining the statuses
COMMENT ON COLUMN orders.status IS 
  'Order status: created (pending payment), paid (payment confirmed), completed (delivered to customer), cancelled (order cancelled)';
