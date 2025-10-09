# Interface Gráfica Pessoal

Este é um projeto de portfólio pessoal construído com React + Vite + TypeScript, desenvolvido como parte do curso de Desenvolvimento Web da FAESA. O projeto demonstra a conversão de design Figma para código funcional.

**🌐 Projeto Original no Figma:** https://www.figma.com/design/YhRfiVLoaaxLm9j3TH7xOP/Interface-Gr%C3%A1fica-Pessoal

## 🔗 Link do Portfólio (Controlado via CSS)

O link do seu portfólio online é **controlado dinamicamente via CSS** usando propriedades personalizadas. Para alterar o link:

### Como Alterar o Link via CSS

**Abra o arquivo:** `src/styles/globals.css`

**Encontre a seção:**
```css
:root {
  /* Link do Portfólio - Alterável via CSS */
  --portfolio-link: "https://seu-portfolio.vercel.app";
  --portfolio-text: "🌐 Portfólio Online";
}
```

**Altere apenas a URL entre aspas:**
```css
:root {
  /* Exemplo: depois do deploy na Vercel */
  --portfolio-link: "https://meu-portfolio-react.vercel.app";
  
  /* Exemplo: depois do deploy no Netlify */
  --portfolio-link: "https://amazing-portfolio-123.netlify.app";
  
  /* Exemplo: GitHub Pages */
  --portfolio-link: "https://gabriel-malheiros.github.io/DesenvolvimentoWeb-2025-2";
}
```

### ✨ Vantagens desta Abordagem
- **Alteração rápida:** Mude apenas 1 linha no CSS
- **Sem rebuild:** Funciona instantaneamente após salvar
- **Centralizado:** Um local para controlar o link em todo o projeto
- **Flexível:** Pode alterar também o texto exibido

### 🎯 Como Usar o Componente

```jsx
// Exibição automática do link (aparece na página)
<PortfolioLink />

// Como botão clicável
<PortfolioLink showAsButton={true} />

// Com estilo personalizado
<PortfolioLink className="my-4" />
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

### 2. **Deploy**
```powershell
npm run build  # Build de produção
# Usar Vercel/Netlify/GitHub Pages
```

### 3. **Atualizar Link via CSS**
```css
/* Em src/styles/globals.css */
:root {
  --portfolio-link: "SEU_LINK_AQUI";
}
```

### 4. **Publicar Mudança**
```powershell
git add .
git commit -m "feat: atualiza link do portfólio"
git push origin main
```

## 🎯 Exemplo Prático

**Antes do deploy:**
```css
--portfolio-link: "https://seu-portfolio.vercel.app";
```

**Depois do deploy na Vercel:**
```css
--portfolio-link: "https://portfolio-gabriel-malheiros.vercel.app";
```

**Resultado:** O link aparece automaticamente em todos os lugares onde o componente `PortfolioLink` é usado!

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
