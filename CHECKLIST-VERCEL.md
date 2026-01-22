# ✅ Checklist: Configurar Vercel com Supabase

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Passo a Passo

### 1️⃣ Obter Credenciais do Supabase

- [ ] Acessei https://app.supabase.com
- [ ] Abri meu projeto
- [ ] Fui em **Settings** → **API**
- [ ] Copiei o **Project URL** (ex: `https://xxxxx.supabase.co`)
- [ ] Copiei a **anon public key** (chave longa começando com `eyJ...`)
- [ ] Copiei a **service_role key** (⚠️ SECRETA - chave longa começando com `eyJ...`)

**Dica:** Mantenha essas credenciais em um arquivo de texto temporário para facilitar.

---

### 2️⃣ Configurar Variáveis no Vercel

- [ ] Acessei https://vercel.com/dashboard
- [ ] Abri meu projeto "Pastelada"
- [ ] Fui em **Settings** → **Environment Variables**

#### Adicionar Variável 1:
- [ ] Nome: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Valor: (colei o Project URL do Supabase)
- [ ] Ambientes: ✅ Production ✅ Preview ✅ Development
- [ ] Cliquei em **Save**

#### Adicionar Variável 2:
- [ ] Nome: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Valor: (colei a anon public key do Supabase)
- [ ] Ambientes: ✅ Production ✅ Preview ✅ Development
- [ ] Cliquei em **Save**

#### Adicionar Variável 3:
- [ ] Nome: `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Valor: (colei a service_role key do Supabase)
- [ ] Ambientes: ✅ Production ✅ Preview ✅ Development
- [ ] Cliquei em **Save**

**Verificação:** Você deve ver 3 variáveis listadas na página.

---

### 3️⃣ Fazer Redeploy

- [ ] Fui em **Deployments** (no menu do projeto)
- [ ] Encontrei o último deploy (o mais recente no topo)
- [ ] Cliquei nos 3 pontos (...) ao lado do deploy
- [ ] Cliquei em **Redeploy**
- [ ] (Opcional) Marquei **Use existing Build Cache** para ser mais rápido
- [ ] Cliquei em **Redeploy** novamente para confirmar
- [ ] Aguardei o deploy finalizar (1-3 minutos)
- [ ] Status mudou para **Ready** ✅

---

### 4️⃣ Testar o Sistema

Acesse seu site no Vercel e teste:

#### Teste 1: Dashboard
- [ ] Acessei `/adm` (ou fiz login em `/adm/login`)
- [ ] Dashboard mostra números (não está tudo zerado)
- [ ] Vejo estatísticas: Total de Vendas, Pedidos, etc.

#### Teste 2: Relatórios
- [ ] Acessei `/adm/relatorios`
- [ ] Vejo lista de pedidos (se houver)
- [ ] Consigo filtrar por data/vendedor

#### Teste 3: Nova Venda
- [ ] Acessei `/vender`
- [ ] Selecionei um vendedor
- [ ] Adicionei sabores ao carrinho
- [ ] Finalizei uma venda de teste
- [ ] Venda apareceu nos relatórios

#### Teste 4: Configurações
- [ ] Acessei `/adm/configuracoes`
- [ ] QR Code PIX aparece (se já foi configurado)
- [ ] Consigo ver/editar configurações

---

## ✅ Tudo Funcionando?

Se todos os testes passaram: **PARABÉNS! 🎉**

Seu sistema está 100% funcional em produção!

---

## ❌ Algo Não Funcionou?

### Problema: Dashboard mostra tudo zerado

**Solução:**
1. Verifique se as 3 variáveis estão no Vercel
2. Verifique se não há espaços extras nos valores
3. Faça um novo redeploy
4. Limpe o cache do navegador (Ctrl+Shift+R)

### Problema: Erro ao fazer login

**Solução:**
1. Verifique se o usuário admin foi criado no Supabase
2. Veja o guia: `docs/admin-setup.md`
3. Verifique os logs no Vercel (Deployments → Functions)

### Problema: Vendas não são registradas

**Solução:**
1. Abra o Console do navegador (F12)
2. Veja se há erros de API
3. Verifique os logs no Vercel
4. Confirme que as variáveis estão corretas

### Problema: QR Code não aparece

**Solução:**
1. Verifique se o QR Code foi enviado no Supabase Storage
2. Acesse: Supabase → Storage → qr-codes
3. Se não houver, faça upload em `/adm/configuracoes`

---

## 📞 Precisa de Ajuda?

Consulte os guias:
- **CONFIGURACAO-VERCEL.md** - Guia detalhado
- **PROXIMOS-PASSOS.md** - Status e próximos passos
- **docs/DEPLOYMENT.md** - Guia de deploy completo

---

## 🔍 Verificação Rápida

Execute localmente para verificar sua configuração:

```bash
npm run verify
```

Este comando verifica se todas as variáveis estão configuradas corretamente.

---

**Última atualização:** 22/01/2026
