/**
 * 🎮 JOGO DE ADIVINHAÇÃO DE CORES - VERSÃO COM VISIBILIDADE CORRIGIDA
 * Projeto Prático C3 - Gabriel Malheiros de Castro
 * FAESA 2025-2
 * 
 * FUNCIONALIDADES:
 * ✅ Exibe a cor sorteada no fundo ANTES do jogo começar 
 * ✅ Exibe a cor sorteada no fundo APÓS 3 tentativas falhadas
 * ✅ Preview durante digitação
 * ✅ NUNCA mostra o NOME da cor sorteada
 */

// Configurações do jogo
const GAME_CONFIG = {
    ATTEMPTS_PER_GAME: 3,
    WINS_TO_UNLOCK_NEXT: 3,
    SCORES: { easy: 10, medium: 25, hard: 50 },
    TARGET_COLOR_DISPLAY_TIME: 3000 // 3 segundos para mostrar cor antes/depois
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

// Lista de cores válidas para CSS (expandida)
const VALID_CSS_COLORS = [
    // Cores básicas
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'grey', 
    'white', 'black', 'cyan', 'magenta', 'lime', 'maroon', 'navy', 'olive', 'teal', 'silver',
    // Cores médias
    'aqua', 'fuchsia', 'gold', 'indigo', 'coral', 'crimson', 'violet', 'turquoise', 'salmon',
    'khaki', 'lavender', 'plum', 'orchid', 'tan', 'ivory', 'beige', 'azure', 'snow',
    // Cores avançadas
    'darkslateblue', 'lightcoral', 'mediumseagreen', 'darkgoldenrod', 'lightsteelblue',
    'palevioletred', 'mediumorchid', 'darkolivegreen', 'lightslategray', 'mediumturquoise',
    'darkred', 'darkblue', 'darkgreen', 'darkgray', 'lightgray', 'lightgreen', 'lightblue',
    'darkviolet', 'lightviolet', 'darkkhaki', 'lightpink', 'darkorange', 'lightyellow',
    'darkmagenta', 'lightcyan', 'darkcyan', 'lightgoldenrodyellow', 'darkseagreen',
    // Variações comuns
    'skyblue', 'forestgreen', 'orangered', 'royalblue', 'mediumpurple', 'springgreen',
    'deeppink', 'hotpink', 'darkturquoise', 'lightseagreen', 'mediumblue', 'darkslategray'
];

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
    highScore: 0,
    originalBackgroundColor: '',
    isPreviewActive: false,
    lastPreviewedColor: '',
    isShowingTargetColor: false, // Flag para controlar quando está mostrando cor alvo
    gamePhase: 'pre-game' // 'pre-game', 'playing', 'post-game'
};

// Elementos DOM
let elements = {};

// Debug e testes
let debugMode = false;

// Cache para cores validadas (melhora performance)
const colorValidationCache = new Map();

// Função otimizada para detectar se uma cor é válida no CSS
function isValidCSSColor(color) {
    if (!color || typeof color !== 'string') return false;
    
    const lowerColor = color.toLowerCase().trim();
    
    // Verifica cache primeiro
    if (colorValidationCache.has(lowerColor)) {
        return colorValidationCache.get(lowerColor);
    }
    
    let isValid = false;
    
    // Verifica se está na lista de cores válidas conhecidas (mais rápido)
    if (VALID_CSS_COLORS.includes(lowerColor)) {
        isValid = true;
    } else {
        // Testa com elemento temporário (mais lento, usado como fallback)
        try {
            const testElement = document.createElement('div');
            const originalColor = testElement.style.color;
            testElement.style.color = lowerColor;
            isValid = testElement.style.color !== originalColor;
            
            // Se ainda não foi validado, testa como background
            if (!isValid) {
                testElement.style.backgroundColor = lowerColor;
                isValid = testElement.style.backgroundColor !== '';
            }
        } catch (error) {
            isValid = false;
        }
    }
    
    // Salva no cache para próximas consultas
    colorValidationCache.set(lowerColor, isValid);
    
    if (debugMode && isValid) {
        console.log(`🎨 Cor validada: ${lowerColor}`);
    }
    
    return isValid;
}

// Cache para cores de contraste (otimização)
const contrastCache = new Map();

