-- Insert initial app_settings record with default price
INSERT INTO app_settings (id, pastel_price_cents, updated_at)
VALUES (1, 500, now()) -- Default price: R$ 5,00 (500 centavos)
ON CONFLICT (id) DO NOTHING;

-- Insert example flavors (optional)
INSERT INTO flavors (name, active, created_at, updated_at) VALUES
  ('Carne', true, now(), now()),
  ('Frango', true, now(), now()),
  ('Queijo', true, now(), now()),
  ('Pizza', true, now(), now()),
  ('Calabresa', true, now(), now()),
  ('Palmito', true, now(), now())
ON CONFLICT (name) DO NOTHING;