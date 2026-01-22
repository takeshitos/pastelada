# Documento de Requisitos - Sistema Pastelada

## Introdução

O Sistema Pastelada é uma aplicação web completa para gerenciamento de vendas de uma pastelaria, oferecendo funcionalidades para vendedores registrarem vendas através de dispositivos móveis e administradores gerenciarem o negócio através de um painel administrativo. O sistema utiliza Supabase como backend (PostgreSQL + Auth + Storage) e Next.js como frontend responsivo.

## Glossário

- **Sistema_Pastelada**: A aplicação web completa de vendas de pastel
- **Vendedor**: Pessoa autorizada a registrar vendas no sistema
- **Cliente**: Pessoa que compra pastéis
- **Sabor**: Tipo/categoria de pastel disponível para venda
- **Pedido**: Transação de venda contendo um ou mais itens
- **Item_Pedido**: Linha individual de um pedido (sabor + quantidade)
- **Administrador**: Usuário com acesso completo ao sistema via autenticação
- **PIX**: Método de pagamento digital brasileiro
- **QR_Code**: Código de resposta rápida para pagamento PIX
- **RLS**: Row Level Security (segurança a nível de linha no banco)

## Requisitos

### Requisito 1

**User Story:** Como um vendedor, eu quero me cadastrar e fazer login por seleção, para que eu possa acessar o sistema de vendas sem necessidade de senha.

#### Acceptance Criteria

1. WHEN um usuário acessa a página inicial, THE Sistema_Pastelada SHALL exibir um formulário de cadastro de vendedor com campos nome e telefone
2. WHEN um vendedor preenche nome com mínimo 2 caracteres, THE Sistema_Pastelada SHALL aceitar o cadastro
3. WHEN um vendedor seleciona seu nome da lista de vendedores ativos, THE Sistema_Pastelada SHALL salvar as informações no storage local e redirecionar para a tela de vendas
4. WHEN um vendedor tenta acessar a tela de vendas sem estar logado, THE Sistema_Pastelada SHALL redirecionar para a página inicial
5. THE Sistema_Pastelada SHALL validar que telefones contenham apenas números

### Requisito 2

**User Story:** Como um vendedor, eu quero registrar vendas selecionando sabores e quantidades, para que eu possa processar pedidos de clientes de forma eficiente.

#### Acceptance Criteria

1. WHEN um vendedor acessa a tela de vendas, THE Sistema_Pastelada SHALL exibir o preço atual do pastel e lista de sabores ativos
2. WHEN um vendedor altera a quantidade de um sabor, THE Sistema_Pastelada SHALL recalcular automaticamente o total do pedido
3. WHEN um vendedor clica em "Salvar pedido", THE Sistema_Pastelada SHALL solicitar dados do cliente (nome obrigatório, telefone opcional)
4. WHEN um vendedor confirma os dados do cliente, THE Sistema_Pastelada SHALL apresentar opções de pagamento (PIX ou Local)
5. THE Sistema_Pastelada SHALL permitir apenas quantidades maiores que zero para cada sabor

### Requisito 3

**User Story:** Como um vendedor, eu quero processar pagamentos via PIX ou local, para que eu possa finalizar vendas com diferentes métodos de pagamento.

#### Acceptance Criteria

1. WHEN um vendedor escolhe pagamento PIX, THE Sistema_Pastelada SHALL exibir QR code, valor total e lista de itens
2. WHEN um vendedor confirma pagamento PIX, THE Sistema_Pastelada SHALL registrar a venda com status "paid" e método "PIX"
3. WHEN um vendedor escolhe pagamento local, THE Sistema_Pastelada SHALL registrar a venda com status "pending" e método "LOCAL"
4. WHEN uma venda é finalizada, THE Sistema_Pastelada SHALL exibir confirmação de sucesso e opções para nova venda ou sair
5. THE Sistema_Pastelada SHALL persistir todas as vendas no banco de dados via API server-side

### Requisito 4

**User Story:** Como um vendedor, eu quero visualizar minhas vendas realizadas, para que eu possa acompanhar meu desempenho e histórico.

#### Acceptance Criteria

1. WHEN um vendedor acessa "Minhas vendas", THE Sistema_Pastelada SHALL exibir apenas vendas do vendedor logado
2. WHEN vendas são exibidas, THE Sistema_Pastelada SHALL mostrar data/hora, total, método de pagamento, status e itens
3. WHEN um vendedor aplica filtros de período, THE Sistema_Pastelada SHALL atualizar a lista conforme o filtro selecionado
4. THE Sistema_Pastelada SHALL permitir filtros por hoje, 7 dias e mês
5. THE Sistema_Pastelada SHALL formatar valores monetários em reais brasileiros

### Requisito 5

**User Story:** Como um administrador, eu quero gerenciar sabores de pastéis, para que eu possa manter o cardápio atualizado.

#### Acceptance Criteria

