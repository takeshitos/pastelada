-- Migration 009: Add Individual Prices to Flavors
-- This migration adds price_cents column to flavors table
-- and migrates existing data from app_settings

-- Add price_cents column to flavors table
ALTER TABLE flavors 
ADD COLUMN IF NOT EXISTS price_cents int NOT NULL DEFAULT 500;

-- Add comment
COMMENT ON COLUMN flavors.price_cents IS 
  'Price in cents for this flavor. Example: 500 = R$ 5,00';

-- Migrate existing price from app_settings to all flavors
UPDATE flavors 
SET price_cents = (
  SELECT pastel_price_cents 
  FROM app_settings 
  WHERE id = 1
)
WHERE price_cents = 500; -- Only update if still default

-- Note: We keep pastel_price_cents in app_settings as a default for new flavors
-- but it's no longer used for pricing calculations

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_flavors_price ON flavors(price_cents);

