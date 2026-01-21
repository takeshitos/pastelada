-- Function to calculate line total for order items
CREATE OR REPLACE FUNCTION calculate_line_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.line_total_cents = NEW.quantity * NEW.unit_price_cents;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update order total when order items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders 
  SET total_cents = (
    SELECT COALESCE(SUM(line_total_cents), 0)
    FROM order_items 
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
  )
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate line total before insert/update on order_items
CREATE TRIGGER trigger_calculate_line_total
  BEFORE INSERT OR UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_line_total();

-- Trigger to update order total after insert/update/delete on order_items
CREATE TRIGGER trigger_update_order_total_insert_update
  AFTER INSERT OR UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trigger_update_order_total_delete
  AFTER DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_total();

-- Triggers to update updated_at timestamp
CREATE TRIGGER trigger_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_flavors_updated_at
  BEFORE UPDATE ON flavors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();