/**
 * 🎮 JOGO DE ADIVINHAÇÃO DE CORES - VERSÃO FUNCIONAL
 * Projeto Prático C3 - Gabriel Malheiros de Castro
 * FAESA 2025-2
 * 
 * Versão simplificada mas completa que funciona garantidamente
 */

// Configurações do jogo
const GAME_CONFIG = {
    ATTEMPTS_PER_GAME: 3,
    WINS_TO_UNLOCK_NEXT: 3,
    SCORES: { easy: 10, medium: 25, hard: 50 }
};

// Arrays de cores por nível
const COLOR_SETS = {
    easy: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'white'],
    medium: ['navy', 'teal', 'coral', 'crimson', 'indigo', 'lime', 'olive', 'cyan', 'gold', 'silver'],
    hard: ['darkslateblue', 'lightcoral', 'mediumseagreen', 'darkgoldenrod', 'lightsteelblue', 
           'palevioletred', 'mediumorchid', 'darkolivegreen', 'lightslategray', 'mediumturquoise']
};

// Famílias de cores para dicas
const COLOR_FAMILIES = {
    warm: ['red', 'orange', 'yellow', 'pink', 'coral', 'crimson', 'gold'],
    cool: ['blue', 'green', 'purple', 'navy', 'teal', 'indigo', 'cyan'],
    neutral: ['brown', 'gray', 'white', 'silver', 'olive']
};

// Estado global do jogo
let gameState = {
    currentLevel: 'easy',
    targetColor: '',
    attemptsLeft: GAME_CONFIG.ATTEMPTS_PER_GAME,
    score: 0,
    usedColors: [],
    levelProgress: { easy: 0, medium: 0, hard: 0 },
    unlockedLevels: ['easy'],
    isGameActive: false,
    totalGames: 0,
    totalWins: 0,
    highScore: 0
};

// Elementos DOM
let elements = {};

// Carregar dados salvos
function loadFromStorage() {
    try {
        const saved = localStorage.getItem('colorGameData');
        if (saved) {
            const data = JSON.parse(saved);
            gameState.levelProgress = data.levelProgress || { easy: 0, medium: 0, hard: 0 };
            gameState.unlockedLevels = data.unlockedLevels || ['easy'];
            gameState.totalGames = data.totalGames || 0;
            gameState.totalWins = data.totalWins || 0;
            gameState.highScore = data.highScore || 0;
            gameState.score = data.score || 0;
        }
    } catch (error) {
        console.warn('Erro ao carregar dados salvos:', error);
    }
}

// Salvar dados
function saveToStorage() {
    const data = {
        levelProgress: gameState.levelProgress,
        unlockedLevels: gameState.unlockedLevels,
        totalGames: gameState.totalGames,
        totalWins: gameState.totalWins,
        highScore: gameState.highScore,
        score: gameState.score
    };
    localStorage.setItem('colorGameData', JSON.stringify(data));
}

// Gerar nova cor
function generateNewColor() {
    const availableColors = COLOR_SETS[gameState.currentLevel].filter(
        color => !gameState.usedColors.includes(color)
    );
    
    if (availableColors.length === 0) {
        gameState.usedColors = [];
        return getRandomColor(COLOR_SETS[gameState.currentLevel]);
    }
    
    return getRandomColor(availableColors);
}

function getRandomColor(colorArray) {
    return colorArray[Math.floor(Math.random() * colorArray.length)];
}

// Iniciar novo jogo
function startNewGame() {
    gameState.targetColor = generateNewColor();
    gameState.attemptsLeft = GAME_CONFIG.ATTEMPTS_PER_GAME;
    gameState.isGameActive = true;
    gameState.usedColors = [gameState.targetColor];
    
    // Reset visual
    document.body.className = '';
    elements.colorInput.value = '';
    elements.colorInput.disabled = false;
    elements.guessBtn.style.display = 'inline-flex';
    elements.restartBtn.style.display = 'none';
    if (elements.nextLevelBtn) elements.nextLevelBtn.style.display = 'none';
    if (elements.hintArea) elements.hintArea.style.display = 'none';
    
    showFeedback('Boa sorte! Uma nova cor foi sorteada...', 'info');
    updateUI();
    elements.colorInput.focus();
}

