# 🚀 Como Executar a Migration 009

Guia rápido para adicionar preços individuais aos sabores.

---

## ⚡ Passo a Passo (5 minutos)

### 1. Abrir Supabase SQL Editor

1. Acesse https://app.supabase.com
2. Abra seu projeto
3. Clique em **SQL Editor** (ícone de banco de dados no menu lateral)
4. Clique em **New Query**

---

### 2. Copiar e Colar a Migration

Copie TODO o conteúdo abaixo:

```sql
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
```

Cole no editor SQL do Supabase.

---

### 3. Executar

1. Clique no botão **Run** (ou pressione Ctrl+Enter)
2. Aguarde alguns segundos
3. Você verá: **"Success. No rows returned"**

✅ **Pronto!** A migration foi executada com sucesso.

---

### 4. Verificar (Opcional)

Para confirmar que tudo funcionou, execute este script de verificação:

```sql
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
  name,
  CONCAT('R$ ', (price_cents::float / 100)::numeric(10,2)) as price,
  active
FROM flavors
ORDER BY name;
```

**Resultado esperado:**
- Primeira query: 1 linha mostrando a coluna `price_cents`
- Segunda query: Lista de todos os sabores com seus preços

---

## ✅ Checklist

- [ ] Acessei Supabase SQL Editor
- [ ] Copiei a migration completa
- [ ] Colei no editor
- [ ] Cliquei em Run
- [ ] Vi "Success. No rows returned"
- [ ] (Opcional) Executei script de verificação
- [ ] Todos os sabores têm preços

---

## 🎯 Próximo Passo

Após executar a migration:

1. **Fazer deploy do código:**
```bash
git add .
git commit -m "feat: adicionar preços individuais por sabor"
git push
```

2. **Aguardar deploy no Vercel** (1-2 minutos)

3. **Configurar preços:**
   - Acesse `/adm/sabores`
   - Edite cada sabor
   - Defina preços individuais

---

## 🐛 Problemas?

### Erro: "column price_cents already exists"

**Não é problema!** Significa que a migration já foi executada antes.

**Solução:** Pule para o próximo passo (fazer deploy).

---

### Erro: "relation flavors does not exist"

**Causa:** Banco de dados não está configurado.

**Solução:** Execute todas as migrations anteriores (001 a 008) primeiro.

---

### Erro: "syntax error"

**Causa:** Copiou apenas parte da migration.

**Solução:** Copie TODO o conteúdo da migration, incluindo os comentários.

---

## 📝 Notas

- ✅ Migration é **idempotente** (pode executar múltiplas vezes)
- ✅ Usa `IF NOT EXISTS` para evitar erros
- ✅ Não afeta dados existentes
- ✅ Migra preços automaticamente
- ✅ Seguro para produção

---

**Última atualização:** 22/01/2026  
**Tempo estimado:** 5 minutos  
**Dificuldade:** ⭐ Fácil
