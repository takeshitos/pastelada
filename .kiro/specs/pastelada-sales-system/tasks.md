# Plano de Implementação - Sistema Pastelada

- [x] 1. Configurar projeto Next.js e dependências





  - Criar projeto Next.js 14 com App Router e TypeScript
  - Instalar dependências: @supabase/supabase-js, tailwindcss, fast-check para property testing
  - Configurar estrutura de pastas (app, components, lib, types)
  - Configurar variáveis de ambiente para Supabase
  - _Requirements: Todos os requisitos dependem desta base_

- [x] 2. Configurar Supabase e banco de dados





  - [x] 2.1 Criar tabelas do banco de dados


    - Implementar DDL para vendors, customers, flavors, app_settings, orders, order_items
    - Criar índices necessários para performance
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1_

  - [x] 2.2 Implementar triggers e funções automáticas


    - Criar função calculate_line_total() para order_items
    - Criar função update_order_total() para recálculo automático
    - Implementar triggers para cálculos automáticos
    - _Requirements: 10.5_

  - [ ]* 2.3 Escrever teste de propriedade para cálculos automáticos
    - **Property 21: Database calculation automation**
    - **Validates: Requirements 10.5**

  - [x] 2.4 Configurar RLS (Row Level Security)


    - Ativar RLS em todas as tabelas
    - Criar policies para leituras públicas (flavors ativos, app_settings)
    - Configurar policies para operações administrativas
    - _Requirements: 10.4_

  - [x] 2.5 Configurar Supabase Storage


    - Criar bucket 'public-assets' para QR codes PIX
    - Configurar permissões de leitura pública e escrita admin
    - _Requirements: 6.2_

  - [x] 2.6 Inserir dados iniciais (seeds)


    - Inserir registro app_settings com id=1 e preço padrão
    - Criar sabores de exemplo (opcional)
    - Documentar criação de usuário admin
    - _Requirements: 6.5_

- [x] 3. Implementar tipos TypeScript e utilitários





  - [x] 3.1 Definir interfaces de dados


    - Criar tipos para Vendor, Customer, Flavor, Order, OrderItem, AppSettings
    - Definir tipos para requests/responses da API
    - Criar tipos para componentes e props
    - _Requirements: Todos os requisitos se beneficiam de type safety_

  - [x] 3.2 Implementar funções utilitárias


    - Função de formatação de moeda (centavos para reais)
    - Função de validação de telefone (apenas números)
    - Função de validação de nome (mínimo 2 caracteres)
    - Utilitários de data e localStorage
    - _Requirements: 1.2, 1.5, 4.5, 6.4_

  - [ ]* 3.3 Escrever testes de propriedade para validações
    - **Property 1: Vendor name validation**
    - **Property 4: Input validation consistency**
    - **Property 13: Currency conversion consistency**
    - **Validates: Requirements 1.2, 1.5, 2.5, 6.4**

- [x] 4. Implementar cliente Supabase e configuração





  - [x] 4.1 Configurar clientes Supabase


    - Cliente público (anonymous key) para leituras
    - Cliente servidor (service role) para APIs
    - Configurar autenticação para admin
    - _Requirements: 9.2, 10.2, 10.3_

  - [x] 4.2 Implementar hooks de dados


    - Hook para buscar sabores ativos
    - Hook para buscar configurações (preço, QR PIX)
    - Hook para buscar vendedores ativos
    - _Requirements: 2.1, 5.1, 6.1, 7.1_

- [x] 5. Implementar APIs server-side





  - [x] 5.1 Criar API POST /api/orders


    - Validar vendor_id ativo
    - Validar itens e quantidades
    - Criar/buscar customer por telefone
    - Criar order e order_items com preço atual
    - Retornar resumo da venda
    - _Requirements: 3.2, 3.3, 3.5, 10.1_

  - [ ]* 5.2 Escrever teste de propriedade para criação de pedidos
    - **Property 6: Order persistence with correct attributes**
    - **Property 20: API validation completeness**
    - **Validates: Requirements 3.2, 3.3, 3.5, 10.1**

  - [x] 5.3 Criar API GET /api/vendor-sales


    - Filtrar vendas por vendor_id
    - Implementar filtros de data
    - Incluir dados de itens e cliente
    - Implementar paginação
    - _Requirements: 4.1, 4.3_

  - [ ]* 5.4 Escrever teste de propriedade para filtros de vendas
    - **Property 7: Vendor-specific data filtering**
    - **Property 9: Date range filtering**
    - **Validates: Requirements 4.1, 4.3**

