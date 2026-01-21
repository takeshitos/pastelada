# Checklist de Produção - Sistema Pastelada

Use este checklist para garantir que todos os passos necessários foram completados antes e depois do deploy em produção.

## 📋 Pré-Deploy

### Código e Testes
- [ ] Todos os testes unitários passando (`npm test`)
- [ ] Testes de propriedade (PBT) executados e passando
- [ ] Build local funciona sem erros (`npm run build`)
- [ ] Aplicação testada localmente em modo produção (`npm start`)
- [ ] Código revisado e sem console.logs desnecessários
- [ ] Linting sem erros (`npm run lint`)

### Configuração do Supabase
- [ ] Projeto Supabase criado e configurado
- [ ] Todas as migrations aplicadas (001 a 005)
- [ ] Tabelas criadas corretamente
- [ ] Triggers e funções implementados
- [ ] RLS (Row Level Security) configurado
- [ ] Storage bucket 'public-assets' criado
- [ ] Dados iniciais (seeds) inseridos
- [ ] Usuário administrador criado e testado

### Verificação do Banco de Dados
Execute estas queries no SQL Editor do Supabase:

```sql
-- Verificar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
-- Deve retornar: app_settings, customers, flavors, order_items, orders, vendors

-- Verificar triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
-- Deve retornar triggers de cálculo e atualização

-- Verificar RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies WHERE schemaname = 'public';
-- Deve retornar policies para cada tabela

-- Verificar dados iniciais
SELECT * FROM app_settings;
SELECT name, active FROM flavors ORDER BY name;
-- Deve retornar configurações e sabores padrão
```

### Repositório Git
- [ ] Código commitado e pushed para repositório remoto
- [ ] Branch principal (main/master) atualizada
- [ ] `.env.local` NÃO está no repositório (verificar .gitignore)
- [ ] Arquivos sensíveis não commitados
- [ ] README.md atualizado com instruções

### Documentação
- [ ] Guia de setup completo (docs/SETUP.md)
- [ ] Guia de deployment (docs/DEPLOYMENT.md)
- [ ] Variáveis de ambiente documentadas
- [ ] Instruções de criação de admin documentadas

## 🚀 Durante o Deploy

### Configuração na Vercel
- [ ] Projeto importado do Git
- [ ] Framework detectado como Next.js
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Install command: `npm install`

### Variáveis de Ambiente
Configure estas variáveis no dashboard da Vercel (Settings > Environment Variables):

- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada
- [ ] Todas as variáveis aplicadas ao ambiente "Production"
- [ ] Valores copiados corretamente (sem espaços extras)

### Build e Deploy
- [ ] Build iniciado com sucesso
- [ ] Build completado sem erros
- [ ] Deploy URL gerada
- [ ] Nenhum erro crítico nos logs

## ✅ Pós-Deploy

### Configuração do Supabase
- [ ] Redirect URLs configuradas no Supabase
  - Site URL: `https://seu-dominio.vercel.app`
  - Redirect URLs: `/adm/login`, `/adm`
- [ ] CORS configurado se necessário
- [ ] Limites de rate limiting revisados

### Testes Funcionais

#### Página Inicial e Vendedor
- [ ] Página inicial (`/`) carrega corretamente
- [ ] Formulário de cadastro de vendedor funciona
- [ ] Lista de vendedores exibe dados
- [ ] Seleção de vendedor funciona
- [ ] Redirecionamento para `/vender` funciona
- [ ] LocalStorage salva vendedor corretamente

#### Tela de Vendas
- [ ] Tela `/vender` carrega com vendedor logado
- [ ] Preço atual é exibido corretamente
- [ ] Lista de sabores carrega
- [ ] Controles de quantidade funcionam (+/-)
- [ ] Cálculo do total é correto
- [ ] Modal de cliente abre e valida dados
- [ ] Modal de pagamento funciona
- [ ] Modal PIX exibe QR code (se configurado)
- [ ] Criação de pedido funciona
- [ ] Modal de sucesso exibe informações corretas
- [ ] Opções "Outra compra" e "Sair" funcionam

#### Histórico de Vendas
- [ ] Página `/vendas` carrega
- [ ] Lista de vendas do vendedor exibe dados
- [ ] Filtros de período funcionam (hoje, 7 dias, mês)
- [ ] Formatação de valores está correta
- [ ] Detalhes dos itens são exibidos

#### Login Administrativo
- [ ] Página `/adm/login` carrega
- [ ] Login com credenciais corretas funciona
- [ ] Login com credenciais incorretas mostra erro
- [ ] Redirecionamento após login funciona
- [ ] Acesso sem login redireciona para login

#### Painel Administrativo
- [ ] Dashboard admin (`/adm`) carrega
- [ ] Navegação entre seções funciona
- [ ] Logout funciona corretamente

#### Gestão de Sabores
- [ ] Página `/adm/sabores` carrega
- [ ] Lista de sabores exibe dados
- [ ] Criar novo sabor funciona
- [ ] Editar sabor funciona
- [ ] Ativar/desativar sabor funciona
- [ ] Validação de nome único funciona
- [ ] Feedback de sucesso/erro aparece

#### Gestão de Configurações
- [ ] Página `/adm/configuracoes` carrega
- [ ] Preço atual é exibido
- [ ] Alteração de preço funciona
- [ ] Upload de QR code PIX funciona
- [ ] Preview da imagem aparece
- [ ] Salvamento de configurações funciona
- [ ] Conversão reais/centavos está correta

