# Configuração de Pagamento PIX

## Visão Geral

O sistema agora suporta upload e exibição de QR Code PIX para pagamentos. Esta funcionalidade permite que os vendedores mostrem o QR Code durante o processo de venda.

## Como Configurar

### 1. Acessar Configurações

1. Faça login como administrador em `/adm/login`
2. Navegue para **Configurações** no menu lateral
3. Role até a seção **Configurações PIX**

### 2. Configurar Chave PIX (Opcional)

- Digite sua chave PIX no campo **Chave PIX**
- Pode ser: email, telefone, CPF/CNPJ ou chave aleatória
- Esta chave será exibida no modal de pagamento para referência
- Os clientes poderão copiar a chave com um clique

### 3. Upload do QR Code

1. Clique em **Escolher arquivo** no campo **QR Code PIX**
2. Selecione uma imagem do QR Code (PNG, JPG, GIF, WEBP)
3. Tamanho máximo: **2MB**
4. Um preview será exibido automaticamente
5. Clique em **Salvar Configurações**

### 4. Verificar Configuração

Após salvar:
- O QR Code será armazenado no Supabase Storage
- O preview será atualizado com a imagem salva
- A chave PIX será salva no banco de dados

## Como Funciona na Venda

### Fluxo de Pagamento PIX

1. Vendedor adiciona itens ao carrinho
2. Clica em **Salvar Pedido**
3. Preenche dados do cliente
4. Seleciona **Pagamento via PIX**
5. Modal PIX é exibido com:
   - QR Code para escanear
   - Chave PIX (com botão copiar)
   - Valor total
   - Detalhes do pedido
6. Cliente escaneia o QR Code ou copia a chave
7. Vendedor confirma o pagamento após receber

## Estrutura Técnica

### Banco de Dados

A tabela `app_settings` armazena:
```sql
- pix_qr_image_path: text (caminho no storage)
- pix_key_text: text (chave PIX)
```

### Supabase Storage

- **Bucket**: `public-assets`
- **Pasta**: `qr-codes/`
- **Acesso**: Público (leitura)
- **Limite**: 5MB por arquivo
- **Tipos permitidos**: PNG, JPG, JPEG, GIF, WEBP

### APIs

#### Upload de QR Code
```
POST /api/settings/upload-qr
Content-Type: multipart/form-data

Body: FormData com campo 'file'

Response:
{
  "path": "qr-codes/pix-qr-code-1234567890.png",
  "url": "https://[projeto].supabase.co/storage/v1/object/public/public-assets/qr-codes/..."
}
```

#### Atualizar Configurações
```
PATCH /api/settings
Content-Type: application/json

Body:
{
  "pix_qr_image_path": "qr-codes/pix-qr-code-1234567890.png",
  "pix_key_text": "email@exemplo.com"
}
```

## Validações

### Upload de Arquivo
- ✅ Apenas imagens são aceitas
- ✅ Tamanho máximo: 2MB
- ✅ Formatos: PNG, JPG, JPEG, GIF, WEBP
- ✅ Nome único gerado automaticamente

### Chave PIX
- ✅ Campo opcional
- ✅ Aceita qualquer formato de chave
- ✅ Pode ser deixado em branco

## Segurança

### Permissões do Storage
- **Leitura pública**: Qualquer pessoa pode ver o QR Code
- **Escrita**: Apenas service role (API) pode fazer upload
- **Atualização**: Apenas service role pode atualizar
- **Exclusão**: Apenas service role pode deletar

### Validações de API
- Tipo de arquivo verificado no servidor
- Tamanho de arquivo validado
- Buffer de arquivo processado com segurança
- Erros tratados e logados

## Troubleshooting

### QR Code não aparece no modal
1. Verifique se o upload foi bem-sucedido
2. Confirme que o Supabase Storage está configurado
3. Verifique se o bucket `public-assets` existe
4. Confirme que as políticas RLS estão ativas

### Erro ao fazer upload
1. Verifique o tamanho do arquivo (máx 2MB)
2. Confirme que é uma imagem válida
3. Verifique as credenciais do Supabase
4. Confirme que o bucket existe

### Chave PIX não aparece
1. Verifique se foi salva nas configurações
2. Confirme que não está vazia
3. Recarregue a página de vendas

## Próximos Passos

Possíveis melhorias futuras:
- [ ] Gerar QR Code automaticamente a partir da chave PIX
- [ ] Suportar múltiplas chaves PIX
- [ ] Histórico de QR Codes anteriores
- [ ] Validação de formato de chave PIX
- [ ] Integração com API de pagamento PIX
- [ ] Confirmação automática de pagamento

## Suporte

Para problemas ou dúvidas:
1. Verifique os logs do console do navegador
2. Verifique os logs do servidor Next.js
3. Confirme a configuração do Supabase
4. Revise a documentação do Supabase Storage
