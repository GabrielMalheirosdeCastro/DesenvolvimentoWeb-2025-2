/**
 * 🎮 JOGO DE ADIVINHAÇÃO DE CORES - VERSÃO TESTE COM DETECÇÃO DE FUNDO
 * Projeto Prático C3 - Gabriel Malheiros de Castro
 * FAESA 2025-2
 * 
 * Este arquivo implementa toda a lógica do jogo seguindo as especificações:
 * - Sistema de 3 tentativas por rodada
 * - Progressão de níveis (Fácil → Médio → Difícil)
 * - Sistema de pontuação e estatísticas
 * - Feedback inteligente com dicas
 * - LocalStorage para persistência de dados
 * - NOVA: Detecção da cor de fundo da página para aceitar como resposta
 */

// ================================
// CONSTANTES E CONFIGURAÇÕES
// ================================

const GAME_CONFIG = {
    ATTEMPTS_PER_GAME: 3,
    WINS_TO_UNLOCK_NEXT: 3,
    SCORES: {
        easy: 10,
        medium: 25,
        hard: 50
    }
};

// Arrays de cores por nível de dificuldade
const COLOR_SETS = {
    easy: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'white'],
    medium: ['navy', 'teal', 'coral', 'crimson', 'indigo', 'lime', 'olive', 'cyan', 'gold', 'silver'],
    hard: ['darkslateblue', 'lightcoral', 'mediumseagreen', 'darkgoldenrod', 'lightsteelblue', 
           'palevioletred', 'mediumorchid', 'darkolivegreen', 'lightslategray', 'mediumturquoise']
};

// Famílias de cores para dicas inteligentes
const COLOR_FAMILIES = {
    warm: ['red', 'orange', 'yellow', 'pink', 'coral', 'crimson', 'gold'],
    cool: ['blue', 'green', 'purple', 'navy', 'teal', 'indigo', 'cyan'],
    neutral: ['brown', 'gray', 'white', 'silver', 'olive'],
    light: ['lightcoral', 'lightsteelblue', 'lightslategray'],
    dark: ['darkslateblue', 'darkgoldenrod', 'darkolivegreen'],
    medium: ['mediumseagreen', 'mediumorchid', 'mediumturquoise']
};

// ================================
// UTILITÁRIOS DE DETECÇÃO DE COR
// ================================

class ColorDetector {
    /**
     * Converte valores RGB para nome de cor HTML quando possível
     */
    static rgbToColorName(r, g, b) {
        const colorMap = {
            '255,0,0': 'red',
            '0,128,0': 'green',
            '0,0,255': 'blue',
            '255,255,0': 'yellow',
            '128,0,128': 'purple',
            '255,165,0': 'orange',
            '255,192,203': 'pink',
            '165,42,42': 'brown',
            '128,128,128': 'gray',
            '255,255,255': 'white',
            '0,0,0': 'black',
            '0,0,128': 'navy',
            '0,128,128': 'teal',
            '255,127,80': 'coral',
            '220,20,60': 'crimson',
            '75,0,130': 'indigo',
            '0,255,0': 'lime',
            '128,128,0': 'olive',
            '0,255,255': 'cyan',
            '255,215,0': 'gold',
            '192,192,192': 'silver',
            '72,61,139': 'darkslateblue',
            '240,128,128': 'lightcoral',
            '60,179,113': 'mediumseagreen',
            '184,134,11': 'darkgoldenrod',
            '176,196,222': 'lightsteelblue',
            '219,112,147': 'palevioletred',
            '186,85,211': 'mediumorchid',
            '85,107,47': 'darkolivegreen',
            '119,136,153': 'lightslategray',
            '72,209,204': 'mediumturquoise'
        };
        
        const key = `${r},${g},${b}`;
        return colorMap[key] || null;
    }

