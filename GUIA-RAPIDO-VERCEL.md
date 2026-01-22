# ⚡ Guia Rápido: Configurar Vercel (5 minutos)

**Problema:** Dados não atualizam no Vercel após deploy  
**Solução:** Configurar 3 variáveis de ambiente  
**Tempo:** 5-10 minutos

---

## 🎯 O Que Fazer (Resumo Ultra-Rápido)

### 1️⃣ Supabase (2 min)
```
https://app.supabase.com
→ Seu projeto
→ Settings → API
→ Copiar 3 valores
```

### 2️⃣ Vercel (3 min)
```
https://vercel.com/dashboard
→ Seu projeto
→ Settings → Environment Variables
→ Adicionar 3 variáveis
```

### 3️⃣ Redeploy (2 min)
```
Deployments
→ ... (3 pontos)
→ Redeploy
→ Aguardar
```

### 4️⃣ Testar (3 min)
```
Acessar site
→ Testar dashboard
→ Testar venda
→ ✅ Pronto!
```

---

## 📋 As 3 Variáveis

Copie e cole no Vercel (Settings → Environment Variables):

### Variável 1
```
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: [copiar do Supabase: Project URL]
Ambientes: ✅ Production ✅ Preview ✅ Development
```

### Variável 2
```
Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: [copiar do Supabase: anon public key]
Ambientes: ✅ Production ✅ Preview ✅ Development
```

### Variável 3
```
Nome: SUPABASE_SERVICE_ROLE_KEY
Valor: [copiar do Supabase: service_role key]
Ambientes: ✅ Production ✅ Preview ✅ Development
```

---

## ✅ Verificação Rápida

Após redeploy, teste:

- [ ] Dashboard mostra números (não está zerado)
- [ ] Consegue fazer uma venda
- [ ] Venda aparece nos relatórios

**Se todos passaram: 🎉 PRONTO!**

---

## ❌ Não Funcionou?

### Verifique:
1. As 3 variáveis estão no Vercel?
2. Não há espaços extras nos valores?
3. Fez redeploy após adicionar?
4. Aguardou o deploy finalizar (status: Ready)?

### Ainda não funciona?
Consulte o guia completo: **[CHECKLIST-VERCEL.md](CHECKLIST-VERCEL.md)**

---

## 🔍 Verificar Configuração Local

```bash
npm run verify
```

---

## 📚 Mais Ajuda

- **CHECKLIST-VERCEL.md** - Passo a passo detalhado
- **CONFIGURACAO-VERCEL.md** - Guia completo
- **INDICE-AJUDA.md** - Índice de todos os guias

---

**Última atualização:** 22/01/2026
