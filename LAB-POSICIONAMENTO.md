# 📐 Laboratório 5 - Posicionamento e Z-index

## 🎯 Objetivo
Dominar as propriedades de posicionamento CSS para criar layouts complexos e elementos interativos modernos.

## ✨ Características do Laboratório

### 🔧 Funcionalidades Implementadas
- ✅ **Header Fixo Moderno** - `position: fixed` com animação de scroll
- ✅ **Modal Centralizado** - Popup sobreposto com backdrop blur
- ✅ **Menu Hambúrguer Deslizante** - Menu lateral com overlay
- ✅ **Sistema de Badges** - Notificações com contador interativo
- ✅ **Elementos Sticky** - Comportamento híbrido relative/fixed
- ✅ **Z-index Interativo** - Demonstração prática de empilhamento
- ✅ **Tooltips** - Dicas contextuais posicionadas
- ✅ **Botão Flutuante** - FAB (Floating Action Button)

### 🎨 Design System
- **Paleta de Cores**: Baseada no `globals.css` do projeto
- **Tipografia**: Inter + JetBrains Mono
- **Animações**: Transições suaves em 0.2s-0.3s
- **Responsividade**: Mobile-first design
- **Acessibilidade**: ARIA labels, contraste adequado

### 🌐 Compatibilidade
- **Deploy**: Vercel + GitHub Pages
- **Browsers**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Devices**: 320px até 4K
- **Performance**: CSS otimizado, lazy loading

## 📂 Estrutura de Arquivos

```
posicionamento.html         # HTML principal do laboratório
posicionamento.css          # CSS completo com namespace isolado
public/
├── posicionamento.html     # Cópia para build/deploy
└── posicionamento.css      # Cópia para build/deploy
```

## 🚀 Como Acessar

### Local (Desenvolvimento)
```bash
cd "c:\Users\Gabriel.Malheiros\OneDrive - FAESA\Desktop\HTML\DesenvolvimentoWeb-2025-2"
npm run dev
# Acesse: http://localhost:3000/posicionamento.html
```

### Local (Preview)
```bash
npm run build
npm run preview
# Acesse: http://localhost:4173/posicionamento.html
```

### Produção (Após Deploy)
- **URL Principal**: `https://desenvolvimento-web-2025-2.vercel.app/posicionamento.html`
- **GitHub Pages**: `https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2/posicionamento.html`

## 📚 Conceitos Demonstrados

### 1. Position Types
```css
/* static (padrão) - Fluxo normal do documento */
.elemento { position: static; }

/* relative - Relativo à posição original */
.elemento { 
    position: relative; 
    top: 20px; 
    left: 50px; 
}

/* absolute - Relativo ao ancestral posicionado */
.elemento { 
    position: absolute; 
    top: 0; 
    right: 0; 
}

/* fixed - Relativo à viewport */
.elemento { 
    position: fixed; 
    bottom: 30px; 
    right: 30px; 
}

/* sticky - Híbrido relative/fixed */
.elemento { 
    position: sticky; 
    top: 100px; 
}
```

### 2. Z-index e Stacking Context
```css
.elemento {
    position: relative; /* Obrigatório para z-index funcionar */
    z-index: 10; /* Maior valor = mais na frente */
}

/* Hierarquia de z-index do projeto */
--pos-z-dropdown: 1000;
--pos-z-sticky: 1020;
--pos-z-fixed: 1030;
--pos-z-modal-backdrop: 1040;
--pos-z-modal: 1050;
--pos-z-tooltip: 1070;
```

### 3. Centralização de Elementos
```css
/* Método 1: Transform */
.centralizado {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Método 2: Flexbox */
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
```

## ⚡ Funcionalidades JavaScript

### Menu Hambúrguer
```javascript
function toggleMenu() {
    const menu = document.getElementById('menuLateral');
    const overlay = document.getElementById('menuOverlay');
    // Toggle classes e controle de overflow
}
```

### Modal Centralizado
```javascript
function abrirModal() {
    document.getElementById('modalOverlay').classList.add('ativo');
    document.body.style.overflow = 'hidden'; // Previne scroll
}
```

### Z-index Interativo
```javascript
function alterarZIndex(elemento, camada) {
    const novoZ = prompt(`Digite o novo z-index:`);
    elemento.style.zIndex = novoZ;
    // Atualiza interface em tempo real
}
```

### Sistema de Notificações
```javascript
function adicionarNotificacao() {
    contadorNotificacao++;
    document.getElementById('badgeNotificacao').textContent = contadorNotificacao;
    mostrarFeedback('✅ Notificação adicionada!');
}
```

## 🎯 Elementos Interativos Detalhados