    /**
     * Detecta a cor de fundo atual da página
     */
    static detectBackgroundColor() {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const bgColor = computedStyle.backgroundColor;
        
        // Se for transparente ou inherit, usa branco como padrão
        if (bgColor === 'transparent' || bgColor === 'inherit' || bgColor === 'rgba(0, 0, 0, 0)') {
            return 'white';
        }
        
        // Parse RGB/RGBA
        const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const rgbaMatch = bgColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
        
        if (rgbMatch) {
            const [, r, g, b] = rgbMatch.map(Number);
            const colorName = this.rgbToColorName(r, g, b);
            console.log(`🎨 Cor de fundo detectada: rgb(${r}, ${g}, ${b}) = ${colorName || 'desconhecida'}`);
            return colorName;
        }
        
        if (rgbaMatch) {
            const [, r, g, b] = rgbaMatch.map(Number);
            const colorName = this.rgbToColorName(r, g, b);
            console.log(`🎨 Cor de fundo detectada: rgba(${r}, ${g}, ${b}, a) = ${colorName || 'desconhecida'}`);
            return colorName;
        }
        
        // Se não conseguir detectar, assume branco
        console.log('🎨 Cor de fundo não detectada, assumindo branco');
        return 'white';
    }

    /**
     * Verifica se uma cor específica está atualmente sendo exibida como fundo
     */
    static isColorCurrentlyDisplayed(colorName) {
        const currentBgColor = this.detectBackgroundColor();
        return currentBgColor && currentBgColor.toLowerCase() === colorName.toLowerCase();
    }

    /**
     * Lista todas as cores que podem ser detectadas como fundo da página
     */
    static getDetectableColors() {
        const allGameColors = [
            ...COLOR_SETS.easy,
            ...COLOR_SETS.medium, 
            ...COLOR_SETS.hard
        ];
        
        return [...new Set(allGameColors)]; // Remove duplicatas
    }
}

// ================================
// ESTADO DO JOGO (MODIFICADO)
// ================================

class GameState {
    constructor() {
        this.currentLevel = 'easy';
        this.targetColor = '';
        this.attemptsLeft = GAME_CONFIG.ATTEMPTS_PER_GAME;
        this.score = 0;
        this.usedColors = [];
        this.levelProgress = { easy: 0, medium: 0, hard: 0 };
        this.unlockedLevels = ['easy'];
        this.isGameActive = false;
        this.totalGames = 0;
        this.totalWins = 0;
        this.highScore = 0;
        
        // Nova propriedade para detectar se a cor está sendo exibida
        this.colorDisplayedOnBackground = false;
        
        this.loadFromStorage();
    }

    saveToStorage() {
        const data = {
            levelProgress: this.levelProgress,
            unlockedLevels: this.unlockedLevels,
            totalGames: this.totalGames,
            totalWins: this.totalWins,
            highScore: this.highScore,
            score: this.score
        };
        localStorage.setItem('colorGameData', JSON.stringify(data));
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('colorGameData');
            if (saved) {
                const data = JSON.parse(saved);
                this.levelProgress = data.levelProgress || { easy: 0, medium: 0, hard: 0 };
                this.unlockedLevels = data.unlockedLevels || ['easy'];
                this.totalGames = data.totalGames || 0;
                this.totalWins = data.totalWins || 0;
                this.highScore = data.highScore || 0;
                this.score = data.score || 0;
            }
        } catch (error) {
            console.warn('Erro ao carregar dados salvos:', error);
        }
    }

    resetGame() {
        this.targetColor = this.generateNewColor();
        this.attemptsLeft = GAME_CONFIG.ATTEMPTS_PER_GAME;
        this.isGameActive = true;
        this.usedColors = [this.targetColor];
        this.colorDisplayedOnBackground = false;
    }

    generateNewColor() {
        const availableColors = COLOR_SETS[this.currentLevel].filter(
            color => !this.usedColors.includes(color)
        );
        
        // Se todas as cores foram usadas, reinicia a lista
        if (availableColors.length === 0) {
            this.usedColors = [];
            return this.getRandomColor(COLOR_SETS[this.currentLevel]);
        }
        
        return this.getRandomColor(availableColors);
    }

    getRandomColor(colorArray) {
        const randomIndex = Math.floor(Math.random() * colorArray.length);
        return colorArray[randomIndex];
    }

    addWin() {
        this.totalWins++;
        this.levelProgress[this.currentLevel]++;
        this.score += GAME_CONFIG.SCORES[this.currentLevel];
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }

        // Verifica se deve desbloquear próximo nível
        this.checkLevelUnlock();
        this.saveToStorage();
    }

    addGame() {
        this.totalGames++;
        this.saveToStorage();
    }

    checkLevelUnlock() {
        if (this.levelProgress.easy >= GAME_CONFIG.WINS_TO_UNLOCK_NEXT && !this.unlockedLevels.includes('medium')) {
            this.unlockedLevels.push('medium');
            this.showLevelUnlocked('medium');
        }
        
        if (this.levelProgress.medium >= GAME_CONFIG.WINS_TO_UNLOCK_NEXT && !this.unlockedLevels.includes('hard')) {
            this.unlockedLevels.push('hard');
            this.showLevelUnlocked('hard');
        }
    }

    showLevelUnlocked(level) {
        const levelNames = { medium: 'Médio', hard: 'Difícil' };
        setTimeout(() => {
            alert(`🎉 Parabéns! Você desbloqueou o nível ${levelNames[level]}!`);
        }, 1500);
    }

    getWinRate() {
        if (this.totalGames === 0) return 0;
        return Math.round((this.totalWins / this.totalGames) * 100);
    }

    /**
     * Verifica se o jogador pode "ver" a cor através do fundo da página
     */
    checkBackgroundColorMatch() {
        const isDisplayed = ColorDetector.isColorCurrentlyDisplayed(this.targetColor);
        this.colorDisplayedOnBackground = isDisplayed;
        return isDisplayed;
    }
}

