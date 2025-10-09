# Interface Gráfica Pessoal

Este é um projeto de portfólio pessoal construído com React + Vite + TypeScript, desenvolvido como parte do curso de Desenvolvimento Web da FAESA. O projeto demonstra a conversão de design Figma para código funcional.

**🌐 Projeto Original no Figma:** https://www.figma.com/design/YhRfiVLoaaxLm9j3TH7xOP/Interface-Gr%C3%A1fica-Pessoal

## 🔗 Link do Portfólio (Controlado via CSS)

O link do seu portfólio online é **controlado dinamicamente via CSS** usando propriedades personalizadas. Para alterar o link:

### 🎯 Como Alterar o Link via CSS

**1. Abra o arquivo:** `src/styles/globals.css`

**2. Encontre a seção:**
```css
:root {
  /* 🌐 Sistema de Link do Portfólio - Controlado via CSS */
  --portfolio-url: "https://portfolio-gabriel-malheiros.vercel.app";
  --portfolio-status: "deployed"; /* deployed | pending | local */
  --portfolio-platform: "Vercel"; /* Vercel | Netlify | GitHub Pages */
  --portfolio-display-text: "🌐 Acessar Portfólio Online";
}
```

**3. Altere as propriedades conforme necessário:**

```css
/* ✅ EXEMPLO: Após deploy na Vercel */
:root {
  --portfolio-url: "https://meu-portfolio-react.vercel.app";
  --portfolio-status: "deployed";
  --portfolio-platform: "Vercel";
  --portfolio-display-text: "🌐 Ver Portfólio no Vercel";
}

/* ✅ EXEMPLO: Após deploy no Netlify */
:root {
  --portfolio-url: "https://amazing-portfolio-123.netlify.app";
  --portfolio-status: "deployed";
  --portfolio-platform: "Netlify";
  --portfolio-display-text: "🌐 Ver Portfólio no Netlify";
}

/* ✅ EXEMPLO: GitHub Pages */
:root {
  --portfolio-url: "https://gabriel-malheiros.github.io/DesenvolvimentoWeb-2025-2";
  --portfolio-status: "deployed";
  --portfolio-platform: "GitHub Pages";
  --portfolio-display-text: "🌐 Ver no GitHub Pages";
}

/* ⏳ EXEMPLO: Deploy em andamento */
:root {
  --portfolio-url: "https://deploy-em-andamento.vercel.app";
  --portfolio-status: "pending";
  --portfolio-platform: "Vercel";
  --portfolio-display-text: "⏳ Deploy em andamento...";
}
```

### 🔧 Estados do Status

| Status | Descrição | Comportamento |
|--------|-----------|---------------|
| `"deployed"` | Link ativo e funcionando | ✅ Clicável, abre em nova aba |
| `"pending"` | Deploy em andamento | ⏳ Não clicável, mostra loading |
| `"local"` | Apenas desenvolvimento local | 🔧 Não clicável, apenas visual |

### 🎯 Como Usar o Componente

```jsx
// Botão padrão (recomendado)
<PortfolioLink />

// Badge pequeno
<PortfolioLink variant="badge" />

// Link inline
<PortfolioLink variant="inline" />

// Com informações de debug (desenvolvimento)
<PortfolioLink showDebugInfo={true} />

// Com estilo personalizado
<PortfolioLink className="my-4" variant="button" />
```

### ✨ Funcionalidades do Sistema

- **🔍 Detecção automática:** Identifica URLs inválidas ou placeholder
- **🎨 Estados visuais:** Diferentes estilos para deployed/pending/local
- **⚡ Tempo real:** Mudanças no CSS refletem instantaneamente
- **🛡️ Validação:** Impede cliques em URLs inválidas
- **🎯 Acessibilidade:** Suporte completo a screen readers

### 🚨 URLs que NÃO funcionam (detectadas automaticamente)

