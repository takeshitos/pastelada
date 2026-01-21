# Guia de Referência Rápida - Sistema Pastelada

## 🚀 Comandos Essenciais

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes
npm test

# Executar testes em watch mode
npm run test:watch

# Executar apenas testes de propriedade
npm run test:pbt

# Linting
npm run lint
```

### Produção
```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Testar build localmente
npm run build && npm start
```

### Supabase CLI
```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Linkar projeto
supabase link --project-ref SEU_PROJECT_REF

# Aplicar migrations
supabase db push

# Backup do banco
supabase db dump -f backup.sql
```

### Vercel CLI
```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs
```

---

## 📁 Estrutura de Arquivos

```
pastelada-sales-system/
├── app/                          # Next.js App Router
│   ├── adm/                      # Painel administrativo
│   │   ├── configuracoes/        # Gestão de configurações
│   │   ├── login/                # Login admin
│   │   ├── relatorios/           # Relatórios
│   │   ├── sabores/              # Gestão de sabores
│   │   └── vendedores/           # Gestão de vendedores
│   ├── api/                      # API Routes
│   │   ├── admin-reports/        # API de relatórios
│   │   ├── flavors/              # API de sabores
│   │   ├── orders/               # API de pedidos
│   │   ├── settings/             # API de configurações
│   │   ├── vendor-sales/         # API de vendas do vendedor
│   │   └── vendors/              # API de vendedores
│   ├── vendas/                   # Histórico de vendas
│   ├── vender/                   # Tela de vendas
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Página inicial
├── components/                   # Componentes React
│   ├── admin/                    # Componentes admin
│   ├── layouts/                  # Layouts reutilizáveis
│   ├── sales/                    # Componentes de vendas
│   ├── ui/                       # Componentes UI base
│   └── vendor/                   # Componentes de vendedor
├── docs/                         # Documentação
│   ├── SETUP.md                  # Guia de instalação
│   ├── DEPLOYMENT.md             # Guia de deploy
│   ├── PRODUCTION-CHECKLIST.md   # Checklist de produção
│   ├── QUICK-REFERENCE.md        # Este arquivo
│   ├── admin-setup.md            # Setup de admin
│   └── database-setup.md         # Setup do banco
├── lib/                          # Utilitários
│   ├── api-client.ts             # Cliente de API
│   ├── error-handler.ts          # Tratamento de erros
│   ├── hooks.ts                  # React hooks customizados
│   ├── supabase.ts               # Cliente Supabase
│   └── utils.ts                  # Funções utilitárias
├── supabase/migrations/          # Migrations do banco
│   ├── 001_create_tables.sql     # Criação de tabelas
│   ├── 002_create_triggers.sql   # Triggers e funções
│   ├── 003_setup_rls.sql         # Row Level Security
│   ├── 004_setup_storage.sql     # Configuração de storage
│   └── 005_seed_data.sql         # Dados iniciais
├── types/                        # Tipos TypeScript
│   ├── api.ts                    # Tipos de API
│   ├── components.ts             # Tipos de componentes
│   ├── database.ts               # Tipos do banco
│   └── supabase.ts               # Tipos do Supabase
├── .env.local.example            # Template de variáveis (dev)
├── .env.production.example       # Template de variáveis (prod)
├── .gitignore                    # Arquivos ignorados pelo Git
├── .vercelignore                 # Arquivos ignorados pela Vercel
├── next.config.js                # Configuração do Next.js
├── package.json                  # Dependências e scripts
├── README.md                     # Documentação principal
├── tailwind.config.js            # Configuração do Tailwind
├── tsconfig.json                 # Configuração do TypeScript
└── vercel.json                   # Configuração da Vercel
```

---

## 🔑 Variáveis de Ambiente

### Desenvolvimento (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Produção (Vercel Dashboard)
Mesmas variáveis, configuradas em: Settings > Environment Variables

**Onde encontrar no Supabase:**
- Dashboard > Settings > API
- Project URL = NEXT_PUBLIC_SUPABASE_URL
- anon/public = NEXT_PUBLIC_SUPABASE_ANON_KEY
- service_role = SUPABASE_SERVICE_ROLE_KEY

---

## 🗄️ Banco de Dados

### Tabelas Principais
- **vendors**: Vendedores do sistema
- **customers**: Clientes que compram
- **flavors**: Sabores de pastéis
- **app_settings**: Configurações globais (singleton)
- **orders**: Pedidos de venda
- **order_items**: Itens de cada pedido

### Queries Úteis

#### Verificar estrutura
```sql
-- Listar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Ver estrutura de uma tabela
\d orders
```

#### Dados de configuração
```sql
-- Ver configurações atuais
SELECT * FROM app_settings;

-- Atualizar preço (em centavos)
UPDATE app_settings SET pastel_price_cents = 600 WHERE id = 1;
```

#### Vendas
```sql
-- Total de vendas hoje
SELECT COUNT(*), SUM(total_cents) 
FROM orders 
WHERE DATE(created_at) = CURRENT_DATE;

