# 💰 Preços Individuais por Sabor

## 🎯 Mudança Implementada

O sistema agora suporta **preços individuais para cada sabor** ao invés de um preço único para todos os pastéis.

---

## ✅ O Que Foi Modificado

### 1. Banco de Dados

**Nova Migration:** `supabase/migrations/009_add_flavor_prices.sql`

- Adicionada coluna `price_cents` na tabela `flavors`
- Migração automática dos preços existentes
- Índice criado para performance

```sql
ALTER TABLE flavors 
ADD COLUMN price_cents int NOT NULL DEFAULT 500;
```

---

### 2. Tipos TypeScript

**Arquivos atualizados:**
- `types/database.ts`
- `types/supabase.ts`

```typescript
export interface Flavor {
  id: string
  name: string
  price_cents: number  // ← NOVO
  active: boolean
  created_at: string
  updated_at: string
}
```

---

### 3. API de Flavors

**Arquivo:** `app/api/flavors/route.ts`

**POST - Criar sabor:**
- Aceita `price_cents` opcional
- Se não fornecido, usa preço padrão de `app_settings`

**PATCH - Atualizar sabor:**
- Permite atualizar `price_cents`
- Validação: preço deve ser ≥ 0

---

### 4. API de Orders

**Arquivo:** `app/api/orders/route.ts`

**Mudança principal:**
- Busca preço individual de cada sabor
- Cria mapa de preços: `flavorPrices.get(flavor_id)`
- Cada item do pedido usa o preço do seu sabor

**Antes:**
```typescript
const currentPriceCents = settings.pastel_price_cents
// Todos os itens usavam o mesmo preço
```

**Depois:**
```typescript
const flavorPrices = new Map<string, number>()
flavors.forEach(flavor => {
  flavorPrices.set(flavor.id, flavor.price_cents)
})
// Cada item usa seu próprio preço
```

---

### 5. Página de Sabores (Admin)

**Arquivo:** `app/adm/sabores/page.tsx`

**Novos campos:**
- Input de preço no formulário de criar/editar
- Coluna "Preço" na tabela de sabores
- Validação de preço (0 a 1000 reais)

**Interface:**
```
┌─────────────────────────────────────┐
│ Nome do Sabor *                     │
│ [Carne                          ]   │
│                                     │
│ Preço (R$) *                        │
│ [5.00                           ]   │
│ Preço individual deste sabor        │
└─────────────────────────────────────┘
```

---

### 6. Página de Vendas

**Arquivo:** `app/vender/page.tsx`

**Mudanças:**
- Removido card "Preço do Pastel" único
- Cada sabor mostra seu preço individual
- Cálculo de total usa preços individuais
- Subtotal por sabor calculado corretamente

**Antes:**
```
┌─────────────────────────┐
│ Preço do Pastel         │
│ R$ 5,00                 │
└─────────────────────────┘

┌─────────────────────────┐
│ Carne                   │
│ Subtotal: R$ 15,00      │
└─────────────────────────┘
```

**Depois:**
```
┌─────────────────────────┐
│ Carne                   │
│ R$ 5,00                 │
│ Subtotal: R$ 15,00      │
└─────────────────────────┘

┌─────────────────────────┐
│ Queijo                  │
│ R$ 6,00                 │
│ Subtotal: R$ 12,00      │
└─────────────────────────┘
```

---

### 7. Página de Configurações

**Arquivo:** `app/adm/configuracoes/page.tsx`

**Mudança:**
- Nota explicativa atualizada
- Preço em configurações é apenas padrão para novos sabores
- Não afeta sabores existentes

---

## 🚀 Como Usar

### 1. Executar Migration no Supabase

**Passo a passo:**

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie todo o conteúdo de `supabase/migrations/009_add_flavor_prices.sql`
5. Cole no editor
6. Clique em **Run**

**Resultado esperado:**
```
Success. No rows returned
```

**Verificar se funcionou:**

Execute o script de verificação `supabase/verify_flavor_prices.sql` para ver:
- ✅ Coluna `price_cents` criada
- ✅ Todos os sabores com preços
- ✅ Índice criado
- ✅ Estatísticas de preços

---

### 2. Fazer Deploy

```bash
git add .
git commit -m "feat: adicionar preços individuais por sabor"
git push
```

Aguarde o deploy automático no Vercel (1-2 minutos).

---

### 3. Configurar Preços dos Sabores

