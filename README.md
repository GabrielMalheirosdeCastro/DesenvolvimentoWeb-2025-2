# Interface Gráfica Pessoal

Este é um projeto de portfólio pessoal construído com React + Vite + TypeScript, desenvolvido como parte do curso de Desenvolvimento Web da FAESA. O projeto demonstra a conversão de design Figma para código funcional.

**🌐 Projeto Original no Figma:** https://www.figma.com/design/YhRfiVLoaaxLm9j3TH7xOP/Interface-Gr%C3%A1fica-Pessoal

## 🔗 Link do Portfólio (Universal - Funciona com QUALQUER Provedor)

O sistema de link do portfólio é **totalmente independente de plataforma** e funciona com qualquer provedor de hospedagem. Basta alterar a URL no CSS!

### 🌍 Provedores Suportados (Detecção Automática)

| Provedor | Exemplo de URL | Status |
|----------|----------------|--------|
| **Vercel** | `https://meu-projeto.vercel.app` | ✅ Auto-detectado |
| **Netlify** | `https://amazing-site.netlify.app` | ✅ Auto-detectado |
| **GitHub Pages** | `https://usuario.github.io/repo` | ✅ Auto-detectado |
| **Firebase** | `https://projeto.web.app` | ✅ Auto-detectado |
| **Surge.sh** | `https://meusite.surge.sh` | ✅ Auto-detectado |
| **Heroku** | `https://app.herokuapp.com` | ✅ Auto-detectado |
| **Render** | `https://app.render.com` | ✅ Auto-detectado |
| **Railway** | `https://app.railway.app` | ✅ Auto-detectado |
| **Cloudflare Pages** | `https://projeto.pages.dev` | ✅ Auto-detectado |
| **AWS Amplify** | `https://app.amplify.aws` | ✅ Auto-detectado |
| **Domínio Próprio** | `https://meusite.com.br` | ✅ Auto-detectado |
| **Qualquer Outro** | `https://qualquer-url.com` | ✅ Funciona! |

### 🎯 Como Configurar (Universal)

**1. Abra:** `src/styles/globals.css`

**2. Configure sua URL:**
```css
:root {
  /* 🌐 CONFIGURE APENAS ESTA URL - Funciona com QUALQUER provedor! */
  --portfolio-url: "https://SEU-LINK-AQUI.com";
  --portfolio-status: "deployed"; /* deployed | staging | development | offline */
  
  /* 🎨 Personalizações Opcionais */
  --portfolio-title: "Seu Portfólio Incrível";
  --portfolio-button-text: "🌐 Ver Meu Trabalho";
  --portfolio-show-provider: "true"; /* mostra o provedor detectado */
}
```

### 📋 Exemplos Práticos para Diferentes Provedores

```css
/* ✅ VERCEL */
:root {
  --portfolio-url: "https://portfolio-gabriel-2025.vercel.app";
  --portfolio-status: "deployed";
}

/* ✅ NETLIFY */
:root {
  --portfolio-url: "https://stunning-portfolio-123abc.netlify.app";
  --portfolio-status: "deployed";
}

/* ✅ GITHUB PAGES */
:root {
  --portfolio-url: "https://gabriel-malheiros.github.io/DesenvolvimentoWeb-2025-2";
  --portfolio-status: "deployed";
}

/* ✅ DOMÍNIO PRÓPRIO */
:root {
  --portfolio-url: "https://gabrielmalheiros.dev";
  --portfolio-status: "deployed";
}

/* ✅ FIREBASE HOSTING */
:root {
  --portfolio-url: "https://meu-portfolio-2025.web.app";
  --portfolio-status: "deployed";
}

/* ⏳ DEPLOY EM ANDAMENTO (Qualquer provedor) */
:root {
  --portfolio-url: "https://meu-novo-site.vercel.app";
  --portfolio-status: "staging"; /* Mostra como "em desenvolvimento" */
}
```

### 🔧 Estados Universais do Sistema

| Status | Quando Usar | Comportamento |
|--------|-------------|---------------|
| `"deployed"` | Site no ar e funcionando | ✅ Link clicável, abre nova aba |
| `"staging"` | Deploy de teste/preview | 🔄 Visual diferenciado, clicável |
| `"development"` | Apenas desenvolvimento | 🔧 Não clicável, apenas info |
| `"offline"` | Site temporariamente fora | 📴 Não clicável, aviso visual |

### 🎯 Como Usar o Componente Universal

```jsx
// Botão padrão - detecta provedor automaticamente
<PortfolioLink />

// Badge pequeno com provedor
<PortfolioLink variant="badge" size="sm" />

// Card completo com informações
<PortfolioLink variant="card" />

// Com debug info (desenvolvimento)
<PortfolioLink showDebugInfo={true} />
```

### ✨ Funcionalidades Universais

- **🔍 Auto-detecção:** Identifica automaticamente Vercel, Netlify, GitHub Pages, Firebase, Surge, Heroku, Render, Railway, Cloudflare, AWS, domínios próprios, etc.
- **🌐 Validação Universal:** Verifica se URL é válida independente do provedor
- **⚡ Tempo Real:** Mudanças no CSS refletem instantaneamente
- **🛡️ Proteção:** Impede cliques em URLs inválidas ou offline
- **🎨 Visual Adaptativo:** Interface muda baseada no provedor detectado
- **📱 Responsivo:** Funciona perfeitamente em mobile e desktop

## 🚀 Deploy Universal - Qualquer Plataforma

### 🔥 Fluxo Rápido (Funciona com TODOS os Provedores)

```powershell
# 1. Build do projeto
npm run build

# 2. Deploy em QUALQUER plataforma (escolha uma):

# Vercel
npx vercel --prod

# Netlify  
npx netlify deploy --prod --dir=dist

# GitHub Pages
git add . && git commit -m "deploy" && git push origin main

# Firebase
npx firebase deploy

# Surge
npx surge dist/

# Render, Railway, Heroku - siga docs específicas
```

### 3. **Atualizar CSS com Novo Link**
```css
/* Cole o link que você recebeu do deploy */
:root {
  --portfolio-url: "https://SEU-LINK-REAL-AQUI.app"; /* ✅ Link do deploy */
  --portfolio-status: "deployed"; /* ✅ Ativo */
}
```

### 4. **Commit Final**
```powershell
git add .
git commit -m "feat: portfolio online em produção"
git push origin main
```

### 🎯 Resultado Final

**Independente da plataforma**, seu link ficará assim:
- ✅ **Clicável e funcional**
- 🏷️ **Provedor detectado automaticamente** 
- 🎨 **Visual adaptado ao status**
- 📱 **Responsivo em qualquer dispositivo**

**Exemplo:** Se você fez deploy no Firebase, aparecerá:
> 🌐 Acessar Portfólio [🔥 Firebase] ↗️

**Se mudou para Vercel, aparecerá:**
> 🌐 Acessar Portfólio [⚡ Vercel] ↗️

**Tudo automaticamente, apenas mudando a URL no CSS!**

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
