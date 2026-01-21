-- Enable Row Level Security on all tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for vendors table
-- Allow public read access to active vendors only
CREATE POLICY "Public read access to active vendors" ON vendors
  FOR SELECT USING (active = true);

-- Allow service role full access for admin operations
CREATE POLICY "Service role full access to vendors" ON vendors
  USING (auth.role() = 'service_role');

-- Policies for customers table
-- No public access - only service role can manage customers
CREATE POLICY "Service role full access to customers" ON customers
  USING (auth.role() = 'service_role');

-- Policies for flavors table
-- Allow public read access to active flavors only
CREATE POLICY "Public read access to active flavors" ON flavors
  FOR SELECT USING (active = true);

-- Allow service role full access for admin operations
CREATE POLICY "Service role full access to flavors" ON flavors
  USING (auth.role() = 'service_role');

-- Policies for app_settings table
-- Allow public read access to app settings
CREATE POLICY "Public read access to app settings" ON app_settings
  FOR SELECT USING (true);

-- Allow service role full access for admin operations
CREATE POLICY "Service role full access to app settings" ON app_settings
  USING (auth.role() = 'service_role');

-- Policies for orders table
-- No public access - only service role can manage orders
CREATE POLICY "Service role full access to orders" ON orders
  USING (auth.role() = 'service_role');

-- Policies for order_items table
-- No public access - only service role can manage order items
CREATE POLICY "Service role full access to order items" ON order_items
  USING (auth.role() = 'service_role');

-- Grant necessary permissions to authenticated and anon roles
GRANT SELECT ON vendors TO anon, authenticated;
GRANT SELECT ON flavors TO anon, authenticated;
GRANT SELECT ON app_settings TO anon, authenticated;

-- Grant full permissions to service role (this is typically already granted)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;