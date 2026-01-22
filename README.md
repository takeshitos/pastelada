# Sistema Pastelada

Sistema de vendas para pastelaria construído com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## 🚀 Começar Agora

**Novo no projeto?** Siga este guia passo a passo:

### 👉 [**GUIA DE INÍCIO RÁPIDO**](docs/GUIA-INICIO-RAPIDO.md) 👈

Este guia vai te levar do zero até o sistema funcionando em **30-45 minutos**:
1. ⚙️ Configurar o Supabase (backend)
2. 💻 Configurar o projeto localmente  
3. 🌐 Fazer deploy na Vercel (produção)

### Ou siga o fluxo rápido:

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 3. Executar em desenvolvimento
npm run dev
```

📖 **Precisa de mais detalhes?** Consulte:
- [📊 Fluxo Visual de Configuração](docs/FLUXO-CONFIGURACAO.md) - Diagramas e checklist
- [📖 Guia de Setup Completo](docs/SETUP.md) - Documentação detalhada

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Testing**: Jest, React Testing Library, fast-check (Property-Based Testing)

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar apenas testes de propriedade (PBT)
npm run test:pbt

# Linting
npm run lint
```

## Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── admin/            # Componentes administrativos
│   ├── sales/            # Componentes de vendas
│   ├── ui/               # Componentes UI reutilizáveis
│   └── vendor/           # Componentes de vendedor
├── lib/                  # Utilitários e configurações
│   ├── supabase.ts       # Cliente Supabase
│   └── utils.ts          # Funções utilitárias
├── types/                # Definições TypeScript
│   ├── api.ts            # Tipos de API
│   └── database.ts       # Tipos do banco de dados
└── .kiro/specs/          # Especificações do projeto
```

## 📚 Documentação

### 🎯 Para Começar
- **[🚀 Guia de Início Rápido](docs/GUIA-INICIO-RAPIDO.md)** - **COMECE AQUI!** Passo a passo completo (30-45 min)
- **[📊 Fluxo Visual de Configuração](docs/FLUXO-CONFIGURACAO.md)** - Diagramas e checklist visual
- **[⚡ Referência Rápida](docs/QUICK-REFERENCE.md)** - Comandos e informações essenciais

### 📖 Guias Detalhados
- **[📖 Guia de Setup Completo](docs/SETUP.md)** - Instalação e configuração detalhada
- **[🚀 Guia de Deploy](docs/DEPLOYMENT.md)** - Deploy em produção na Vercel
- **[✅ Checklist de Produção](docs/PRODUCTION-CHECKLIST.md)** - Checklist completo pré e pós-deploy

### 🔧 Documentação Técnica
- **[🗄️ Configuração do Banco de Dados](docs/database-setup.md)** - Detalhes sobre migrations e estrutura
- **[🔐 Configuração Admin](docs/admin-setup.md)** - Criação de usuário administrador
- **[💳 Configuração PIX](docs/CONFIGURACAO-PIX.md)** - Upload de QR Code e configuração de chave PIX
- **[📋 Especificações do Sistema](.kiro/specs/pastelada-sales-system/)** - Requisitos, design e tarefas

## 🏗️ Arquitetura

### Funcionalidades Principais

#### Interface de Vendedor (Sem Autenticação)
- Cadastro e seleção de vendedor
- Registro de vendas com múltiplos sabores
- Processamento de pagamentos (PIX e Local)
- Visualização de histórico de vendas

#### Painel Administrativo (Com Autenticação)
- Gestão de sabores (CRUD completo)
- Gestão de vendedores
- Configuração de preços e QR Code PIX
- Relatórios e KPIs de vendas

### Segurança
- Row Level Security (RLS) no banco de dados
- APIs server-side para operações de escrita
- Autenticação Supabase apenas para administradores
- Separação clara entre chaves públicas e privadas

## 🧪 Metodologia de Desenvolvimento

Este projeto segue a metodologia de **Spec-Driven Development** com:

- **Requisitos formais** usando padrões EARS
- **Propriedades de correção** testáveis
- **Testes baseados em propriedades** (Property-Based Testing)
- **Testes unitários** complementares

Consulte `.kiro/specs/pastelada-sales-system/` para detalhes completos dos requisitos, design e tarefas de implementação.

## 🚀 Deploy

Para instruções de deploy em produção (Vercel), consulte o **[Guia de Deploy](docs/DEPLOYMENT.md)**.

### ⚠️ Problema Comum: Dados Não Atualizam no Vercel

Se após o deploy os dados não estiverem atualizando, você precisa configurar as variáveis de ambiente do Supabase no Vercel.

**📋 Siga este guia passo a passo:** [**CHECKLIST-VERCEL.md**](CHECKLIST-VERCEL.md)

**Outros recursos úteis:**
- 📖 [CONFIGURACAO-VERCEL.md](CONFIGURACAO-VERCEL.md) - Guia detalhado
- 🎯 [PROXIMOS-PASSOS.md](PROXIMOS-PASSOS.md) - Status e próximos passos
- 📊 [RESUMO-SITUACAO-ATUAL.md](RESUMO-SITUACAO-ATUAL.md) - Visão geral completa

**Verificar configuração local:**
```bash
npm run verify
```

## 🔍 Verificação de Setup

Execute o script de verificação para garantir que tudo está configurado:

```bash
node verificar-setup.js
```

Este script verifica:
- ✅ Variáveis de ambiente configuradas
- ✅ Arquivo .env.local existe
- ✅ Valores não são placeholders
- ✅ Todas as credenciais necessárias presentes