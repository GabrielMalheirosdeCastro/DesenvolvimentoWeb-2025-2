# 🎨 Documentação Técnica - Detecção de Cor de Fundo

## Visão Geral

Esta funcionalidade permite que o jogo de adivinhação de cores reconheça quando o jogador digita a cor que está sendo exibida como fundo da página, aceitando-a como resposta correta.

## Como Funciona

### 1. Classe ColorDetector

A classe `ColorDetector` é responsável por detectar a cor atual do fundo da página:

```javascript
class ColorDetector {
    static detectBackgroundColor() {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const bgColor = computedStyle.backgroundColor;
        
        // Parse RGB/RGBA e converte para nome da cor
        // ...
    }
    
    static rgbToColorName(r, g, b) {
        // Mapa de valores RGB para nomes de cores HTML
        // ...
    }
    
    static isColorCurrentlyDisplayed(colorName) {
        // Verifica se uma cor específica está no fundo
        // ...
    }
}
```

### 2. Monitoramento Contínuo

O jogo monitora a cor de fundo a cada 2 segundos:

```javascript
startBackgroundColorMonitoring() {
    this.backgroundColorCheckInterval = setInterval(() => {
        if (this.gameState.isGameActive) {
            const isNowDisplayed = this.gameState.checkBackgroundColorMatch();
            // Mostra dica especial se a cor apareceu no fundo
        }
    }, 2000);
}
```

### 3. Validação de Entrada

A validação agora aceita tanto a cor correta quanto a cor do fundo:

```javascript
handleGuess() {
    const isCorrectTarget = guess === this.gameState.targetColor.toLowerCase();
    const isBackgroundColor = ColorDetector.isColorCurrentlyDisplayed(guess);
    
    if (isCorrectTarget || isBackgroundColor) {
        this.handleCorrectGuess(isBackgroundColor);
    }
    // ...
}
```

### 4. Feedback Diferenciado

O jogo fornece feedback específico quando o jogador acerta observando o fundo:

```javascript
if (wasBackgroundGuess) {
    feedbackMessage = `🎨 Excelente! Você observou a cor de fundo! A cor era "${this.gameState.targetColor}".`;
} else {
    feedbackMessage = `🎉 Parabéns! Você acertou! A cor era "${this.gameState.targetColor}".`;
}
```

## Características Técnicas

### Detecção RGB para Nome de Cor

O sistema converte valores RGB computados para nomes de cores HTML:

- `rgb(255, 0, 0)` → `"red"`
- `rgb(0, 128, 0)` → `"green"`  
- `rgb(0, 0, 255)` → `"blue"`

### Cores Suportadas

Todas as 30 cores do jogo são detectáveis:
- **Fácil**: 10 cores básicas
- **Médio**: 10 cores intermediárias  
- **Difícil**: 10 cores complexas

### Classe CSS Dinâmica

O sistema adiciona classes CSS dinamicamente ao body:

```css
.color-red { background-color: red !important; color: white; }
.color-blue { background-color: blue !important; color: white; }
/* ... todas as cores do jogo ... */
```

## Fluxo de Funcionamento

1. **Início do jogo**: Nova cor é sorteada
2. **Após 3 segundos**: Cor aparece automaticamente no fundo
3. **Monitoramento**: Sistema detecta mudança de cor a cada 2s
4. **Dica especial**: Quando cor aparece, mostra dica visual
5. **Validação**: Input do jogador é comparado com cor alvo E cor de fundo
6. **Feedback**: Mensagem diferenciada se acertou por observação

## Melhorias de UX

### Validação Visual em Tempo Real

```javascript
validateInput() {
    const matchesBackground = ColorDetector.isColorCurrentlyDisplayed(input);
    if (matchesBackground) {
        this.dom.colorInput.classList.add('background-match');
    }
    // ...
}
```

### Dicas Inteligentes

```javascript
showHint(guess) {
    // ... dicas existentes ...
    
    if (ColorDetector.isColorCurrentlyDisplayed(targetColor)) {
        hint += ` 👀 Dica extra: Olhe ao redor da página...`;
    }
}
```

### Animações Especiais

- **background-match**: Input ganha borda roxa quando cor corresponde ao fundo
- **background-hint-pulse**: Área de dicas pulsa quando cor aparece
- **backgroundMatchGlow**: Efeito de brilho no input

## Performance e Cleanup

### Gerenciamento de Memória

```javascript
stopBackgroundColorMonitoring() {
    if (this.backgroundColorCheckInterval) {
        clearInterval(this.backgroundColorCheckInterval);
        this.backgroundColorCheckInterval = null;
    }
}

window.addEventListener('beforeunload', () => {
    if (window.colorGame) {
        window.colorGame.stopBackgroundColorMonitoring();
    }
});
```

### Debug e Desenvolvimento

Funções de debug disponíveis em modo desenvolvimento:

- `ColorDetector.detectBackgroundColor()` - Mostra cor atual
- `testColorDetector()` - Testa detector
- `setBackgroundColor(color)` - Força mudança de cor
- **F2** - Atalho para debug de cor

## Benefícios da Implementação

1. **Experiência inovadora**: Jogador pode "ver" a resposta
2. **Aprendizado visual**: Associa nome da cor com sua aparência
3. **Acessibilidade**: Facilita para jogadores com dificuldades
4. **Engajamento**: Cria nova dinâmica de jogo
5. **Técnico**: Demonstra manipulação avançada do DOM

## Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões modernas)
- ✅ Mobile e Desktop
- ✅ Modo escuro e claro
- ✅ Todas as resoluções de tela

---

**Desenvolvido por Gabriel Malheiros de Castro**  
**FAESA 2025-2 - Desenvolvimento Web**