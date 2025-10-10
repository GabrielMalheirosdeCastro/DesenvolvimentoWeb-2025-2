# Interface Gráfica Pessoal

Este é um projeto de portfólio pessoal construído com React + Vite + TypeScript, desenvolvido como parte do curso de Desenvolvimento Web da FAESA. O projeto demonstra a conversão de design Figma para código funcional.

**🌐 Projeto Original no Figma:** https://www.figma.com/design/YhRfiVLoaaxLm9j3TH7xOP/Interface-Gr%C3%A1fica-Pessoal

## 🎓 Atividade FAESA - Portfólio com CSS3

### 📝 Requisitos da Atividade Atendidos

✅ **Portfólio pessoal criado** - Interface gráfica baseada no design Figma  
✅ **Estilização CSS3 aplicada** - Sistema completo com Tailwind CSS + CSS personalizado  
✅ **Seletores CSS utilizados** - Incluindo conceitos do CSS Diner  
✅ **Design responsivo** - Mobile-first com breakpoints adaptativos  
✅ **Commits no GitHub** - Histórico completo de desenvolvimento  
✅ **Link público funcional** - Configurado independente de plataforma  

### 🌐 Link Público do Portfólio (FAESA 2025-2)

**🔗 Acesso Direto:** https://desenvolvimento-web-2025-2.vercel.app

> **Nota:** Este link é configurado via CSS e pode ser alterado facilmente para qualquer provedor de hospedagem, funcionando independentemente da plataforma escolhida.

### 🎯 Como Configurar Seu Próprio Link Público

**Para alunos Windows - Fluxo Completo:**

#### 1. **Preparar o CSS (ANTES do deploy)**
```css
/* Em src/styles/globals.css */
:root {
  /* 🌐 Configure seu link de portfólio aqui */
  --portfolio-url: "https://seu-nome-portfolio.vercel.app";
  --portfolio-status: "deployed";
  --portfolio-title: "Portfólio - Seu Nome - FAESA 2025-2";
  --portfolio-button-text: "🌐 Ver Meu Portfólio";
}
```

#### 2. **Fazer Deploy (Windows PowerShell)**
```powershell
# Navegar para o projeto
cd "C:\Users\SeuUsuario\Desktop\HTML\DesenvolvimentoWeb-2025-2"

# Instalar dependências se necessário
npm install

# Build do projeto
npm run build

# Deploy no Vercel (recomendado)
npx vercel --prod

# OU Deploy no Netlify
npx netlify deploy --prod --dir=dist

# OU Deploy no GitHub Pages (automático via push)
git add .
git commit -m "feat: portfólio FAESA pronto para avaliação"
git push origin main
```

#### 3. **Atualizar com Link Real**
```css
/* Depois do deploy - cole o link que você recebeu */
:root {
  --portfolio-url: "https://portfolio-gabriel-malheiros-faesa.vercel.app"; /* Link real */
  --portfolio-status: "deployed";
  --portfolio-title: "Gabriel Malheiros - Desenvolvimento Web FAESA";
}
```

#### 4. **Commit Final para Entrega**
```powershell
git add .
git commit -m "feat: portfólio FAESA 2025-2 - CSS3 aplicado e link público ativo"
git push origin main
```

### 📋 Template para Entrega da Atividade

**Link do Repositório GitHub:** `https://github.com/seu-usuario/DesenvolvimentoWeb-2025-2`

**Link do Portfólio Público:** `https://seu-portfolio.vercel.app` *(gerado automaticamente)*

**Commits Realizados:**
- ✅ Estrutura inicial do portfólio
- ✅ Conversão do design Figma para React
- ✅ Aplicação de CSS3 e estilização avançada
- ✅ Responsividade e otimizações
- ✅ Deploy e configuração do link público

### 🎨 Recursos CSS3 Implementados

**Seletores Avançados:**
```css
/* Seletores de atributo */
[data-status="deployed"] { /* ... */ }

/* Pseudo-elementos */
.portfolio-link::before { /* ... */ }

/* Combinadores */
.portfolio-container > .status-indicator { /* ... */ }

/* Pseudo-classes */
.portfolio-button:hover:not(:disabled) { /* ... */ }
```

**Propriedades Modernas:**
- ✅ **Custom Properties (CSS Variables)** - Sistema de tokens de design
- ✅ **Flexbox & Grid** - Layouts responsivos
- ✅ **Transitions & Animations** - Interações suaves
- ✅ **Media Queries** - Design mobile-first
- ✅ **Transform & Filter** - Efeitos visuais
- ✅ **Border-radius & Box-shadow** - Estética moderna

### 💻 Compatibilidade Windows

**Testado em:**
- ✅ Windows 11 + PowerShell
- ✅ Visual Studio Code
- ✅ Node.js 18+
- ✅ npm/yarn
- ✅ Git for Windows

**Browsers Suportados:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### 🚀 Demonstração das Funcionalidades

**1. Sistema de Link Dinâmico:**
```jsx
<PortfolioLink /> // Detecta provedor automaticamente
```

**2. Estados Visuais:**
- 🟢 **Deployed** - Link ativo e clicável
- 🔶 **Staging** - Em teste/desenvolvimento
- 🔴 **Offline** - Temporariamente indisponível

**3. Detecção Automática de Plataforma:**
- Vercel → ⚡ Vercel
- Netlify → ☁️ Netlify  
- GitHub Pages → 🐙 GitHub Pages
- Firebase → 🔥 Firebase
- Domínio Próprio → 🌐 Custom Domain

## 🔗 Link do Portfólio (Universal - Funciona com QUALQUER Provedor)

**🌐 LINK PÚBLICO CONFIGURADO:** https://desenvolvimento-web-2025-2.vercel.app

> Este link é **configurado via CSS** e funciona independentemente da plataforma de hospedagem escolhida. Ideal para projetos acadêmicos que precisam de flexibilidade de deploy.

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
