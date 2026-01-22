# Status de Pagamento Local como Pendente

## Data: 22/01/2026

## Requisito

Quando o usuário escolher a opção "Pagar no Local", o pedido deve ser salvo com status **pendente** (`'created'`), não como pago.

## Alterações Implementadas

### 1. API de Pedidos (`app/api/orders/route.ts`)

Ajustada a lógica para diferenciar o status baseado no método de pagamento:

```typescript
// ANTES
const orderStatus = body.mark_as_paid ? 'paid' : 'created'

// DEPOIS
const orderStatus = body.payment_method === 'PIX' && body.mark_as_paid ? 'paid' : 'created'
```

**Lógica:**
- **PIX + mark_as_paid = true**: Status = `'paid'` (pago imediatamente)
- **LOCAL**: Status = `'created'` (pendente, aguardando confirmação)

### 2. Frontend - Página de Vendas (`app/vender/page.tsx`)

Ajustado o envio do parâmetro `mark_as_paid` baseado no método:

```typescript
// ANTES
mark_as_paid: true // Always mark as paid for now

// DEPOIS
mark_as_paid: method === 'PIX' // PIX is paid immediately, LOCAL is pending
```

**Lógica:**
- **PIX**: `mark_as_paid = true` → Pedido marcado como pago
- **LOCAL**: `mark_as_paid = false` → Pedido fica pendente

## Fluxo de Pagamento Atualizado

### Pagamento PIX
1. Usuário seleciona PIX
2. Sistema abre modal com QR Code
3. Usuário confirma pagamento
4. **Pedido criado com status `'paid'`** ✅

### Pagamento Local
1. Usuário seleciona "Pagamento Local"
2. Sistema processa imediatamente
3. **Pedido criado com status `'created'` (pendente)** ✅
4. Vendedor pode confirmar pagamento posteriormente

## Status Válidos

Conforme constraint do banco de dados:

| Status | Descrição | Quando Usar |
|--------|-----------|-------------|
| `created` | Pedido criado, aguardando pagamento | **Pagamento LOCAL** |
| `paid` | Pedido pago e confirmado | **Pagamento PIX** |
| `cancelled` | Pedido cancelado | Cancelamento manual |

## Benefícios

1. **Controle de Pagamentos**: Vendedor pode confirmar pagamentos locais posteriormente
2. **Rastreabilidade**: Diferencia pedidos pagos de pendentes
3. **Relatórios Precisos**: Permite filtrar por status de pagamento
4. **Fluxo de Caixa**: Melhor controle do que foi efetivamente recebido

## Próximos Passos (Sugestões)

### Funcionalidade de Confirmação de Pagamento

Adicionar interface para o vendedor ou admin confirmar pagamentos pendentes:

1. **Página de Pedidos Pendentes**
   - Listar pedidos com status `'created'`
   - Botão "Confirmar Pagamento"
   - Atualizar status para `'paid'`

2. **API de Atualização de Status**
   ```typescript
   PATCH /api/orders/:id/status
   Body: { status: 'paid' | 'cancelled' }
   ```

3. **Notificações**
   - Alertar vendedor sobre pedidos pendentes
   - Dashboard com contadores de pendentes

## Arquivos Modificados

- `app/api/orders/route.ts` - Lógica de status baseada no método
- `app/vender/page.tsx` - Parâmetro mark_as_paid condicional

## Testes

✅ Build de produção - Sucesso
✅ Compilação TypeScript - Sem erros
✅ PIX marca como `'paid'`
✅ LOCAL marca como `'created'`
