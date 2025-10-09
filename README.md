# Interface Gráfica Pessoal

Este é um projeto de portfólio pessoal construído com React + Vite + TypeScript, desenvolvido como parte do curso de Desenvolvimento Web da FAESA. O projeto demonstra a conversão de design Figma para código funcional.

**🌐 Projeto Original no Figma:** https://www.figma.com/design/YhRfiVLoaaxLm9j3TH7xOP/Interface-Gr%C3%A1fica-Pessoal

## 🚀 Deploy e Acesso Público

### Links do Portfólio Online
- **Vercel:** `https://seu-portfolio.vercel.app` (será gerado após deploy)
- **Netlify:** `https://seu-portfolio.netlify.app` (será gerado após deploy)
- **GitHub Pages:** `https://seu-usuario.github.io/DesenvolvimentoWeb-2025-2` (será gerado após deploy)

### Opções de Deploy Gratuito

#### 1. **Vercel (Recomendado para React)**
```powershell
# Instalar CLI da Vercel
npm i -g vercel

# Fazer deploy
npm run build
npx vercel --prod

# Ou conectar repositório GitHub na interface web da Vercel
```

#### 2. **Netlify**
```powershell
# Instalar CLI do Netlify
npm i -g netlify-cli

# Fazer deploy
npm run build
npx netlify deploy --prod --dir=dist

# Ou arrastar pasta 'dist' na interface web do Netlify
```

#### 3. **GitHub Pages**
```powershell
# Fazer build e deploy via GitHub Actions (veja .github/workflows/deploy.yml)
git add .
git commit -m "feat: configuração para deploy GitHub Pages"
git push origin main
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

## 🔗 Como Atualizar o Link Público

1. **Fazer mudanças no código**
2. **Testar localmente:** `npm run dev`
3. **Fazer commit:** `git add . && git commit -m "feat: suas mudanças"`
4. **Push para GitHub:** `git push origin main`
5. **Deploy automático:** Site atualiza automaticamente (se configurado CI/CD)

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