// Mostrar feedback
function showFeedback(message, type) {
    if (elements.feedbackMessage) {
        elements.feedbackMessage.textContent = message;
        elements.feedbackArea.className = `feedback-area ${type}`;
    }
}

// Atualizar interface
function updateUI() {
    if (elements.attemptsCount) elements.attemptsCount.textContent = gameState.attemptsLeft;
    if (elements.scoreCount) elements.scoreCount.textContent = gameState.score;
    if (elements.levelProgress) {
        elements.levelProgress.textContent = 
            `${gameState.levelProgress[gameState.currentLevel]}/${GAME_CONFIG.WINS_TO_UNLOCK_NEXT}`;
    }
    
    // Estatísticas
    if (elements.totalGames) elements.totalGames.textContent = gameState.totalGames;
    if (elements.totalWins) elements.totalWins.textContent = gameState.totalWins;
    if (elements.winRate) {
        const rate = gameState.totalGames > 0 ? Math.round((gameState.totalWins / gameState.totalGames) * 100) : 0;
        elements.winRate.textContent = `${rate}%`;
    }
    if (elements.highScore) elements.highScore.textContent = gameState.highScore;
}

// Processar palpite
function handleGuess() {
    if (!gameState.isGameActive) return;
    
    const guess = elements.colorInput.value.trim().toLowerCase();
    
    if (!guess) {
        showFeedback('Digite uma cor!', 'error');
        return;
    }
    
    gameState.attemptsLeft--;
    const isCorrect = guess === gameState.targetColor.toLowerCase();
    
    if (isCorrect) {
        handleCorrectGuess();
    } else {
        handleIncorrectGuess(guess);
    }
    
    // Garantir que a UI seja atualizada após mudanças no estado
    setTimeout(() => {
        updateUI();
    }, 50);
}

// Palpite correto
function handleCorrectGuess() {
    gameState.isGameActive = false;
    gameState.totalWins++;
    gameState.levelProgress[gameState.currentLevel]++;
    gameState.score += GAME_CONFIG.SCORES[gameState.currentLevel];
    gameState.totalGames++;
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
    }
    
    // Mudança de cor de fundo
    document.body.style.backgroundColor = gameState.targetColor;
    
    showFeedback(
        `🎉 Parabéns! Você acertou! A cor era "${gameState.targetColor}". +${GAME_CONFIG.SCORES[gameState.currentLevel]} pontos!`, 
        'success'
    );
    
    elements.guessBtn.style.display = 'none';
    elements.restartBtn.style.display = 'inline-flex';
    elements.colorInput.disabled = true;
    
    checkLevelUnlock();
    saveToStorage();
}

// Palpite incorreto
function handleIncorrectGuess(guess) {
    if (gameState.attemptsLeft > 0) {
        showFeedback(
            `❌ Errou! "${guess}" não é a cor. Tentativas restantes: ${gameState.attemptsLeft}`, 
            'error'
        );
        
        showHint(guess);
        elements.colorInput.value = '';
        elements.colorInput.focus();
        
    } else {
        gameState.isGameActive = false;
        gameState.totalGames++;
        
        showFeedback(
            `💀 Fim de jogo! A cor era "${gameState.targetColor}". Tente novamente!`, 
            'error'
        );
        
        elements.guessBtn.style.display = 'none';
        elements.restartBtn.style.display = 'inline-flex';
        elements.colorInput.disabled = true;
        
        saveToStorage();
    }
}

// Mostrar dica
function showHint(guess) {
    if (!elements.hintArea || !elements.hintMessage) return;
    
    const targetColor = gameState.targetColor.toLowerCase();
    const targetFamily = getColorFamily(targetColor);
    const guessFamily = getColorFamily(guess);
    
    let hint = '';
    
    if (targetFamily === guessFamily) {
        hint = `🔥 Quente! A cor é da mesma família (${targetFamily}) que "${guess}"`;
    } else {
        hint = `❄️ Frio! A cor não é da família ${guessFamily}. Tente cores ${targetFamily}`;
    }
    
    elements.hintMessage.textContent = hint;
    elements.hintArea.style.display = 'block';
}

