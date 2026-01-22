# Status de Pagamento - Sistema Pastelada

## Lógica de Status

O sistema utiliza diferentes status de pagamento dependendo do método escolhido:

### 🟢 PIX - Status: "paid" (Pago)

Quando o vendedor escolhe **pagamento via PIX**:
- ✅ Status salvo: **"paid"**
- ✅ Método: **"PIX"**
- ✅ Considerado pago imediatamente

**Motivo**: O pagamento PIX é instantâneo e o vendedor confirma visualmente através do QR code que o pagamento foi realizado.

### 🟡 LOCAL - Status: "pending" (Pendente)

Quando o vendedor escolhe **pagamento local**:
- ⏳ Status salvo: **"pending"**
- 💵 Método: **"LOCAL"**
- ⏳ Aguardando confirmação de pagamento

**Motivo**: O pagamento local (dinheiro, cartão na maquininha, etc.) ainda precisa ser confirmado fisicamente. O status "pending" permite que o administrador acompanhe quais vendas ainda precisam ter o pagamento confirmado.

---

## Fluxo de Pagamento

### Fluxo PIX

```
1. Vendedor seleciona itens
2. Vendedor escolhe "PIX"
3. Sistema exibe QR code
4. Cliente paga via PIX
5. Vendedor confirma pagamento
6. ✅ Venda salva com status "paid"
```

### Fluxo LOCAL

```
1. Vendedor seleciona itens
2. Vendedor escolhe "LOCAL"
3. Sistema registra venda
4. ⏳ Venda salva com status "pending"
5. Cliente paga (dinheiro/cartão)
6. [Futuro] Admin confirma pagamento
7. ✅ Status atualizado para "paid"
```

---

## Implementação Técnica

### API de Criação de Pedidos

Arquivo: `app/api/orders/route.ts`

```typescript
// PIX é marcado como pago imediatamente
// LOCAL fica pendente até confirmação
const orderStatus = body.payment_method === 'PIX' && body.mark_as_paid 
  ? 'paid' 
  : 'pending'

const { data: order, error: orderError } = await supabaseAdmin
  .from('orders')
  .insert({
    vendor_id: body.vendor_id,
    customer_id: customerId,
    status: orderStatus,  // 'paid' para PIX, 'pending' para LOCAL
    payment_method: body.payment_method,
    total_cents: 0
  })
```

### Possíveis Status

O sistema suporta os seguintes status:

| Status | Descrição | Quando usar |
|--------|-----------|-------------|
| **pending** | Pendente | Pagamento LOCAL aguardando confirmação |
| **paid** | Pago | Pagamento PIX confirmado ou LOCAL confirmado pelo admin |
| **created** | Criado | Pedido criado mas sem método de pagamento definido |
| **cancelled** | Cancelado | Pedido cancelado (futuro) |

---

## Visualização de Status

### Para Vendedores

Na tela "Minhas Vendas" (`/vendas`), os vendedores veem:

```tsx
// Badge de status
{status === 'paid' && (
  <span className="bg-success-100 text-success-800">Pago</span>
)}

{status === 'pending' && (
  <span className="bg-warning-100 text-warning-800">Pendente</span>
)}
```

### Para Administradores

No painel de relatórios (`/adm/relatorios`), os administradores podem:
- Ver todas as vendas com seus status
- Filtrar por status (pago, pendente, etc.)
- Identificar vendas que precisam de confirmação

---

## Benefícios desta Abordagem

### ✅ Controle Financeiro

- Administrador sabe exatamente quais vendas foram pagas
- Fácil identificar vendas pendentes de confirmação
- Melhor controle de caixa

### ✅ Rastreabilidade

- Histórico completo de cada venda
- Sabe quando e como cada venda foi paga
- Auditoria facilitada

### ✅ Flexibilidade

- Permite diferentes métodos de pagamento
- Suporta confirmação posterior
- Pode adicionar novos status no futuro

---

## Funcionalidades Futuras (Opcional)

### 1. Confirmação de Pagamento LOCAL

Adicionar funcionalidade para admin confirmar pagamentos locais:

```tsx
// Botão no painel admin
<button onClick={() => confirmPayment(orderId)}>
  Confirmar Pagamento
</button>

// API para atualizar status
PUT /api/orders/:id/confirm
{
  "status": "paid"
}
```

### 2. Notificações

- Notificar admin quando há vendas pendentes
- Lembrete diário de vendas não confirmadas
- Dashboard com resumo de pendências

### 3. Relatório de Pendências

- Relatório específico de vendas pendentes
- Filtro por vendedor
- Filtro por data
- Exportação para Excel

---

## Exemplo de Uso

### Cenário 1: Venda com PIX

```
Vendedor: João
Cliente: Maria
Itens: 3x Carne, 2x Frango
Total: R$ 25,00
Método: PIX
Status: paid ✅
```

### Cenário 2: Venda com Pagamento Local

```
Vendedor: João
Cliente: Pedro
Itens: 5x Queijo
Total: R$ 25,00
Método: LOCAL
Status: pending ⏳
```

Depois que o cliente pagar:
```
Status: paid ✅ (após confirmação do admin)
```

---

## Requisitos Atualizados

### Requisito 3.2
**WHEN** um vendedor confirma pagamento PIX, **THE** Sistema_Pastelada **SHALL** registrar a venda com status "paid" e método "PIX"

### Requisito 3.3
**WHEN** um vendedor escolhe pagamento local, **THE** Sistema_Pastelada **SHALL** registrar a venda com status "pending" e método "LOCAL"

---

## Resumo

| Método | Status Inicial | Quando muda para "paid" |
|--------|---------------|-------------------------|
| **PIX** | `paid` | Imediatamente (já confirmado) |
| **LOCAL** | `pending` | Após confirmação do admin (futuro) |

**Status atual**: ✅ Implementado e funcionando

**Próximos passos**: Adicionar funcionalidade de confirmação de pagamento no painel admin (opcional)