// Função otimizada para obter contraste de texto baseado na cor de fundo
function getTextColorForBackground(backgroundColor) {
    if (contrastCache.has(backgroundColor)) {
        return contrastCache.get(backgroundColor);
    }
    
    // Lista expandida de cores que precisam de texto escuro
    const lightColors = [
        'white', 'yellow', 'lime', 'cyan', 'lightgray', 'lightgreen', 'lightblue',
        'lightcoral', 'lightsteelblue', 'lightpink', 'lightyellow', 'lightcyan',
        'lightgoldenrodyellow', 'lightseagreen', 'ivory', 'beige', 'snow', 'azure',
        'lavender', 'pink', 'orange', 'gold', 'silver', 'khaki', 'coral', 'salmon',
        'plum', 'tan', 'mediumturquoise', 'skyblue', 'springgreen', 'hotpink', 'wheat',
        'lemonchiffon', 'lightgrey', 'mistyrose', 'papayawhip', 'peachpuff', 'navajowhite'
    ];
    
    const textColor = lightColors.includes(backgroundColor.toLowerCase()) ? '#1e293b' : '#f8fafc';
    contrastCache.set(backgroundColor, textColor);
    
    return textColor;
}

// ⭐ NOVA FUNCIONALIDADE: Mostrar cor alvo no fundo (SEM mostrar nome)
function showTargetColorInBackground() {
    if (!gameState.targetColor) {
        console.error('❌ Tentativa de mostrar cor alvo sem cor definida');
        return;
    }
    
    console.log(`🎯 Exibindo cor alvo no fundo: ${gameState.targetColor}`);
    
    gameState.isShowingTargetColor = true;
    
    try {
        // Forçar aplicação da cor com !important via estilo inline
        const body = document.body;
        const targetColor = gameState.targetColor;
        const textColor = getTextColorForBackground(targetColor);
        
        // Aplicar cor de fundo diretamente com prioridade máxima
        body.style.cssText = `
            background-color: ${targetColor} !important;
            color: ${textColor} !important;
            transition: all 1s ease !important;
        `;
        
        // Adicionar classe especial para indicar que é a cor alvo
        body.classList.add('showing-target-color');
        
        // Força um repaint
        body.offsetHeight;
        
        console.log(`✅ Cor alvo aplicada ao fundo: ${targetColor} com texto: ${textColor}`);
        
    } catch (error) {
        console.error('❌ Erro ao aplicar cor alvo:', error);
        // Fallback mais simples
        try {
            document.body.style.backgroundColor = gameState.targetColor;
            document.body.style.color = getTextColorForBackground(gameState.targetColor);
        } catch (fallbackError) {
            console.error('❌ Fallback também falhou:', fallbackError);
        }
    }
}

// ⭐ NOVA FUNCIONALIDADE: Ocultar cor alvo do fundo
function hideTargetColorFromBackground() {
    if (!gameState.isShowingTargetColor) {
        console.log('⚠️ Tentativa de ocultar cor alvo que não está sendo exibida');
        return;
    }
    
    console.log('🙈 Ocultando cor alvo do fundo');
    
    gameState.isShowingTargetColor = false;
    
    try {
        const body = document.body;
        
        // Remover classe especial
        body.classList.remove('showing-target-color');
        
        // Limpar todos os estilos inline relacionados a cor
        body.style.cssText = '';
        
        // Força um repaint
        body.offsetHeight;
        
        console.log('✅ Cor alvo removida do fundo com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao ocultar cor alvo:', error);
        // Fallback mais simples
        try {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.classList.remove('showing-target-color');
        } catch (fallbackError) {
            console.error('❌ Fallback para ocultar também falhou:', fallbackError);
        }
    }
}

