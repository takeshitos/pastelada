# 📊 Fluxo de Configuração Visual - Sistema Pastelada

## Visão Geral do Processo

```
┌─────────────────────────────────────────────────────────────┐
│                    CONFIGURAÇÃO COMPLETA                     │
│                         (30-45 min)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │   ETAPA 1: SUPABASE (Backend)           │
        │   ⏱️ 15-20 minutos                       │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │   ETAPA 2: LOCAL (Desenvolvimento)      │
        │   ⏱️ 10-15 minutos                       │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │   ETAPA 3: VERCEL (Produção)            │
        │   ⏱️ 5-10 minutos                        │
        └─────────────────────────────────────────┘
                              │
                              ▼
                    ✅ SISTEMA NO AR!
```

---

## ETAPA 1: Configurar Supabase (Backend)

### 1.1 Criar Projeto
```
supabase.com/dashboard
        │
        ▼
   New Project
        │
        ├─ Name: pastelada-sales
        ├─ Password: [senha forte]
        └─ Region: South America (São Paulo)
        │
        ▼
   Aguardar 2-3 min
        │
        ▼
   ✅ Projeto criado!
```

### 1.2 Copiar Credenciais
```
Settings > API
        │
        ├─ 📍 Project URL
        ├─ 🔑 anon public key
        └─ 🔐 service_role key
        │
        ▼
   💾 Salvar em bloco de notas
```

### 1.3 Configurar Banco de Dados
```
SQL Editor > New Query
        │
        ├─ 001_create_tables.sql    ✅ Run
        ├─ 002_create_triggers.sql  ✅ Run
        ├─ 003_setup_rls.sql        ✅ Run
        ├─ 004_setup_storage.sql    ✅ Run
        └─ 005_seed_data.sql        ✅ Run
        │
        ▼
   Verificar: 6 tabelas criadas
        │
        ▼
   ✅ Banco configurado!
```

### 1.4 Criar Admin
```
Authentication > Users
        │
        ▼
   Add user > Create new user
        │
        ├─ Email: admin@pastelada.com
        ├─ Password: [senha forte]
        └─ ✅ Auto Confirm User
        │
        ▼
   💾 Anotar email e senha
        │
        ▼
   ✅ Admin criado!
```

---

## ETAPA 2: Configurar Localmente

### 2.1 Instalar Dependências
```
Terminal na pasta do projeto
        │
        ▼
   npm install
        │
        ▼
   ⏳ Aguardar 1-2 min
        │
        ▼
   ✅ Dependências instaladas!
```

### 2.2 Configurar Variáveis
```
cp .env.local.example .env.local
        │
        ▼
   Editar .env.local
        │
        ├─ NEXT_PUBLIC_SUPABASE_URL=...
        ├─ NEXT_PUBLIC_SUPABASE_ANON_KEY=...
        └─ SUPABASE_SERVICE_ROLE_KEY=...
        │
        ▼
   💾 Salvar arquivo
        │
        ▼
   ✅ Variáveis configuradas!
```

### 2.3 Testar Sistema
```
npm run dev
        │
        ▼
   Abrir: http://localhost:3000
        │
        ├─ Testar cadastro de vendedor
        ├─ Testar login admin (/adm/login)
        └─ Configurar preço e sabores
        │
        ▼
   ✅ Sistema funcionando!
```

---

## ETAPA 3: Deploy na Vercel

### 3.1 Preparar Código
```
git status
        │
        ▼
   git add .
   git commit -m "Setup completo"
   git push origin main
        │
        ▼
   ✅ Código no Git!
```

### 3.2 Criar Projeto Vercel
```
vercel.com/dashboard
        │
        ▼
   Add New > Project
        │
        ▼
   Import Git Repository
        │
        ▼
   Selecionar repositório
        │
        ▼
   ✅ Projeto importado!
```

### 3.3 Configurar Deploy
```
Environment Variables
        │
        ├─ NEXT_PUBLIC_SUPABASE_URL
        ├─ NEXT_PUBLIC_SUPABASE_ANON_KEY
        └─ SUPABASE_SERVICE_ROLE_KEY
        │
        ▼
   Deploy
        │
        ▼
   ⏳ Aguardar 2-5 min
        │
        ▼
   🎉 Deploy completo!
        │
        ▼
   📋 Copiar URL: https://seu-projeto.vercel.app
```

