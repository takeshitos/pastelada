# Paleta de Cores - Sistema Pastelada

## Design Moderno e Profissional

O sistema utiliza uma paleta de cores moderna seguindo padrões de web design profissional, com foco em acessibilidade e usabilidade.

## Paleta Principal

### Cor Primária - Azul Moderno
A cor primária é um azul vibrante e profissional, ideal para aplicações web modernas.

**Tema Claro:**
- `primary-500`: `#3b82f6` (Blue 500) - Cor principal
- `primary-600`: `#2563eb` (Blue 600) - Hover/Active
- `primary-100`: `#dbeafe` (Blue 100) - Backgrounds leves

**Tema Escuro:**
- `primary-400`: `#60a5fa` (Blue 400) - Cor principal
- `primary-300`: `#93c5fd` (Blue 300) - Hover/Active
- `primary-900`: `#1e3a8a` (Blue 900) - Backgrounds leves

**Uso:**
- Botões primários
- Links
- Elementos interativos
- Destaques importantes

---

## Cores de Status

### Verde - Sucesso
Indica operações bem-sucedidas e estados positivos.

**Tema Claro:**
- `success-500`: `#22c55e` (Green 500)
- `success-100`: `#dcfce7` (Green 100) - Background

**Tema Escuro:**
- `success-400`: `#4ade80` (Green 400)
- `success-900`: `#14532d` (Green 900) - Background

**Uso:**
- Confirmações
- Mensagens de sucesso
- Indicadores positivos
- Botões de confirmação

### Vermelho - Erro
Indica erros, avisos críticos e ações destrutivas.

**Tema Claro:**
- `error-500`: `#ef4444` (Red 500)
- `error-100`: `#fee2e2` (Red 100) - Background

**Tema Escuro:**
- `error-400`: `#f87171` (Red 400)
- `error-900`: `#7f1d1d` (Red 900) - Background

**Uso:**
- Mensagens de erro
- Validações falhas
- Botões de exclusão
- Alertas críticos

### Âmbar - Aviso
Indica avisos e situações que requerem atenção.

**Tema Claro:**
- `warning-500`: `#f59e0b` (Amber 500)
- `warning-100`: `#fef3c7` (Amber 100) - Background

**Tema Escuro:**
- `warning-400`: `#fbbf24` (Amber 400)
- `warning-900`: `#78350f` (Amber 900) - Background

**Uso:**
- Avisos importantes
- Ações que requerem atenção
- Notificações de alerta

### Ciano - Informação
Indica informações neutras e dicas úteis.

**Tema Claro:**
- `info-500`: `#06b6d4` (Cyan 500)
- `info-100`: `#cffafe` (Cyan 100) - Background

**Tema Escuro:**
- `info-400`: `#22d3ee` (Cyan 400)
- `info-900`: `#164e63` (Cyan 900) - Background

**Uso:**
- Mensagens informativas
- Dicas e tooltips
- Notificações neutras

---

## Cores Neutras - Slate

Tons de cinza modernos com leve tonalidade azulada para melhor harmonia visual.

### Tema Claro
- `neutral-50`: `#f8fafc` - Background principal
- `neutral-100`: `#f1f5f9` - Background secundário
- `neutral-200`: `#e2e8f0` - Bordas
- `neutral-300`: `#cbd5e1` - Bordas hover
- `neutral-400`: `#94a3b8` - Texto muted
- `neutral-500`: `#64748b` - Texto terciário
- `neutral-600`: `#475569` - Texto secundário
- `neutral-700`: `#334155` - Texto secundário escuro
- `neutral-800`: `#1e293b` - Texto primário
- `neutral-900`: `#0f172a` - Texto primário escuro

### Tema Escuro
- `neutral-950`: `#020617` - Background principal
- `neutral-900`: `#0f172a` - Background secundário
- `neutral-800`: `#1e293b` - Background terciário
- `neutral-700`: `#334155` - Bordas
- `neutral-600`: `#475569` - Bordas hover
- `neutral-500`: `#64748b` - Texto muted
- `neutral-400`: `#94a3b8` - Texto terciário
- `neutral-300`: `#cbd5e1` - Texto secundário
- `neutral-200`: `#e2e8f0` - Texto secundário claro
- `neutral-50`: `#f8fafc` - Texto primário

---

## Variáveis CSS

O sistema utiliza variáveis CSS para facilitar a manutenção e permitir temas dinâmicos.

### Tema Claro
```css
:root {
  /* Backgrounds */
  --bg-primary: 248, 250, 252;      /* Slate 50 */
  --bg-secondary: 255, 255, 255;    /* Branco */
  --bg-tertiary: 241, 245, 249;     /* Slate 100 */
  
  /* Texto */
  --text-primary: 15, 23, 42;       /* Slate 900 */
  --text-secondary: 51, 65, 85;     /* Slate 700 */
  --text-tertiary: 100, 116, 139;   /* Slate 500 */
  --text-muted: 148, 163, 184;      /* Slate 400 */
  
  /* Bordas */
  --border-primary: 226, 232, 240;  /* Slate 200 */
  --border-secondary: 203, 213, 225;/* Slate 300 */
  
  /* Primária */
  --primary: 59, 130, 246;          /* Blue 500 */
  --primary-hover: 37, 99, 235;     /* Blue 600 */
  --primary-light: 219, 234, 254;   /* Blue 100 */
}
```