#### Gestão de Vendedores
- [ ] Página `/adm/vendedores` carrega
- [ ] Lista de vendedores exibe dados
- [ ] Editar vendedor funciona
- [ ] Ativar/desativar vendedor funciona
- [ ] Validações funcionam corretamente

#### Relatórios
- [ ] Página `/adm/relatorios` carrega
- [ ] Lista de todas as vendas exibe dados
- [ ] Filtros funcionam (sabor, vendedor, período)
- [ ] KPIs são calculados corretamente
  - Total de vendas (R$)
  - Total de pastéis vendidos
  - Ranking de sabores
- [ ] Paginação funciona (se implementada)
- [ ] Busca funciona (se implementada)

### Performance e Otimização
- [ ] Páginas carregam em menos de 3 segundos
- [ ] Imagens são otimizadas
- [ ] Não há erros no console do navegador
- [ ] Não há warnings críticos
- [ ] Core Web Vitals estão bons (se Vercel Analytics ativo)
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### Segurança
- [ ] HTTPS está ativo (automático na Vercel)
- [ ] Headers de segurança configurados
- [ ] RLS está ativo em todas as tabelas
- [ ] Service role key não está exposta no frontend
- [ ] Não há dados sensíveis nos logs públicos
- [ ] CORS configurado adequadamente

### Responsividade
Teste em diferentes dispositivos:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Layout se adapta corretamente
- [ ] Todos os botões são clicáveis
- [ ] Texto é legível em todas as telas

### Navegadores
Teste nos principais navegadores:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (se disponível)
- [ ] Mobile browsers (Chrome Mobile, Safari Mobile)

## 🔧 Configuração Inicial em Produção

Após deploy bem-sucedido, configure:

### 1. Configurações do Sistema
- [ ] Acessar `/adm/login` com credenciais admin
- [ ] Ir para Configurações
- [ ] Definir preço do pastel
- [ ] Fazer upload do QR code PIX
- [ ] Adicionar chave PIX em texto (opcional)
- [ ] Salvar configurações

### 2. Sabores
- [ ] Revisar sabores padrão
- [ ] Adicionar sabores específicos do negócio
- [ ] Desativar sabores não utilizados
- [ ] Verificar que sabores ativos aparecem na tela de vendas

### 3. Vendedores
- [ ] Cadastrar vendedores reais via página inicial
- [ ] Verificar que aparecem no painel admin
- [ ] Ajustar informações se necessário
- [ ] Testar login de cada vendedor

### 4. Teste de Venda Real
- [ ] Fazer uma venda de teste completa
- [ ] Verificar que aparece no histórico do vendedor
- [ ] Verificar que aparece nos relatórios admin
- [ ] Confirmar que cálculos estão corretos
- [ ] Verificar que dados do cliente foram salvos

## 📊 Monitoramento

### Configurar Alertas
- [ ] Vercel: Configurar alertas de erro
- [ ] Vercel: Ativar Analytics (opcional)
- [ ] Supabase: Configurar alertas de uso
- [ ] Supabase: Monitorar logs de erro

### Métricas para Acompanhar
- [ ] Número de vendas por dia
- [ ] Tempo de resposta das APIs
- [ ] Taxa de erro
- [ ] Uso do banco de dados
- [ ] Uso de storage
- [ ] Número de usuários ativos

## 🔄 Manutenção Contínua

### Diário
- [ ] Verificar logs de erro
- [ ] Monitorar performance
- [ ] Verificar vendas registradas

### Semanal
- [ ] Revisar métricas de uso
- [ ] Verificar backups do banco
- [ ] Atualizar sabores se necessário
- [ ] Revisar relatórios de vendas

### Mensal
- [ ] Atualizar dependências (`npm update`)
- [ ] Revisar e otimizar queries lentas
- [ ] Limpar dados antigos se necessário
- [ ] Revisar e ajustar preços
- [ ] Backup manual do banco de dados

## 🆘 Plano de Contingência

### Se o Site Cair
1. [ ] Verificar status da Vercel (status.vercel.com)
2. [ ] Verificar status do Supabase (status.supabase.com)
3. [ ] Verificar logs da Vercel
4. [ ] Verificar logs do Supabase
5. [ ] Fazer rollback para deploy anterior se necessário

### Se Houver Erro Crítico
1. [ ] Identificar o erro nos logs
2. [ ] Reproduzir localmente
3. [ ] Corrigir o problema
4. [ ] Testar localmente
5. [ ] Deploy da correção
6. [ ] Verificar que o problema foi resolvido

### Contatos de Emergência
- [ ] Documentar contatos da equipe técnica
- [ ] Documentar credenciais de acesso (em local seguro)
- [ ] Documentar procedimentos de emergência

## ✨ Otimizações Futuras

Considere implementar:
- [ ] Cache de dados com Redis
- [ ] CDN para assets estáticos
- [ ] Compressão de imagens automática
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Backup automático agendado
- [ ] Monitoramento avançado (Sentry, LogRocket)
- [ ] A/B testing
- [ ] Analytics detalhado

---

## 📝 Notas

**Data do Deploy**: _______________

**URL de Produção**: _______________

**Responsável**: _______________

**Observações**:
_______________________________________________
_______________________________________________
_______________________________________________

---

**Status Final**: [ ] Aprovado para Produção

**Assinatura**: _______________  **Data**: _______________
