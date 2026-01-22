# Correção do Erro ao Salvar Pedido com Pagamento Local

## Data: 22/01/2026

## Problema Identificado

Ao tentar salvar um pedido com a opção "Pagar no Local", o sistema retornava um erro.

### Causa Raiz

A API de criação de pedidos (`app/api/orders/route.ts`) estava tentando criar pedidos com o status `'pending'`, mas o banco de dados possui uma constraint que só aceita os seguintes status:

- `'created'` - Pedido criado
- `'paid'` - Pedido pago
- `'cancelled'` - Pedido cancelado

### Código Problemático

```typescript
// ANTES (INCORRETO)
const orderStatus = body.payment_method === 'PIX' && body.mark_as_paid ? 'paid' : 'pending'
```

O status `'pending'` não existe na constraint do banco de dados, causando erro ao inserir o pedido.

## Solução Implementada

### Arquivo Modificado: `app/api/orders/route.ts`

Alterado a lógica de definição do status do pedido:

```typescript
// DEPOIS (CORRETO)
const orderStatus = body.mark_as_paid ? 'paid' : 'created'
```

### Lógica Corrigida

1. **Se `mark_as_paid` é `true`**: Status = `'paid'`
   - Aplica-se tanto para PIX quanto para LOCAL
   - Indica que o pagamento foi confirmado

2. **Se `mark_as_paid` é `false`**: Status = `'created'`
   - Pedido foi criado mas ainda não foi pago
   - Pode ser atualizado posteriormente para `'paid'` ou `'cancelled'`

## Status Válidos no Banco de Dados

Conforme definido em `supabase/migrations/001_create_tables.sql`:

```sql
ALTER TABLE orders ADD CONSTRAINT valid_order_status 
  CHECK (status IN ('created', 'paid', 'cancelled'));
```

### Significado de Cada Status

| Status | Descrição |
|--------|-----------|
| `created` | Pedido criado, aguardando confirmação de pagamento |
| `paid` | Pedido pago e confirmado |
| `cancelled` | Pedido cancelado |

## Fluxo de Pagamento Corrigido

### Pagamento PIX
1. Usuário seleciona PIX
2. Sistema abre modal com QR Code
3. Usuário confirma pagamento
4. Pedido criado com status `'paid'` (mark_as_paid = true)

### Pagamento Local
1. Usuário seleciona "Pagamento Local"
2. Sistema processa imediatamente
3. Pedido criado com status `'paid'` (mark_as_paid = true)
4. ✅ **AGORA FUNCIONA CORRETAMENTE**

## Testes Realizados

✅ Build de produção - Sucesso
✅ Compilação TypeScript - Sem erros
✅ Constraint do banco respeitada
✅ Ambos métodos de pagamento funcionando

## Impacto

- ✅ Pagamento LOCAL agora funciona corretamente
- ✅ Pagamento PIX continua funcionando
- ✅ Sem quebra de funcionalidades existentes
- ✅ Compatível com constraints do banco de dados

## Arquivos Afetados

- `app/api/orders/route.ts` - Lógica de status corrigida

## Próximos Passos (Opcional)

Se houver necessidade de um status intermediário entre "criado" e "pago", considerar:

1. Adicionar novo status `'pending'` na constraint do banco:
```sql
ALTER TABLE orders DROP CONSTRAINT valid_order_status;
ALTER TABLE orders ADD CONSTRAINT valid_order_status 
  CHECK (status IN ('created', 'pending', 'paid', 'cancelled'));
```

2. Atualizar a lógica da API conforme necessário

Porém, para o fluxo atual do sistema, os 3 status existentes são suficientes.
