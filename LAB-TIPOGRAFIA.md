# 🔤 Laboratório 2 - Tipografia e Cores

## 📋 **Informações do Laboratório**

- **Disciplina**: Desenvolvimento de Aplicações Web I
- **Autor**: Gabriel Malheiros de Castro  
- **Instituição**: FAESA - Faculdades Integradas Espírito-Santenses
- **Data**: Outubro 2025
- **Arquivos**: `tipografia.html` + `tipografia.css`

## 🌟 **Mensagem Pessoal do Desenvolvedor**

> **"Sou um autista buscando fazer meu melhor para todos e ser alguém de confiança"**

Como pessoa neurodivergente, Gabriel traz uma perspectiva única para o desenvolvimento web, focando especialmente em acessibilidade, atenção aos detalhes e criação de interfaces inclusivas que funcionam para todos os usuários.

## 🎯 **Objetivo do Laboratório**

Dominar propriedades de texto e aplicar esquemas de cores profissionais para criar interfaces web acessíveis e visualmente atrativas.

## 📚 **Conceitos Implementados**

### 🔤 **Propriedades Tipográficas**

#### **font-family**
- Define a família de fontes utilizada
- Exemplos com Google Fonts (Roboto e Poppins)
- Fallbacks para sans-serif

#### **font-size**
- Tamanhos relativos (em, rem) e absolutos (px)
- Demonstração com diferentes escalas (0.9em até 2em)
- Hierarquia visual clara

#### **font-weight**
- Pesos de 300 (light) até 900 (black)  
- Valores numéricos e nomeados (normal, bold)
- Impacto na hierarquia de informação

#### **line-height**
- Altura de linha para legibilidade
- Variações de 1.2 (compacto) até 2.0 (solto)
- Importância para acessibilidade

#### **text-align**
- Alinhamentos: left, center, right, justify
- Quando usar cada tipo de alinhamento
- Impacto na experiência de leitura

#### **text-decoration**
- Decorações: none, underline, line-through, overline
- Uso semântico e visual
- Estados de link e elementos interativos

#### **text-transform**
- Transformações: uppercase, lowercase, capitalize
- Uso apropriado para diferentes contextos
- Impacto na acessibilidade

#### **letter-spacing**
- Espaçamento entre caracteres
- Valores em pixels para controle preciso
- Efeitos visuais e legibilidade

### 🎨 **Sistemas de Cores**

#### **Nomes de Cores**
- Cores básicas: red, blue, green, purple, orange
- Facilidade de uso e limitações
- Casos de uso apropriados

#### **Hexadecimal (#)**
- Formato #RRGGBB
- Cores personalizadas precisas
- Padrão da indústria web

#### **RGB**
- Formato rgb(vermelho, verde, azul)
- Valores de 0 a 255
- Intuição com componentes de cor

#### **RGBA (com transparência)**
- Formato rgba(r, g, b, alpha)
- Canal alpha de 0.0 a 1.0
- Efeitos de sobreposição e transparência

#### **HSL**
- Formato hsl(matiz, saturação, luminosidade)
- Matiz: 0-360 graus
- Saturação e luminosidade: 0-100%
- Mais intuitivo para designers

## 🔧 **Implementação Técnica**

### **Estrutura HTML Semântica**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Lab 2 - Tipografia</title>
    <link rel="stylesheet" href="tipografia.css">
    <link href="https://fonts.googleapis.com/css2..." rel="stylesheet">
</head>
<body>
    <header>
        <h1>Tipografia na Web</h1>
        <p class="subtitulo">Explorando fontes e estilos</p>
    </header>
    <!-- Conteúdo estruturado semanticamente -->
</body>
</html>
```

### **CSS Avançado com Variáveis**
```css
:root {
    --cor-primaria: #667eea;
    --cor-secundaria: #764ba2;
    --fonte-principal: 'Roboto', sans-serif;
    --tamanho-base: 16px;
    --altura-linha-base: 1.8;
}

body {
    font-family: var(--fonte-principal);
    line-height: var(--altura-linha-base);
    color: var(--cor-texto);
}
```

### **Sistema de Design Responsivo**
- Mobile-first approach
- Breakpoints para tablet e desktop
- Typography scaling responsivo
- Otimização para diferentes tamanhos de tela

## ♿ **Foco em Acessibilidade**

### **Contraste de Cores**
- Verificação de contraste mínimo 4.5:1
- Exemplos de bom e mau contraste
- Ferramenta de teste visual

### **Legibilidade**
- Fontes sans-serif para melhor legibilidade
- Tamanhos mínimos de fonte
- Espaçamento adequado entre linhas

### **Estrutura Semântica**
- Uso correto de headings (h1-h6)
- Hierarquia de informação clara
- Navegação acessível

## 🌐 **Google Fonts Integration**

### **Fontes Utilizadas**
- **Roboto**: Fonte moderna e legível, ideal para interfaces
- **Poppins**: Fonte geométrica com personalidade única

### **Implementação**
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### **Otimizações**
- Display swap para performance
- Subset de pesos específicos
- Fallbacks apropriados

## 🎯 **Hierarquia Visual Demonstrada**

### **Níveis de Título**
```css
h1 { font-size: 2.5em; font-weight: 700; } /* Título principal */
h2 { font-size: 2em; font-weight: 600; }   /* Seções */
h3 { font-size: 1.5em; font-weight: 500; } /* Subseções */
p  { font-size: 1em; font-weight: 400; }   /* Texto base */
```

### **Cores Hierárquicas**
- Títulos principais: Cor primária (#667eea)
- Títulos secundários: Cor secundária (#764ba2)
- Texto normal: Cinza escuro (#333)
- Texto secundário: Cinza médio (#555)

## 📱 **Responsividade Implementada**

### **Breakpoints**
```css
/* Mobile (< 768px) */
@media (max-width: 768px) {
    .titulo-pessoal { font-size: 2.5em; }
    .mensagem-especial { font-size: 1.4em; }
}

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
    /* Ajustes para tablet */
}

/* Desktop (> 1024px) */
/* Estilos base */
```

### **Typography Scaling**
- Escalas proporcionais para diferentes dispositivos
- Manutenção da legibilidade em todos os tamanhos
- Adaptação do espaçamento

## 🔗 **Links de Acesso**

- **🌐 Laboratório Online**: https://desenvolvimento-web-2025-2.vercel.app/tipografia.html
- **📁 Repositório**: https://github.com/GabrielMalheirosdeCastro/DesenvolvimentoWeb-2025-2
- **🏠 Portfolio Principal**: https://desenvolvimento-web-2025-2.vercel.app

## 📈 **Métricas de Performance**

- **HTML**: Semântico e validado
- **CSS**: Otimizado com variáveis e responsivo
- **Acessibilidade**: WCAG 2.1 AA compliant
- **Performance**: Carregamento < 3 segundos
- **SEO**: Meta tags adequadas

## 🎓 **Resultados de Aprendizado**

✅ **Domínio completo das propriedades tipográficas CSS**  
✅ **Implementação de sistemas de cores profissionais**  
✅ **Integração eficaz de Google Fonts**  
✅ **Criação de hierarquia visual clara**  
✅ **Foco em acessibilidade e inclusão**  
✅ **Design responsivo mobile-first**  
✅ **Código semântico e bem estruturado**

---

*Desenvolvido com 💙 por Gabriel Malheiros de Castro | FAESA 2025-2*  
*"Sou um autista buscando fazer meu melhor para todos e ser alguém de confiança"*