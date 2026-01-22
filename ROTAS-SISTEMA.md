# 🗺️ Rotas do Sistema Pastelada GOJ Imac

Documentação completa de todas as rotas (URLs) disponíveis no sistema.

---

## 📱 Páginas Públicas (Sem Autenticação)

### Home
```
URL: /
Arquivo: app/page.tsx
Descrição: Página inicial do sistema
Acesso: Público
```

### Vender
```
URL: /vender
Arquivo: app/vender/page.tsx
Descrição: Interface de vendas - seleção de vendedor e registro de vendas
Acesso: Público
Funcionalidades:
  - Seleção de vendedor
  - Adicionar sabores ao carrinho
  - Calcular total
  - Processar pagamento (PIX ou Local)
  - Registrar dados do cliente
```

### Vendas
```
URL: /vendas
Arquivo: app/vendas/page.tsx
Descrição: Histórico de vendas por vendedor
Acesso: Público
Funcionalidades:
  - Visualizar vendas do vendedor selecionado
  - Filtrar por data
  - Ver detalhes de cada venda
  - Cancelar pedidos
  - Atualizar status de pagamento
```

---

## 🔐 Páginas Administrativas (Requer Autenticação)

### Login Admin
```
URL: /adm/login
Arquivo: app/adm/login/page.tsx
Descrição: Página de login para administradores
Acesso: Público (mas leva à área restrita)
Funcionalidades:
  - Login com email e senha
  - Autenticação via Supabase
```

### Dashboard Admin
```
URL: /adm
Arquivo: app/adm/page.tsx
Descrição: Dashboard principal com estatísticas
Acesso: Requer autenticação
Funcionalidades:
  - Total de vendas (R$)
  - Total de pedidos
  - Pedidos em andamento
  - Ticket médio
  - Pedidos concluídos
  - Gráficos e KPIs
```

### Relatórios
```
URL: /adm/relatorios
Arquivo: app/adm/relatorios/page.tsx
Descrição: Relatórios detalhados de vendas
Acesso: Requer autenticação
Funcionalidades:
  - Filtrar por vendedor
  - Filtrar por sabor
  - Filtrar por data
  - Buscar por nome/telefone
  - Visualizar pedidos em andamento
  - Visualizar pedidos concluídos
  - Concluir pedidos
  - Cancelar pedidos
  - Atualizar status de pagamento
```

### Gestão de Vendedores
```
URL: /adm/vendedores
Arquivo: app/adm/vendedores/page.tsx
Descrição: CRUD de vendedores
Acesso: Requer autenticação
Funcionalidades:
  - Listar vendedores
  - Adicionar novo vendedor
  - Editar vendedor
  - Ativar/desativar vendedor
```

### Gestão de Sabores
```
URL: /adm/sabores
Arquivo: app/adm/sabores/page.tsx
Descrição: CRUD de sabores de pastel
Acesso: Requer autenticação
Funcionalidades:
  - Listar sabores
  - Adicionar novo sabor
  - Editar sabor
  - Ativar/desativar sabor
```

### Configurações
```
URL: /adm/configuracoes
Arquivo: app/adm/configuracoes/page.tsx
Descrição: Configurações do sistema
Acesso: Requer autenticação
Funcionalidades:
  - Configurar preço por unidade
  - Upload de QR Code PIX
  - Configurar chave PIX
  - Visualizar QR Code atual
```

---

## 🔌 API Routes (Backend)

### Admin Reports
```
URL: /api/admin-reports
Arquivo: app/api/admin-reports/route.ts
Método: GET
Descrição: Buscar relatórios administrativos
Parâmetros Query:
  - vendor_id (opcional): Filtrar por vendedor
  - flavor_id (opcional): Filtrar por sabor
  - start_date (opcional): Data inicial
  - end_date (opcional): Data final
  - search (opcional): Buscar por nome/telefone
  - limit (opcional): Limite de resultados (padrão: 50)
  - offset (opcional): Offset para paginação (padrão: 0)
Resposta:
  - sales: Array de vendas
  - total_count: Total de registros
```