// Função principal otimizada para aplicar preview da cor (durante digitação)
function applyColorPreview(colorName) {
    // NÃO aplicar preview se estiver mostrando a cor alvo
    if (gameState.isShowingTargetColor) {
        return;
    }
    
    if (!colorName || !gameState.isGameActive || gameState.gamePhase !== 'playing') {
        resetBackgroundPreview();
        return;
    }
    
    const cleanColor = colorName.toLowerCase().trim();
    
    // Evita aplicar a mesma cor repetidamente (performance)
    if (cleanColor === gameState.lastPreviewedColor) {
        return;
    }
    
    // Validação mais robusta
    if (!isValidCSSColor(cleanColor)) {
        resetBackgroundPreview();
        return;
    }
    
    try {
        // Salva estado original se for a primeira vez
        if (!gameState.isPreviewActive) {
            gameState.originalBackgroundColor = document.body.style.backgroundColor || '';
            gameState.isPreviewActive = true;
        }
        
        // Aplica a nova cor com verificação
        const beforeColor = document.body.style.backgroundColor;
        document.body.style.backgroundColor = cleanColor;
        
        // Verifica se a cor foi realmente aplicada
        if (document.body.style.backgroundColor !== beforeColor) {
            document.body.style.color = getTextColorForBackground(cleanColor);
            
            // Adiciona classe para indicar que o preview está ativo
            document.body.classList.add('color-preview-active');
            
            gameState.lastPreviewedColor = cleanColor;
            
            if (debugMode) {
                console.log(`🎨 Preview aplicado: ${cleanColor}`);
            }
        } else {
            throw new Error(`Cor ${cleanColor} não pôde ser aplicada`);
        }
        
    } catch (error) {
        if (debugMode) {
            console.warn(`Erro ao aplicar preview para "${cleanColor}":`, error.message);
        }
        resetBackgroundPreview();
    }
}

// Função para resetar o preview do fundo
function resetBackgroundPreview() {
    if (!gameState.isPreviewActive) return;
    
    // NÃO resetar se estiver mostrando a cor alvo
    if (gameState.isShowingTargetColor) {
        return;
    }
    
    try {
        // Remove classes de preview
        document.body.classList.remove('color-preview-active');
        
        // Restaura cor original ou remove estilo
        if (gameState.originalBackgroundColor) {
            document.body.style.backgroundColor = gameState.originalBackgroundColor;
        } else {
            document.body.style.backgroundColor = '';
        }
        
        // Restaura cor do texto padrão
        document.body.style.color = '';
        
        gameState.isPreviewActive = false;
        gameState.lastPreviewedColor = '';
        
        if (debugMode) {
            console.log('🔄 Preview resetado');
        }
        
    } catch (error) {
        if (debugMode) {
            console.warn('Erro ao resetar preview:', error);
        }
    }
}

// Função melhorada para detectar quando o usuário para de digitar
function setupInputPreview() {
    if (!elements.colorInput) return;
    
    let typingTimer;
    let validationTimer;
    const typingDelay = 200; // 200ms de delay após parar de digitar
    const validationDelay = 100; // 100ms para validação visual
    
    // Função para atualizar indicadores visuais do input
    function updateInputVisualState(inputValue) {
        if (!inputValue) {
            elements.colorInput.classList.remove('preview-active', 'background-match');
            return;
        }
        
        const isValid = isValidCSSColor(inputValue);
        const isCurrentTarget = inputValue.toLowerCase() === gameState.targetColor.toLowerCase();
        
        if (isValid) {
            elements.colorInput.classList.add('preview-active');
            if (isCurrentTarget) {
                elements.colorInput.classList.add('background-match');
            } else {
                elements.colorInput.classList.remove('background-match');
            }
        } else {
            elements.colorInput.classList.remove('preview-active', 'background-match');
        }
    }
    
    // Evento de input em tempo real com validação visual rápida
    elements.colorInput.addEventListener('input', function(e) {
        const inputValue = e.target.value.trim();
        
        // Limpa timers anteriores
        clearTimeout(typingTimer);
        clearTimeout(validationTimer);
        
        // Validação visual rápida
        validationTimer = setTimeout(() => {
            updateInputVisualState(inputValue);
        }, validationDelay);
        
        if (inputValue.length > 0) {
            // Preview com delay para evitar muitas mudanças - APENAS durante jogo ativo
            if (gameState.isGameActive && gameState.gamePhase === 'playing') {
                typingTimer = setTimeout(() => {
                    applyColorPreview(inputValue);
                }, typingDelay);
            }
        } else {
            // Só reseta se não estiver mostrando cor alvo
            if (!gameState.isShowingTargetColor) {
                resetBackgroundPreview();
            }
            elements.colorInput.classList.remove('preview-active', 'background-match');
        }
    });
    
    // Evento para aplicação imediata em certas teclas
    elements.colorInput.addEventListener('keydown', function(e) {
        // Aplica imediatamente em espaço, enter ou tab - APENAS durante jogo ativo
        if ((e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') && 
            gameState.isGameActive && gameState.gamePhase === 'playing') {
            clearTimeout(typingTimer);
            const inputValue = e.target.value.trim();
            if (inputValue.length > 0) {
                setTimeout(() => applyColorPreview(inputValue), 50);
            }
        }
        
        // Reset em Escape - APENAS durante jogo ativo
        if (e.key === 'Escape' && gameState.isGameActive && gameState.gamePhase === 'playing') {
            clearTimeout(typingTimer);
            if (!gameState.isShowingTargetColor) {
                resetBackgroundPreview();
            }
            this.value = '';
            this.classList.remove('preview-active', 'background-match');
        }
    });
    
    // Gestão de foco
    elements.colorInput.addEventListener('focus', function() {
        const inputValue = this.value.trim();
        if (inputValue && isValidCSSColor(inputValue) && 
            gameState.isGameActive && gameState.gamePhase === 'playing') {
            applyColorPreview(inputValue);
            updateInputVisualState(inputValue);
        }
    });
    
    elements.colorInput.addEventListener('blur', function() {
        clearTimeout(typingTimer);
        clearTimeout(validationTimer);
        
        // Mantém preview se há valor válido e jogo está ativo
        const inputValue = this.value.trim();
        if (!gameState.isGameActive || !inputValue || !isValidCSSColor(inputValue) || 
            gameState.gamePhase !== 'playing') {
            setTimeout(() => {
                if (!gameState.isShowingTargetColor) {
                    resetBackgroundPreview();
                }
                this.classList.remove('preview-active', 'background-match');
            }, 200);
        }
    });
    
    // Evento de paste (colar)
    elements.colorInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            const inputValue = this.value.trim();
            if (inputValue && gameState.isGameActive && gameState.gamePhase === 'playing') {
                updateInputVisualState(inputValue);
                applyColorPreview(inputValue);
            }
        }, 10);
    });
    
    if (debugMode) {
        console.log('✅ Sistema avançado de preview de input configurado');
    }
}

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