-- Vendas por vendedor
SELECT v.name, COUNT(o.id) as total_vendas, SUM(o.total_cents) as total_valor
FROM vendors v
LEFT JOIN orders o ON v.id = o.vendor_id
GROUP BY v.id, v.name
ORDER BY total_valor DESC;

-- Sabores mais vendidos
SELECT f.name, SUM(oi.quantity) as total_vendido
FROM flavors f
JOIN order_items oi ON f.id = oi.flavor_id
GROUP BY f.id, f.name
ORDER BY total_vendido DESC;
```

#### Manutenção
```sql
-- Desativar vendedor
UPDATE vendors SET active = false WHERE id = 'uuid-aqui';

-- Desativar sabor
UPDATE flavors SET active = false WHERE name = 'Nome do Sabor';

-- Limpar vendas de teste (CUIDADO!)
DELETE FROM orders WHERE created_at < '2024-01-01';
```

---

## 🔐 Segurança

### Boas Práticas
- ✅ Nunca commitar `.env.local`
- ✅ Usar `NEXT_PUBLIC_` apenas para dados públicos
- ✅ `SERVICE_ROLE_KEY` apenas no servidor
- ✅ RLS ativo em todas as tabelas
- ✅ Validação de dados nas APIs
- ✅ HTTPS em produção (automático na Vercel)

### Criar Usuário Admin
```sql
-- Via SQL Editor do Supabase
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@pastelada.com',
  crypt('SuaSenhaAqui', gen_salt('bf')),
  now(), now(), now()
);
```

Ou via Dashboard: Authentication > Users > Add user

---

## 🐛 Troubleshooting Rápido

### Build Falha
```bash
# Limpar e reinstalar
rm -rf node_modules .next
npm install
npm run build
```

### Erro de Conexão com Supabase
1. Verificar variáveis de ambiente
2. Confirmar URLs e chaves no dashboard
3. Reiniciar servidor de desenvolvimento

### Erro de RLS
```sql
-- Verificar policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Reexecutar migration de RLS
-- Copiar e colar: supabase/migrations/003_setup_rls.sql
```

### Imagens Não Carregam
1. Verificar bucket 'public-assets' existe
2. Confirmar permissões públicas
3. Testar URL da imagem diretamente

### Login Admin Não Funciona
1. Verificar usuário existe: Authentication > Users
2. Confirmar email está confirmado
3. Testar credenciais
4. Verificar redirect URLs no Supabase

---

## 📊 URLs Importantes

### Desenvolvimento
- **App**: http://localhost:3000
- **Vendas**: http://localhost:3000/vender
- **Admin**: http://localhost:3000/adm/login

### Produção
- **App**: https://seu-dominio.vercel.app
- **Vendas**: https://seu-dominio.vercel.app/vender
- **Admin**: https://seu-dominio.vercel.app/adm/login

### Dashboards
- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://supabase.com/dashboard

---

## 📞 Recursos e Suporte

### Documentação do Projeto
- [Setup Completo](./SETUP.md)
- [Guia de Deploy](./DEPLOYMENT.md)
- [Checklist de Produção](./PRODUCTION-CHECKLIST.md)
- [Setup do Banco](./database-setup.md)
- [Setup Admin](./admin-setup.md)

### Documentação Externa
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Vercel](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Status das Plataformas
- [Vercel Status](https://www.vercel-status.com/)
- [Supabase Status](https://status.supabase.com/)

---

## 🎯 Fluxos Principais

### Fluxo de Venda
1. Vendedor acessa página inicial
2. Seleciona/cadastra seu nome
3. Acessa tela de vendas
4. Adiciona itens ao carrinho
5. Clica em "Salvar pedido"
6. Preenche dados do cliente
7. Escolhe método de pagamento
8. Confirma venda
9. Venda registrada no banco

### Fluxo Administrativo
1. Admin acessa /adm/login
2. Faz login com email/senha
3. Acessa painel administrativo
4. Gerencia sabores, vendedores, configurações
5. Visualiza relatórios e KPIs
6. Faz logout

### Fluxo de Deploy
1. Desenvolver e testar localmente
2. Commit e push para Git
3. Configurar projeto na Vercel
4. Adicionar variáveis de ambiente
5. Deploy automático
6. Testar em produção
7. Configurar sistema (preços, sabores, etc)

---

## 💡 Dicas Úteis

### Performance
- Use `npm run build` para verificar tamanho dos bundles
- Monitore Core Web Vitals no Vercel Analytics
- Otimize imagens antes de fazer upload

### Desenvolvimento
- Use React DevTools para debug
- Verifique console do navegador para erros
- Use Supabase logs para debug de queries

### Produção
- Sempre teste build local antes de deploy
- Configure alertas de erro
- Faça backups regulares do banco
- Monitore uso de recursos

---

**Última atualização**: Janeiro 2025