// Obter família da cor
function getColorFamily(color) {
    for (const [family, colors] of Object.entries(COLOR_FAMILIES)) {
        if (colors.includes(color)) {
            return family === 'warm' ? 'quentes' : 
                   family === 'cool' ? 'frias' : 'neutras';
        }
    }
    return 'especiais';
}

// Verificar desbloqueio de nível
function checkLevelUnlock() {
    if (gameState.levelProgress.easy >= GAME_CONFIG.WINS_TO_UNLOCK_NEXT && 
        !gameState.unlockedLevels.includes('medium')) {
        gameState.unlockedLevels.push('medium');
        setTimeout(() => alert('🎉 Parabéns! Você desbloqueou o nível Médio!'), 1500);
    }
    
    if (gameState.levelProgress.medium >= GAME_CONFIG.WINS_TO_UNLOCK_NEXT && 
        !gameState.unlockedLevels.includes('hard')) {
        gameState.unlockedLevels.push('hard');
        setTimeout(() => alert('🎉 Parabéns! Você desbloqueou o nível Difícil!'), 1500);
    }
    
    updateLevelSelector();
}

// Atualizar seletor de nível
function updateLevelSelector() {
    if (!elements.difficultySelect) return;
    
    const options = elements.difficultySelect.querySelectorAll('option');
    options.forEach(option => {
        const level = option.value;
        if (gameState.unlockedLevels.includes(level)) {
            option.disabled = false;
            option.textContent = option.textContent.replace(' - Desbloqueie acertando 3 no fácil', '')
                                                   .replace(' - Desbloqueie acertando 3 no médio', '');
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Capturar elementos DOM
    elements = {
        difficultySelect: document.getElementById('difficulty-select'),
        attemptsCount: document.getElementById('attempts-count'),
        scoreCount: document.getElementById('score-count'),
        levelProgress: document.getElementById('level-progress'),
        colorInput: document.getElementById('color-guess'),
        guessBtn: document.getElementById('guess-btn'),
        feedbackArea: document.getElementById('feedback-area'),
        feedbackMessage: document.getElementById('feedback-message'),
        hintArea: document.getElementById('hint-area'),
        hintMessage: document.getElementById('hint-message'),
        restartBtn: document.getElementById('restart-btn'),
        nextLevelBtn: document.getElementById('next-level-btn'),
        homeBtn: document.getElementById('home-btn'),
        totalGames: document.getElementById('total-games'),
        totalWins: document.getElementById('total-wins'),
        winRate: document.getElementById('win-rate'),
        highScore: document.getElementById('high-score')
    };
    
    // Verificar elementos críticos
    const criticalElements = ['colorInput', 'guessBtn', 'feedbackMessage'];
    const missing = criticalElements.filter(key => !elements[key]);
    
    if (missing.length > 0) {
        console.error('Elementos críticos ausentes:', missing);
        return;
    }
    
    // Configurar eventos
    elements.guessBtn.addEventListener('click', handleGuess);
    
    if (elements.restartBtn) {
        elements.restartBtn.addEventListener('click', () => {
            startNewGame();
        });
    }
    
    if (elements.colorInput) {
        elements.colorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && gameState.isGameActive) {
                handleGuess();
            }
        });
    }
    
    if (elements.difficultySelect) {
        elements.difficultySelect.addEventListener('change', (e) => {
            gameState.currentLevel = e.target.value;
            startNewGame();
        });
    }
    
    if (elements.homeBtn) {
        elements.homeBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja voltar à página principal? O progresso será salvo.')) {
                saveToStorage();
                window.location.href = '../index.html';
            }
        });
    }
    
    // Carregar dados salvos e inicializar
    loadFromStorage();
    updateLevelSelector();
    updateUI();
    startNewGame();
    
    console.log('✅ Jogo de cores inicializado com sucesso!');
});