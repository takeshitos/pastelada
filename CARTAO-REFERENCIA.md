# 📇 Cartão de Referência Rápida

**Sistema Pastelada GOJ Imac** | Versão 1.0 | 22/01/2026

---

## 🔗 Links Importantes

| Serviço | URL |
|---------|-----|
| **Supabase** | https://app.supabase.com |
| **Vercel** | https://vercel.com/dashboard |
| **Site Produção** | [seu-site].vercel.app |

---

## 🔑 Variáveis de Ambiente (Vercel)

```env
NEXT_PUBLIC_SUPABASE_URL=https://[projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Onde encontrar:** Supabase → Settings → API

---

## 📂 Estrutura de Páginas

| Rota | Descrição | Auth |
|------|-----------|------|
| `/` | Home | Não |
| `/vender` | Interface de vendas | Não |
| `/vendas` | Histórico do vendedor | Não |
| `/adm` | Dashboard admin | Sim |
| `/adm/login` | Login admin | Não |
| `/adm/relatorios` | Relatórios | Sim |
| `/adm/vendedores` | Gestão vendedores | Sim |
| `/adm/sabores` | Gestão sabores | Sim |
| `/adm/configuracoes` | Configurações | Sim |

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Testes
npm test

# Verificar configuração
npm run verify

# Linting
npm run lint
```

---

## 📊 Status de Pedidos

| Status | Descrição | Cor |
|--------|-----------|-----|
| `pending` | Pagamento pendente | Amarelo |
| `paid` | Pago | Verde |
| `completed` | Concluído | Azul |
| `cancelled` | Cancelado | Vermelho |

**Nota:** Pedidos cancelados não entram nas estatísticas.

---

## 💳 Métodos de Pagamento

- **PIX** - Requer QR Code configurado
- **Local** - Pagamento presencial

---

## 🔐 Credenciais Admin

**Criar usuário:** Supabase → Authentication → Add User

```sql
-- Ou via SQL:
INSERT INTO auth.users (email, encrypted_password)
VALUES ('admin@pastelada.com', crypt('senha123', gen_salt('bf')));
```

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `.env.local` | Variáveis locais (NÃO commitar) |
| `supabase/migrations/` | Migrations do banco |
| `app/api/` | API routes |
| `components/` | Componentes React |
| `lib/supabase.ts` | Cliente Supabase |

---

## 🐛 Troubleshooting Rápido

### Dados não atualizam no Vercel
→ Configurar variáveis de ambiente ([CHECKLIST-VERCEL.md](CHECKLIST-VERCEL.md))

### Erro ao fazer login
→ Criar usuário admin ([docs/admin-setup.md](docs/admin-setup.md))

### QR Code não aparece
→ Upload em /adm/configuracoes ([docs/CONFIGURACAO-PIX.md](docs/CONFIGURACAO-PIX.md))

### Erro de build
→ Verificar API routes têm `export const dynamic = 'force-dynamic'`

---

## 📞 Suporte

### Documentação
- **README.md** - Visão geral
- **INDICE-AJUDA.md** - Índice completo
- **docs/** - Documentação detalhada

### Guias Rápidos
- **GUIA-RAPIDO-VERCEL.md** - 5 minutos
- **CHECKLIST-VERCEL.md** - Passo a passo
- **PROXIMOS-PASSOS.md** - Status e próximos passos

---

## ✅ Checklist de Deploy

- [ ] Código commitado no Git
- [ ] Projeto criado no Vercel
- [ ] Banco de dados criado no Supabase
- [ ] Migrations executadas
- [ ] Variáveis configuradas no Vercel
- [ ] Redeploy realizado
- [ ] Usuário admin criado
- [ ] QR Code PIX configurado
- [ ] Testes realizados
- [ ] Sistema funcionando

---

## 🎯 KPIs do Dashboard

1. **Total de Vendas** - Soma em R$ (exceto cancelados)
2. **Total de Pedidos** - Contagem total (exceto cancelados)
3. **Pedidos em Andamento** - Status: pending ou paid
4. **Ticket Médio** - Valor médio por pedido
5. **Pedidos Concluídos** - Status: completed

---

## 🔒 Segurança

- ✅ RLS habilitado no Supabase
- ✅ Service role key apenas no servidor
- ✅ Autenticação apenas para admin
- ✅ Validação de dados no backend
- ✅ HTTPS em produção

---

## 📱 Responsividade

- ✅ Mobile-first design
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px)
- ✅ Modais adaptados para mobile
- ✅ Tabelas com colunas ocultas em mobile
- ✅ Navegação otimizada

---

**Imprima este cartão para referência rápida!**

---

**Última atualização:** 22/01/2026  
**Versão:** 1.0  
**Status:** Produção