### Flavors (Sabores)
```
URL: /api/flavors
Arquivo: app/api/flavors/route.ts
Métodos: GET, POST, PUT, DELETE
Descrição: CRUD de sabores

GET - Listar sabores
  Parâmetros: Nenhum
  Resposta: Array de sabores

POST - Criar sabor
  Body: { name: string }
  Resposta: Sabor criado

PUT - Atualizar sabor
  Body: { id: string, name?: string, is_active?: boolean }
  Resposta: Sabor atualizado

DELETE - Deletar sabor
  Body: { id: string }
  Resposta: Confirmação
```

### Orders (Pedidos)
```
URL: /api/orders
Arquivo: app/api/orders/route.ts
Métodos: GET, POST
Descrição: Gerenciar pedidos

GET - Listar pedidos
  Parâmetros Query:
    - vendor_id (opcional): Filtrar por vendedor
  Resposta: Array de pedidos

POST - Criar pedido
  Body: {
    vendor_id: string,
    customer_name: string,
    customer_phone?: string,
    payment_method: 'pix' | 'local',
    items: Array<{
      flavor_id: string,
      quantity: number,
      unit_price_cents: number
    }>
  }
  Resposta: Pedido criado
```

### Order Status
```
URL: /api/orders/[id]/status
Arquivo: app/api/orders/[id]/status/route.ts
Método: PUT
Descrição: Atualizar status do pedido
Parâmetros URL:
  - id: ID do pedido
Body: {
  status?: 'pending' | 'paid' | 'completed' | 'cancelled',
  payment_status?: 'pending' | 'paid'
}
Resposta: Pedido atualizado
```

### Settings (Configurações)
```
URL: /api/settings
Arquivo: app/api/settings/route.ts
Métodos: GET, PUT
Descrição: Gerenciar configurações do sistema

GET - Buscar configurações
  Resposta: {
    price_per_unit_cents: number,
    pix_key: string,
    qr_code_path: string
  }

PUT - Atualizar configurações
  Body: {
    price_per_unit_cents?: number,
    pix_key?: string
  }
  Resposta: Configurações atualizadas
```

### Upload QR Code
```
URL: /api/settings/upload-qr
Arquivo: app/api/settings/upload-qr/route.ts
Método: POST
Descrição: Upload de QR Code PIX
Body: FormData com arquivo de imagem
Resposta: {
  path: string (caminho do arquivo no storage)
}
```

### Vendor Sales
```
URL: /api/vendor-sales
Arquivo: app/api/vendor-sales/route.ts
Método: GET
Descrição: Buscar vendas de um vendedor específico
Parâmetros Query:
  - vendor_id (obrigatório): ID do vendedor
  - start_date (opcional): Data inicial
  - end_date (opcional): Data final
Resposta: {
  sales: Array de vendas,
  total_count: number
}
```

### Vendors (Vendedores)
```
URL: /api/vendors
Arquivo: app/api/vendors/route.ts
Métodos: GET, POST, PUT, DELETE
Descrição: CRUD de vendedores

GET - Listar vendedores
  Resposta: Array de vendedores

POST - Criar vendedor
  Body: { name: string }
  Resposta: Vendedor criado

PUT - Atualizar vendedor
  Body: { id: string, name?: string, is_active?: boolean }
  Resposta: Vendedor atualizado

DELETE - Deletar vendedor
  Body: { id: string }
  Resposta: Confirmação
```

---

## 📊 Estrutura de Rotas

### Hierarquia de Páginas

```
/                           (Home)
├── /vender                 (Interface de vendas)
├── /vendas                 (Histórico de vendas)
└── /adm                    (Área administrativa)
    ├── /adm/login          (Login)
    ├── /adm                (Dashboard)
    ├── /adm/relatorios     (Relatórios)
    ├── /adm/vendedores     (Gestão de vendedores)
    ├── /adm/sabores        (Gestão de sabores)
    └── /adm/configuracoes  (Configurações)
```

