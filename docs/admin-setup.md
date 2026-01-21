# Configuração do Usuário Administrador

## Criação do Usuário Admin

Para criar um usuário administrador no sistema, siga os passos abaixo:

### 1. Via Supabase Dashboard

1. Acesse o painel do Supabase (https://supabase.com/dashboard)
2. Navegue até seu projeto
3. Vá para **Authentication** > **Users**
4. Clique em **Add user**
5. Preencha:
   - **Email**: email do administrador (ex: admin@pastelada.com)
   - **Password**: senha segura
   - **Email Confirm**: marque como confirmado
6. Clique em **Create user**

### 2. Via SQL (Alternativo)

Execute o seguinte SQL no editor SQL do Supabase:

```sql
-- Inserir usuário admin diretamente na tabela auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@pastelada.com',
  crypt('sua_senha_aqui', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);
```

### 3. Testando o Login

1. Acesse a página `/adm/login` do sistema
2. Use as credenciais criadas:
   - **Email**: admin@pastelada.com
   - **Senha**: a senha definida
3. Após o login, você terá acesso completo ao painel administrativo

### 4. Configurações Iniciais Recomendadas

Após o primeiro login como admin, configure:

1. **Preço do Pastel**: Ajuste o preço padrão em Configurações
2. **QR Code PIX**: Faça upload do QR code para pagamentos PIX
3. **Sabores**: Revise e ajuste os sabores disponíveis
4. **Vendedores**: Cadastre os vendedores iniciais

## Segurança

- Use senhas fortes para contas administrativas
- Mantenha as credenciais seguras
- Considere usar autenticação de dois fatores quando disponível
- Revise regularmente os acessos administrativos

## Troubleshooting

### Erro de Login
- Verifique se o email está confirmado no Supabase
- Confirme se as variáveis de ambiente estão configuradas corretamente
- Verifique se o RLS está configurado adequadamente

### Sem Acesso ao Painel
- Confirme se o usuário tem role 'authenticated'
- Verifique se as policies de RLS estão ativas
- Teste a conexão com o Supabase