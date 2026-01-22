# Configuração do Vercel com Supabase

## Problema
Os dados não estão atualizando após o deploy porque as variáveis de ambiente do Supabase não estão configuradas no Vercel.

## Solução: Configurar Variáveis de Ambiente no Vercel

### Passo 1: Obter as Credenciais do Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** → **API**
3. Copie as seguintes informações:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave pública)
   - **service_role key** (chave secreta - CUIDADO!)

### Passo 2: Configurar no Vercel

1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
```

#### Variáveis Opcionais (se você tiver):

```
NEXT_PUBLIC_SITE_URL=https://seu-site.vercel.app
```

### Passo 3: Configurar para Todos os Ambientes

Para cada variável, selecione os ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

### Passo 4: Fazer Redeploy

Após adicionar as variáveis:
1. Vá em **Deployments**
2. Clique nos três pontos (...) do último deploy
3. Clique em **Redeploy**
4. Marque a opção **Use existing Build Cache** (opcional)
5. Clique em **Redeploy**

## Verificação

Após o redeploy, verifique:
1. ✅ Dashboard mostra estatísticas corretas
2. ✅ Relatórios carregam dados
3. ✅ Vendas são registradas
4. ✅ Login funciona

## Troubleshooting

### Se ainda não funcionar:

1. **Verifique os logs no Vercel:**
   - Vá em **Deployments** → Clique no deploy → **Functions**
   - Procure por erros relacionados ao Supabase

2. **Verifique as variáveis:**
   - Certifique-se que não há espaços extras
   - Verifique se a URL termina sem `/` no final
   - Confirme que as chaves estão corretas

3. **Limpe o cache:**
   - Faça um novo deploy sem usar o cache
   - Desmarque "Use existing Build Cache"

4. **Verifique o Supabase:**
   - Confirme que o projeto está ativo
   - Verifique se as tabelas existem
   - Teste as credenciais localmente

## Segurança

⚠️ **IMPORTANTE:**
- NUNCA commite a `SUPABASE_SERVICE_ROLE_KEY` no código
- Mantenha o arquivo `.env.local` no `.gitignore`
- Use apenas no Vercel como variável de ambiente

## Arquivo .env.local (Local)

Seu arquivo `.env.local` deve ter:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Site URL (opcional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Checklist Final

- [ ] Variáveis adicionadas no Vercel
- [ ] Redeploy realizado
- [ ] Dashboard carrega dados
- [ ] Vendas funcionam
- [ ] Login funciona
- [ ] Relatórios atualizam

## Suporte

Se o problema persistir, verifique:
1. Console do navegador (F12) para erros
2. Logs do Vercel para erros de API
3. Logs do Supabase para erros de banco de dados