- [ ] 6. Checkpoint - Verificar APIs e banco
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implementar componentes base e layout
  - [ ] 7.1 Criar componentes UI básicos
    - Componente Toast para notificações
    - Componente LoadingSpinner
    - Componente Modal reutilizável
    - Componente Table responsivo
    - _Requirements: 11.2_

  - [ ] 7.2 Implementar layout responsivo
    - Layout base com Tailwind CSS
    - Breakpoints para mobile/desktop
    - Navegação adaptativa
    - _Requirements: 11.1, 11.4_

  - [ ]* 7.3 Escrever teste de propriedade para responsividade
    - **Property 22: Responsive layout adaptation**
    - **Validates: Requirements 11.1**

- [ ] 8. Implementar tela inicial e gestão de vendedores
  - [ ] 8.1 Criar página inicial (/)
    - Formulário de cadastro de vendedor
    - Lista de vendedores ativos
    - Validação de nome e telefone
    - Seleção de vendedor com storage local
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [ ]* 8.2 Escrever teste de propriedade para seleção de vendedor
    - **Property 2: Vendor selection and session management**
    - **Validates: Requirements 1.3**

  - [ ] 8.3 Implementar proteção de rota para vendas
    - Verificar vendor_id no localStorage
    - Redirecionar para home se não logado
    - _Requirements: 1.4_

  - [ ]* 8.4 Escrever teste de propriedade para controle de acesso
    - **Property 3: Access control for sales page**
    - **Validates: Requirements 1.4**

- [ ] 9. Implementar tela de vendas
  - [ ] 9.1 Criar página de vendas (/vender)
    - Exibir preço atual e sabores ativos
    - Controles de quantidade (+/- para cada sabor)
    - Cálculo dinâmico do total
    - Botão "Salvar pedido"
    - _Requirements: 2.1, 2.2, 2.5_

  - [ ]* 9.2 Escrever teste de propriedade para cálculo dinâmico
    - **Property 5: Dynamic total calculation**
    - **Validates: Requirements 2.2**

  - [ ] 9.3 Implementar modal de dados do cliente
    - Formulário com nome (obrigatório) e telefone (opcional)
    - Validação de campos
    - Botão "Salvar e escolher pagamento"
    - _Requirements: 2.3, 2.4_

  - [ ] 9.4 Implementar seleção de método de pagamento
    - Opções PIX e Pagamento Local
    - Modal PIX com QR code, valor e itens
    - Confirmação de pagamento
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 9.5 Implementar finalização de venda
    - Chamada para API /api/orders
    - Feedback de sucesso/erro
    - Opções "Outra compra" e "Sair"
    - _Requirements: 3.4, 3.5_

  - [ ]* 9.6 Escrever testes de propriedade para proteção de formulários
    - **Property 24: Form submission protection**
    - **Validates: Requirements 11.3**

- [ ] 10. Implementar tela de vendas do vendedor
  - [ ] 10.1 Criar página de vendas do vendedor (/vendas)
    - Tabela com vendas do vendedor logado
    - Colunas: data/hora, total, método, status, itens
    - Formatação de valores em reais
    - _Requirements: 4.1, 4.2, 4.5_

  - [ ]* 10.2 Escrever teste de propriedade para formatação de dados
    - **Property 8: Sales data formatting consistency**
    - **Validates: Requirements 4.2, 4.5**

  - [ ] 10.3 Implementar filtros de período
    - Filtros: hoje, 7 dias, mês
    - Busca simples por texto
    - Atualização dinâmica da lista
    - _Requirements: 4.3, 4.4_