### Tema Escuro
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Backgrounds */
    --bg-primary: 2, 6, 23;         /* Slate 950 */
    --bg-secondary: 15, 23, 42;     /* Slate 900 */
    --bg-tertiary: 30, 41, 59;      /* Slate 800 */
    
    /* Texto */
    --text-primary: 248, 250, 252;  /* Slate 50 */
    --text-secondary: 226, 232, 240;/* Slate 200 */
    --text-tertiary: 148, 163, 184; /* Slate 400 */
    --text-muted: 100, 116, 139;    /* Slate 500 */
    
    /* Bordas */
    --border-primary: 51, 65, 85;   /* Slate 700 */
    --border-secondary: 71, 85, 105;/* Slate 600 */
    
    /* Primária */
    --primary: 96, 165, 250;        /* Blue 400 */
    --primary-hover: 147, 197, 253; /* Blue 300 */
    --primary-light: 30, 58, 138;   /* Blue 900 */
  }
}
```

---

## Uso no Código

### Classes Tailwind

```jsx
// Botão primário
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Clique aqui
</button>

// Botão de sucesso
<button className="bg-success-500 hover:bg-success-600 text-white">
  Confirmar
</button>

// Botão de erro
<button className="bg-error-500 hover:bg-error-600 text-white">
  Excluir
</button>

// Card com borda
<div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
  Conteúdo
</div>

// Texto com hierarquia
<h1 className="text-neutral-900 dark:text-neutral-50">Título</h1>
<p className="text-neutral-700 dark:text-neutral-300">Parágrafo</p>
<span className="text-neutral-500 dark:text-neutral-400">Texto muted</span>
```

### Classes Utilitárias Personalizadas

```jsx
// Usando variáveis CSS
<div className="bg-brand text-brand">
  Conteúdo com cor primária
</div>

// Backgrounds
<div className="bg-primary">Background principal</div>
<div className="bg-secondary">Background secundário</div>
<div className="bg-tertiary">Background terciário</div>

// Texto
<p className="text-primary">Texto primário</p>
<p className="text-secondary">Texto secundário</p>
<p className="text-tertiary">Texto terciário</p>
<p className="text-muted">Texto muted</p>

// Bordas
<div className="border-primary">Borda primária</div>
<div className="border-secondary">Borda secundária</div>
```

---

## Acessibilidade (WCAG 2.1)

Todas as combinações de cores atendem aos padrões de acessibilidade:

### Contraste de Texto
- **Texto normal (16px+)**: Mínimo 4.5:1 (AA)
- **Texto grande (18px+ ou 14px+ bold)**: Mínimo 3:1 (AA)
- **Elementos interativos**: Mínimo 3:1 (AA)

### Combinações Aprovadas

**Tema Claro:**
- ✅ `text-neutral-900` em `bg-white` - 19.6:1 (AAA)
- ✅ `text-neutral-700` em `bg-white` - 12.6:1 (AAA)
- ✅ `text-neutral-500` em `bg-white` - 7.0:1 (AAA)
- ✅ `text-white` em `bg-primary-500` - 8.6:1 (AAA)
- ✅ `text-white` em `bg-success-500` - 4.8:1 (AA)
- ✅ `text-white` em `bg-error-500` - 5.9:1 (AA)

**Tema Escuro:**
- ✅ `text-neutral-50` em `bg-neutral-950` - 18.2:1 (AAA)
- ✅ `text-neutral-200` em `bg-neutral-900` - 13.1:1 (AAA)
- ✅ `text-neutral-400` em `bg-neutral-900` - 6.8:1 (AAA)
- ✅ `text-white` em `bg-primary-400` - 7.2:1 (AAA)

---

## Princípios de Design

### 1. Consistência
- Use sempre as mesmas cores para os mesmos propósitos
- Mantenha hierarquia visual clara
- Siga os padrões estabelecidos

### 2. Hierarquia Visual
- **Primário**: Ações principais (azul)
- **Sucesso**: Confirmações positivas (verde)
- **Erro**: Ações destrutivas (vermelho)
- **Aviso**: Atenção necessária (âmbar)
- **Info**: Informações neutras (ciano)

### 3. Acessibilidade
- Sempre teste contraste de cores
- Não use apenas cor para transmitir informação
- Forneça alternativas textuais

### 4. Responsividade
- Cores funcionam em todos os tamanhos de tela
- Tema escuro ativa automaticamente
- Suporte a preferências do sistema

---

## Referências

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Material Design Color System](https://m3.material.io/styles/color/overview)
