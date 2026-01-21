# Guia de Deploy - Sistema Pastelada

## Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Preparação para Deploy](#preparação-para-deploy)
4. [Deploy na Vercel](#deploy-na-vercel)
5. [Configuração Pós-Deploy](#configuração-pós-deploy)
6. [Otimizações de Produção](#otimizações-de-produção)
7. [Monitoramento e Manutenção](#monitoramento-e-manutenção)
8. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Este guia descreve o processo completo de deploy do Sistema Pastelada em produção usando a Vercel como plataforma de hospedagem. A Vercel é a plataforma recomendada por ser otimizada para Next.js e oferecer integração simples com o Supabase.

### Arquitetura de Produção

```
┌─────────────┐
│   Vercel    │ ← Frontend Next.js + API Routes
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Supabase   │ ← Backend (PostgreSQL + Auth + Storage)
└─────────────┘
```

---

## Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

- ✅ Projeto Supabase configurado e funcionando
- ✅ Banco de dados com todas as migrations aplicadas
- ✅ Usuário administrador criado
- ✅ Aplicação testada localmente
- ✅ Conta na Vercel ([criar conta](https://vercel.com/signup))
- ✅ Repositório Git (GitHub, GitLab ou Bitbucket)

---

## Preparação para Deploy

### 1. Testar Build Local

Antes de fazer deploy, teste se o build funciona corretamente:

```bash
# Criar build de produção
npm run build

# Testar build localmente
npm start
```

Acesse `http://localhost:3000` e verifique se tudo funciona corretamente.

### 2. Verificar Variáveis de Ambiente

Certifique-se de que todas as variáveis necessárias estão documentadas:

```env
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env.local` no Git!

### 3. Otimizar Configuração do Next.js

O arquivo `next.config.js` já está otimizado para produção com:

- ✅ Configuração de domínios de imagem do Supabase
- ✅ Padrões remotos para Storage do Supabase
- ✅ Otimizações automáticas do Next.js

### 4. Verificar .gitignore

Confirme que arquivos sensíveis não serão commitados:

```gitignore
# Já incluído no .gitignore
.env*.local
.env.local
.env.production.local
node_modules/
.next/
```

### 5. Commit e Push do Código

```bash
# Adicionar todas as alterações
git add .

# Commit
git commit -m "Preparar para deploy em produção"

# Push para repositório remoto
git push origin main
```

---

## Deploy na Vercel

### Método 1: Via Dashboard da Vercel (Recomendado)

#### Passo 1: Importar Projeto

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **Add New** > **Project**
3. Selecione seu repositório Git
4. Clique em **Import**

#### Passo 2: Configurar Projeto

1. **Framework Preset**: Next.js (detectado automaticamente)
2. **Root Directory**: `.` (raiz do projeto)
3. **Build Command**: `npm run build` (padrão)
4. **Output Directory**: `.next` (padrão)
5. **Install Command**: `npm install` (padrão)

#### Passo 3: Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```
NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: 
- Cole as mesmas credenciais do seu `.env.local`
- A `SUPABASE_SERVICE_ROLE_KEY` é sensível - mantenha em segredo
- Variáveis com `NEXT_PUBLIC_` são expostas no frontend

#### Passo 4: Deploy

1. Clique em **Deploy**
2. Aguarde o build e deploy (geralmente 2-5 minutos)
3. Após conclusão, você receberá uma URL de produção

### Método 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Seguir prompts interativos
# Configurar variáveis de ambiente quando solicitado

# Deploy para produção
vercel --prod
```

---

## Configuração Pós-Deploy

### 1. Configurar Domínio Personalizado (Opcional)

1. No dashboard da Vercel, vá para **Settings** > **Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções da Vercel
4. Aguarde propagação DNS (pode levar até 48h)

### 2. Configurar Redirects do Supabase

No dashboard do Supabase, configure URLs de redirect para autenticação:

1. Vá para **Authentication** > **URL Configuration**
2. Adicione suas URLs de produção:
   - **Site URL**: `https://seu-dominio.vercel.app`
   - **Redirect URLs**: 
     - `https://seu-dominio.vercel.app/adm/login`
     - `https://seu-dominio.vercel.app/adm`

### 3. Testar Aplicação em Produção

Verifique todas as funcionalidades:

- ✅ Página inicial carrega corretamente
- ✅ Cadastro/seleção de vendedor funciona
- ✅ Tela de vendas exibe sabores e preços
- ✅ Criação de pedidos funciona
- ✅ Login administrativo funciona
- ✅ Painel admin carrega corretamente
- ✅ Upload de imagens (QR Code) funciona
- ✅ Relatórios exibem dados corretamente

### 4. Configurar Monitoramento

#### Vercel Analytics (Opcional)

1. No dashboard da Vercel, vá para **Analytics**
2. Ative o Vercel Analytics para métricas de performance
3. Configure alertas para erros

#### Supabase Monitoring

1. No dashboard do Supabase, vá para **Database** > **Logs**
2. Configure alertas para erros de banco de dados
3. Monitore uso de recursos

---

## Otimizações de Produção

### 1. Otimizações Já Implementadas

O projeto já inclui várias otimizações:

✅ **Next.js Image Optimization**: Imagens otimizadas automaticamente
✅ **Code Splitting**: Carregamento sob demanda de componentes
✅ **CSS Optimization**: Tailwind CSS com purge automático
✅ **TypeScript**: Type safety em produção
✅ **API Routes**: Server-side rendering otimizado

### 2. Otimizações de Imagens

Para QR Codes PIX e outras imagens:

```typescript
// Já implementado no next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

### 3. Otimizações de Performance

#### Cache de Dados

O sistema já implementa cache adequado:
- Sabores e preços são buscados sob demanda
- LocalStorage para sessão de vendedor
- Supabase realtime para atualizações

#### Lazy Loading

Componentes pesados são carregados sob demanda:
```typescript
// Exemplo de lazy loading (já implementado onde necessário)
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
})
```

### 4. Otimizações de Banco de Dados

Já implementadas nas migrations:

✅ **Índices**: Criados em colunas frequentemente consultadas
✅ **Triggers**: Cálculos automáticos no banco
✅ **RLS**: Segurança a nível de linha
✅ **Constraints**: Validações no banco de dados

---

## Monitoramento e Manutenção

### 1. Logs e Debugging

#### Vercel Logs

```bash
# Ver logs em tempo real
vercel logs

# Ver logs de uma função específica
vercel logs [function-name]
```

Ou via dashboard: **Deployments** > Selecionar deploy > **Logs**

#### Supabase Logs

No dashboard do Supabase:
1. **Database** > **Logs** - Logs de queries
2. **API** > **Logs** - Logs de API
3. **Auth** > **Logs** - Logs de autenticação

### 2. Métricas de Performance

#### Vercel Analytics

Monitore:
- **Core Web Vitals**: LCP, FID, CLS
- **Real User Monitoring**: Performance real dos usuários
- **Error Tracking**: Erros em produção

#### Supabase Metrics

Monitore:
- **Database Size**: Crescimento do banco
- **API Requests**: Volume de requisições
- **Storage Usage**: Uso de storage

### 3. Backups

#### Banco de Dados

O Supabase faz backups automáticos, mas você pode fazer backups manuais:

```bash
# Via Supabase CLI
supabase db dump -f backup.sql

# Ou via dashboard: Database > Backups
```

#### Código

Mantenha backups do código:
- Git repository (GitHub/GitLab)
- Tags de versão para releases importantes

### 4. Atualizações

#### Deploy de Atualizações

```bash
# Commit alterações
git add .
git commit -m "Descrição das alterações"
git push origin main

# Vercel fará deploy automático
```

#### Rollback

Se algo der errado:

1. No dashboard da Vercel, vá para **Deployments**
2. Encontre o deploy anterior estável
3. Clique em **...** > **Promote to Production**

---

## Troubleshooting

### Build Falha na Vercel

**Sintomas**: Build falha com erro de TypeScript ou dependências

**Soluções**:
```bash
# Testar build localmente primeiro
npm run build

# Limpar cache e reinstalar
rm -rf node_modules .next
npm install
npm run build

# Se funcionar localmente, limpar cache da Vercel
# No dashboard: Settings > General > Clear Build Cache
```

### Variáveis de Ambiente Não Funcionam

**Sintomas**: Erro "Invalid API key" ou conexão falha

**Soluções**:
1. Verifique se as variáveis estão configuradas corretamente na Vercel
2. Confirme que variáveis públicas têm prefixo `NEXT_PUBLIC_`
3. Redeploy após alterar variáveis (necessário)
4. Verifique se não há espaços extras nas variáveis

### Imagens Não Carregam

**Sintomas**: QR Code PIX não aparece

**Soluções**:
1. Verifique configuração de domínios no `next.config.js`
2. Confirme que o bucket do Supabase é público
3. Teste URL da imagem diretamente no navegador
4. Verifique CORS no Supabase Storage

### Erro 500 em API Routes

**Sintomas**: Operações de escrita falham

**Soluções**:
1. Verifique logs da Vercel para detalhes do erro
2. Confirme que `SUPABASE_SERVICE_ROLE_KEY` está configurada
3. Teste a mesma operação localmente
4. Verifique RLS policies no Supabase

### Performance Lenta

**Sintomas**: Aplicação carrega devagar

**Soluções**:
1. Verifique Core Web Vitals no Vercel Analytics
2. Otimize queries do banco (adicione índices)
3. Implemente cache onde apropriado
4. Reduza tamanho de imagens
5. Use lazy loading para componentes pesados

### Autenticação Admin Falha

**Sintomas**: Login admin não funciona em produção

**Soluções**:
1. Verifique redirect URLs no Supabase
2. Confirme que usuário admin existe
3. Teste credenciais localmente primeiro
4. Verifique logs de autenticação no Supabase

---

## Checklist de Deploy

Use este checklist antes de cada deploy:

### Pré-Deploy
- [ ] Código testado localmente
- [ ] Build local funciona (`npm run build`)
- [ ] Testes passando (`npm test`)
- [ ] Variáveis de ambiente documentadas
- [ ] Migrations aplicadas no Supabase
- [ ] Código commitado e pushed

### Durante Deploy
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Build completou com sucesso
- [ ] Deploy URL gerada

### Pós-Deploy
- [ ] Página inicial carrega
- [ ] Fluxo de vendedor funciona
- [ ] Login admin funciona
- [ ] Painel admin acessível
- [ ] Upload de imagens funciona
- [ ] Relatórios exibem dados
- [ ] Redirect URLs configuradas no Supabase
- [ ] Monitoramento configurado

---

## Recursos Adicionais

- **Documentação Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Documentação Next.js Deploy**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Documentação Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Guia de Setup**: [docs/SETUP.md](./SETUP.md)

---

## Suporte

Para problemas específicos de deploy:
1. Consulte a seção de Troubleshooting acima
2. Verifique logs da Vercel e Supabase
3. Teste localmente para isolar o problema
4. Consulte documentação oficial das plataformas
