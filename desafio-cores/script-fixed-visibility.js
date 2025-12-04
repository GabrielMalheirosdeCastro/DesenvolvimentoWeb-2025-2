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

// ⭐ NOVO: Mapeamento Português -> Inglês para tradução
const COLOR_TRANSLATION = {
    // Nível Fácil (básicas)
    'vermelho': 'red',
    'azul': 'blue', 
    'verde': 'green',
    'amarelo': 'yellow',
    'roxo': 'purple',
    'laranja': 'orange',
    'rosa': 'pink',
    'marrom': 'brown',
    'cinza': 'gray',
    'branco': 'white',
    // Nível Médio
    'marinho': 'navy',
    'azul-petróleo': 'teal',
    'coral': 'coral',
    'carmesim': 'crimson',
    'anil': 'indigo',
    'lima': 'lime',
    'oliva': 'olive',
    'ciano': 'cyan',
    'dourado': 'gold',
    'prateado': 'silver',
    // Nível Difícil
    'azul-ardósia-escuro': 'darkslateblue',
    'coral-claro': 'lightcoral',
    'verde-mar-médio': 'mediumseagreen',
    'dourado-escuro': 'darkgoldenrod',
    'azul-aço-claro': 'lightsteelblue',
    'rosa-violeta-pálido': 'palevioletred',
    'orquídea-médio': 'mediumorchid',
    'verde-oliva-escuro': 'darkolivegreen',
    'cinza-ardósia-claro': 'lightslategray',
    'turquesa-médio': 'mediumturquoise'
};

// ⭐ NOVO: Mapeamento Inglês -> Português para exibição
const ENGLISH_TO_PORTUGUESE = {};
Object.keys(COLOR_TRANSLATION).forEach(pt => {
    ENGLISH_TO_PORTUGUESE[COLOR_TRANSLATION[pt]] = pt;
});

// Arrays de cores por nível (AGORA EM PORTUGUÊS)
const COLOR_SETS = {
    easy: ['vermelho', 'azul', 'verde', 'amarelo', 'roxo', 'laranja', 'rosa', 'marrom', 'cinza', 'branco'],
    medium: ['marinho', 'azul-petróleo', 'coral', 'carmesim', 'anil', 'lima', 'oliva', 'ciano', 'dourado', 'prateado'],
    hard: ['azul-ardósia-escuro', 'coral-claro', 'verde-mar-médio', 'dourado-escuro', 'azul-aço-claro', 
           'rosa-violeta-pálido', 'orquídea-médio', 'verde-oliva-escuro', 'cinza-ardósia-claro', 'turquesa-médio']
};

// ⭐ FUNÇÃO AUXILIAR: Traduzir cor português -> inglês para CSS
function translateColorToCss(portugueseColor) {
    const normalizedColor = portugueseColor.toLowerCase().trim();
    return COLOR_TRANSLATION[normalizedColor] || normalizedColor;
}

// ⭐ FUNÇÃO AUXILIAR: Traduzir cor inglês -> português para exibição
function translateColorToPortuguese(englishColor) {
    const normalizedColor = englishColor.toLowerCase().trim();
    return ENGLISH_TO_PORTUGUESE[normalizedColor] || normalizedColor;
}

// Famílias de cores para dicas (AGORA EM PORTUGUÊS)
const COLOR_FAMILIES = {
    warm: ['vermelho', 'laranja', 'amarelo', 'rosa', 'coral', 'carmesim', 'dourado'],
    cool: ['azul', 'verde', 'roxo', 'marinho', 'azul-petróleo', 'anil', 'ciano'],
    neutral: ['marrom', 'cinza', 'branco', 'prateado', 'oliva']
};

