# Documento de Design - Sistema Pastelada

## Overview

O Sistema Pastelada é uma aplicação web full-stack para gerenciamento de vendas de pastelaria, construída com Next.js 14 (App Router) + TypeScript + Tailwind CSS no frontend e Supabase (PostgreSQL + Auth + Storage) no backend. O sistema oferece duas interfaces principais: uma interface simplificada para vendedores (sem autenticação por senha) e um painel administrativo completo com autenticação segura.

A arquitetura prioriza segurança através de APIs server-side para operações de escrita, Row Level Security (RLS) no banco de dados, e separação clara entre funcionalidades de vendedor e administrador.

## Architecture

### Frontend Architecture
- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript para type safety
- **Styling**: Tailwind CSS para design responsivo
- **State Management**: React hooks + localStorage para sessão de vendedor
- **Autenticação**: Supabase Auth apenas para administradores

### Backend Architecture
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth (apenas admin)
- **Storage**: Supabase Storage para QR codes PIX
- **Security**: Row Level Security (RLS) + API server-side
- **API**: Next.js Route Handlers com service role key

### Security Model
- **Vendedores**: Sem autenticação por senha, identificação por seleção + localStorage
- **Administradores**: Autenticação completa via Supabase Auth
- **Operações de Escrita**: Apenas via API server-side com validação
- **Operações de Leitura**: Anonymous key para dados públicos (sabores, preços)

## Components and Interfaces

### Core Components

#### 1. Vendor Management
- `VendorSelector`: Componente para seleção/cadastro de vendedores
- `VendorForm`: Formulário de cadastro com validação
- `VendorList`: Lista de vendedores ativos

#### 2. Sales Interface
- `SalesCart`: Carrinho de compras com cálculo dinâmico
- `FlavorSelector`: Seleção de sabores com controle de quantidade
- `CustomerForm`: Coleta de dados do cliente
- `PaymentSelector`: Escolha do método de pagamento
- `PIXModal`: Modal com QR code e confirmação PIX

#### 3. Admin Panel
- `AdminLayout`: Layout protegido com autenticação
- `FlavorManager`: CRUD de sabores
- `VendorManager`: Gerenciamento de vendedores
- `SettingsManager`: Configuração de preços e PIX
- `ReportsView`: Relatórios e KPIs

#### 4. Shared Components
- `Toast`: Notificações de feedback
- `LoadingSpinner`: Estados de carregamento
- `Modal`: Componente modal reutilizável
- `Table`: Tabela responsiva com paginação

### API Interfaces

#### POST /api/orders
```typescript
interface CreateOrderRequest {
  vendor_id: string;
  customer: {
    name: string;
    phone?: string;
  };
  items: Array<{
    flavor_id: string;
    quantity: number;
  }>;
  payment_method: 'PIX' | 'LOCAL';
  mark_as_paid: boolean;
}

interface CreateOrderResponse {
  order_id: string;
  total_cents: number;
  status: string;
  items: Array<{
    flavor_name: string;
    quantity: number;
    line_total_cents: number;
  }>;
}
```

#### GET /api/vendor-sales
```typescript
interface VendorSalesRequest {
  vendor_id: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

interface VendorSalesResponse {
  sales: Array<{
    id: string;
    created_at: string;
    total_cents: number;
    payment_method: string;
    status: string;
    customer_name: string;
    items: Array<{
      flavor_name: string;
      quantity: number;
      line_total_cents: number;
    }>;
  }>;
  total_count: number;
}
```

## Data Models

### Database Schema

#### vendors
```sql
CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

#### customers
```sql
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

