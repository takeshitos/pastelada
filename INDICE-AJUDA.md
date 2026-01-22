# 📚 Índice de Ajuda - Sistema Pastelada GOJ Imac

**Não sabe por onde começar?** Este índice te guia para o documento certo.

---

## 🚨 PROBLEMA: Dados não atualizam no Vercel

### 👉 COMECE AQUI:

1. **[CHECKLIST-VERCEL.md](CHECKLIST-VERCEL.md)** ⭐ RECOMENDADO
   - Checklist passo a passo
   - Marque cada item conforme completa
   - Inclui testes de verificação
   - **Tempo:** 10 minutos

2. **[CONFIGURACAO-VERCEL.md](CONFIGURACAO-VERCEL.md)**
   - Guia detalhado e completo
   - Explicações aprofundadas
   - Troubleshooting extenso

---

## 📊 Entender a Situação Atual

### [PROXIMOS-PASSOS.md](PROXIMOS-PASSOS.md)
- Ação necessária (você precisa fazer)
- Checklist de verificação
- Próximos passos após configuração

---

## 🛠️ Ferramentas e Scripts

### Verificar Configuração Local

```bash
npm run verify
```

ou

```bash
node verificar-setup.js
```

**O que verifica:**
- ✅ Variáveis de ambiente configuradas
- ✅ Arquivo .env.local existe
- ✅ Valores não são placeholders
- ✅ Todas as credenciais presentes

---

## 📖 Documentação Geral do Projeto

### Começando do Zero

1. **[README.md](README.md)**
   - Visão geral do projeto
   - Tecnologias usadas
   - Scripts disponíveis

2. **[docs/GUIA-INICIO-RAPIDO.md](docs/GUIA-INICIO-RAPIDO.md)**
   - Setup completo do zero
   - Passo a passo: 30-45 minutos
   - Para quem está começando

3. **[docs/SETUP.md](docs/SETUP.md)**
   - Guia de setup detalhado
   - Configuração do ambiente
   - Instalação de dependências

### Deploy e Produção

1. **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**
   - Guia de deploy na Vercel
   - Configuração de produção
   - Variáveis de ambiente

2. **[docs/PRODUCTION-CHECKLIST.md](docs/PRODUCTION-CHECKLIST.md)**
   - Checklist pré-deploy
   - Checklist pós-deploy
   - Verificações de segurança

### Configurações Específicas

1. **[docs/database-setup.md](docs/database-setup.md)**
   - Estrutura do banco de dados
   - Migrations
   - Tabelas e relacionamentos

2. **[docs/admin-setup.md](docs/admin-setup.md)**
   - Criar usuário administrador
   - Configurar autenticação
   - Primeiro acesso

3. **[docs/CONFIGURACAO-PIX.md](docs/CONFIGURACAO-PIX.md)**
   - Upload de QR Code PIX
   - Configurar chave PIX
   - Testar pagamentos

---

## 🔧 Documentação Técnica

---

## 📋 Especificações do Sistema

### [.kiro/specs/pastelada-sales-system/requirements.md](.kiro/specs/pastelada-sales-system/requirements.md)
- Requisitos funcionais
- Requisitos não-funcionais
- Casos de uso

### [.kiro/specs/pastelada-sales-system/design.md](.kiro/specs/pastelada-sales-system/design.md)
- Arquitetura do sistema
- Decisões de design
- Padrões utilizados

### [.kiro/specs/pastelada-sales-system/tasks.md](.kiro/specs/pastelada-sales-system/tasks.md)
- Tarefas implementadas
- Status de cada tarefa
- Histórico de desenvolvimento

---

## 🐛 Troubleshooting

### Problema: Dados não atualizam no Vercel
**Solução:** [CHECKLIST-VERCEL.md](CHECKLIST-VERCEL.md)

### Problema: Erro ao fazer login
**Solução:** [docs/admin-setup.md](docs/admin-setup.md)

### Problema: QR Code não aparece
**Solução:** [docs/CONFIGURACAO-PIX.md](docs/CONFIGURACAO-PIX.md)

### Problema: Vendas não são registradas
**Solução:** [CONFIGURACAO-VERCEL.md](CONFIGURACAO-VERCEL.md) (seção Troubleshooting)

### Problema: Sistema não funciona no mobile
**Solução:** Já está implementado! Verifique se está usando a versão mais recente.

---

## 🎯 Fluxo Recomendado

### Se você está começando agora:

```
1. README.md
   ↓
2. docs/GUIA-INICIO-RAPIDO.md
   ↓
3. docs/SETUP.md
   ↓
4. docs/DEPLOYMENT.md
   ↓
5. CHECKLIST-VERCEL.md
```

### Se você já tem o sistema deployado mas não funciona:

```
1. LEIA-ME-PRIMEIRO.md (entender o problema)
   ↓
2. CHECKLIST-VERCEL.md (resolver o problema)
   ↓
3. npm run verify (verificar configuração)
   ↓
4. Testar o sistema
```

### Se você quer entender o sistema:

```
1. README.md (visão geral)
   ↓
2. .kiro/specs/pastelada-sales-system/requirements.md (requisitos)
   ↓
3. .kiro/specs/pastelada-sales-system/design.md (arquitetura)
   ↓
4. docs/database-setup.md (banco de dados)
```

---

## 📞 Precisa de Ajuda Rápida?

### Perguntas Frequentes

- **Q: O sistema está deployado mas não funciona?**  
  A: Siga o [CHECKLIST-VERCEL.md](CHECKLIST-VERCEL.md)

- **Q: Como criar o primeiro usuário admin?**  
  A: Veja [docs/admin-setup.md](docs/admin-setup.md)

- **Q: Como configurar o PIX?**  
  A: Veja [docs/CONFIGURACAO-PIX.md](docs/CONFIGURACAO-PIX.md)

- **Q: Como verificar se está tudo configurado?**  
  A: Execute `npm run verify`

---

## 🎉 Checklist Rápido

Marque conforme completa:

- [ ] Li o LEIA-ME-PRIMEIRO.md
- [ ] Segui o CHECKLIST-VERCEL.md
- [ ] Configurei as 3 variáveis no Vercel
- [ ] Fiz redeploy
- [ ] Testei o dashboard
- [ ] Testei fazer uma venda
- [ ] Sistema funciona 100%

---

## 📝 Notas

- Todos os documentos estão em português
- Guias são passo a passo
- Inclui troubleshooting
- Tempo estimado em cada guia
- Exemplos práticos

---

**Última atualização:** 22/01/2026  
**Próxima ação:** Abra o [CHECKLIST-VERCEL.md](CHECKLIST-VERCEL.md)
