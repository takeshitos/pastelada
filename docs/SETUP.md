# Guia de Instalação e Configuração - Sistema Pastelada

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Configuração do Supabase](#configuração-do-supabase)
4. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
5. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
6. [Criação do Usuário Administrador](#criação-do-usuário-administrador)
7. [Executando o Projeto](#executando-o-projeto)
8. [Verificação da Instalação](#verificação-da-instalação)
9. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.x ou superior ([Download](https://nodejs.org/))
- **npm** 9.x ou superior (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))
- Conta no **Supabase** ([Criar conta](https://supabase.com/))

---

## Instalação

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd pastelada-sales-system
```

### 2. Instale as Dependências

```bash
npm install
```

Isso instalará todas as dependências necessárias, incluindo:
- Next.js 14
- React 18
- Supabase Client
- Tailwind CSS
- TypeScript
- Jest e fast-check (para testes)

---

## Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **New Project**
3. Preencha os dados:
   - **Name**: pastelada-sales-system (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e guarde-a
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
4. Clique em **Create new project**
5. Aguarde alguns minutos enquanto o projeto é provisionado

### 2. Obter Credenciais do Projeto

Após a criação do projeto:

1. No dashboard do Supabase, vá para **Settings** > **API**
2. Você precisará de três informações:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon/public key**: Chave pública para operações de leitura
   - **service_role key**: Chave privada para operações administrativas (⚠️ NUNCA exponha no frontend)

---

## Configuração de Variáveis de Ambiente

### 1. Criar Arquivo de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

### 2. Preencher Variáveis

Edite o arquivo `.env.local` com as credenciais obtidas do Supabase:

```env
# URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co

# Chave pública (anon key) - pode ser exposta no frontend
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Chave de serviço (service role) - NUNCA exponha no frontend
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: 
- O arquivo `.env.local` está no `.gitignore` e não deve ser commitado
- A `service_role key` tem acesso total ao banco e deve ser mantida em segredo
- Use apenas a `anon key` no código frontend

---

## Configuração do Banco de Dados

### Método 1: Via Supabase Dashboard (Recomendado para Iniciantes)

1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute cada migration na ordem, copiando e colando o conteúdo:

#### Passo 1: Criar Tabelas
```sql
-- Copie e cole o conteúdo de: supabase/migrations/001_create_tables.sql
-- Clique em "Run" ou pressione Ctrl+Enter
```

#### Passo 2: Criar Triggers
```sql
-- Copie e cole o conteúdo de: supabase/migrations/002_create_triggers.sql
-- Clique em "Run"
```

#### Passo 3: Configurar RLS
```sql
-- Copie e cole o conteúdo de: supabase/migrations/003_setup_rls.sql
-- Clique em "Run"
```

#### Passo 4: Configurar Storage
```sql
-- Copie e cole o conteúdo de: supabase/migrations/004_setup_storage.sql
-- Clique em "Run"
```

#### Passo 5: Inserir Dados Iniciais
```sql
-- Copie e cole o conteúdo de: supabase/migrations/005_seed_data.sql
-- Clique em "Run"
```

### Método 2: Via Supabase CLI (Recomendado para Desenvolvedores)

```bash
# Instalar Supabase CLI globalmente
npm install -g supabase

# Fazer login no Supabase
supabase login

# Linkar com seu projeto remoto
supabase link --project-ref SEU_PROJECT_REF

# Aplicar todas as migrations
supabase db push
```

Para encontrar o `PROJECT_REF`:
- No dashboard do Supabase, vá para **Settings** > **General**
- Copie o **Reference ID**

### Verificar Instalação do Banco

Execute no SQL Editor do Supabase:

```sql
-- Verificar tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Deve retornar: app_settings, customers, flavors, order_items, orders, vendors

-- Verificar dados iniciais
SELECT * FROM app_settings;
SELECT name, active FROM flavors ORDER BY name;
```

---

## Criação do Usuário Administrador

### Método 1: Via Supabase Dashboard (Mais Simples)

1. No dashboard do Supabase, vá para **Authentication** > **Users**
2. Clique em **Add user** > **Create new user**
3. Preencha:
   - **Email**: `admin@pastelada.com` (ou email de sua preferência)
   - **Password**: Crie uma senha forte (mínimo 8 caracteres)
   - **Auto Confirm User**: ✅ Marque esta opção
4. Clique em **Create user**

### Método 2: Via SQL Editor

```sql
-- Criar usuário admin com senha
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@pastelada.com',
  crypt('SuaSenhaForteAqui123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);
```

⚠️ **Importante**: Substitua `'SuaSenhaForteAqui123!'` por uma senha forte de sua escolha.

---

## Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em: `http://localhost:3000`

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Executar build de produção
npm start
```

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar apenas testes de propriedade (PBT)
npm run test:pbt
```

---

## Verificação da Instalação

### 1. Testar Página Inicial

1. Acesse `http://localhost:3000`
2. Você deve ver a página de seleção/cadastro de vendedores
3. Tente cadastrar um vendedor de teste

### 2. Testar Login Administrativo

1. Acesse `http://localhost:3000/adm/login`
2. Use as credenciais do administrador criado:
   - **Email**: `admin@pastelada.com`
   - **Senha**: A senha que você definiu
3. Após login bem-sucedido, você será redirecionado para o painel admin

### 3. Configurações Iniciais Recomendadas

Após o primeiro login como admin, configure:

#### a) Preço do Pastel
1. No painel admin, vá para **Configurações**
2. Ajuste o preço do pastel (padrão: R$ 5,00)
3. Clique em **Salvar**

#### b) QR Code PIX
1. Ainda em **Configurações**
2. Faça upload da imagem do QR Code PIX
3. Opcionalmente, adicione a chave PIX em texto
4. Clique em **Salvar**

#### c) Revisar Sabores
1. Vá para **Sabores**
2. Revise os sabores padrão criados
3. Adicione, edite ou desative conforme necessário

#### d) Cadastrar Vendedores
1. Vá para **Vendedores**
2. Os vendedores cadastrados via página inicial aparecerão aqui
3. Você pode editar informações ou desativar vendedores

### 4. Testar Fluxo de Venda

1. Faça logout do painel admin (ou use aba anônima)
2. Acesse `http://localhost:3000`
3. Selecione ou cadastre um vendedor
4. Acesse a tela de vendas
5. Adicione itens ao carrinho
6. Complete uma venda de teste

---

## Troubleshooting

### Erro: "Failed to fetch" ou problemas de conexão

**Causa**: Variáveis de ambiente incorretas ou Supabase não configurado

**Solução**:
1. Verifique se o arquivo `.env.local` existe e está preenchido corretamente
2. Confirme se as URLs e chaves estão corretas no dashboard do Supabase
3. Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro: "Invalid API key" ou "JWT expired"

**Causa**: Chaves do Supabase incorretas ou expiradas

**Solução**:
1. Vá para **Settings** > **API** no dashboard do Supabase
2. Copie novamente as chaves (anon key e service_role key)
3. Atualize o arquivo `.env.local`
4. Reinicie o servidor

### Erro de Login Admin: "Invalid login credentials"

**Causa**: Usuário não criado ou senha incorreta

**Solução**:
1. Verifique no Supabase: **Authentication** > **Users**
2. Confirme se o usuário existe e está com email confirmado
3. Se necessário, recrie o usuário ou redefina a senha
4. Tente fazer login novamente

### Tabelas não encontradas ou erro de SQL

**Causa**: Migrations não foram executadas corretamente

**Solução**:
1. Verifique no SQL Editor se as tabelas existem:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
2. Se as tabelas não existirem, execute as migrations novamente na ordem correta
3. Verifique se há erros no console do SQL Editor

### Erro: "Row Level Security policy violation"

**Causa**: RLS não configurado corretamente

**Solução**:
1. Execute novamente a migration `003_setup_rls.sql`
2. Verifique se as policies foram criadas:
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

### Build falha com erro de TypeScript

**Causa**: Tipos incorretos ou dependências desatualizadas

**Solução**:
```bash
# Limpar cache e reinstalar dependências
rm -rf node_modules .next
npm install

# Executar build novamente
npm run build
```

### Storage/Upload de imagens não funciona

**Causa**: Bucket não criado ou permissões incorretas

**Solução**:
1. Verifique no Supabase: **Storage** > **Buckets**
2. Confirme se o bucket `public-assets` existe
3. Execute novamente a migration `004_setup_storage.sql`
4. Verifique as policies do bucket

---

## Próximos Passos

Após a instalação e configuração completa:

1. ✅ Familiarize-se com a interface de vendedor
2. ✅ Configure preços e sabores no painel admin
3. ✅ Cadastre vendedores reais
4. ✅ Faça vendas de teste para validar o fluxo
5. ✅ Revise os relatórios administrativos
6. ✅ Prepare para deploy em produção (ver `docs/DEPLOYMENT.md`)

---

## Recursos Adicionais

- **Documentação do Banco**: `docs/database-setup.md`
- **Configuração Admin**: `docs/admin-setup.md`
- **Especificações do Sistema**: `.kiro/specs/pastelada-sales-system/`
- **Documentação Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Documentação Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

## Suporte

Para problemas ou dúvidas:
1. Consulte a seção de Troubleshooting acima
2. Revise a documentação técnica em `docs/`
3. Verifique os logs do console do navegador e do servidor
4. Consulte a documentação oficial do Supabase e Next.js