// ⭐ FUNCIONALIDADE CORRIGIDA: Iniciar novo jogo com visibilidade adequada
function startNewGame() {
    console.log('🎮 Iniciando novo jogo...');
    
    // Gerar nova cor e configurar estado
    gameState.targetColor = generateNewColor();
    gameState.attemptsLeft = GAME_CONFIG.ATTEMPTS_PER_GAME;
    gameState.isGameActive = false; // Inicialmente inativo para mostrar a cor
    gameState.gamePhase = 'pre-game';
    gameState.usedColors = [gameState.targetColor];
    
    // Reset visual e preview
    resetBackgroundPreview();
    document.body.className = '';
    elements.colorInput.value = '';
    elements.colorInput.disabled = true; // Desabilitar input durante preview
    elements.guessBtn.style.display = 'none'; // Ocultar botão durante preview
    elements.restartBtn.style.display = 'none';
    if (elements.nextLevelBtn) elements.nextLevelBtn.style.display = 'none';
    if (elements.hintArea) elements.hintArea.style.display = 'none';
    
    // ⭐ NOVA FUNCIONALIDADE: Mostrar a cor sorteada no fundo por alguns segundos
    showFeedback('🎯 Uma nova cor foi sorteada! Observe o fundo e memorize a cor...', 'info');
    showTargetColorInBackground();
    
    // Debug log
    console.log(`🎨 Mostrando cor alvo por ${GAME_CONFIG.TARGET_COLOR_DISPLAY_TIME}ms: ${gameState.targetColor}`);
    
    setTimeout(() => {
        // Após mostrar a cor, ocultar e permitir que o jogo comece
        console.log('⏰ Timeout executado - ocultando cor e iniciando jogo');
        hideTargetColorFromBackground();
        gameState.isGameActive = true;
        gameState.gamePhase = 'playing';
        elements.colorInput.disabled = false;
        elements.guessBtn.style.display = 'inline-flex';
        
        showFeedback('🎨 Agora adivinhe! Digite o nome da cor e use o preview para ajudar.', 'info');
        elements.colorInput.focus();
        
        console.log('✅ Jogo ativo - jogador pode adivinhar');
        
    }, GAME_CONFIG.TARGET_COLOR_DISPLAY_TIME);
    
    updateUI();
    
    if (debugMode) {
        console.log(`🎮 Novo jogo iniciado. Cor alvo: ${gameState.targetColor}`);
    }
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
    if (elements.attemptsCount) {
        elements.attemptsCount.textContent = gameState.attemptsLeft;
        // Forçar repaint
        elements.attemptsCount.style.display = 'none';
        elements.attemptsCount.offsetHeight; // trigger reflow
        elements.attemptsCount.style.display = '';
    }
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
    console.log('🎯 Processando palpite...');
    
    if (!gameState.isGameActive || gameState.gamePhase !== 'playing') {
        console.log('❌ Jogo não está ativo ou não está na fase de jogar');
        return;
    }
    
    const guess = elements.colorInput.value.trim().toLowerCase();
    console.log('💭 Palpite do usuário:', guess);
    console.log('🎨 Cor alvo:', gameState.targetColor);
    
    if (!guess) {
        console.log('❌ Palpite vazio');
        showFeedback('Digite uma cor!', 'error');
        return;
    }
    
    gameState.attemptsLeft--;
    console.log('🔢 Tentativas restantes:', gameState.attemptsLeft);
    
    const isCorrect = guess === gameState.targetColor.toLowerCase();
    console.log('🎯 Palpite correto?', isCorrect);
    
    if (isCorrect) {
        console.log('🎉 Palpite correto! Processando vitória...');
        handleCorrectGuess();
    } else {
        console.log('❌ Palpite incorreto. Processando erro...');
        handleIncorrectGuess(guess);
    }
    
    // Garantir que a UI seja atualizada após mudanças no estado
    setTimeout(() => {
        console.log('🔄 Atualizando UI após palpite...');
        updateUI();
    }, 50);
}

