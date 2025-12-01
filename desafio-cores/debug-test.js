/**
 * 🧪 SCRIPT DE DEBUG TEMPORÁRIO - Jogo de Cores
 * Versão simplificada para detectar o problema das tentativas
 */

console.log('🚀 Iniciando debug do jogo de cores...');

// Estado simplificado do jogo
let debugGame = {
    targetColor: '',
    attemptsLeft: 3,
    isGameActive: false
};

// Array de cores simples
const debugColors = ['red', 'blue', 'green', 'yellow', 'purple'];

// Elementos DOM
let debugElements = {};

// Função para sortear nova cor
function debugGenerateColor() {
    debugGame.targetColor = debugColors[Math.floor(Math.random() * debugColors.length)];
    console.log('🎯 Nova cor sorteada:', debugGame.targetColor);
    return debugGame.targetColor;
}

// Função para iniciar jogo
function debugStartGame() {
    debugGame.targetColor = debugGenerateColor();
    debugGame.attemptsLeft = 3;
    debugGame.isGameActive = true;
    
    debugElements.colorInput.value = '';
    debugElements.colorInput.disabled = false;
    debugElements.guessBtn.style.display = 'inline-block';
    debugElements.restartBtn.style.display = 'none';
    
    debugUpdateUI();
    debugShowFeedback('🎮 Jogo iniciado! Adivinhe a cor sorteada.', 'info');
    
    console.log('✅ Jogo iniciado - Estado:', debugGame);
}

// Função para atualizar UI
function debugUpdateUI() {
    if (debugElements.attemptsCount) {
        debugElements.attemptsCount.textContent = debugGame.attemptsLeft;
    }
    console.log('🔄 UI atualizada - Tentativas restantes:', debugGame.attemptsLeft);
}

// Função para mostrar feedback
function debugShowFeedback(message, type) {
    if (debugElements.feedbackMessage) {
        debugElements.feedbackMessage.textContent = message;
        debugElements.feedbackArea.className = `feedback-area ${type}`;
    }
    console.log(`📢 Feedback (${type}):`, message);
}

// Função principal para processar palpites
function debugHandleGuess() {
    if (!debugGame.isGameActive) {
        console.log('⚠️ Jogo não está ativo!');
        return;
    }
    
    const guess = debugElements.colorInput.value.trim().toLowerCase();
    console.log('🎯 Palpite recebido:', guess);
    
    if (!guess) {
        debugShowFeedback('Digite uma cor!', 'error');
        return;
    }
    
    // AQUI É O PONTO CRÍTICO - decrementar tentativas ANTES de verificar
    debugGame.attemptsLeft--;
    console.log(`📊 Tentativas decrementadas. Restam: ${debugGame.attemptsLeft}`);
    
    const isCorrect = guess === debugGame.targetColor.toLowerCase();
    console.log(`🎯 Comparação: "${guess}" === "${debugGame.targetColor.toLowerCase()}" = ${isCorrect}`);
    
    if (isCorrect) {
        debugGame.isGameActive = false;
        document.body.style.backgroundColor = debugGame.targetColor;
        debugShowFeedback(`🎉 PARABÉNS! Você acertou! A cor era "${debugGame.targetColor}"`, 'success');
        debugElements.guessBtn.style.display = 'none';
        debugElements.restartBtn.style.display = 'inline-block';
        debugElements.colorInput.disabled = true;
        console.log('✅ VITÓRIA!');
    } else {
        if (debugGame.attemptsLeft > 0) {
            debugShowFeedback(`❌ Errou! "${guess}" não é a cor. Tentativas restantes: ${debugGame.attemptsLeft}`, 'error');
            debugElements.colorInput.value = '';
            debugElements.colorInput.focus();
            console.log(`💔 Erro! Ainda há ${debugGame.attemptsLeft} tentativas`);
        } else {
            debugGame.isGameActive = false;
            debugShowFeedback(`💀 Fim de jogo! A cor era "${debugGame.targetColor}". Tente novamente!`, 'error');
            debugElements.guessBtn.style.display = 'none';
            debugElements.restartBtn.style.display = 'inline-block';
            debugElements.colorInput.disabled = true;
            console.log('💀 GAME OVER!');
        }
    }
    
    debugUpdateUI();
    console.log('🎮 Estado final do jogo:', debugGame);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏗️ Inicializando debug...');
    
    // Capturar elementos DOM
    debugElements = {
        colorInput: document.getElementById('color-guess'),
        guessBtn: document.getElementById('guess-btn'),
        restartBtn: document.getElementById('restart-btn'),
        attemptsCount: document.getElementById('attempts-count'),
        feedbackArea: document.getElementById('feedback-area'),
        feedbackMessage: document.getElementById('feedback-message')
    };
    
    // Verificar se elementos existem
    const missing = Object.entries(debugElements).filter(([key, element]) => !element);
    if (missing.length > 0) {
        console.error('❌ Elementos DOM faltando:', missing.map(([key]) => key));
        return;
    }
    
    console.log('✅ Todos os elementos DOM encontrados');
    
    // Configurar event listeners
    debugElements.guessBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Botão Adivinhar clicado');
        debugHandleGuess();
    });
    
    debugElements.restartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🔄 Botão Reiniciar clicado');
        debugStartGame();
    });
    
    debugElements.colorInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('⌨️ Enter pressionado');
            debugHandleGuess();
        }
    });
    
    // Iniciar primeiro jogo
    debugStartGame();
    
    console.log('🎮 Debug inicializado com sucesso!');
});

// Função global para teste manual
window.debugRevealColor = function() {
    console.log('🔍 REVELAÇÃO: A cor sorteada é:', debugGame.targetColor);
    alert(`A cor sorteada é: ${debugGame.targetColor}`);
};