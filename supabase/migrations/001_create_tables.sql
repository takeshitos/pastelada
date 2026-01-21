-- Create vendors table
CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create flavors table
CREATE TABLE flavors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create app_settings table (singleton pattern)
CREATE TABLE app_settings (
  id int PRIMARY KEY DEFAULT 1,
  pastel_price_cents int NOT NULL DEFAULT 0,
  pix_qr_image_path text,
  pix_key_text text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id),
  customer_id uuid REFERENCES customers(id),
  status text NOT NULL DEFAULT 'created',
  payment_method text NOT NULL DEFAULT 'LOCAL',
  total_cents int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  flavor_id uuid NOT NULL REFERENCES flavors(id),
  quantity int NOT NULL CHECK (quantity > 0),
  unit_price_cents int NOT NULL DEFAULT 0,
  line_total_cents int NOT NULL DEFAULT 0
);

-- Create indexes for performance
CREATE INDEX idx_vendors_active ON vendors(active);
CREATE INDEX idx_vendors_name ON vendors(name);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_flavors_active ON flavors(active);
CREATE INDEX idx_flavors_name ON flavors(name);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_flavor_id ON order_items(flavor_id);

-- Add constraint to ensure valid payment methods
ALTER TABLE orders ADD CONSTRAINT valid_payment_method 
  CHECK (payment_method IN ('PIX', 'LOCAL'));

-- Add constraint to ensure valid order status
ALTER TABLE orders ADD CONSTRAINT valid_order_status 
  CHECK (status IN ('created', 'paid', 'cancelled'));