# Feedback Visual e Tratamento de Erros

Este documento descreve as implementações de feedback visual e tratamento de erros no Sistema Pastelada.

## Visão Geral

O sistema implementa uma estratégia abrangente de feedback visual e tratamento de erros para garantir uma experiência de usuário consistente e confiável.

## Componentes de Feedback Visual

### 1. LoadingSpinner

Componente de spinner de carregamento com três tamanhos e cores configuráveis.

**Uso:**
```tsx
import { LoadingSpinner, ButtonSpinner, LoadingOverlay } from '@/components/ui'

// Spinner padrão
<LoadingSpinner size="md" color="primary" />

// Spinner para botões
<ButtonSpinner />

// Overlay de carregamento de página inteira
<LoadingOverlay message="Processando..." />
```

**Tamanhos:** `sm`, `md`, `lg`
**Cores:** `primary`, `white`, `gray`

### 2. Toast Notifications

Sistema de notificações toast para feedback de ações do usuário.

**Uso:**
```tsx
import { useToast } from '@/components/ui'

const { showToast, ToastContainer } = useToast()

// Mostrar toast
showToast('Operação realizada com sucesso!', 'success')
showToast('Erro ao processar', 'error')
showToast('Informação importante', 'info')

// Renderizar container
<ToastContainer />
```

**Tipos:** `success`, `error`, `info`

### 3. NetworkStatus

Indicador de status de rede que mostra um banner quando o usuário está offline.

**Uso:**
```tsx
import { NetworkStatus, useNetworkStatus } from '@/components/ui'

// Componente de banner
<NetworkStatus />

// Hook para verificar status
const isOnline = useNetworkStatus()
```

### 4. RetryButton

Botão de retry com estado de carregamento para operações falhadas.

**Uso:**
```tsx
import { RetryButton, ErrorState } from '@/components/ui'

// Botão simples
<RetryButton onRetry={fetchData} error="Erro ao carregar" />

// Estado de erro completo
<ErrorState
  error="Detalhes do erro"
  onRetry={fetchData}
  title="Falha ao carregar"
  description="Não foi possível carregar os dados"
/>
```

### 5. ErrorBoundary

Componente de boundary de erro para capturar erros do React.

**Uso:**
```tsx
import { ErrorBoundary, withErrorBoundary } from '@/components/ui'

// Wrapper de componente
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// HOC
const SafeComponent = withErrorBoundary(YourComponent)
```

## Utilitários de Tratamento de Erros

### 1. Error Handler

Utilitários centralizados para tratamento de erros.

**Funções:**
- `parseError(error)` - Converte erros em formato consistente
- `getUserFriendlyErrorMessage(error)` - Retorna mensagem amigável
- `retryWithBackoff(fn, options)` - Retry com backoff exponencial
- `isNetworkError(error)` - Verifica se é erro de rede
- `isRetryableError(error)` - Verifica se erro pode ser retentado
- `logError(error, context)` - Log estruturado de erros

**Uso:**
```tsx
import { 
  parseError, 
  getUserFriendlyErrorMessage,
  retryWithBackoff 
} from '@/lib/error-handler'

try {
  await someOperation()
} catch (error) {
  const friendlyMessage = getUserFriendlyErrorMessage(error)
  showToast(friendlyMessage, 'error')
}

// Retry com backoff
await retryWithBackoff(
  () => fetchData(),
  {
    maxRetries: 3,
    initialDelay: 1000,
    onRetry: (attempt) => console.log(`Tentativa ${attempt}`)
  }
)
```

### 2. API Client

Cliente HTTP aprimorado com retry automático e tratamento de erros.

**Uso:**
```tsx
import { api } from '@/lib/api-client'

// GET request
const data = await api.get('/api/vendors')

// POST request
const result = await api.post('/api/orders', orderData)

// Com opções customizadas
const data = await api.get('/api/data', {
  retry: true,
  maxRetries: 5,
  timeout: 10000,
  onRetry: (attempt, error) => {
    console.log(`Retry attempt ${attempt}`, error)
  }
})
```

**Opções:**
- `retry` - Habilitar retry automático (padrão: true)
- `maxRetries` - Número máximo de tentativas (padrão: 3)
- `timeout` - Timeout em ms (padrão: 30000)
- `onRetry` - Callback para cada tentativa

## Padrões de Implementação

### Estados de Loading em Formulários