// Lista de cores válidas para CSS (expandida) - AGORA INCLUI PORTUGUÊS
const VALID_CSS_COLORS = [
    // Cores básicas em inglês
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'grey', 
    'white', 'black', 'cyan', 'magenta', 'lime', 'maroon', 'navy', 'olive', 'teal', 'silver',
    // Cores médias em inglês
    'aqua', 'fuchsia', 'gold', 'indigo', 'coral', 'crimson', 'violet', 'turquoise', 'salmon',
    'khaki', 'lavender', 'plum', 'orchid', 'tan', 'ivory', 'beige', 'azure', 'snow',
    // Cores avançadas em inglês
    'darkslateblue', 'lightcoral', 'mediumseagreen', 'darkgoldenrod', 'lightsteelblue',
    'palevioletred', 'mediumorchid', 'darkolivegreen', 'lightslategray', 'mediumturquoise',
    'darkred', 'darkblue', 'darkgreen', 'darkgray', 'lightgray', 'lightgreen', 'lightblue',
    'darkviolet', 'lightviolet', 'darkkhaki', 'lightpink', 'darkorange', 'lightyellow',
    'darkmagenta', 'lightcyan', 'darkcyan', 'lightgoldenrodyellow', 'darkseagreen',
    // Variações comuns em inglês
    'skyblue', 'forestgreen', 'orangered', 'royalblue', 'mediumpurple', 'springgreen',
    'deeppink', 'hotpink', 'darkturquoise', 'lightseagreen', 'mediumblue', 'darkslategray',
    // ⭐ CORES EM PORTUGUÊS (traduzidas)
    ...Object.keys(COLOR_TRANSLATION)
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
    gamePhase: 'pre-game', // 'pre-game', 'playing', 'post-game'
    hasShownLevel3Congratulations: false // Flag para controlar se já mostrou parabéns dos 3 acertos
};

// Elementos DOM
let elements = {};

// ⭐ NOVA FUNÇÃO: Reset completo de todas as pontuações e progresso
function resetAllGameData() {
    console.log('🔄 Executando reset completo de todas as pontuações...');
    
    const shouldReset = confirm(
        '⚠️ ATENÇÃO: Esta ação irá ZERAR TUDO!\n\n' +
        '• Todas as pontuações serão zeradas\n' +
        '• Todo o progresso será perdido\n' +
        '• Todas as estatísticas serão resetadas\n' +
        '• O jogo voltará ao estado inicial\n\n' +
        '🔄 Tem certeza que deseja continuar?'
    );
    
    if (!shouldReset) {
        console.log('❌ Reset cancelado pelo usuário');
        return;
    }
    
    // Reset COMPLETO de TODOS os dados
    gameState = {
        currentLevel: 'easy',
        targetColor: '',
        attemptsLeft: GAME_CONFIG.ATTEMPTS_PER_GAME,
        score: 0, // ⭐ CRÍTICO: Zerar pontuação atual
        usedColors: [],
        levelProgress: { easy: 0, medium: 0, hard: 0 }, // ⭐ Reset progresso dos níveis
        unlockedLevels: ['easy'], // ⭐ Reset níveis desbloqueados
        isGameActive: false,
        totalGames: 0, // ⭐ CRÍTICO: Zerar estatísticas
        totalWins: 0, // ⭐ CRÍTICO: Zerar vitórias
        highScore: 0, // ⭐ CRÍTICO: Zerar recorde
        originalBackgroundColor: '',
        isPreviewActive: false,
        lastPreviewedColor: '',
        isShowingTargetColor: false,
        gamePhase: 'pre-game',
        hasShownLevel3Congratulations: false
    };
    
    // ⭐ CRÍTICO: Limpar localStorage completamente
    try {
        localStorage.removeItem('colorGameData');
        console.log('✅ Dados salvos removidos do localStorage');
    } catch (error) {
        console.warn('⚠️ Erro ao limpar localStorage:', error);
    }
    
    // Reset visual completo
    hideTargetColorFromBackground();
    resetBackgroundPreview();
    document.body.className = '';
    
    // Reset seletor de dificuldade
    if (elements.difficultySelect) {
        elements.difficultySelect.value = 'easy';
        // Reset opções de nível para estado bloqueado
        const options = elements.difficultySelect.querySelectorAll('option');
        options.forEach(option => {
            const level = option.value;
            if (level !== 'easy') {
                option.disabled = true;
                option.textContent = option.textContent.includes('Desbloqueie') ? 
                    option.textContent : 
                    (level === 'medium' ? 
                        '🟡 Médio (10 cores) - Desbloqueie acertando 3 no fácil' : 
                        '🔴 Difícil (10 cores) - Desbloqueie acertando 3 no médio');
            }
        });
    }
    
    // Reset completo da interface
    elements.colorInput.value = '';
    elements.colorInput.disabled = false;
    elements.colorInput.classList.remove('preview-active', 'background-match');
    elements.restartBtn.style.display = 'none';
    if (elements.nextLevelBtn) elements.nextLevelBtn.style.display = 'none';
    if (elements.hintArea) {
        elements.hintArea.style.display = 'none';
        if (elements.hintMessage) elements.hintMessage.textContent = '';
    }
    if (elements.feedbackArea) {
        elements.feedbackArea.className = 'feedback-area';
        if (elements.feedbackMessage) elements.feedbackMessage.textContent = '';
    }
    
    // ⭐ CRÍTICO: Forçar atualização da UI para refletir os zeros
    updateUI();
    
    // Feedback visual do reset
    showFeedback('🔄 Tudo foi zerado! Começando um novo jogo...', 'info');
    
    console.log('✅ Reset completo executado com sucesso');
    console.log('📊 Estado após reset:', {
        score: gameState.score,
        totalGames: gameState.totalGames,
        totalWins: gameState.totalWins,
        highScore: gameState.highScore,
        levelProgress: gameState.levelProgress
    });
    
    // Iniciar novo jogo após reset
    setTimeout(() => {
        startNewGame();
    }, 1000);
}