- [ ] 11. Implementar autenticação admin
  - [ ] 11.1 Criar página de login admin (/adm/login)
    - Formulário email/senha
    - Integração com Supabase Auth
    - Redirecionamento após login
    - _Requirements: 9.1, 9.2, 9.4_

  - [ ]* 11.2 Escrever teste de propriedade para autenticação
    - **Property 18: Admin authentication enforcement**
    - **Property 19: Authentication state consistency**
    - **Validates: Requirements 9.1, 9.2, 9.3**

  - [ ] 11.3 Implementar layout admin protegido
    - Verificação de autenticação
    - Layout com navegação admin
    - Logout functionality
    - _Requirements: 9.3_

- [ ] 12. Implementar painel administrativo
  - [ ] 12.1 Criar gestão de sabores
    - CRUD completo de sabores
    - Validação de nomes únicos
    - Ativação/desativação
    - Proteção contra exclusão com vendas
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 12.2 Escrever testes de propriedade para gestão de sabores
    - **Property 10: Flavor management integrity**
    - **Property 11: Flavor name uniqueness**
    - **Validates: Requirements 5.2, 5.3, 5.5**

  - [ ] 12.3 Criar gestão de configurações
    - Edição de preço do pastel
    - Upload de QR code PIX
    - Preview de imagem
    - Conversão reais/centavos
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 12.4 Escrever testes de propriedade para configurações
    - **Property 12: Price change propagation**
    - **Property 14: Configuration singleton**
    - **Validates: Requirements 6.1, 6.5**

  - [ ] 12.5 Criar gestão de vendedores
    - Listagem com status ativo/inativo
    - Edição de dados (nome, telefone, status)
    - Preferência por desativação vs exclusão
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 12.6 Escrever teste de propriedade para gestão de vendedores
    - **Property 15: Vendor management with history preservation**
    - **Validates: Requirements 7.3, 7.4**

- [ ] 13. Implementar relatórios administrativos
  - [ ] 13.1 Criar página de relatórios
    - Tabela com todas as vendas
    - Filtros por sabor, vendedor, período
    - Paginação e busca
    - _Requirements: 8.1, 8.4, 8.5_

  - [ ]* 13.2 Escrever teste de propriedade para filtros de relatórios
    - **Property 16: Report filtering accuracy**
    - **Validates: Requirements 8.2**

  - [ ] 13.3 Implementar KPIs e métricas
    - Total de vendas
    - Total de pastéis vendidos
    - Ranking de sabores
    - Cálculos dinâmicos baseados em filtros
    - _Requirements: 8.3_

  - [ ]* 13.4 Escrever teste de propriedade para cálculo de KPIs
    - **Property 17: KPI calculation correctness**
    - **Validates: Requirements 8.3**

- [ ] 14. Implementar feedback visual e UX
  - [ ] 14.1 Adicionar estados de loading
    - Spinners durante requisições
    - Desabilitação de botões durante submit
    - Feedback visual em todas as interações
    - _Requirements: 11.2, 11.3_

  - [ ]* 14.2 Escrever teste de propriedade para feedback do usuário
    - **Property 23: User feedback consistency**
    - **Validates: Requirements 11.2**

  - [ ] 14.3 Implementar tratamento de erros
    - Toast notifications para erros/sucessos
    - Mensagens de erro específicas
    - Fallbacks para falhas de rede
    - _Requirements: Error Handling section_

- [ ] 15. Checkpoint final - Testes e validação
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Documentação e deploy
  - [ ] 16.1 Criar documentação de setup
    - Instruções de instalação
    - Configuração de variáveis de ambiente
    - Setup do Supabase
    - Criação de usuário admin
    - _Requirements: Deployment requirements_

  - [ ] 16.2 Preparar para deploy
    - Configurar build para produção
    - Otimizar assets e imagens
    - Configurar variáveis de ambiente para Vercel
    - Testar build local
    - _Requirements: Production deployment_