# Sistema Pastelada

Sistema de vendas para pastelaria construído com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## Tecnologias

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Testing**: Jest, React Testing Library, fast-check (Property-Based Testing)

## Configuração do Ambiente

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.local.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Scripts Disponíveis

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

## Próximos Passos

1. Configure o banco de dados Supabase (Task 2)
2. Implemente as interfaces de vendedor (Tasks 8-10)
3. Implemente o painel administrativo (Tasks 11-13)
4. Execute os testes de propriedade conforme implementa

## Desenvolvimento

Este projeto segue a metodologia de desenvolvimento orientado por especificações (Spec-Driven Development) com:

- **Requisitos formais** usando padrões EARS
- **Propriedades de correção** testáveis
- **Testes baseados em propriedades** (Property-Based Testing)
- **Testes unitários** complementares

Consulte os arquivos em `.kiro/specs/pastelada-sales-system/` para detalhes completos dos requisitos, design e tarefas de implementação.