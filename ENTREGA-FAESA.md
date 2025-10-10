# 🎓 Entrega da Atividade - Portfólio com CSS3

**Aluno:** Gabriel Malheiros  
**Instituição:** FAESA - Faculdades Integradas Espírito-Santenses  
**Curso:** Desenvolvimento Web 2025-2  
**Atividade:** Aplicação de CSS3 em Portfólio Pessoal  

## 📋 Requisitos Atendidos

### ✅ 1. Portfólio Pessoal Criado
- Interface baseada em design Figma profissional
- Estrutura completa com React + TypeScript
- Arquitetura de componentes moderna

### ✅ 2. Estilização CSS3 Aplicada
- Sistema completo de design tokens
- Propriedades CSS personalizadas (Custom Properties)
- Layouts responsivos com Flexbox e Grid
- Animações e transições modernas

### ✅ 3. Seletores CSS Utilizados
```css
/* Seletores de atributo */
[data-status="deployed"] { background: hsl(var(--primary)); }

/* Pseudo-elementos */
.portfolio-link::before { content: var(--portfolio-text); }

/* Combinadores descendentes */
.portfolio-container .status-indicator { display: flex; }

/* Pseudo-classes */
.portfolio-button:hover:not(:disabled) { transform: translateY(-2px); }

/* Seletores universais e de tipo */
* { box-sizing: border-box; }
button { cursor: pointer; }
```

### ✅ 4. Design Responsivo
- Mobile-first approach
- Breakpoints adaptativos
- Componentes que se adaptam a diferentes telas
- Testes em dispositivos móveis e desktop

### ✅ 5. Commits no GitHub
- Histórico completo de desenvolvimento
- Mensagens descritivas seguindo padrões semânticos
- Versionamento adequado do código

## 🌐 Links de Entrega

**🔗 Repositório GitHub:** https://github.com/gabriel-malheiros/DesenvolvimentoWeb-2025-2

**🔗 Portfólio Público:** https://desenvolvimento-web-2025-2.vercel.app

## 🎨 Técnicas CSS3 Implementadas

### 1. **Custom Properties (CSS Variables)**
```css
:root {
  --portfolio-url: "https://desenvolvimento-web-2025-2.vercel.app";
  --portfolio-status: "deployed";
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
}
```

### 2. **Flexbox e Grid Layouts**
```css
.portfolio-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

### 3. **Animações e Transições**
```css
.portfolio-button {
  transition: all 0.2s ease;
  transform: translateY(0);
}

.portfolio-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px hsl(var(--primary) / 0.25);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 4. **Media Queries Responsivas**
```css
@media (max-width: 768px) {
  .portfolio-container {
    flex-direction: column;
    text-align: center;
  }
}

@media (min-width: 1024px) {
  .portfolio-button {
    font-size: 1.125rem;
    padding: 0.75rem 1.5rem;
  }
}
```

### 5. **Seletores Avançados**
```css
/* Seletores de atributo */
[data-status="deployed"][data-provider*="vercel"] {
  border-color: #000;
}

/* Pseudo-seletores */
.portfolio-link:not(:last-child)::after {
  content: " | ";
  color: hsl(var(--muted-foreground));
}

/* Combinadores */
.portfolio-container > .status + .provider {
  margin-left: auto;
}
```

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS + CSS3 personalizado
- **Componentes:** shadcn/ui + Radix UI primitives
- **Ícones:** Lucide React
- **Deploy:** Vercel (configurável para qualquer provedor)

## 🎯 Funcionalidades Especiais

### Sistema de Link Dinâmico
- Configuração via CSS sem necessidade de rebuild
- Detecção automática de provedor de hospedagem
- Estados visuais para diferentes ambientes
- Validação automática de URLs

### Design System Completo
- Tokens de design consistentes
- Modo escuro/claro
- Componentes reutilizáveis
- Acessibilidade (WCAG compliance)

### Arquitetura Moderna
- Componentização React
- TypeScript para type safety
- Hooks personalizados
- Performance otimizada

## 📱 Teste de Responsividade

**Mobile (320px - 768px):**
- ✅ Layout adaptativo
- ✅ Touch-friendly interactions
- ✅ Readable typography
- ✅ Optimized performance

**Tablet (768px - 1024px):**
- ✅ Intermediate layouts
- ✅ Balanced content distribution
- ✅ Smooth transitions

**Desktop (1024px+):**
- ✅ Full-featured interface
- ✅ Hover effects
- ✅ Optimized for mouse interaction

## 🎓 Aprendizados da Atividade

1. **CSS3 Moderno:** Aplicação prática de propriedades avançadas
2. **Design System:** Criação de sistema de design escalável
3. **Responsividade:** Implementação de layouts adaptativos
4. **Performance:** Otimização de CSS para produção
5. **Versionamento:** Boas práticas de Git e deploy

---

**Data de Entrega:** Janeiro 2025  
**Status:** ✅ Completo e Funcionando  
**Link Público:** https://desenvolvimento-web-2025-2.vercel.app