### 3.4 Configurar Redirect URLs
```
Voltar ao Supabase
        │
        ▼
   Authentication > URL Configuration
        │
        ├─ Site URL: https://seu-projeto.vercel.app
        └─ Redirect URLs:
            ├─ https://seu-projeto.vercel.app/adm/login
            └─ https://seu-projeto.vercel.app/adm
        │
        ▼
   💾 Save
        │
        ▼
   ✅ URLs configuradas!
```

### 3.5 Testar Produção
```
Abrir: https://seu-projeto.vercel.app
        │
        ├─ Testar cadastro vendedor
        ├─ Testar login admin
        └─ Fazer venda de teste
        │
        ▼
   ✅ SISTEMA NO AR! 🎉
```

---

## 🔄 Fluxo de Dados do Sistema

```
┌──────────────┐
│   VENDEDOR   │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 1. Seleciona vendedor
       │ 2. Adiciona itens
       │ 3. Confirma venda
       │
       ▼
┌──────────────┐
│  NEXT.JS API │
│   (Server)   │
└──────┬───────┘
       │
       │ 4. Valida dados
       │ 5. Cria pedido
       │
       ▼
┌──────────────┐
│   SUPABASE   │
│  (Database)  │
└──────┬───────┘
       │
       │ 6. Salva no banco
       │ 7. Triggers calculam totais
       │
       ▼
┌──────────────┐
│  RELATÓRIOS  │
│    (Admin)   │
└──────────────┘
```

---

## 🗂️ Estrutura de Arquivos Importantes

```
pastelada-sales-system/
│
├── 📄 .env.local                    ← VOCÊ CRIA (local)
│   └── Credenciais do Supabase
│
├── 📁 supabase/migrations/          ← VOCÊ EXECUTA
│   ├── 001_create_tables.sql
│   ├── 002_create_triggers.sql
│   ├── 003_setup_rls.sql
│   ├── 004_setup_storage.sql
│   └── 005_seed_data.sql
│
├── 📁 docs/                         ← VOCÊ CONSULTA
���   ├── GUIA-INICIO-RAPIDO.md       ← Comece aqui!
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── QUICK-REFERENCE.md
│
└── 📁 app/                          ← Código pronto
    ├── page.tsx                     (Página inicial)
    ├── vender/                      (Tela de vendas)
    ├── vendas/                      (Histórico)
    └── adm/                         (Painel admin)
```

---

## 🎯 Checklist Rápido

### Supabase ✅
- [ ] Projeto criado
- [ ] Credenciais copiadas
- [ ] 5 migrations executadas
- [ ] Admin criado

### Local ✅
- [ ] `npm install` executado
- [ ] `.env.local` configurado
- [ ] `npm run dev` funcionando
- [ ] Sistema testado

### Vercel ✅
- [ ] Código no Git
- [ ] Projeto criado
- [ ] Variáveis configuradas
- [ ] Deploy realizado
- [ ] Redirect URLs configuradas
- [ ] Produção testada

---

## 🆘 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| ❌ "Failed to fetch" | Verificar `.env.local` |
| ❌ Login não funciona | Verificar "Auto Confirm User" |
| ❌ Tabelas não existem | Executar migrations novamente |
| ❌ Build falha | `rm -rf node_modules && npm install` |
| ❌ Imagens não carregam | Executar migration 004 |

---

## 📞 Onde Buscar Ajuda

1. **Início Rápido**: `docs/GUIA-INICIO-RAPIDO.md` ← Comece aqui!
2. **Setup Detalhado**: `docs/SETUP.md`
3. **Deploy**: `docs/DEPLOYMENT.md`
4. **Referência**: `docs/QUICK-REFERENCE.md`
5. **Checklist**: `docs/PRODUCTION-CHECKLIST.md`

---

## 🎉 Resultado Final

Após completar todas as etapas, você terá:

```
✅ Sistema funcionando localmente (http://localhost:3000)
✅ Sistema em produção (https://seu-projeto.vercel.app)
✅ Banco de dados configurado
✅ Usuário admin criado
✅ Pronto para usar!
```

---

**Tempo total**: 30-45 minutos
**Dificuldade**: Fácil (seguindo o guia)
**Resultado**: Sistema completo funcionando! 🚀