// ⭐ FUNÇÃO MELHORADA: Reset apenas da pontuação atual (mantendo estatísticas)
function resetCurrentGameScore() {
    console.log('🔄 Resetando apenas pontuação atual...');
    
    // Reset apenas da pontuação atual e progresso de nível, mantendo estatísticas gerais
    const preservedStats = {
        totalGames: gameState.totalGames,
        totalWins: gameState.totalWins,
        highScore: gameState.highScore
    };
    
    gameState.score = 0; // ⭐ Zerar apenas pontuação atual
    gameState.levelProgress[gameState.currentLevel] = 0; // Reset progresso do nível atual
    gameState.hasShownLevel3Congratulations = false;
    
    // Restaurar estatísticas preservadas
    gameState.totalGames = preservedStats.totalGames;
    gameState.totalWins = preservedStats.totalWins;
    gameState.highScore = preservedStats.highScore;
    
    // Salvar apenas dados necessários
    saveToStorage();
    updateUI();
    
    console.log('✅ Pontuação atual resetada, estatísticas preservadas');
}

// Debug e testes
let debugMode = false;

// Cache para cores validadas (melhora performance)
const colorValidationCache = new Map();

// Função otimizada para detectar se uma cor é válida no CSS (AGORA SUPORTA PORTUGUÊS)
function isValidCSSColor(color) {
    if (!color || typeof color !== 'string') return false;
    
    const lowerColor = color.toLowerCase().trim();
    
    // Verifica cache primeiro
    if (colorValidationCache.has(lowerColor)) {
        return colorValidationCache.get(lowerColor);
    }
    
    let isValid = false;
    
    // ⭐ VERIFICA SE É UMA COR EM PORTUGUÊS VÁLIDA
    if (COLOR_TRANSLATION[lowerColor]) {
        isValid = true;
    }
    // Verifica se está na lista de cores válidas conhecidas (mais rápido)
    else if (VALID_CSS_COLORS.includes(lowerColor)) {
        isValid = true;
    } else {
        // Testa com elemento temporário (mais lento, usado como fallback)
        // ⭐ TRADUZ PARA INGLÊS ANTES DE TESTAR
        const cssColor = translateColorToCss(lowerColor);
        try {
            const testElement = document.createElement('div');
            const originalColor = testElement.style.color;
            testElement.style.color = cssColor;
            isValid = testElement.style.color !== originalColor;
            
            // Se ainda não foi validado, testa como background
            if (!isValid) {
                testElement.style.backgroundColor = cssColor;
                isValid = testElement.style.backgroundColor !== '';
            }
        } catch (error) {
            isValid = false;
        }
    }
    
    // Salva no cache para próximas consultas
    colorValidationCache.set(lowerColor, isValid);
    
    if (debugMode && isValid) {
        console.log(`🎨 Cor validada: ${lowerColor} ${COLOR_TRANSLATION[lowerColor] ? `(traduzida para: ${COLOR_TRANSLATION[lowerColor]})` : ''}`);
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
    
    // ⭐ CORREÇÃO CRÍTICA: Reset preview ANTES de mostrar cor alvo
    if (gameState.isPreviewActive) {
        gameState.isPreviewActive = false;
        gameState.lastPreviewedColor = '';
    }
    
    gameState.isShowingTargetColor = true;
    
    try {
        // Forçar aplicação da cor com !important via estilo inline
        const body = document.body;
        const targetColor = gameState.targetColor;
        // ⭐ TRADUZIR COR PARA CSS ANTES DE APLICAR
        const cssTargetColor = translateColorToCss(targetColor);
        const textColor = getTextColorForBackground(cssTargetColor);
        
        // ⭐ CORREÇÃO CRÍTICA: Limpar TODOS os estilos anteriores primeiro
        body.className = '';
        body.style.cssText = '';
        
        // Aplicar cor de fundo diretamente com prioridade máxima
        body.style.cssText = `
            background-color: ${cssTargetColor} !important;
            color: ${textColor} !important;
            transition: all 1s ease !important;
        `;
        
        // Adicionar classe especial para indicar que é a cor alvo
        body.classList.add('showing-target-color');
        
        // ⭐ FORÇA MÚLTIPLA: Aplicar de várias formas para garantir
        setTimeout(() => {
            body.style.backgroundColor = cssTargetColor;
            body.style.color = textColor;
        }, 100);
        
        // Força um repaint
        body.offsetHeight;
        
        console.log(`✅ Cor alvo aplicada ao fundo: ${targetColor} (CSS: ${cssTargetColor}) com texto: ${textColor}`);
        
    } catch (error) {
        console.error('❌ Erro ao aplicar cor alvo:', error);
        // Fallback mais simples
        try {
            const cssTargetColor = translateColorToCss(gameState.targetColor);
            document.body.style.backgroundColor = cssTargetColor;
            document.body.style.color = getTextColorForBackground(cssTargetColor);
            gameState.isShowingTargetColor = true;
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

// Função principal otimizada para aplicar preview da cor (durante digitação) - AGORA COM TRADUÇÃO
function applyColorPreview(colorName) {
    // ⭐ CORREÇÃO CRÍTICA: NÃO aplicar preview se estiver mostrando a cor alvo
    if (gameState.isShowingTargetColor) {
        console.log('⚠️ Bloqueando preview - cor alvo sendo exibida');
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
        
        // ⭐ TRADUZ COR PARA CSS (INGLÊS) ANTES DE APLICAR
        const cssColorName = translateColorToCss(cleanColor);
        
        // Aplica a nova cor com verificação
        const beforeColor = document.body.style.backgroundColor;
        document.body.style.backgroundColor = cssColorName;
        
        // Verifica se a cor foi realmente aplicada
        if (document.body.style.backgroundColor !== beforeColor) {
            document.body.style.color = getTextColorForBackground(cssColorName);
            
            // Adiciona classe para indicar que o preview está ativo
            document.body.classList.add('color-preview-active');
            
            gameState.lastPreviewedColor = cleanColor;
            
            if (debugMode) {
                console.log(`🎨 Preview aplicado: ${cleanColor} (CSS: ${cssColorName})`);
            }
        } else {
            throw new Error(`Cor ${cssColorName} não pôde ser aplicada`);
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
    
    // ⭐ CORREÇÃO CRÍTICA: NÃO resetar se estiver mostrando a cor alvo
    if (gameState.isShowingTargetColor) {
        console.log('⚠️ Bloqueando reset do preview - cor alvo sendo exibida');
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
            // ⭐ CORREÇÃO: Não carregar pontuação da sessão anterior, sempre começar zerado
            gameState.score = 0; 
            gameState.hasShownLevel3Congratulations = data.hasShownLevel3Congratulations || false;
            
            console.log('📁 Dados carregados:', {
                totalGames: gameState.totalGames,
                totalWins: gameState.totalWins,
                highScore: gameState.highScore,
                scoreAtual: gameState.score
            });
        }
    } catch (error) {
        console.warn('Erro ao carregar dados salvos:', error);
        // Reset para estado padrão em caso de erro
        gameState.score = 0;
        gameState.totalGames = 0;
        gameState.totalWins = 0;
        gameState.highScore = 0;
        gameState.levelProgress = { easy: 0, medium: 0, hard: 0 };
        gameState.unlockedLevels = ['easy'];
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
        // ⭐ CORREÇÃO: Não salvar pontuação atual, apenas estatísticas permanentes
        // score: gameState.score, // Removido para sempre começar zerado
        hasShownLevel3Congratulations: gameState.hasShownLevel3Congratulations
    };
    localStorage.setItem('colorGameData', JSON.stringify(data));
    
    if (debugMode) {
        console.log('💾 Dados salvos (sem pontuação atual):', data);
    }
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
    
    // ⭐ CORREÇÃO CRÍTICA: Reset completo de TODAS as variáveis necessárias
    gameState.targetColor = generateNewColor();
    gameState.attemptsLeft = GAME_CONFIG.ATTEMPTS_PER_GAME; // Garante que sempre volta para 3
    gameState.isGameActive = false; // Inicialmente inativo para mostrar a cor
    gameState.gamePhase = 'pre-game';
    
    // ⭐ IMPORTANTE: NÃO resetar score aqui, pois pode ser uma continuação de jogos
    // A pontuação só deve ser resetada explicitamente pelo usuário
    
    // ⭐ CRÍTICO: Resetar flags de controle para garantir funcionamento correto
    gameState.isShowingTargetColor = false;
    gameState.isPreviewActive = false;
    gameState.lastPreviewedColor = '';
    
    // Adicionar cor atual à lista de usadas, mas manter histórico se existir
    if (!gameState.usedColors.includes(gameState.targetColor)) {
        gameState.usedColors.push(gameState.targetColor);
    }
    
    // ⭐ CORREÇÃO CRÍTICA: Reset visual e preview COMPLETO
    resetBackgroundPreview();
    hideTargetColorFromBackground(); // Garante que qualquer cor anterior seja removida
    document.body.className = '';
    
    // ⭐ CORREÇÃO CRÍTICA: Reset da interface garantindo estado inicial correto
    elements.colorInput.value = '';
    elements.colorInput.disabled = true; // Desabilitar input durante preview
    elements.colorInput.classList.remove('preview-active', 'background-match'); // Reset classes CSS
    elements.guessBtn.style.display = 'none'; // Ocultar botão durante preview
    elements.restartBtn.style.display = 'none';
    if (elements.nextLevelBtn) elements.nextLevelBtn.style.display = 'none';
    if (elements.hintArea) {
        elements.hintArea.style.display = 'none';
        if (elements.hintMessage) elements.hintMessage.textContent = '';
    }
    
    // ⭐ CRÍTICO: Garantir que o feedback é limpo antes de mostrar novo
    if (elements.feedbackArea) {
        elements.feedbackArea.className = 'feedback-area';
        if (elements.feedbackMessage) elements.feedbackMessage.textContent = '';
    }
    
    // ⭐ NOVA FUNCIONALIDADE: Mostrar a cor sorteada no fundo por alguns segundos
    showFeedback('🎯 Uma nova cor foi sorteada! Observe o fundo e memorize a cor...', 'info');
    showTargetColorInBackground();
    
    // Debug log
    console.log(`🎨 Mostrando cor alvo por ${GAME_CONFIG.TARGET_COLOR_DISPLAY_TIME}ms: ${gameState.targetColor}`);
    
    setTimeout(() => {
        // ⭐ CRÍTICO: Verificar se o jogo ainda está no estado correto (não foi interrompido)
        if (gameState.gamePhase === 'pre-game' && gameState.targetColor) {
            // Após mostrar a cor, ocultar e permitir que o jogo comece
            console.log('⏰ Timeout executado - ocultando cor e iniciando jogo');
            hideTargetColorFromBackground();
            
            // ⭐ CORREÇÃO CRÍTICA: Reset completo do estado para garantir jogo limpo
            gameState.isGameActive = true;
            gameState.gamePhase = 'playing';
            gameState.attemptsLeft = GAME_CONFIG.ATTEMPTS_PER_GAME; // Garantia extra
            
            // ⭐ CRÍTICO: Garantir interface completamente resetada
            elements.colorInput.disabled = false;
            elements.colorInput.value = '';
            elements.colorInput.classList.remove('preview-active', 'background-match');
            elements.guessBtn.style.display = 'inline-flex';
            
            // ⭐ Forçar atualização da UI para garantir que valores são exibidos corretamente
            updateUI();
            
            showFeedback('🎨 Agora adivinhe! Digite o nome da cor em português e use o preview para ajudar.', 'info');
            elements.colorInput.focus();
            
            console.log('✅ Jogo ativo - jogador pode adivinhar');
            console.log('🔢 Estado das tentativas após reset:', gameState.attemptsLeft);
        }
    }, GAME_CONFIG.TARGET_COLOR_DISPLAY_TIME);
    
    updateUI();
    
    if (debugMode) {
        console.log(`🎮 Novo jogo iniciado. Cor alvo: ${gameState.targetColor}`);
        console.log(`💰 Pontuação atual: ${gameState.score}`);
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
    console.log('🔄 Atualizando UI com estado atual:', {
        attempts: gameState.attemptsLeft,
        score: gameState.score,
        active: gameState.isGameActive,
        phase: gameState.gamePhase
    });
    
    if (elements.attemptsCount) {
        elements.attemptsCount.textContent = gameState.attemptsLeft;
        // ⭐ CRÍTICO: Forçar repaint para garantir atualização visual
        elements.attemptsCount.style.display = 'none';
        elements.attemptsCount.offsetHeight; // trigger reflow
        elements.attemptsCount.style.display = '';
        
        // Reset cor se não for erro (0 tentativas)
        if (gameState.attemptsLeft > 0) {
            elements.attemptsCount.style.color = '';
        }
    }
    if (elements.scoreCount) {
        elements.scoreCount.textContent = gameState.score;
        // Forçar repaint
        elements.scoreCount.offsetHeight;
    }
    if (elements.levelProgress) {
        // ⭐ CORREÇÃO: Sempre mostrar máximo 3 no contador de acertos do nível
        const currentProgress = Math.min(gameState.levelProgress[gameState.currentLevel], 3);
        elements.levelProgress.textContent = `${currentProgress}/${GAME_CONFIG.WINS_TO_UNLOCK_NEXT}`;
    }
    
    // Estatísticas
    if (elements.totalGames) {
        elements.totalGames.textContent = gameState.totalGames;
        elements.totalGames.offsetHeight; // Forçar repaint
    }
    if (elements.totalWins) {
        elements.totalWins.textContent = gameState.totalWins;
        elements.totalWins.offsetHeight; // Forçar repaint
    }
    if (elements.winRate) {
        const rate = gameState.totalGames > 0 ? Math.round((gameState.totalWins / gameState.totalGames) * 100) : 0;
        elements.winRate.textContent = `${rate}%`;
    }
    if (elements.highScore) {
        elements.highScore.textContent = gameState.highScore;
        elements.highScore.offsetHeight; // Forçar repaint
    }
    
    console.log('✅ UI atualizada com sucesso');
}

// Processar palpite
function handleGuess() {
    console.log('🎯 Processando palpite...');
    console.log('📊 Estado atual antes do palpite:', {
        attempts: gameState.attemptsLeft,
        active: gameState.isGameActive,
        phase: gameState.gamePhase,
        target: gameState.targetColor
    });
    
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
    
    // ⭐ CRÍTICO: Decrementar tentativas ANTES de verificar resultado
    gameState.attemptsLeft--;
    console.log('🔢 Tentativas restantes após decremento:', gameState.attemptsLeft);
    
    // ⭐ COMPARAÇÃO AGORA É EM PORTUGUÊS
    const isCorrect = guess === gameState.targetColor.toLowerCase();
    console.log('🎯 Palpite correto?', isCorrect);
    
    if (isCorrect) {
        console.log('🎉 Palpite correto! Processando vitória...');
        handleCorrectGuess();
    } else {
        console.log('❌ Palpite incorreto. Processando erro...');
        handleIncorrectGuess(guess);
    }
    
    // ⭐ CRÍTICO: Garantir que a UI seja atualizada após mudanças no estado
    setTimeout(() => {
        console.log('🔄 Atualizando UI após palpite...');
        console.log('📊 Estado final após palpite:', {
            attempts: gameState.attemptsLeft,
            active: gameState.isGameActive,
            phase: gameState.gamePhase
        });
        updateUI();
    }, 50);
}

// ⭐ FUNCIONALIDADE CORRIGIDA: Palpite correto
function handleCorrectGuess() {
    gameState.isGameActive = false;
    gameState.gamePhase = 'post-game';
    gameState.totalWins++;
    
    // ⭐ CORREÇÃO: Limitar contador de acertos no nível a máximo 3
    if (gameState.levelProgress[gameState.currentLevel] < 3) {
        gameState.levelProgress[gameState.currentLevel]++;
    }
    
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
    elements.colorInput.disabled = true;
    
    // ⭐ NOVA FUNCIONALIDADE: Verificar se completou 3 acertos seguidos
    const consecutiveWins = gameState.levelProgress[gameState.currentLevel];
    
    if (consecutiveWins >= 3) {
        // ⭐ PRIMEIRA VEZ atingindo 3 acertos - mostrar parabéns e opções
        if (consecutiveWins === 3 && !gameState.hasShownLevel3Congratulations) {
            gameState.hasShownLevel3Congratulations = true;
            
            setTimeout(() => {
                hideTargetColorFromBackground();
                const shouldContinue = confirm(
                    `🎉 Parabéns! Você acertou 3 cores seguidas!\n\n` +
                    `🔄 Deseja continuar no mesmo nível?\n` +
                    `✅ OK = Continuar\n` +
                    `❌ Cancelar = Recomeçar do zero`
                );
                
                if (shouldContinue) {
                    // Continuar no mesmo nível
                    console.log('🎮 Jogador escolheu continuar no mesmo nível');
                    startNewGame();
                } else {
                    // Recomeçar do zero
                    console.log('🔄 Jogador escolheu recomeçar do zero');
                    resetGameToStart();
                }
            }, 2000);
            
            elements.restartBtn.style.display = 'none'; // Ocultar botão pois será automático
        } else {
            // ⭐ JÁ ATINGIU 3 - apenas continuar o jogo sem mostrar mensagem especial
            elements.restartBtn.style.display = 'inline-flex';
        }
    } else {
        // Acerto normal, mostrar botão de restart
        elements.restartBtn.style.display = 'inline-flex';
    }
    
    checkLevelUnlock();
    saveToStorage();
}

// ⭐ FUNÇÃO MELHORADA: Resetar jogo completamente do zero (mantendo estatísticas)
function resetGameToStart() {
    console.log('🔄 Resetando jogo completamente do zero...');
    
    // ⭐ CORREÇÃO: Reset do progresso do jogo, mas preservar estatísticas gerais
    const preservedStats = {
        totalGames: gameState.totalGames,
        totalWins: gameState.totalWins,
        highScore: gameState.highScore
    };
    
    gameState.currentLevel = 'easy';
    gameState.score = 0; // ⭐ CRÍTICO: Zerar pontuação atual
    gameState.usedColors = [];
    gameState.isGameActive = false;
    gameState.gamePhase = 'pre-game';
    gameState.levelProgress = { easy: 0, medium: 0, hard: 0 }; // Reset progresso dos níveis
    gameState.hasShownLevel3Congratulations = false; // ⭐ Reset flag de congratulações
    
    // Restaurar estatísticas gerais (não resetar histórico total)
    gameState.totalGames = preservedStats.totalGames;
    gameState.totalWins = preservedStats.totalWins;
    gameState.highScore = preservedStats.highScore;
    
    // Reset visual completo
    hideTargetColorFromBackground();
    resetBackgroundPreview();
    document.body.className = '';
    
    // Reset UI
    if (elements.difficultySelect) {
        elements.difficultySelect.value = 'easy';
    }
    elements.colorInput.value = '';
    elements.restartBtn.style.display = 'none';
    if (elements.nextLevelBtn) elements.nextLevelBtn.style.display = 'none';
    if (elements.hintArea) elements.hintArea.style.display = 'none';
    
    updateUI();
    saveToStorage();
    
    console.log('✅ Reset do jogo concluído, estatísticas preservadas');
    
    // Iniciar novo jogo após um breve delay
    setTimeout(() => {
        startNewGame();
    }, 500);
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
        // ⭐ FUNCIONALIDADE NOVA: Fim de jogo - mostrar cor alvo no fundo e reiniciar automaticamente
        gameState.isGameActive = false;
        gameState.gamePhase = 'post-game';
        gameState.totalGames++;
        
        // ⭐ CRÍTICO: Garantir que tentativas seja 0 na UI
        gameState.attemptsLeft = 0;
        
        // Mostrar a cor sorteada no fundo (sem mostrar nome)
        showTargetColorInBackground();
        
        showFeedback(
            `💀 Fim de jogo! Veja a cor sorteada no fundo. O jogo reiniciará automaticamente em alguns segundos...`, 
            'error'
        );
        
        // ⭐ CORREÇÃO CRÍTICA: Atualizar UI imediatamente para mostrar 0 tentativas
        if (elements.attemptsCount) {
            elements.attemptsCount.textContent = '0';
            // Forçar repaint
            elements.attemptsCount.style.color = '#ef4444'; // Vermelho para indicar fim
            elements.attemptsCount.offsetHeight; // trigger reflow
        }
        
        elements.guessBtn.style.display = 'none';
        elements.restartBtn.style.display = 'none'; // Ocultar botão pois será automático
        elements.colorInput.disabled = true;
        elements.colorInput.value = '';
        elements.colorInput.classList.remove('preview-active', 'background-match');
        
        // ⭐ CRÍTICO: Garantir que o feedback area mostre o erro
        if (elements.feedbackArea) {
            elements.feedbackArea.className = 'feedback-area error';
        }
        
        saveToStorage();
        
        // ⭐ NOVA FUNCIONALIDADE: Reiniciar automaticamente após 3 segundos
        setTimeout(() => {
            console.log('🔄 Reiniciando jogo automaticamente após 3 tentativas falhadas...');
            console.log('📊 Estado antes do reset automático:', {
                attempts: gameState.attemptsLeft,
                active: gameState.isGameActive,
                phase: gameState.gamePhase
            });
            
            hideTargetColorFromBackground();
            
            // ⭐ CRÍTICO: Garantir reset completo antes de chamar startNewGame
            gameState.attemptsLeft = GAME_CONFIG.ATTEMPTS_PER_GAME;
            gameState.isGameActive = false;
            gameState.gamePhase = 'pre-game';
            gameState.isShowingTargetColor = false;
            gameState.isPreviewActive = false;
            gameState.lastPreviewedColor = '';
            
            if (elements.attemptsCount) {
                elements.attemptsCount.style.color = ''; // Reset cor para padrão
            }
            
            startNewGame();
        }, 3000);
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
        resetAllBtn: document.getElementById('reset-all-btn'), // ⭐ NOVO ELEMENTO
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
            console.log('📊 Estado antes do reset manual:', {
                attempts: gameState.attemptsLeft,
                active: gameState.isGameActive,
                phase: gameState.gamePhase,
                score: gameState.score
            });
            
            // ⭐ CORREÇÃO CRÍTICA: Reset completo antes de iniciar novo jogo
            hideTargetColorFromBackground(); // Limpar cor atual
            resetBackgroundPreview(); // Limpar preview
            
            // ⭐ CRÍTICO: Reset manual de todas as variáveis importantes
            gameState.attemptsLeft = GAME_CONFIG.ATTEMPTS_PER_GAME;
            gameState.isGameActive = false;
            gameState.gamePhase = 'pre-game';
            gameState.isShowingTargetColor = false;
            gameState.isPreviewActive = false;
            gameState.lastPreviewedColor = '';
            
            // ⭐ Reset visual da UI
            if (elements.attemptsCount) {
                elements.attemptsCount.style.color = ''; // Reset cor para padrão
            }
            elements.colorInput.value = '';
            elements.colorInput.classList.remove('preview-active', 'background-match');
            
            console.log('✅ Reset manual concluído, iniciando novo jogo...');
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
            // ⭐ CORREÇÃO CRÍTICA: Reset da pontuação ao mudar nível
            gameState.score = 0;
            console.log('💰 Pontuação resetada para 0 ao mudar nível');
            gameState.hasShownLevel3Congratulations = false; // ⭐ Reset congratulações para novo nível
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
    
    // ⭐ NOVO: Event listener para botão "Zerar Tudo"
    if (elements.resetAllBtn) {
        elements.resetAllBtn.addEventListener('click', () => {
            console.log('🔄 Botão zerar tudo clicado');
            resetAllGameData(); // Chama a função de reset completo
        });
    }
    
    // Carregar dados salvos e inicializar
    console.log('💾 Carregando dados salvos...');
    loadFromStorage();
    
    // ⭐ CORREÇÃO CRÍTICA: Garantir que a pontuação sempre comece em 0 ao carregar página
    gameState.score = 0;
    console.log('🔄 Pontuação resetada para 0 ao carregar a página');
    
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