### Hierarquia de APIs

```
/api
├── /api/admin-reports              (GET)
├── /api/flavors                    (GET, POST, PUT, DELETE)
├── /api/orders                     (GET, POST)
│   └── /api/orders/[id]/status     (PUT)
├── /api/settings                   (GET, PUT)
│   └── /api/settings/upload-qr     (POST)
├── /api/vendor-sales               (GET)
└── /api/vendors                    (GET, POST, PUT, DELETE)
```

---

## 🔒 Controle de Acesso

### Rotas Públicas (Sem Autenticação)
- `/` - Home
- `/vender` - Interface de vendas
- `/vendas` - Histórico de vendas
- `/adm/login` - Login

### Rotas Protegidas (Requer Autenticação)
- `/adm` - Dashboard
- `/adm/relatorios` - Relatórios
- `/adm/vendedores` - Gestão de vendedores
- `/adm/sabores` - Gestão de sabores
- `/adm/configuracoes` - Configurações

### APIs Públicas
- `POST /api/orders` - Criar pedido
- `GET /api/flavors` - Listar sabores (apenas ativos)
- `GET /api/vendors` - Listar vendedores (apenas ativos)
- `GET /api/settings` - Buscar configurações
- `GET /api/vendor-sales` - Vendas do vendedor

### APIs Protegidas (Requer Service Role)
- `GET /api/admin-reports` - Relatórios admin
- `POST /api/flavors` - Criar sabor
- `PUT /api/flavors` - Atualizar sabor
- `DELETE /api/flavors` - Deletar sabor
- `POST /api/vendors` - Criar vendedor
- `PUT /api/vendors` - Atualizar vendedor
- `DELETE /api/vendors` - Deletar vendedor
- `PUT /api/settings` - Atualizar configurações
- `POST /api/settings/upload-qr` - Upload QR Code
- `PUT /api/orders/[id]/status` - Atualizar status

---

## 🎯 Fluxos de Navegação

### Fluxo de Venda (Vendedor)
```
1. / (Home)
   ↓
2. /vender (Selecionar vendedor)
   ↓
3. /vender (Adicionar sabores)
   ↓
4. /vender (Processar pagamento)
   ↓
5. /vendas (Ver histórico)
```

### Fluxo Administrativo
```
1. /adm/login (Login)
   ↓
2. /adm (Dashboard)
   ↓
3. /adm/relatorios (Ver relatórios)
   ou
   /adm/vendedores (Gerenciar vendedores)
   ou
   /adm/sabores (Gerenciar sabores)
   ou
   /adm/configuracoes (Configurar sistema)
```

---

## 📝 Notas Importantes

### Autenticação
- Páginas `/adm/*` (exceto `/adm/login`) requerem autenticação
- Autenticação via Supabase Auth
- Sessão persistida no navegador
- Redirecionamento automático para login se não autenticado

### APIs
- Todas as APIs retornam JSON
- APIs de escrita usam `supabaseAdmin` (service role)
- APIs de leitura pública usam `supabase` (anon key)
- Tratamento de erros padronizado

### Parâmetros de Data
- Formato: ISO 8601 (YYYY-MM-DD)
- Timezone: UTC
- Exemplo: `2026-01-22`

### Status de Pedidos
- `pending` - Pagamento pendente
- `paid` - Pago
- `completed` - Concluído
- `cancelled` - Cancelado

### Métodos de Pagamento
- `pix` - Pagamento via PIX
- `local` - Pagamento presencial

---

## 🔗 Links Úteis

- **Documentação Supabase:** https://supabase.com/docs
- **Next.js App Router:** https://nextjs.org/docs/app
- **Guia de Setup:** [docs/SETUP.md](docs/SETUP.md)
- **Guia de Deploy:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

**Última atualização:** 22/01/2026  
**Total de Páginas:** 9  
**Total de APIs:** 8 (com 10 endpoints)
