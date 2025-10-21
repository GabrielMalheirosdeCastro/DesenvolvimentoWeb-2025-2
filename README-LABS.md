# 🎓 Laboratórios CSS3 - Fundamentos

## 📋 Arquivos Criados

Este projeto agora inclui demonstrações completas dos **Fundamentos de CSS3** solicitados no laboratório acadêmico FAESA 2025-2.

### 📁 Estrutura dos Laboratórios (CONSOLIDADA)

```
📂 Laboratórios CSS3/
├── 📄 lab-fundamentos-css.html # Versão consolidada (CSS inline, interno e externo)
├── 📄 style-lab.css           # CSS externo consolidado (recursos básicos + avançados)
└── 📄 README-LABS.md          # Esta documentação
```

**✅ CONSOLIDAÇÃO CONCLUÍDA (21/10/2025):**
- ❌ Removido: `index-lab.html` (versão básica duplicada)
- ❌ Removido: `fundamentos-style.css` (mesclado em `style-lab.css`)
- ❌ Removido: `exemplo-html-lego-naves.html` (funcionalidade duplicada)
- ✅ Mantido: `lab-fundamentos-css.html` (versão completa)
- ✅ Expandido: `style-lab.css` (agora com recursos CSS3 avançados)

---

## 🎯 **1. Três Tipos de CSS Demonstrados**

### ✅ **CSS Inline** - Aplicado diretamente no elemento HTML
```html
<p style="color: blue; font-size: 16px;">Texto azul</p>
<h1 style="color: red; font-size: 2.5em; text-align: center;">Título</h1>
```

### ✅ **CSS Interno** - Dentro da tag `<style>` no `<head>`
```html
<head>
    <style>
        p {
            color: blue;
            font-size: 16px;
        }
    </style>
</head>
```

### ✅ **CSS Externo** - Arquivo separado (recomendado)
```html
<head>
    <link rel="stylesheet" href="style-lab.css">
</head>
```

---

## 🎯 **2. Seletores Básicos Implementados**

### ✅ **Seletor de Elemento**
```css
p { 
    margin-bottom: 15px;
    font-size: 1.1em;
}
```

### ✅ **Seletor de Classe**
```css
.destaque { 
    background-color: #ffffcc;
    padding: 10px;
    border-left: 4px solid #0072bc;
    font-weight: bold;
}
```

### ✅ **Seletor de ID**
```css
#titulo-principal {
    color: #0072bc;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.5em;
}
```