#### flavors
```sql
CREATE TABLE flavors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

#### app_settings
```sql
CREATE TABLE app_settings (
  id int PRIMARY KEY DEFAULT 1,
  pastel_price_cents int NOT NULL DEFAULT 0,
  pix_qr_image_path text,
  pix_key_text text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

#### orders
```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id),
  customer_id uuid REFERENCES customers(id),
  status text NOT NULL DEFAULT 'created',
  payment_method text NOT NULL DEFAULT 'LOCAL',
  total_cents int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

#### order_items
```sql
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  flavor_id uuid NOT NULL REFERENCES flavors(id),
  quantity int NOT NULL CHECK (quantity > 0),
  unit_price_cents int NOT NULL DEFAULT 0,
  line_total_cents int NOT NULL DEFAULT 0
);
```

### Triggers and Functions

#### Automatic Calculations
```sql
-- Trigger para calcular line_total_cents
CREATE OR REPLACE FUNCTION calculate_line_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.line_total_cents = NEW.quantity * NEW.unit_price_cents;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para recalcular order total
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders 
  SET total_cents = (
    SELECT COALESCE(SUM(line_total_cents), 0)
    FROM order_items 
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
  )
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Baseando-me na análise de prework dos critérios de aceitação, identifiquei as seguintes propriedades de correção:

### Property Reflection

Após revisar todas as propriedades identificadas no prework, identifiquei algumas redundâncias que podem ser consolidadas:

- Propriedades 3.2 e 3.3 (registro de vendas PIX e LOCAL) podem ser combinadas em uma propriedade mais abrangente sobre persistência de vendas
- Propriedades 5.3 e 7.3 (desativação de sabores e vendedores) seguem o mesmo padrão e podem ser generalizadas
- Propriedades de validação (1.2, 1.5, 2.5) podem ser agrupadas em uma propriedade de validação de entrada
- Propriedades de formatação (4.2, 4.5) podem ser combinadas em uma propriedade de formatação de dados

### Correctness Properties

**Property 1: Vendor name validation**
*For any* string input for vendor name, if the string has 2 or more characters, the system should accept the vendor registration
**Validates: Requirements 1.2**

**Property 2: Vendor selection and session management**
*For any* active vendor selected from the list, the system should save vendor information to local storage and redirect to sales page
**Validates: Requirements 1.3**

**Property 3: Access control for sales page**
*For any* attempt to access the sales page without a logged vendor, the system should redirect to the home page
**Validates: Requirements 1.4**

**Property 4: Input validation consistency**
*For any* input field (phone numbers, quantities), the system should validate according to specified rules (phone: numbers only, quantities: > 0)
**Validates: Requirements 1.5, 2.5**

**Property 5: Dynamic total calculation**
*For any* change in item quantities, the system should recalculate the order total automatically and correctly (total = sum of quantity × price for each item)
**Validates: Requirements 2.2**

**Property 6: Order persistence with correct attributes**
*For any* completed order, the system should persist the order with correct payment method, status, and total values matching the payment choice
**Validates: Requirements 3.2, 3.3, 3.5**

**Property 7: Vendor-specific data filtering**
*For any* vendor accessing their sales history, the system should display only orders belonging to that specific vendor
**Validates: Requirements 4.1**

**Property 8: Sales data formatting consistency**
*For any* displayed sale record, the system should include all required fields (date/time, total, payment method, status, items) with proper formatting
**Validates: Requirements 4.2, 4.5**

**Property 9: Date range filtering**
*For any* applied date filter, the system should return only sales within the specified time period
**Validates: Requirements 4.3**

**Property 10: Flavor management integrity**
*For any* flavor modification (edit, deactivate), the system should maintain data integrity and hide deactivated flavors from sales while preserving historical data
**Validates: Requirements 5.2, 5.3**

**Property 11: Flavor name uniqueness**
*For any* active flavor, the system should enforce unique names among all active flavors
**Validates: Requirements 5.5**

**Property 12: Price change propagation**
*For any* price update by admin, the system should apply the new price to all future sales while maintaining historical pricing for past orders
**Validates: Requirements 6.1**

**Property 13: Currency conversion consistency**
*For any* monetary value, the system should consistently convert between reais and centavos (1 real = 100 centavos) for internal storage and display
**Validates: Requirements 6.4**

**Property 14: Configuration singleton**
*For any* system configuration, there should be exactly one active global configuration at any time
**Validates: Requirements 6.5**

