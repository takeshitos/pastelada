# Configuração do Banco de Dados - Sistema Pastelada

## Visão Geral

Este documento descreve como configurar o banco de dados PostgreSQL via Supabase para o Sistema Pastelada.

## Estrutura de Migrations

As migrations estão organizadas na pasta `supabase/migrations/`:

1. `001_create_tables.sql` - Criação das tabelas principais
2. `002_create_triggers.sql` - Funções e triggers automáticos
3. `003_setup_rls.sql` - Configuração de Row Level Security
4. `004_setup_storage.sql` - Configuração do Supabase Storage
5. `005_seed_data.sql` - Dados iniciais

## Aplicando as Migrations

### Opção 1: Via Supabase CLI (Recomendado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login no Supabase
supabase login

# Inicializar projeto local (se necessário)
supabase init

# Linkar com projeto remoto
supabase link --project-ref SEU_PROJECT_REF

# Aplicar migrations
supabase db push
```

### Opção 2: Via Dashboard do Supabase

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Execute cada migration na ordem:
   - Copie e cole o conteúdo de `001_create_tables.sql`
   - Execute
   - Repita para as demais migrations

### Opção 3: Via psql (Avançado)

```bash
# Conectar ao banco
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Executar cada migration
\i supabase/migrations/001_create_tables.sql
\i supabase/migrations/002_create_triggers.sql
\i supabase/migrations/003_setup_rls.sql
\i supabase/migrations/004_setup_storage.sql
\i supabase/migrations/005_seed_data.sql
```

## Verificação da Instalação

Execute as seguintes queries para verificar se tudo foi criado corretamente:

```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Verificar policies RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verificar bucket de storage
SELECT * FROM storage.buckets WHERE id = 'public-assets';

-- Verificar dados iniciais
SELECT * FROM app_settings;
SELECT name, active FROM flavors ORDER BY name;
```

## Estrutura das Tabelas

### vendors
- Armazena informações dos vendedores
- Campos: id, name, phone, active, created_at, updated_at

### customers
- Armazena informações dos clientes
- Campos: id, name, phone, created_at

### flavors
- Armazena sabores de pastéis
- Campos: id, name, active, created_at, updated_at

### app_settings
- Configurações globais do sistema (singleton)
- Campos: id, pastel_price_cents, pix_qr_image_path, pix_key_text, updated_at

### orders
- Armazena pedidos de venda
- Campos: id, vendor_id, customer_id, status, payment_method, total_cents, created_at

### order_items
- Itens individuais de cada pedido
- Campos: id, order_id, flavor_id, quantity, unit_price_cents, line_total_cents

## Funcionalidades Automáticas

### Triggers Implementados

1. **calculate_line_total**: Calcula automaticamente o total da linha (quantidade × preço unitário)
2. **update_order_total**: Recalcula o total do pedido quando itens são modificados
3. **update_updated_at_column**: Atualiza timestamp de modificação

### Row Level Security (RLS)

- **Leituras Públicas**: flavors ativos, app_settings, vendors ativos
- **Operações Administrativas**: Apenas service role pode modificar dados
- **Segurança**: Clientes e pedidos são privados, acessíveis apenas via API

### Storage

- **Bucket**: `public-assets` para QR codes PIX
- **Permissões**: Leitura pública, escrita apenas para admins autenticados
- **Limites**: 5MB por arquivo, apenas imagens

## Dados Iniciais

- **app_settings**: Preço padrão de R$ 5,00 (500 centavos)
- **flavors**: Sabores básicos (Carne, Frango, Queijo, Pizza, Calabresa, Palmito)

## Próximos Passos

1. Configurar variáveis de ambiente no `.env.local`
2. Criar usuário administrador (ver `docs/admin-setup.md`)
3. Testar conexão com o banco via aplicação
4. Configurar preços e QR code PIX no painel admin