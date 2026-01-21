# 🚀 Guia de Início Rápido - Sistema Pastelada

## Visão Geral

Este guia vai te levar do zero até o sistema funcionando em **3 etapas principais**:
1. ⚙️ Configurar o Supabase (backend)
2. 💻 Configurar o projeto localmente
3. 🌐 Fazer deploy na Vercel (produção)

**Tempo estimado**: 30-45 minutos

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:
- [ ] Node.js 18+ instalado ([baixar aqui](https://nodejs.org/))
- [ ] Conta no Supabase ([criar aqui](https://supabase.com/))
- [ ] Conta no Vercel ([criar aqui](https://vercel.com/signup))
- [ ] Git instalado
- [ ] Código do projeto no seu computador

---

## ETAPA 1: Configurar o Supabase (Backend)

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `pastelada-sales` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e **ANOTE EM LUGAR SEGURO**
   - **Region**: Escolha `South America (São Paulo)` para melhor performance no Brasil
4. Clique em **"Create new project"**
5. ⏳ Aguarde 2-3 minutos enquanto o projeto é criado

### 1.2 Copiar Credenciais do Supabase

Após o projeto ser criado:

1. No menu lateral, vá em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Você verá 3 informações importantes:

```
📍 Project URL:
https://xxxxxxxxxxxxx.supabase.co

🔑 anon public (public key):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...

🔐 service_role (secret key):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
```

**⚠️ IMPORTANTE**: Copie essas 3 informações para um bloco de notas. Você vai precisar delas!

### 1.3 Configurar o Banco de Dados

Agora vamos criar as tabelas do sistema:

1. No menu lateral do Supabase, clique em **SQL Editor**
2. Clique em **"New query"**

#### Passo 1: Criar Tabelas

Copie TODO o conteúdo do arquivo `supabase/migrations/001_create_tables.sql` e cole no editor SQL.

Clique em **"Run"** (ou pressione `Ctrl+Enter`)

✅ Você deve ver: "Success. No rows returned"

#### Passo 2: Criar Triggers

Clique em **"New query"** novamente.

Copie TODO o conteúdo do arquivo `supabase/migrations/002_create_triggers.sql` e cole no editor.

Clique em **"Run"**

✅ Você deve ver: "Success. No rows returned"

#### Passo 3: Configurar Segurança (RLS)

Clique em **"New query"** novamente.

Copie TODO o conteúdo do arquivo `supabase/migrations/003_setup_rls.sql` e cole no editor.

Clique em **"Run"**

✅ Você deve ver: "Success. No rows returned"

#### Passo 4: Configurar Storage

Clique em **"New query"** novamente.

Copie TODO o conteúdo do arquivo `supabase/migrations/004_setup_storage.sql` e cole no editor.

Clique em **"Run"**

✅ Você deve ver: "Success. No rows returned"

#### Passo 5: Inserir Dados Iniciais

Clique em **"New query"** novamente.

Copie TODO o conteúdo do arquivo `supabase/migrations/005_seed_data.sql` e cole no editor.

Clique em **"Run"**

✅ Você deve ver: "Success. No rows returned"

### 1.4 Verificar se Deu Certo

No SQL Editor, execute esta query:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Você deve ver estas 6 tabelas:
- app_settings
- customers
- flavors
- order_items
- orders
- vendors

✅ **Se viu as 6 tabelas, o banco está configurado!**

### 1.5 Criar Usuário Administrador

Ainda no Supabase:

1. No menu lateral, clique em **Authentication**
2. Clique em **Users**
3. Clique em **"Add user"** > **"Create new user"**
4. Preencha:
   - **Email**: `admin@pastelada.com` (ou seu email)
   - **Password**: Crie uma senha forte (você vai usar para fazer login)
   - **Auto Confirm User**: ✅ **MARQUE ESTA OPÇÃO**
5. Clique em **"Create user"**

**⚠️ ANOTE**: Email e senha do admin - você vai precisar!

✅ **Etapa 1 completa! Supabase configurado!**

---

## ETAPA 2: Configurar o Projeto Localmente

### 2.1 Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

⏳ Aguarde a instalação (pode levar 1-2 minutos)

### 2.2 Configurar Variáveis de Ambiente

1. Na pasta do projeto, copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

2. Abra o arquivo `.env.local` em um editor de texto

3. Cole as credenciais que você copiou do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE**: 
- Substitua os valores pelos seus (que você copiou na Etapa 1.2)
- Não deixe espaços antes ou depois dos valores
- Salve o arquivo

### 2.3 Testar Localmente

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Você deve ver:

```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 2.4 Verificar se Está Funcionando

1. Abra o navegador em: `http://localhost:3000`

2. Você deve ver a página inicial com:
   - Formulário para cadastrar vendedor
   - Lista de vendedores (vazia no início)

3. **Teste o cadastro de vendedor**:
   - Digite um nome (ex: "João Silva")
   - Digite um telefone (ex: "11999999999")
   - Clique em "Cadastrar"
   - O vendedor deve aparecer na lista

4. **Teste o login admin**:
   - Acesse: `http://localhost:3000/adm/login`
   - Use o email e senha que você criou na Etapa 1.5
   - Clique em "Entrar"
   - Você deve ser redirecionado para o painel admin

✅ **Se tudo funcionou, o sistema está rodando localmente!**

### 2.5 Configurar o Sistema (Primeira Vez)

Agora que está logado como admin:

#### a) Configurar Preço

1. No painel admin, clique em **"Configurações"**
2. Ajuste o preço do pastel (ex: R$ 5,00)
3. Clique em **"Salvar Configurações"**

#### b) Adicionar QR Code PIX (Opcional)

1. Ainda em Configurações
2. Clique em **"Escolher arquivo"** e selecione uma imagem do QR Code PIX
3. Adicione a chave PIX em texto (opcional)
4. Clique em **"Salvar Configurações"**

#### c) Revisar Sabores

1. Clique em **"Sabores"** no menu
2. Você verá os sabores padrão (Carne, Frango, Queijo, etc.)
3. Adicione, edite ou desative conforme necessário

✅ **Etapa 2 completa! Sistema funcionando localmente!**

---

## ETAPA 3: Deploy na Vercel (Produção)

### 3.1 Preparar o Código

1. Certifique-se de que o código está no Git:

```bash
# Verificar status
git status

# Se houver alterações, commitar
git add .
git commit -m "Configuração inicial completa"
git push origin main
```

2. Seu código deve estar em um repositório (GitHub, GitLab ou Bitbucket)

### 3.2 Criar Projeto na Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New"** > **"Project"**
3. Clique em **"Import Git Repository"**
4. Selecione seu repositório do projeto
5. Clique em **"Import"**

### 3.3 Configurar o Projeto

Na tela de configuração:

1. **Framework Preset**: Next.js (já detectado automaticamente)
2. **Root Directory**: `.` (deixe como está)
3. **Build Command**: `npm run build` (deixe como está)
4. **Output Directory**: `.next` (deixe como está)

### 3.4 Adicionar Variáveis de Ambiente

**IMPORTANTE**: Role para baixo até a seção **"Environment Variables"**

Adicione as 3 variáveis (uma por vez):

1. **Primeira variável**:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Cole a URL do seu projeto Supabase
   - Clique em **"Add"**

2. **Segunda variável**:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Cole a anon key do Supabase
   - Clique em **"Add"**

3. **Terceira variável**:
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Cole a service_role key do Supabase
   - Clique em **"Add"**

### 3.5 Fazer Deploy

1. Clique em **"Deploy"**
2. ⏳ Aguarde 2-5 minutos enquanto o build é feito
3. Você verá uma animação de confete quando terminar! 🎉

### 3.6 Configurar URLs no Supabase

Após o deploy, você receberá uma URL tipo: `https://seu-projeto.vercel.app`

Volte ao Supabase:

1. Vá em **Authentication** > **URL Configuration**
2. Em **Site URL**, cole: `https://seu-projeto.vercel.app`
3. Em **Redirect URLs**, adicione:
   - `https://seu-projeto.vercel.app/adm/login`
   - `https://seu-projeto.vercel.app/adm`
4. Clique em **"Save"**

### 3.7 Testar em Produção

1. Acesse a URL do seu projeto: `https://seu-projeto.vercel.app`
2. Teste o cadastro de vendedor
3. Teste o login admin: `https://seu-projeto.vercel.app/adm/login`
4. Faça uma venda de teste completa

✅ **Etapa 3 completa! Sistema no ar em produção!**

---

## 🎉 Parabéns! Sistema Implementado!

Seu sistema está funcionando! Agora você pode:

### Próximos Passos

1. **Cadastrar vendedores reais**
   - Acesse a página inicial
   - Cadastre cada vendedor

2. **Configurar sabores específicos**
   - Entre no painel admin
   - Ajuste os sabores conforme seu negócio

3. **Treinar a equipe**
   - Mostre como fazer vendas
   - Mostre como visualizar histórico

4. **Monitorar o sistema**
   - Acesse relatórios regularmente
   - Acompanhe vendas e KPIs

---

## 🆘 Problemas Comuns

### "Failed to fetch" ou erro de conexão

**Solução**: Verifique se as variáveis de ambiente estão corretas:
- No local: arquivo `.env.local`
- Na Vercel: Settings > Environment Variables

### Login admin não funciona

**Solução**: 
1. Verifique se marcou "Auto Confirm User" ao criar o usuário
2. Tente resetar a senha no Supabase
3. Verifique se as redirect URLs estão configuradas

### Imagens não carregam

**Solução**: Verifique se executou a migration `004_setup_storage.sql`

### Tabelas não encontradas

**Solução**: Execute todas as migrations novamente na ordem (001 a 005)

---

## 📞 Recursos Úteis

- **Documentação Completa**: [docs/SETUP.md](./SETUP.md)
- **Guia de Deploy**: [docs/DEPLOYMENT.md](./DEPLOYMENT.md)
- **Referência Rápida**: [docs/QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
- **Checklist de Produção**: [docs/PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md)

---

## ✅ Checklist Final

Marque conforme completa:

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas
- [ ] Banco de dados configurado (5 migrations)
- [ ] Usuário admin criado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env.local` configurado
- [ ] Sistema testado localmente
- [ ] Preço e sabores configurados
- [ ] Código no Git
- [ ] Projeto criado na Vercel
- [ ] Variáveis de ambiente na Vercel
- [ ] Deploy realizado
- [ ] Redirect URLs configuradas no Supabase
- [ ] Sistema testado em produção

---

**Última atualização**: Janeiro 2025

**Dúvidas?** Consulte a documentação completa em `docs/`
