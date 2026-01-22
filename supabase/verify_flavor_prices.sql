-- Script de Verificação: Preços dos Sabores
-- Execute este script APÓS a migration 009 para verificar se tudo está correto

-- Verificar se a coluna foi criada
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'flavors' 
  AND column_name = 'price_cents';

-- Verificar todos os sabores com seus preços
SELECT 
  id,
  name,
  price_cents,
  CONCAT('R$ ', (price_cents::float / 100)::numeric(10,2)) as price_formatted,
  active,
  created_at
FROM flavors
ORDER BY name;

-- Verificar se há sabores sem preço (price_cents = 0)
SELECT 
  COUNT(*) as flavors_without_price
FROM flavors
WHERE price_cents = 0;

-- Verificar estatísticas de preços
SELECT 
  COUNT(*) as total_flavors,
  MIN(price_cents) as min_price_cents,
  MAX(price_cents) as max_price_cents,
  AVG(price_cents)::int as avg_price_cents,
  CONCAT('R$ ', (MIN(price_cents)::float / 100)::numeric(10,2)) as min_price,
  CONCAT('R$ ', (MAX(price_cents)::float / 100)::numeric(10,2)) as max_price,
  CONCAT('R$ ', (AVG(price_cents)::float / 100)::numeric(10,2)) as avg_price
FROM flavors
WHERE active = true;

-- Verificar se o índice foi criado
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'flavors'
  AND indexname = 'idx_flavors_price';
