/**
 * 🎮 JOGO DE ADIVINHAÇÃO DE CORES - VERSÃO CORRIGIDA
 * Projeto Prático C3 - Gabriel Malheiros de Castro
 * FAESA 2025-2
 * 
 * CORREÇÕES APLICADAS:
 * - Removido monitoramento automático de cor de fundo que causava loop infinito
 * - Removida mudança automática de cor de fundo após 3 segundos
 * - Simplificado o detector de cores para evitar recursão
 * - Otimizada a performance removendo verificações desnecessárias
 * 
 * Este arquivo implementa toda a lógica do jogo seguindo as especificações:
 * - Sistema de 3 tentativas por rodada
 * - Progressão de níveis (Fácil → Médio → Difícil)
 * - Sistema de pontuação e estatísticas
 * - Feedback inteligente com dicas
 * - LocalStorage para persistência de dados
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
// ESTADO DO JOGO
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
}

// ================================
// ELEMENTOS DO DOM
// ================================

class DOMElements {
    constructor() {
        console.log('🔍 Buscando elementos DOM...');
        
        this.difficultySelect = document.getElementById('difficulty-select');
        console.log('difficultySelect:', this.difficultySelect ? '✅' : '❌');
        
        this.attemptsCount = document.getElementById('attempts-count');
        console.log('attemptsCount:', this.attemptsCount ? '✅' : '❌');
        
        this.scoreCount = document.getElementById('score-count');
        console.log('scoreCount:', this.scoreCount ? '✅' : '❌');
        
        this.levelProgress = document.getElementById('level-progress');
        console.log('levelProgress:', this.levelProgress ? '✅' : '❌');
        
        this.colorInput = document.getElementById('color-guess');
        console.log('colorInput:', this.colorInput ? '✅' : '❌');
        
        this.guessBtn = document.getElementById('guess-btn');
        console.log('guessBtn:', this.guessBtn ? '✅' : '❌');
        
        this.feedbackArea = document.getElementById('feedback-area');
        console.log('feedbackArea:', this.feedbackArea ? '✅' : '❌');
        
        this.feedbackMessage = document.getElementById('feedback-message');
        console.log('feedbackMessage:', this.feedbackMessage ? '✅' : '❌');
        
        this.hintArea = document.getElementById('hint-area');
        console.log('hintArea:', this.hintArea ? '✅' : '❌');
        
        this.hintMessage = document.getElementById('hint-message');
        console.log('hintMessage:', this.hintMessage ? '✅' : '❌');
        
        this.restartBtn = document.getElementById('restart-btn');
        console.log('restartBtn:', this.restartBtn ? '✅' : '❌');
        
        this.nextLevelBtn = document.getElementById('next-level-btn');
        console.log('nextLevelBtn:', this.nextLevelBtn ? '✅' : '❌');
        
        this.homeBtn = document.getElementById('home-btn');
        console.log('homeBtn:', this.homeBtn ? '✅' : '❌');
        
        this.totalGames = document.getElementById('total-games');
        console.log('totalGames:', this.totalGames ? '✅' : '❌');
        
        this.totalWins = document.getElementById('total-wins');
        console.log('totalWins:', this.totalWins ? '✅' : '❌');
        
        this.winRate = document.getElementById('win-rate');
        console.log('winRate:', this.winRate ? '✅' : '❌');
        
        this.highScore = document.getElementById('high-score');
        console.log('highScore:', this.highScore ? '✅' : '❌');
        
        console.log('✅ Busca de elementos DOM concluída');
    }
}

// ================================
// CLASSE PRINCIPAL DO JOGO
// ================================

class ColorGuessingGame {
    constructor() {
        this.gameState = new GameState();
        this.dom = new DOMElements();
        this.init();
    }

    init() {
        console.log('🚀 Iniciando configuração da classe ColorGuessingGame...');
        
        try {
            console.log('🎧 Configurando event listeners...');
            this.setupEventListeners();
            
            console.log('🎨 Atualizando UI...');
            this.updateUI();
            
            console.log('📊 Atualizando seletor de nível...');
            this.updateLevelSelector();
            
            console.log('🆕 Iniciando novo jogo...');
            this.startNewGame();
            
            console.log('🎯 Focando no campo de entrada...');
            // Foco inicial no campo de entrada com delay para garantir renderização
            setTimeout(() => {
                if (this.dom.colorInput) {
                    this.dom.colorInput.focus();
                    console.log('✅ Foco definido no campo de entrada');
                } else {
                    console.error('❌ Campo de entrada não encontrado para focar');
                }
            }, 100);
            
            console.log('✅ Inicialização da classe concluída com sucesso');
            
        } catch (error) {
            console.error('❌ Erro durante inicialização da classe:', error);
            throw error;
        }
    }

    setupEventListeners() {
        console.log('🎧 Configurando event listeners...');
        
        try {
            // Eventos principais
            if (this.dom.guessBtn) {
                this.dom.guessBtn.addEventListener('click', () => {
                    console.log('🔘 Botão Adivinhar clicado');
                    this.handleGuess();
                });
                console.log('✅ Listener do botão adivinhar configurado');
            } else {
                console.error('❌ Botão adivinhar não encontrado');
            }
            
            if (this.dom.restartBtn) {
                this.dom.restartBtn.addEventListener('click', () => {
                    console.log('🔄 Botão Reiniciar clicado');
                    this.startNewGame();
                });
                console.log('✅ Listener do botão reiniciar configurado');
            }
            
            if (this.dom.nextLevelBtn) {
                this.dom.nextLevelBtn.addEventListener('click', () => {
                    console.log('⬆️ Botão Próximo Nível clicado');
                    this.nextLevel();
                });
                console.log('✅ Listener do próximo nível configurado');
            }
            
            if (this.dom.homeBtn) {
                this.dom.homeBtn.addEventListener('click', () => {
                    console.log('🏠 Botão Home clicado');
                    this.goHome();
                });
                console.log('✅ Listener do botão home configurado');
            }
            
            // Botão de teste temporário
            const testBtn = document.getElementById('test-btn');
            if (testBtn) {
                testBtn.addEventListener('click', () => {
                    console.log('🧪 TESTE DEBUG EXECUTADO');
                    console.log('🎮 Estado do jogo:', {
                        isActive: this.gameState.isGameActive,
                        targetColor: this.gameState.targetColor,
                        attemptsLeft: this.gameState.attemptsLeft,
                        currentLevel: this.gameState.currentLevel
                    });
                    console.log('🎯 Elementos DOM:', {
                        input: !!this.dom.colorInput,
                        button: !!this.dom.guessBtn,
                        feedback: !!this.dom.feedbackMessage
                    });
                    
                    // Teste forçado de palpite
                    if (this.dom.colorInput) {
                        this.dom.colorInput.value = this.gameState.targetColor;
                        console.log('🎯 Cor inserida no campo:', this.gameState.targetColor);
                    }
                    
                    alert(`🧪 DEBUG INFO:\n\nJogo Ativo: ${this.gameState.isGameActive}\nCor Alvo: ${this.gameState.targetColor}\nTentativas: ${this.gameState.attemptsLeft}\n\nCor foi inserida no campo automaticamente!`);
                });
                console.log('✅ Listener do botão teste configurado');
            }
            
            // Mudança de nível de dificuldade
            if (this.dom.difficultySelect) {
                this.dom.difficultySelect.addEventListener('change', (e) => {
                    console.log('📊 Nível alterado para:', e.target.value);
                    this.gameState.currentLevel = e.target.value;
                    this.startNewGame();
                });
                console.log('✅ Listener do seletor de dificuldade configurado');
            }
            
            // Enter para adivinhar
            if (this.dom.colorInput) {
                this.dom.colorInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && this.gameState.isGameActive) {
                        console.log('⌨️ Enter pressionado');
                        this.handleGuess();
                    }
                });
                console.log('✅ Listener de Enter configurado');

                // Validação em tempo real (SIMPLIFICADA)
                this.dom.colorInput.addEventListener('input', () => {
                    this.validateInput();
                });
                console.log('✅ Listener de validação configurado');
            } else {
                console.error('❌ Campo de entrada não encontrado');
            }
            
            console.log('✅ Todos os event listeners configurados com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao configurar event listeners:', error);
            throw error;
        }
    }

    validateInput() {
        const input = this.dom.colorInput.value.trim().toLowerCase();
        const availableColors = COLOR_SETS[this.gameState.currentLevel];
        
        // Remove classes de validação anteriores
        this.dom.colorInput.classList.remove('valid', 'invalid');
        
        if (input.length > 0) {
            const isValid = availableColors.some(color => 
                color.toLowerCase().includes(input) || input.includes(color.toLowerCase())
            );
            
            this.dom.colorInput.classList.add(isValid ? 'valid' : 'invalid');
        }
    }

    handleGuess() {
        console.log('🎯 HandleGuess chamado');
        console.log('🕹️ Estado do jogo ativo:', this.gameState.isGameActive);
        
        if (!this.gameState.isGameActive) {
            console.log('❌ Jogo não está ativo');
            return;
        }

        const guess = this.dom.colorInput.value.trim().toLowerCase();
        console.log('💭 Palpite do usuário:', guess);
        console.log('🎨 Cor alvo:', this.gameState.targetColor);
        
        // Validação de entrada
        if (!guess) {
            console.log('⚠️ Entrada vazia');
            this.showFeedback('Digite uma cor!', 'error');
            this.dom.colorInput.classList.add('shake');
            setTimeout(() => this.dom.colorInput.classList.remove('shake'), 500);
            return;
        }

        // Decrementar tentativas
        this.gameState.attemptsLeft--;
        console.log('📊 Tentativas restantes:', this.gameState.attemptsLeft);
        
        // Verificar se acertou a cor alvo
        const isCorrect = guess === this.gameState.targetColor.toLowerCase();
        console.log('✅ Acertou?', isCorrect);
        
        if (isCorrect) {
            console.log('🎉 Resposta correta!');
            this.handleCorrectGuess();
        } else {
            console.log('❌ Resposta incorreta');
            this.handleIncorrectGuess(guess);
        }
        
        console.log('🔄 Atualizando UI...');
        this.updateUI();
    }

    handleCorrectGuess() {
        this.gameState.isGameActive = false;
        this.gameState.addWin();
        this.gameState.addGame();
        
        // Mudança visual de fundo para a cor alvo (APENAS QUANDO ACERTA)
        this.changeBackgroundColor(this.gameState.targetColor);
        
        const feedbackMessage = `🎉 Parabéns! Você acertou! A cor era "${this.gameState.targetColor}". +${GAME_CONFIG.SCORES[this.gameState.currentLevel]} pontos!`;
        
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
        console.log('🆕 Iniciando novo jogo...');
        
        try {
            console.log('🔄 Resetando estado do jogo...');
            this.gameState.resetGame();
            
            console.log('🎨 Resetando visual...');
            // Reset visual (sem mudança automática de cor)
            document.body.className = '';
            
            console.log('🎯 Resetando campos de entrada...');
            this.dom.colorInput.value = '';
            this.dom.colorInput.disabled = false;
            this.dom.colorInput.classList.remove('valid', 'invalid', 'shake');
            
            console.log('🔘 Configurando botões...');
            this.dom.guessBtn.style.display = 'inline-flex';
            this.dom.restartBtn.style.display = 'none';
            this.dom.nextLevelBtn.style.display = 'none';
            this.dom.hintArea.style.display = 'none';
            
            console.log('💬 Configurando feedback inicial...');
            // Feedback inicial
            this.showFeedback('Boa sorte! Uma nova cor foi sorteada...', 'info');
            
            console.log('🎨 Cor sorteada:', this.gameState.targetColor);
            console.log('📊 Tentativas disponíveis:', this.gameState.attemptsLeft);
            console.log('🕹️ Jogo ativo:', this.gameState.isGameActive);
            
            console.log('🔄 Atualizando UI...');
            this.updateUI();
            
            console.log('🎯 Focando campo de entrada...');
            setTimeout(() => {
                if (this.dom.colorInput) {
                    this.dom.colorInput.focus();
                }
            }, 100);
            
            // Debug info (remover em produção)
            console.log(`🎯 Cor sorteada: ${this.gameState.targetColor}`);
            console.log('✅ Novo jogo iniciado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao iniciar novo jogo:', error);
            throw error;
        }
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
            // Salvar estado antes de sair
            this.gameState.saveToStorage();
            
            // Navegar para página principal
            window.location.href = '../index.html';
        }
    }
}

// ================================
// INICIALIZAÇÃO DO JOGO
// ================================

// Função de inicialização com fallback
function initializeGame() {
    console.log('🎮 Iniciando Jogo de Adivinhação de Cores - Versão Corrigida...');
    
    // Verificar se todos os elementos necessários estão presentes
    const requiredElements = [
        'difficulty-select', 'attempts-count', 'score-count', 
        'color-guess', 'guess-btn', 'feedback-message'
    ];
    
    console.log('🔍 Verificando elementos DOM...');
    const missingElements = requiredElements.filter(id => {
        const element = document.getElementById(id);
        console.log(`Element ${id}:`, element ? '✅ Found' : '❌ Missing');
        return !element;
    });
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos DOM ausentes:', missingElements);
        alert('Erro: Alguns elementos da interface não foram encontrados. Recarregue a página.');
        return false;
    }
    
    // Inicializar o jogo
    try {
        console.log('🚀 Criando instância do jogo...');
        window.colorGame = new ColorGuessingGame();
        console.log('✅ Jogo inicializado com sucesso!');
        
        // Verificar se o jogo está funcionando
        if (window.colorGame && window.colorGame.gameState && window.colorGame.gameState.isGameActive) {
            console.log('✅ Estado do jogo ativo confirmado');
            console.log(`🎯 Cor alvo: ${window.colorGame.gameState.targetColor}`);
        } else {
            console.error('❌ Estado do jogo não está ativo');
        }
        
        // Mensagem de boas-vindas
        setTimeout(() => {
            const instructions = document.querySelector('.game-instructions');
            if (instructions) {
                instructions.style.animation = 'pulse 2s ease-in-out';
            }
        }, 1000);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao inicializar o jogo:', error);
        console.error('Stack trace:', error.stack);
        alert('Erro ao inicializar o jogo. Verifique o console e recarregue a página.');
        return false;
    }
}

// Múltiplas tentativas de inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    
    // Tentativa imediata
    if (!initializeGame()) {
        console.log('⏳ Primeira tentativa falhou, tentando novamente em 500ms...');
        
        // Segunda tentativa
        setTimeout(() => {
            if (!initializeGame()) {
                console.log('⏳ Segunda tentativa falhou, tentativa final em 1s...');
                
                // Terceira tentativa
                setTimeout(() => {
                    initializeGame();
                }, 1000);
            }
        }, 500);
    }
});

// Fallback adicional para window.onload
window.addEventListener('load', () => {
    console.log('🪟 Window Load Event');
    
    // Se o jogo ainda não foi inicializado
    if (!window.colorGame) {
        console.log('🔄 Jogo não encontrado, tentando inicializar via window.onload...');
        initializeGame();
    }
});

// ================================
// FUNCIONALIDADES EXTRAS
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
                  '• Pressione ESC para reiniciar');
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
        window.colorGame.gameState.saveToStorage();
    }
});

// Sistema de debug (apenas em desenvolvimento)
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.includes('vercel')) {
    console.log('🔧 Modo de desenvolvimento ativo');
    console.log('🎯 Use window.colorGame.gameState.targetColor para ver a cor atual');
    
    // Comando de desenvolvedor para revelar cor
    window.revealColor = () => {
        if (window.colorGame) {
            console.log(`🎯 Cor atual: ${window.colorGame.gameState.targetColor}`);
            return window.colorGame.gameState.targetColor;
        }
    };
}