1. Acesse `/adm/sabores`
2. Clique em "Editar" em cada sabor
3. Defina o preço individual
4. Clique em "Atualizar"

**Ou criar novo sabor:**
1. Clique em "Novo Sabor"
2. Digite nome e preço
3. Clique em "Criar"

---

## 📊 Exemplos de Uso

### Exemplo 1: Sabores com Preços Diferentes

```
Carne:     R$ 5,00
Queijo:    R$ 6,00
Frango:    R$ 5,50
Calabresa: R$ 5,00
Pizza:     R$ 7,00
```

**Venda:**
- 2x Carne = R$ 10,00
- 1x Pizza = R$ 7,00
- **Total: R$ 17,00**

---

### Exemplo 2: Promoção em Sabor Específico

```
Carne:     R$ 5,00
Queijo:    R$ 4,00  ← Em promoção!
Frango:    R$ 5,50
```

**Venda:**
- 3x Queijo = R$ 12,00 (economizou R$ 3,00!)
- 1x Frango = R$ 5,50
- **Total: R$ 17,50**

---

### Exemplo 3: Sabores Premium

```
Carne:     R$ 5,00
Queijo:    R$ 5,00
Camarão:   R$ 12,00  ← Premium
Salmão:    R$ 15,00  ← Premium
```

---

## 🔄 Compatibilidade

### Pedidos Antigos
- ✅ Mantêm o preço original (armazenado em `order_items.unit_price_cents`)
- ✅ Não são afetados por mudanças de preço
- ✅ Relatórios continuam corretos

### Novos Pedidos
- ✅ Usam preço atual de cada sabor
- ✅ Preço é capturado no momento da venda
- ✅ Mudanças futuras não afetam pedidos já feitos

---

## 📝 Notas Importantes

### 1. Preço Padrão em Configurações

O preço em `/adm/configuracoes` agora serve apenas como:
- Valor padrão ao criar novos sabores
- Referência para o sistema

**Não afeta:**
- Sabores existentes
- Cálculo de vendas
- Pedidos em andamento

---

### 2. Migração Automática

Ao executar a migration 009:
- Todos os sabores existentes recebem o preço de `app_settings`
- Você pode ajustar individualmente depois
- Nenhum dado é perdido

---

### 3. Validações

**Preço deve ser:**
- ✅ Número válido
- ✅ Maior ou igual a 0
- ✅ Menor ou igual a R$ 1.000,00

---

## 🐛 Troubleshooting

### Problema: Coluna price_cents não existe

**Causa:** Migration 009 não foi executada

**Solução:**
1. Acesse Supabase SQL Editor
2. Execute `supabase/migrations/009_add_flavor_prices.sql`
3. Aguarde "Success. No rows returned"
4. Execute `supabase/verify_flavor_prices.sql` para confirmar

---

### Problema: Erro "syntax error at or near $"

**Causa:** Versão antiga da migration com bloco DO

**Solução:**
1. Use a versão atualizada da migration (sem bloco DO)
2. A migration atual é segura e simples
3. Execute novamente

---

### Problema: Sabores mostram R$ 0,00

**Solução:**
1. Execute a migration 009
2. Ou edite cada sabor manualmente
3. Defina o preço correto

---

### Problema: Total da venda está errado

**Solução:**
1. Verifique se todos os sabores têm `price_cents > 0`
2. Limpe cache do navegador (Ctrl+Shift+Delete)
3. Recarregue a página

---

## ✅ Checklist de Implementação

- [ ] Migration 009 executada no Supabase
- [ ] Código commitado e pushed
- [ ] Deploy realizado no Vercel
- [ ] Cache do navegador limpo
- [ ] Preços configurados em cada sabor
- [ ] Testado criar nova venda
- [ ] Verificado cálculo de total
- [ ] Confirmado que pedidos antigos não mudaram

---

## 📚 Arquivos Modificados

### Banco de Dados
- `supabase/migrations/009_add_flavor_prices.sql` (NOVO)

### Tipos
- `types/database.ts`
- `types/supabase.ts`

### APIs
- `app/api/flavors/route.ts`
- `app/api/orders/route.ts`

### Páginas
- `app/adm/sabores/page.tsx`
- `app/adm/configuracoes/page.tsx`
- `app/vender/page.tsx`

---

**Última atualização:** 22/01/2026  
**Versão:** 1.1.0  
**Status:** ✅ Implementado e testado