// ================================
// ELEMENTOS DO DOM
// ================================

class DOMElements {
    constructor() {
        this.difficultySelect = document.getElementById('difficulty-select');
        this.attemptsCount = document.getElementById('attempts-count');
        this.scoreCount = document.getElementById('score-count');
        this.levelProgress = document.getElementById('level-progress');
        this.colorInput = document.getElementById('color-guess');
        this.guessBtn = document.getElementById('guess-btn');
        this.feedbackArea = document.getElementById('feedback-area');
        this.feedbackMessage = document.getElementById('feedback-message');
        this.hintArea = document.getElementById('hint-area');
        this.hintMessage = document.getElementById('hint-message');
        this.restartBtn = document.getElementById('restart-btn');
        this.nextLevelBtn = document.getElementById('next-level-btn');
        this.homeBtn = document.getElementById('home-btn');
        this.totalGames = document.getElementById('total-games');
        this.totalWins = document.getElementById('total-wins');
        this.winRate = document.getElementById('win-rate');
        this.highScore = document.getElementById('high-score');
    }
}

// ================================
// CLASSE PRINCIPAL DO JOGO (MODIFICADA)
// ================================

class ColorGuessingGame {
    constructor() {
        this.gameState = new GameState();
        this.dom = new DOMElements();
        this.backgroundColorCheckInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.updateLevelSelector();
        this.startNewGame();
        
        // Inicia monitoramento da cor de fundo
        this.startBackgroundColorMonitoring();
        
        // Foco inicial no campo de entrada
        this.dom.colorInput.focus();
    }

    /**
     * Inicia o monitoramento contínuo da cor de fundo da página
     */
    startBackgroundColorMonitoring() {
        // Verifica a cor de fundo a cada 1 segundo
        this.backgroundColorCheckInterval = setInterval(() => {
            if (this.gameState.isGameActive) {
                const wasDisplayed = this.gameState.colorDisplayedOnBackground;
                const isNowDisplayed = this.gameState.checkBackgroundColorMatch();
                
                // Se a cor acabou de aparecer no fundo
                if (!wasDisplayed && isNowDisplayed) {
                    this.showBackgroundColorHint();
                }
            }
        }, 1000);
    }

    /**
     * Para o monitoramento da cor de fundo
     */
    stopBackgroundColorMonitoring() {
        if (this.backgroundColorCheckInterval) {
            clearInterval(this.backgroundColorCheckInterval);
            this.backgroundColorCheckInterval = null;
        }
    }