```tsx
const [submitting, setSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setSubmitting(true)
  
  try {
    await api.post('/api/endpoint', data)
    showToast('Sucesso!', 'success')
  } catch (error) {
    showToast(getUserFriendlyErrorMessage(error), 'error')
  } finally {
    setSubmitting(false)
  }
}

return (
  <form onSubmit={handleSubmit}>
    <input disabled={submitting} />
    <button type="submit" disabled={submitting}>
      {submitting && <ButtonSpinner />}
      Salvar
    </button>
  </form>
)
```

### Estados de Loading em Páginas

```tsx
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [data, setData] = useState([])

useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  setLoading(true)
  setError(null)
  
  try {
    const result = await api.get('/api/data')
    setData(result)
  } catch (err) {
    setError(getUserFriendlyErrorMessage(err))
  } finally {
    setLoading(false)
  }
}

if (loading) {
  return <LoadingSpinner size="lg" />
}

if (error) {
  return <ErrorState error={error} onRetry={fetchData} />
}

return <DataDisplay data={data} />
```

### Desabilitação de Botões Durante Operações

Todos os botões devem ser desabilitados durante operações assíncronas:

```tsx
<button
  onClick={handleAction}
  disabled={isLoading}
  className="
    px-4 py-2 bg-blue-600 text-white rounded-md
    hover:bg-blue-700
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  "
>
  {isLoading && <ButtonSpinner />}
  Ação
</button>
```

### Feedback em Modais

Modais devem prevenir fechamento durante operações:

```tsx
const handleClose = () => {
  if (!isLoading) {
    onClose()
  }
}

<Modal isOpen={isOpen} onClose={handleClose}>
  <form onSubmit={handleSubmit}>
    <input disabled={isLoading} />
    <button type="button" onClick={handleClose} disabled={isLoading}>
      Cancelar
    </button>
    <button type="submit" disabled={isLoading}>
      {isLoading && <ButtonSpinner />}
      Confirmar
    </button>
  </form>
</Modal>
```

## Mensagens de Erro Amigáveis

O sistema converte erros técnicos em mensagens amigáveis:

| Erro Técnico | Mensagem Amigável |
|--------------|-------------------|
| Network error / fetch failed | Erro de conexão. Verifique sua internet e tente novamente. |
| Timeout | A requisição demorou muito. Tente novamente. |
| 401/403 | Você não tem permissão para realizar esta ação. |
| 404 | Recurso não encontrado. |
| 500+ | Erro no servidor. Tente novamente mais tarde. |

## Retry Automático

O sistema implementa retry automático para erros retentáveis:

- Erros de rede
- Timeouts
- Erros 5xx do servidor
- Erro 429 (Too Many Requests)

**Configuração de Backoff:**
- Delay inicial: 1000ms
- Delay máximo: 10000ms
- Estratégia: Exponencial (2^tentativa)
- Tentativas padrão: 3

## Checklist de Implementação

Ao implementar novas funcionalidades, garanta:

- [ ] Loading spinners durante requisições
- [ ] Botões desabilitados durante submit
- [ ] Toast notifications para feedback
- [ ] Mensagens de erro amigáveis
- [ ] Retry automático para erros de rede
- [ ] Estados de loading em todas as páginas
- [ ] Prevenção de duplo clique
- [ ] Feedback visual em todas as interações
- [ ] Tratamento de erros em try/catch
- [ ] Logs de erro para debugging

## Requisitos Atendidos

Esta implementação atende aos seguintes requisitos:

- **Requisito 11.2**: Feedback visual (loading, toasts, erros)
- **Requisito 11.3**: Proteção de formulários (desabilitação de botões)
- **Error Handling Section**: Tratamento abrangente de erros

## Testes

Para testar o sistema de feedback e erros:

1. **Teste de Loading**: Verifique spinners em todas as páginas
2. **Teste de Erro**: Simule erros de rede (DevTools > Network > Offline)
3. **Teste de Retry**: Verifique retry automático em falhas
4. **Teste de Toast**: Verifique notificações em ações
5. **Teste de Duplo Clique**: Tente clicar múltiplas vezes em botões
6. **Teste de Offline**: Desconecte a internet e verifique banner

## Manutenção

Para manter o sistema de feedback:

1. Use sempre os componentes fornecidos
2. Não crie spinners customizados
3. Use o API client para requisições
4. Sempre trate erros com try/catch
5. Forneça mensagens de erro contextuais
6. Teste cenários de erro regularmente