### ✅ **Seletor Universal**
```css
* { 
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

---

## 🚀 **3. Desafios Resolvidos**

### ✅ **Desafio 1: Classe .aviso**
```css
.aviso {
    background-color: #ffebee; /* Fundo vermelho claro */
    color: #c62828;            /* Texto vermelho escuro */
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #d32f2f;
    margin-bottom: 20px;
    font-weight: 600;
}
```

### ✅ **Desafio 2: Seletor Descendente**
```css
.conteudo p {
    background-color: #e8f5e8;
    padding: 12px;
    border-radius: 6px;
    border-left: 3px solid #4caf50;
    margin-bottom: 10px;
    font-style: italic;
    color: #2e7d32;
}
```

### ✅ **Desafio 3: Efeito Hover**
```css
.destaque:hover {
    background-color: #fff3cd;
    transform: translateX(10px);
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}
```

---

## 🌐 **Como Acessar os Laboratórios**

### 🔗 **URLs Consolidadas (Pós-Consolidação)**
- **Lab Consolidado**: http://localhost:3000/lab-fundamentos-css.html
- **Portfolio Principal**: http://localhost:3000/

### 🔗 **URLs Online (Produção)**
- **Lab Consolidado**: https://desenvolvimento-web-2025-2.vercel.app/lab-fundamentos-css.html
- **Portfolio Principal**: https://desenvolvimento-web-2025-2.vercel.app/

---

## 🎨 **Recursos CSS3 Avançados Incluídos**

### ✨ **Funcionalidades Extras**
- **Flexbox e CSS Grid**: Layout moderno e responsivo
- **Transformações**: `transform: translateX()`, `scale()`, `rotate()`
- **Transições**: `transition: all 0.3s ease`
- **Gradientes**: `linear-gradient(135deg, #color1, #color2)`
- **Sombras**: `box-shadow` com múltiplas camadas
- **Animações**: `@keyframes` e `animation`
- **Media Queries**: Design responsivo para mobile/tablet/desktop

### 📱 **Compatibilidade**
- ✅ **Mobile First**: Design otimizado para dispositivos móveis
- ✅ **Responsive**: Adapta-se a qualquer tamanho de tela
- ✅ **Cross-browser**: Funciona em Chrome, Firefox, Safari, Edge
- ✅ **Acessibilidade**: Alt text, contraste adequado, navegação por teclado

---

## 🔧 **Como Testar**

### **1. Desenvolvimento Local**
```powershell
# Navegar para o diretório
cd "C:\Users\Gabriel.Malheiros\OneDrive - FAESA\Desktop\HTML\DesenvolvimentoWeb-2025-2"

# Instalar dependências
npm install

# Iniciar servidor
npm run dev

# Acessar no navegador
# http://localhost:3000/index-lab.html
```

### **2. Testar CSS Inline, Interno e Externo**
1. Abra `index-lab.html` no navegador
2. Observe os **3 tipos de CSS** funcionando:
   - CSS Inline: Título vermelho e parágrafos azuis
   - CSS Interno: Background azul claro em caixas específicas
   - CSS Externo: Estilos gerais (layout, cores, fontes)

### **3. Testar Seletores**
1. Inspect element (F12) no navegador
2. Veja como cada seletor funciona:
   - `p { }` afeta todos os parágrafos
   - `.destaque { }` afeta elementos com class="destaque"
   - `#titulo-principal { }` afeta o elemento com id="titulo-principal"
   - `*` afeta todos os elementos (reset CSS)

### **4. Testar Desafios**
1. **Classe .aviso**: Procure por divs com fundo vermelho claro
2. **Seletor .conteudo p**: Parágrafos dentro da div.conteudo têm estilo verde
3. **Hover .destaque**: Passe o mouse sobre parágrafos destacados

---

## 📊 **Comparação das Versões**

| Funcionalidade | `index-lab.html` | `lab-fundamentos-css.html` |
|---------------|------------------|---------------------------|
| CSS Inline | ✅ Básico | ✅ Avançado |
| CSS Interno | ✅ Simples | ✅ Completo |
| CSS Externo | ✅ Funcional | ✅ Profissional |
| Seletores Básicos | ✅ 4 tipos | ✅ 10+ tipos |
| Desafios | ✅ 3 resolvidos | ✅ 3 + extras |
| Responsividade | ✅ Básica | ✅ Avançada |
| CSS3 Moderno | ❌ | ✅ Completo |

---

## 🎓 **Entrega Acadêmica**

### ✅ **Requisitos Atendidos**
- [x] Demonstrar 3 tipos de CSS (inline, interno, externo)
- [x] Implementar seletores básicos (elemento, classe, ID, universal)
- [x] Resolver desafios (.aviso, .conteudo p, hover)
- [x] Criar código funcional e bem documentado
- [x] Garantir compatibilidade e responsividade

### 📋 **Para a Avaliação**
1. **Código Limpo**: HTML5 semântico e CSS3 organizado
2. **Comentários**: Explicações claras em português
3. **Funcionamento**: 100% funcional em Windows + Chrome
4. **Responsividade**: Testado mobile/tablet/desktop
5. **Criatividade**: Versão avançada com recursos extras

### 📝 **Arquivos Consolidados para Entrega**
- `lab-fundamentos-css.html` (versão única consolidada)
- `style-lab.css` (CSS externo consolidado com recursos avançados)

---

## 📞 **Suporte**

**Desenvolvido por:** Gabriel Malheiros de Castro  
**Curso:** Desenvolvimento Web - FAESA 2025-2  
**Projeto:** Interface Gráfica Pessoal  
**Data:** Outubro 2025  

**URLs de Referência:**
- Portfolio: https://desenvolvimento-web-2025-2.vercel.app/
- GitHub: https://github.com/GabrielMalheirosdeCastro/DesenvolvimentoWeb-2025-2