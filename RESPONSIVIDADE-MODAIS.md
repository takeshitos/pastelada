# Melhorias de Responsividade - Modais

## Alterações Implementadas

### 1. Modal Base (components/ui/Modal.tsx)
✅ Padding responsivo: `p-2 sm:p-4` no overlay
✅ Altura máxima: `max-h-[95vh]` com scroll interno
✅ Overflow-y-auto no overlay e no modal
✅ Header sticky com `sticky top-0`
✅ Padding do header: `p-3 sm:p-4`
✅ Padding do conteúdo: `p-3 sm:p-4`
✅ Título responsivo: `text-base sm:text-lg`

### 2. PIXModal (components/sales/PIXModal.tsx)
- Espaçamento: `space-y-4 sm:space-y-6`
- QR Code: `w-40 h-40 sm:w-48 sm:h-48`
- Padding dos cards: `p-3 sm:p-4`
- Texto responsivo: `text-xs sm:text-sm` e `text-sm sm:text-base`
- Botões empilhados em mobile: `flex-col sm:flex-row`
- Chave PIX: layout vertical em mobile

### 3. PaymentModal
- Espaçamento responsivo
- Botões de pagamento adaptados

### 4. CustomerModal
- Já está bom, mas pode melhorar espaçamento

### 5. OrderSuccessModal
- Verificar e ajustar se necessário