    /**
     * Mostra dica quando a cor aparece no fundo da página
     */
    showBackgroundColorHint() {
        const hintMessage = `🔍 Dica especial: Observe a cor de fundo desta página! Ela pode te ajudar...`;
        this.dom.hintMessage.textContent = hintMessage;
        this.dom.hintArea.style.display = 'block';
        
        // Adiciona animação especial para chamar atenção
        this.dom.hintArea.classList.add('background-hint-pulse');
        setTimeout(() => {
            this.dom.hintArea.classList.remove('background-hint-pulse');
        }, 2000);
    }

    setupEventListeners() {
        // Eventos principais
        this.dom.guessBtn.addEventListener('click', () => this.handleGuess());
        this.dom.restartBtn.addEventListener('click', () => this.startNewGame());
        this.dom.nextLevelBtn.addEventListener('click', () => this.nextLevel());
        this.dom.homeBtn.addEventListener('click', () => this.goHome());
        
        // Mudança de nível de dificuldade
        this.dom.difficultySelect.addEventListener('change', (e) => {
            this.gameState.currentLevel = e.target.value;
            this.startNewGame();
        });
        
        // Enter para adivinhar
        this.dom.colorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.gameState.isGameActive) {
                this.handleGuess();
            }
        });

        // Validação em tempo real
        this.dom.colorInput.addEventListener('input', () => {
            this.validateInput();
        });

        // Limpar interval quando a página é fechada
        window.addEventListener('beforeunload', () => {
            this.stopBackgroundColorMonitoring();
        });
    }

    validateInput() {
        const input = this.dom.colorInput.value.trim().toLowerCase();
        const availableColors = COLOR_SETS[this.gameState.currentLevel];
        
        // Remove classes de validação anteriores
        this.dom.colorInput.classList.remove('valid', 'invalid', 'background-match');
        
        if (input.length > 0) {
            const isValid = availableColors.some(color => 
                color.toLowerCase().includes(input) || input.includes(color.toLowerCase())
            );
            
            // Verifica se a cor digitada corresponde à cor de fundo atual
            const matchesBackground = ColorDetector.isColorCurrentlyDisplayed(input);
            
            if (matchesBackground) {
                this.dom.colorInput.classList.add('background-match');
            } else {
                this.dom.colorInput.classList.add(isValid ? 'valid' : 'invalid');
            }
        }
    }

    handleGuess() {
        if (!this.gameState.isGameActive) return;

        const guess = this.dom.colorInput.value.trim().toLowerCase();
        
        // Validação de entrada
        if (!guess) {
            this.showFeedback('Digite uma cor!', 'error');
            this.dom.colorInput.classList.add('shake');
            setTimeout(() => this.dom.colorInput.classList.remove('shake'), 500);
            return;
        }

        this.gameState.attemptsLeft--;
        
        // Verificar se acertou a cor alvo OU se digitou a cor do fundo da página
        const isCorrectTarget = guess === this.gameState.targetColor.toLowerCase();
        const isBackgroundColor = ColorDetector.isColorCurrentlyDisplayed(guess);
        
        if (isCorrectTarget || isBackgroundColor) {
            this.handleCorrectGuess(isBackgroundColor);
        } else {
            this.handleIncorrectGuess(guess);
        }
        
        this.updateUI();
    }

    handleCorrectGuess(wasBackgroundGuess = false) {
        this.gameState.isGameActive = false;
        this.gameState.addWin();
        this.gameState.addGame();
        
        // Mudança visual de fundo para a cor alvo
        this.changeBackgroundColor(this.gameState.targetColor);
        
        // Feedback diferenciado baseado no tipo de acerto
        let feedbackMessage;
        if (wasBackgroundGuess) {
            feedbackMessage = `🎨 Excelente! Você observou a cor de fundo! A cor era "${this.gameState.targetColor}". +${GAME_CONFIG.SCORES[this.gameState.currentLevel]} pontos!`;
        } else {
            feedbackMessage = `🎉 Parabéns! Você acertou! A cor era "${this.gameState.targetColor}". +${GAME_CONFIG.SCORES[this.gameState.currentLevel]} pontos!`;
        }
        
        this.showFeedback(feedbackMessage, 'success');
        
        // Animação de celebração
        this.dom.feedbackArea.classList.add('celebrate');
        setTimeout(() => this.dom.feedbackArea.classList.remove('celebrate'), 600);
        
        // Mostrar controles apropriados
        this.dom.guessBtn.style.display = 'none';
        this.dom.restartBtn.style.display = 'inline-flex';
        
        // Verificar se pode avançar de nível
        if (this.canAdvanceLevel()) {
            this.dom.nextLevelBtn.style.display = 'inline-flex';
        }
        
        this.dom.colorInput.disabled = true;
        this.dom.hintArea.style.display = 'none';
    }

    handleIncorrectGuess(guess) {
        if (this.gameState.attemptsLeft > 0) {
            // Ainda tem tentativas
            this.showFeedback(
                `❌ Errou! "${guess}" não é a cor. Tentativas restantes: ${this.gameState.attemptsLeft}`, 
                'error'
            );
            
            // Mostrar dica inteligente
            this.showHint(guess);
            
            // Animação de erro
            this.dom.feedbackArea.classList.add('shake');
            setTimeout(() => this.dom.feedbackArea.classList.remove('shake'), 500);
            
            // Limpar campo para nova tentativa
            this.dom.colorInput.value = '';
            this.dom.colorInput.focus();
            
        } else {
            // Game over
            this.gameState.isGameActive = false;
            this.gameState.addGame();
            
            this.showFeedback(
                `💀 Fim de jogo! A cor era "${this.gameState.targetColor}". Tente novamente!`, 
                'error'
            );
            
            this.dom.guessBtn.style.display = 'none';
            this.dom.restartBtn.style.display = 'inline-flex';
            this.dom.colorInput.disabled = true;
            this.dom.hintArea.style.display = 'none';
        }
    }

    showHint(guess) {
        const targetColor = this.gameState.targetColor.toLowerCase();
        let hint = '';
        
        // Dica baseada na família da cor
        const targetFamily = this.getColorFamily(targetColor);
        const guessFamily = this.getColorFamily(guess);
        
        if (targetFamily === guessFamily) {
            hint = `🔥 Quente! A cor é da mesma família (${targetFamily}) que "${guess}"`;
        } else {
            hint = `❄️ Frio! A cor não é da família ${guessFamily}. Tente cores ${targetFamily}`;
        }
        
        // Dica baseada no comprimento
        if (Math.abs(targetColor.length - guess.length) <= 2) {
            hint += `. O tamanho está próximo!`;
        }
        
        // Dica baseada em letras em comum
        const commonLetters = this.getCommonLetters(targetColor, guess);
        if (commonLetters > 0) {
            hint += ` Tem ${commonLetters} letra(s) em comum!`;
        }

        // Verifica se a cor alvo está atualmente no fundo da página
        if (ColorDetector.isColorCurrentlyDisplayed(targetColor)) {
            hint += ` 👀 Dica extra: Olhe ao redor da página...`;
        }
        
        this.dom.hintMessage.textContent = hint;
        this.dom.hintArea.style.display = 'block';
    }

    getColorFamily(color) {
        for (const [family, colors] of Object.entries(COLOR_FAMILIES)) {
            if (colors.includes(color)) {
                return family === 'warm' ? 'quentes' : 
                       family === 'cool' ? 'frias' : 
                       family === 'neutral' ? 'neutras' :
                       family === 'light' ? 'claras' :
                       family === 'dark' ? 'escuras' : 'intermediárias';
            }
        }
        return 'especiais';
    }

    getCommonLetters(str1, str2) {
        const letters1 = str1.split('').sort();
        const letters2 = str2.split('').sort();
        let common = 0;
        let i = 0, j = 0;
        
        while (i < letters1.length && j < letters2.length) {
            if (letters1[i] === letters2[j]) {
                common++;
                i++;
                j++;
            } else if (letters1[i] < letters2[j]) {
                i++;
            } else {
                j++;
            }
        }
        
        return common;
    }

    showFeedback(message, type) {
        this.dom.feedbackMessage.textContent = message;
        this.dom.feedbackArea.className = `feedback-area ${type}`;
    }

    changeBackgroundColor(color) {
        // Remove classes de cor anteriores
        document.body.className = document.body.className
            .split(' ')
            .filter(cls => !cls.startsWith('color-'))
            .join(' ');
        
        // Adiciona nova classe de cor
        document.body.classList.add(`color-${color.toLowerCase()}`);
    }

    canAdvanceLevel() {
        const currentLevel = this.gameState.currentLevel;
        const progress = this.gameState.levelProgress[currentLevel];
        
        return (currentLevel === 'easy' && progress >= GAME_CONFIG.WINS_TO_UNLOCK_NEXT && this.gameState.unlockedLevels.includes('medium')) ||
               (currentLevel === 'medium' && progress >= GAME_CONFIG.WINS_TO_UNLOCK_NEXT && this.gameState.unlockedLevels.includes('hard'));
    }

    nextLevel() {
        const levelOrder = ['easy', 'medium', 'hard'];
        const currentIndex = levelOrder.indexOf(this.gameState.currentLevel);
        
        if (currentIndex < levelOrder.length - 1) {
            const nextLevel = levelOrder[currentIndex + 1];
            if (this.gameState.unlockedLevels.includes(nextLevel)) {
                this.gameState.currentLevel = nextLevel;
                this.dom.difficultySelect.value = nextLevel;
                this.updateLevelSelector();
                this.startNewGame();
            }
        }
    }

    startNewGame() {
        this.gameState.resetGame();
        
        // Reset visual
        document.body.className = '';
        this.dom.colorInput.value = '';
        this.dom.colorInput.disabled = false;
        this.dom.guessBtn.style.display = 'inline-flex';
        this.dom.restartBtn.style.display = 'none';
        this.dom.nextLevelBtn.style.display = 'none';
        this.dom.hintArea.style.display = 'none';
        
        // Feedback inicial
        this.showFeedback('Boa sorte! Uma nova cor foi sorteada. Observe a página atentamente...', 'info');
        
        this.updateUI();
        this.dom.colorInput.focus();
        
        // Debug info (remover em produção)
        console.log(`🎯 Cor sorteada: ${this.gameState.targetColor}`);
        
        // Força a mudança de cor de fundo após 2 segundos para o jogador poder "ver" a cor
        setTimeout(() => {
            this.changeBackgroundColor(this.gameState.targetColor);
            console.log(`🎨 Cor de fundo alterada para: ${this.gameState.targetColor}`);
        }, 2000);
    }

    updateUI() {
        // Atualizar contadores
        this.dom.attemptsCount.textContent = this.gameState.attemptsLeft;
        this.dom.scoreCount.textContent = this.gameState.score;
        this.dom.levelProgress.textContent = 
            `${this.gameState.levelProgress[this.gameState.currentLevel]}/${GAME_CONFIG.WINS_TO_UNLOCK_NEXT}`;
        
        // Atualizar estatísticas
        this.dom.totalGames.textContent = this.gameState.totalGames;
        this.dom.totalWins.textContent = this.gameState.totalWins;
        this.dom.winRate.textContent = `${this.gameState.getWinRate()}%`;
        this.dom.highScore.textContent = this.gameState.highScore;
        
        // Animação no contador de tentativas se crítico
        if (this.gameState.attemptsLeft === 1) {
            this.dom.attemptsCount.classList.add('pulse');
        } else {
            this.dom.attemptsCount.classList.remove('pulse');
        }
    }

    updateLevelSelector() {
        const options = this.dom.difficultySelect.querySelectorAll('option');
        
        options.forEach(option => {
            const level = option.value;
            if (this.gameState.unlockedLevels.includes(level)) {
                option.disabled = false;
                option.textContent = option.textContent.replace(' - Desbloqueie', '');
            }
        });
    }

    goHome() {
        if (confirm('Tem certeza que deseja voltar à página principal? O progresso atual será salvo.')) {
            // Parar monitoramento antes de sair
            this.stopBackgroundColorMonitoring();
            
            // Salvar estado antes de sair
            this.gameState.saveToStorage();
            
            // Navegar para página principal
            window.location.href = '../index.html';
        }
    }
}