**Property 15: Vendor management with history preservation**
*For any* vendor deactivation, the system should prevent new logins while maintaining all historical sales data
**Validates: Requirements 7.3, 7.4**

**Property 16: Report filtering accuracy**
*For any* applied filter in reports (by flavor, vendor, or period), the system should return only data matching all specified criteria
**Validates: Requirements 8.2**

**Property 17: KPI calculation correctness**
*For any* report generation, calculated KPIs (total sales, total pastries, flavor rankings) should accurately reflect the filtered dataset
**Validates: Requirements 8.3**

**Property 18: Admin authentication enforcement**
*For any* attempt to access admin routes without authentication, the system should redirect to login page
**Validates: Requirements 9.1**

**Property 19: Authentication state consistency**
*For any* valid admin credentials, the system should grant access to all admin functionalities consistently
**Validates: Requirements 9.2, 9.3**

**Property 20: API validation completeness**
*For any* order creation request, the system should validate vendor existence, item validity, and data completeness before processing
**Validates: Requirements 10.1**

**Property 21: Database calculation automation**
*For any* order item modification, database triggers should automatically recalculate line totals and order totals correctly
**Validates: Requirements 10.5**

**Property 22: Responsive layout adaptation**
*For any* screen size, the system should adapt the layout appropriately while maintaining functionality
**Validates: Requirements 11.1**

**Property 23: User feedback consistency**
*For any* user interaction, the system should provide appropriate visual feedback (loading states, success/error messages)
**Validates: Requirements 11.2**

**Property 24: Form submission protection**
*For any* form submission, the system should disable submit buttons during processing to prevent duplicate submissions
**Validates: Requirements 11.3**

## Error Handling

### Client-Side Error Handling
- **Network Errors**: Retry mechanism with exponential backoff
- **Validation Errors**: Real-time feedback with clear error messages
- **Authentication Errors**: Automatic redirect to appropriate login page
- **Storage Errors**: Graceful degradation with user notification

### Server-Side Error Handling
- **Database Errors**: Transaction rollback with detailed logging
- **Validation Errors**: Structured error responses with field-specific messages
- **Authentication Errors**: Proper HTTP status codes and secure error messages
- **File Upload Errors**: Size and type validation with user-friendly messages

### Error Response Format
```typescript
interface ErrorResponse {
  error: true;
  message: string;
  code: string;
  details?: Record<string, string>;
}
```

## Testing Strategy

### Dual Testing Approach

O sistema utilizará uma abordagem dupla de testes para garantir correção e robustez:

#### Unit Testing
- **Framework**: Jest + React Testing Library
- **Scope**: Componentes individuais, funções utilitárias, API routes
- **Focus**: Casos específicos, edge cases, integração entre componentes
- **Examples**: 
  - Teste de validação de formulário com dados específicos
  - Teste de cálculo de total com valores conhecidos
  - Teste de redirecionamento com estados específicos

#### Property-Based Testing
- **Framework**: fast-check (JavaScript/TypeScript)
- **Configuration**: Mínimo de 100 iterações por propriedade
- **Scope**: Propriedades universais que devem valer para todos os inputs válidos
- **Tagging**: Cada teste será marcado com comentário referenciando a propriedade do design

**Exemplo de tag obrigatória:**
```typescript
// **Feature: pastelada-sales-system, Property 5: Dynamic total calculation**
```

#### Complementaridade dos Testes
- **Unit tests**: Capturam bugs concretos e verificam comportamentos específicos
- **Property tests**: Verificam correção geral através de muitos inputs aleatórios
- **Juntos**: Fornecem cobertura abrangente - unit tests para casos conhecidos, property tests para descobrir casos não previstos

### Test Requirements
- Cada propriedade de correção DEVE ser implementada por UM ÚNICO teste property-based
- Testes property-based DEVEM rodar no mínimo 100 iterações
- Cada teste DEVE incluir tag explícita referenciando a propriedade do design
- Unit tests e property tests são complementares e ambos DEVEM ser incluídos
- Testes DEVEM focar na lógica funcional principal e casos edge importantes