// ⭐ FUNCIONALIDADE CORRIGIDA: Palpite correto
function handleCorrectGuess() {
    gameState.isGameActive = false;
    gameState.gamePhase = 'post-game';
    gameState.totalWins++;
    gameState.levelProgress[gameState.currentLevel]++;
    gameState.score += GAME_CONFIG.SCORES[gameState.currentLevel];
    gameState.totalGames++;
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
    }
    
    // Reset do preview
    resetBackgroundPreview();
    
    // ⭐ FUNCIONALIDADE NOVA: Mostrar cor no fundo após acerto (sem nome)
    showTargetColorInBackground();
    
    showFeedback(
        `🎉 Parabéns! Você acertou! +${GAME_CONFIG.SCORES[gameState.currentLevel]} pontos!`, 
        'success'
    );
    
    elements.guessBtn.style.display = 'none';
    elements.restartBtn.style.display = 'inline-flex';
    elements.colorInput.disabled = true;
    
    checkLevelUnlock();
    saveToStorage();
}

// ⭐ FUNCIONALIDADE CORRIGIDA: Palpite incorreto
function handleIncorrectGuess(guess) {
    // Reset do preview após palpite incorreto
    resetBackgroundPreview();
    
    if (gameState.attemptsLeft > 0) {
        showFeedback(
            `❌ Errou! "${guess}" não é a cor. Tentativas restantes: ${gameState.attemptsLeft}`, 
            'error'
        );
        
        // Atualizar UI imediatamente
        if (elements.attemptsCount) {
            elements.attemptsCount.textContent = gameState.attemptsLeft;
        }
        
        showHint(guess);
        elements.colorInput.value = '';
        elements.colorInput.focus();
        
    } else {
        // ⭐ FUNCIONALIDADE NOVA: Fim de jogo - mostrar cor alvo no fundo
        gameState.isGameActive = false;
        gameState.gamePhase = 'post-game';
        gameState.totalGames++;
        
        // Mostrar a cor sorteada no fundo (sem mostrar nome)
        showTargetColorInBackground();
        
        showFeedback(
            `💀 Fim de jogo! Veja a cor sorteada no fundo da tela. Tente novamente!`, 
            'error'
        );
        
        // Atualizar UI imediatamente
        if (elements.attemptsCount) {
            elements.attemptsCount.textContent = gameState.attemptsLeft;
        }
        
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

// Função de teste e debug
function enableDebugMode() {
    debugMode = true;
    console.log('🐛 Modo debug ativado');
    
    // Adiciona info de debug na tela
    const debugInfo = document.createElement('div');
    debugInfo.className = 'debug-info';
    debugInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 999;
    `;
    debugInfo.innerHTML = `
        <strong>Debug Info:</strong><br>
        Cor alvo: <span id="debug-target">-</span><br>
        Fase jogo: <span id="debug-phase">-</span><br>
        Mostrando cor: <span id="debug-showing">-</span><br>
        Preview ativo: <span id="debug-preview">-</span>
    `;
    document.body.appendChild(debugInfo);
    
    // Atualiza info debug em tempo real
    setInterval(() => {
        if (document.getElementById('debug-target')) {
            document.getElementById('debug-target').textContent = gameState.targetColor;
            document.getElementById('debug-phase').textContent = gameState.gamePhase;
            document.getElementById('debug-showing').textContent = gameState.isShowingTargetColor ? 'Sim' : 'Não';
            document.getElementById('debug-preview').textContent = gameState.isPreviewActive ? 'Sim' : 'Não';
        }
    }, 500);
}

// Inicialização principal
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Iniciando jogo de adivinhação de cores com visibilidade corrigida...');
    console.log('✅ Script carregado com sucesso!');
    
    // Ativar debug em desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Ambiente de desenvolvimento detectado - ativando debug');
        enableDebugMode();
    }
    
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
        console.error('❌ Elementos críticos ausentes:', missing);
        return;
    }
    
    console.log('✅ Todos os elementos DOM foram encontrados!');
    
    // Configurar sistema de preview ANTES dos outros eventos
    setupInputPreview();
    
    // Configurar eventos
    if (elements.guessBtn) {
        elements.guessBtn.addEventListener('click', () => {
            console.log('🎯 Botão adivinhar clicado');
            handleGuess();
        });
    }
    
    if (elements.restartBtn) {
        elements.restartBtn.addEventListener('click', () => {
            console.log('🔄 Botão jogar novamente clicado');
            hideTargetColorFromBackground(); // Limpar cor atual
            startNewGame();
        });
    }
    
    if (elements.colorInput) {
        elements.colorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && gameState.isGameActive && gameState.gamePhase === 'playing') {
                console.log('⌨️ Enter pressionado na área de input');
                handleGuess();
            }
        });
    }
    
    if (elements.difficultySelect) {
        elements.difficultySelect.addEventListener('change', (e) => {
            console.log('🎚️ Nível alterado para:', e.target.value);
            gameState.currentLevel = e.target.value;
            hideTargetColorFromBackground(); // Limpar cor atual
            startNewGame();
        });
    }
    
    if (elements.homeBtn) {
        elements.homeBtn.addEventListener('click', () => {
            console.log('🏠 Botão voltar ao início clicado');
            if (confirm('Tem certeza que deseja voltar à página principal? O progresso será salvo.')) {
                hideTargetColorFromBackground();
                resetBackgroundPreview();
                saveToStorage();
                window.location.href = '../index.html';
            }
        });
    }
    
    // Carregar dados salvos e inicializar
    console.log('💾 Carregando dados salvos...');
    loadFromStorage();
    console.log('🎚️ Atualizando seletor de nível...');
    updateLevelSelector();
    console.log('🔄 Atualizando UI...');
    updateUI();
    console.log('🎮 Iniciando novo jogo...');
    startNewGame();
    
    console.log('✅ Jogo de cores com visibilidade corrigida inicializado com sucesso!');
    
    // Cleanup quando sair da página
    window.addEventListener('beforeunload', () => {
        hideTargetColorFromBackground();
        resetBackgroundPreview();
        saveToStorage();
    });
    
    // Cleanup para navegação SPA
    window.addEventListener('popstate', () => {
        hideTargetColorFromBackground();
        resetBackgroundPreview();
    });
});

// Funções auxiliares para testes
if (typeof window !== 'undefined') {
    window.gameDebug = {
        getGameState: () => gameState,
        testColorPreview: (color) => applyColorPreview(color),
        resetPreview: () => resetBackgroundPreview(),
        isValidColor: (color) => isValidCSSColor(color),
        enableDebug: () => enableDebugMode(),
        showTarget: () => showTargetColorInBackground(),
        hideTarget: () => hideTargetColorFromBackground(),
        info: 'Versão corrigida com visibilidade adequada da cor alvo'
    };
}