### 1. 🔲 Modal Centralizado
**Funcionalidade**: Popup sobreposto ao conteúdo
**Posicionamento**: `position: fixed` com centralização flexbox
**Features**:
- Backdrop com blur effect
- Animação de entrada/saída
- Fecha com ESC ou clique fora
- Previne scroll da página

### 2. 🍔 Menu Hambúrguer
**Funcionalidade**: Menu lateral deslizante
**Posicionamento**: `position: fixed` com animação right
**Features**:
- Ícone animado (3 linhas → X)
- Overlay escuro
- Navegação interna
- Links para outras seções

### 3. 🔔 Badge de Notificação
**Funcionalidade**: Indicador de quantidade
**Posicionamento**: `position: absolute` no canto do ícone
**Features**:
- Contador dinâmico
- Animação de pulso
- Desaparece quando zerado
- Feedback visual

### 4. 💬 Tooltip
**Funcionalidade**: Dica contextual
**Posicionamento**: `position: absolute` com pseudo-elementos
**Features**:
- Aparece no hover
- Seta indicativa
- Z-index elevado
- Centralização automática

### 5. 📌 Botão Flutuante (FAB)
**Funcionalidade**: Ação principal sempre visível
**Posicionamento**: `position: fixed` no canto inferior
**Features**:
- Sempre visível durante scroll
- Animação hover (scale + shadow)
- Ícone SVG responsivo
- Ação "voltar ao topo"

## 🔧 Sistema de Namespace

O laboratório utiliza namespace CSS isolado para evitar conflitos:

```css
.pagina-posicionamento {
    --pos-brand-primary: #2563eb;
    --pos-bg-primary: #ffffff;
    /* Todas as variáveis com prefixo --pos- */
}

.pagina-posicionamento * {
    /* Estilos aplicados apenas dentro do contexto */
}
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px (1 coluna, menu compacto)
- **Tablet**: 768px - 1024px (2 colunas, layout híbrido)
- **Desktop**: > 1024px (3+ colunas, layout completo)

### Adaptações Mobile
- Header compacto sem badge
- Menu lateral mais estreito (280px → 320px)
- Botões menores (50px → 60px)
- Grid de uma coluna
- Z-index boxes menores
- Modal ocupa 95% da largura

## 🛡️ Segurança e Compatibilidade

### Isolamento CSS
- ✅ Namespace `.pagina-posicionamento` impede conflitos
- ✅ Variáveis CSS com prefixo `--pos-*`
- ✅ Classes específicas sem interferência no React

### Build System
- ✅ Cópia automática para `public/`
- ✅ Incluído no processo de build do Vite
- ✅ Deploy automático no Vercel
- ✅ Compatível com GitHub Pages

### Performance
- ✅ CSS otimizado (minificado no build)
- ✅ JavaScript vanilla (sem dependências)
- ✅ Imagens SVG inline (sem requisições extras)
- ✅ Transições em GPU (transform, opacity)

## 🎓 Aplicação Pedagógica

### Conceitos Abordados
1. **Fluxo do Documento** - Como position altera o fluxo normal
2. **Stacking Context** - Como z-index e posicionamento criam camadas
3. **Viewport vs Document** - Diferença entre fixed e absolute
4. **Containing Block** - Como ancestrais afetam posicionamento absolute
5. **Performance** - Uso de transform para animações eficientes

### Exercícios Práticos
- [ ] Alterar z-index das caixas e observar empilhamento
- [ ] Modificar posições do menu e modal
- [ ] Criar novos elementos posicionados
- [ ] Implementar sticky headers personalizados
- [ ] Desenvolver tooltips em outras posições

## 📝 Notas Técnicas

### JavaScript ES6+
- Arrow functions para callbacks
- Template literals para strings
- Destructuring para elementos DOM
- Async/await não necessário (sem requisições)

### CSS Moderno
- Custom Properties (variáveis CSS)
- Flexbox para alinhamento
- Grid para layouts complexos
- Transform para animações eficientes
- Backdrop-filter para efeitos modernos

### Acessibilidade
- ARIA labels em botões
- Focus management em modais
- Contraste adequado (WCAG AA)
- Navegação por teclado (ESC, Enter)
- Tamanhos de toque mínimos (44px)

## 🚀 Próximos Passos

1. **Expandir Interatividade**: Adicionar drag & drop
2. **Novos Elementos**: Implementar dropdowns complexos
3. **Animações Avançadas**: Usar CSS animations
4. **PWA Features**: Service worker para offline
5. **Testes**: Implementar testes automatizados

---

📚 **Laboratório criado para o curso de Desenvolvimento Web - FAESA 2025**  
👨‍💻 **Autor**: Gabriel Malheiros de Castro  
🌐 **URL**: https://desenvolvimento-web-2025-2.vercel.app/posicionamento.html