```css
/* ❌ Estas URLs serão marcadas como inválidas: */
--portfolio-url: "https://seu-portfolio.vercel.app";           /* Placeholder */
--portfolio-url: "https://localhost:3000";                    /* Local */
--portfolio-url: "https://example.com";                       /* Exemplo */
--portfolio-url: "not-a-valid-url";                          /* Formato inválido */
```

## 🚀 Deploy e Acesso Público

### Opções de Deploy Gratuito

#### 1. **Vercel (Recomendado para React)**
```powershell
# Instalar CLI da Vercel
npm i -g vercel

# Fazer deploy
npm run build
npx vercel --prod

# ✅ Após deploy, copie o link gerado e cole em globals.css
```

#### 2. **Netlify**
```powershell
# Instalar CLI do Netlify
npm i -g netlify-cli

# Fazer deploy
npm run build
npx netlify deploy --prod --dir=dist

# ✅ Após deploy, copie o link gerado e cole em globals.css
```

#### 3. **GitHub Pages**
```powershell
# Fazer build e deploy via GitHub Actions
git add .
git commit -m "feat: deploy para GitHub Pages"
git push origin main

# ✅ Após deploy, o link será: https://seu-usuario.github.io/DesenvolvimentoWeb-2025-2
```

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Instalação e Execução
```powershell
# Instalar dependências
npm i

# Iniciar servidor de desenvolvimento (localhost:3000)
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes reutilizáveis (shadcn/ui)
│   └── figma/        # Componentes específicos do Figma
├── assets/           # Imagens e recursos estáticos
├── styles/           # Estilos globais e CSS personalizado
└── App.tsx           # Componente principal

public/               # Assets públicos
dist/                 # Build de produção (gerado)
```

## 🎨 Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS + shadcn/ui
- **Componentes:** Radix UI primitives
- **Ícones:** Lucide React
- **Deploy:** Vercel/Netlify/GitHub Pages

## 📝 Scripts Disponíveis

```powershell
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
```

## 🔧 Fluxo Completo: Do Desenvolvimento ao Link Público

### 1. **Desenvolvimento Local**
```powershell
npm run dev  # Testar localmente
```

### 2. **Preparar para Deploy**
```css
/* Em src/styles/globals.css - ANTES do deploy */
:root {
  --portfolio-url: "https://meu-projeto.vercel.app";  /* URL esperada */
  --portfolio-status: "pending";                       /* Status: pendente */
  --portfolio-platform: "Vercel";                     /* Plataforma escolhida */
}
```

### 3. **Fazer Deploy**
```powershell
npm run build
npx vercel --prod  # ou netlify deploy --prod
```

### 4. **Atualizar com Link Real**
```css
/* DEPOIS do deploy - copie o link real */
:root {
  --portfolio-url: "https://portfolio-gabriel-123abc.vercel.app";  /* ✅ Link real */
  --portfolio-status: "deployed";                                  /* ✅ Ativo */
  --portfolio-platform: "Vercel";
}
```

### 5. **Publicar Mudança**
```powershell
git add .
git commit -m "feat: atualiza link do portfólio para produção"
git push origin main
```

### 🎯 Exemplo Prático Completo

**Antes do deploy:**
```css
--portfolio-url: "https://meu-portfolio.vercel.app";
--portfolio-status: "pending";
```
**Resultado:** ⏳ Deploy pendente (Vercel) - não clicável

**Depois do deploy:**
```css
--portfolio-url: "https://portfolio-gabriel-abc123.vercel.app";
--portfolio-status: "deployed";
```
**Resultado:** 🌐 Acessar Portfólio Online - clicável e funcional!

## 🎓 Projeto Acadêmico - FAESA

Este projeto faz parte do curso de Desenvolvimento Web da FAESA (Faculdades Integradas Espírito-Santenses), demonstrando:

- Conversão de design Figma para código React
- Arquitetura moderna de componentes
- Boas práticas de desenvolvimento web
- Deploy e hospedagem de aplicações React

---

**Desenvolvido por:** Gabriel Malheiros  
**Instituição:** FAESA - Faculdades Integradas Espírito-Santenses  
**Curso:** Desenvolvimento Web 2025-2