// ================================
// INICIALIZAÇÃO DO JOGO (MODIFICADA)
// ================================

// Aguardar carregamento completo da página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Iniciando Jogo de Adivinhação de Cores com Detecção de Fundo...');
    
    // Verificar se todos os elementos necessários estão presentes
    const requiredElements = [
        'difficulty-select', 'attempts-count', 'score-count', 
        'color-guess', 'guess-btn', 'feedback-message'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos DOM ausentes:', missingElements);
        alert('Erro: Alguns elementos da interface não foram encontrados. Recarregue a página.');
        return;
    }
    
    // Testar detector de cores
    console.log('🧪 Testando detector de cores...');
    const detectableColors = ColorDetector.getDetectableColors();
    console.log(`📊 Cores detectáveis: ${detectableColors.length}`, detectableColors);
    
    // Inicializar o jogo
    try {
        window.colorGame = new ColorGuessingGame();
        console.log('✅ Jogo inicializado com sucesso!');
        
        // Mensagem de boas-vindas
        setTimeout(() => {
            const instructions = document.querySelector('.game-instructions');
            if (instructions) {
                instructions.style.animation = 'pulse 2s ease-in-out';
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar o jogo:', error);
        alert('Erro ao inicializar o jogo. Recarregue a página e tente novamente.');
    }
});

// ================================
// FUNCIONALIDADES EXTRAS (MODIFICADAS)
// ================================

// Sistema de atalhos de teclado
document.addEventListener('keydown', (e) => {
    // Apenas se o jogo estiver ativo e não há modais
    if (!window.colorGame || !window.colorGame.gameState.isGameActive) return;
    
    switch(e.key) {
        case 'Escape':
            if (confirm('Deseja reiniciar o jogo atual?')) {
                window.colorGame.startNewGame();
            }
            break;
            
        case 'F1':
            e.preventDefault();
            alert('🎮 DICAS:\n\n' +
                  '• Digite nomes de cores em inglês\n' +
                  '• Use as dicas após cada erro\n' +
                  '• Cores quentes: red, orange, yellow...\n' +
                  '• Cores frias: blue, green, purple...\n' +
                  '• 👀 NOVO: Observe a cor de fundo da página!\n' +
                  '• Pressione ESC para reiniciar');
            break;

        case 'F2':
            e.preventDefault();
            // Atalho secreto para mostrar cor de fundo atual
            const currentBg = ColorDetector.detectBackgroundColor();
            alert(`🔍 Debug: Cor de fundo atual = ${currentBg || 'não detectada'}`);
            break;
    }
});

// Detecção de inatividade
let inactivityTimer;
const INACTIVITY_TIMEOUT = 300000; // 5 minutos

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (window.colorGame && window.colorGame.gameState.isGameActive) {
            const shouldContinue = confirm(
                '⏰ Você está inativo há 5 minutos.\n\n' +
                'Deseja continuar jogando?'
            );
            if (!shouldContinue) {
                window.colorGame.gameState.saveToStorage();
            }
        }
    }, INACTIVITY_TIMEOUT);
}