1. WHEN um administrador acessa o painel admin autenticado, THE Sistema_Pastelada SHALL permitir criar novos sabores
2. WHEN um administrador edita um sabor, THE Sistema_Pastelada SHALL atualizar as informações mantendo integridade
3. WHEN um administrador desativa um sabor, THE Sistema_Pastelada SHALL ocultar o sabor das vendas mas manter histórico
4. WHEN um administrador tenta excluir sabor com vendas, THE Sistema_Pastelada SHALL apenas desativar o sabor
5. THE Sistema_Pastelada SHALL garantir nomes únicos para sabores ativos

### Requisito 6

**User Story:** Como um administrador, eu quero configurar preços e QR code PIX, para que eu possa manter as configurações de pagamento atualizadas.

#### Acceptance Criteria

1. WHEN um administrador altera o preço do pastel, THE Sistema_Pastelada SHALL aplicar o novo preço para vendas futuras
2. WHEN um administrador faz upload de QR code PIX, THE Sistema_Pastelada SHALL salvar no storage e atualizar configurações
3. WHEN um QR code é carregado, THE Sistema_Pastelada SHALL exibir preview da imagem
4. THE Sistema_Pastelada SHALL converter valores de reais para centavos internamente
5. THE Sistema_Pastelada SHALL manter apenas uma configuração global ativa

### Requisito 7

**User Story:** Como um administrador, eu quero gerenciar vendedores, para que eu possa controlar quem tem acesso ao sistema.

#### Acceptance Criteria

1. WHEN um administrador visualiza vendedores, THE Sistema_Pastelada SHALL listar todos com status ativo/inativo
2. WHEN um administrador edita dados de vendedor, THE Sistema_Pastelada SHALL atualizar nome, telefone e status
3. WHEN um administrador desativa vendedor, THE Sistema_Pastelada SHALL impedir novos logins mas manter histórico
4. THE Sistema_Pastelada SHALL preferir desativação ao invés de exclusão para manter integridade
5. THE Sistema_Pastelada SHALL validar dados antes de salvar alterações

### Requisito 8

**User Story:** Como um administrador, eu quero visualizar relatórios de vendas, para que eu possa analisar o desempenho do negócio.

#### Acceptance Criteria

1. WHEN um administrador acessa relatórios, THE Sistema_Pastelada SHALL exibir todas as vendas com filtros disponíveis
2. WHEN filtros são aplicados, THE Sistema_Pastelada SHALL atualizar dados conforme critérios selecionados
3. WHEN relatórios são gerados, THE Sistema_Pastelada SHALL calcular KPIs (total vendas, pastéis vendidos, ranking sabores)
4. THE Sistema_Pastelada SHALL permitir filtros por sabor, vendedor e período
5. THE Sistema_Pastelada SHALL exibir dados em formato tabular com paginação

### Requisito 9

**User Story:** Como um administrador, eu quero autenticação segura, para que apenas usuários autorizados acessem funções administrativas.

#### Acceptance Criteria

1. WHEN um usuário acessa /adm sem autenticação, THE Sistema_Pastelada SHALL redirecionar para tela de login
2. WHEN credenciais válidas são fornecidas, THE Sistema_Pastelada SHALL autenticar via Supabase Auth
3. WHEN um administrador está autenticado, THE Sistema_Pastelada SHALL permitir acesso a todas as funcionalidades admin
4. THE Sistema_Pastelada SHALL usar email e senha para autenticação de administradores
5. THE Sistema_Pastelada SHALL manter sessão ativa conforme configurações do Supabase

### Requisito 10

**User Story:** Como desenvolvedor do sistema, eu quero APIs server-side seguras, para que operações de escrita sejam protegidas e validadas.

#### Acceptance Criteria

1. WHEN uma venda é registrada, THE Sistema_Pastelada SHALL validar vendedor ativo e itens válidos via API
2. WHEN dados são enviados para API, THE Sistema_Pastelada SHALL usar service role key apenas no servidor
3. WHEN clientes fazem requisições, THE Sistema_Pastelada SHALL usar anonymous key apenas para leituras públicas
4. THE Sistema_Pastelada SHALL implementar RLS (Row Level Security) em todas as tabelas
5. THE Sistema_Pastelada SHALL calcular totais automaticamente via triggers no banco

### Requisito 11

**User Story:** Como usuário do sistema, eu quero interface responsiva, para que eu possa usar o sistema eficientemente em dispositivos móveis.

#### Acceptance Criteria

1. WHEN o sistema é acessado em dispositivos móveis, THE Sistema_Pastelada SHALL adaptar layout para telas pequenas
2. WHEN interações são realizadas, THE Sistema_Pastelada SHALL fornecer feedback visual (loading, toasts, erros)
3. WHEN formulários são submetidos, THE Sistema_Pastelada SHALL desabilitar botões para evitar duplo clique
4. THE Sistema_Pastelada SHALL usar Tailwind CSS para responsividade
5. THE Sistema_Pastelada SHALL manter usabilidade consistente entre desktop e mobile