// Eventos que resetam o timer de inatividade
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
});

// Salvar automaticamente antes de fechar a página
window.addEventListener('beforeunload', () => {
    if (window.colorGame) {
        window.colorGame.stopBackgroundColorMonitoring();
        window.colorGame.gameState.saveToStorage();
    }
});

// Sistema de debug (apenas em desenvolvimento)
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.includes('vercel')) {
    console.log('🔧 Modo de desenvolvimento ativo');
    console.log('🎯 Use colorGame.gameState.targetColor para ver a cor atual');
    console.log('🏆 Use colorGame.gameState.score para ver a pontuação');
    console.log('🎨 Use ColorDetector.detectBackgroundColor() para ver cor de fundo');
    
    // Comando de desenvolvedor para revelar cor
    window.revealColor = () => {
        if (window.colorGame) {
            console.log(`🎯 Cor atual: ${window.colorGame.gameState.targetColor}`);
            return window.colorGame.gameState.targetColor;
        }
    };

    // Comando para testar detector de cores
    window.testColorDetector = () => {
        const currentBg = ColorDetector.detectBackgroundColor();
        console.log(`🎨 Cor de fundo: ${currentBg}`);
        return currentBg;
    };

    // Comando para forçar mudança de cor de fundo
    window.setBackgroundColor = (color) => {
        if (window.colorGame) {
            window.colorGame.changeBackgroundColor(color);
            console.log(`🎨 Cor de fundo alterada para: ${color}`);
        }
    };
}