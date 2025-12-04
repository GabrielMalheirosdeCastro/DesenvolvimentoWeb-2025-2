/**
 * 🔍 ANÁLISE DOS PROBLEMAS REPORTADOS
 * 
 * PROBLEMA 1: Resposta da cor sorteada não sendo mostrada após três tentativas falhadas
 * PROBLEMA 2: Pontuação permanece mesmo mudando de nível de dificuldade
 * 
 * Vamos criar testes específicos para verificar esses comportamentos
 */

// Função para testar o problema das 3 tentativas
function testTresTentativasFalhadas() {
    console.log('🧪 TESTE: 3 tentativas falhadas');
    
    // Simular 3 tentativas incorretas
    const inputElement = document.getElementById('color-guess');
    const guessBtn = document.getElementById('guess-btn');
    
    if (!inputElement || !guessBtn) {
        console.error('❌ Elementos não encontrados');
        return false;
    }
    
    // Verificar estado inicial
    console.log('📊 Estado inicial:', {
        tentativas: document.getElementById('attempts-count')?.textContent,
        ativo: window.gameDebug?.getGameState()?.isGameActive,
        fase: window.gameDebug?.getGameState()?.gamePhase
    });
    
    // Simular 3 palpites incorretos
    const palpitesIncorretos = ['wrong1', 'wrong2', 'wrong3'];
    let tentativaAtual = 0;
    
    const intervalTeste = setInterval(() => {
        if (tentativaAtual >= 3) {
            clearInterval(intervalTeste);
            
            // Verificar se a cor foi mostrada
            setTimeout(() => {
                const corSendoMostrada = window.gameDebug?.getGameState()?.isShowingTargetColor;
                const corAlvo = window.gameDebug?.getGameState()?.targetColor;
                
                console.log('🔍 RESULTADO TESTE 3 TENTATIVAS:');
                console.log('- Cor sendo mostrada:', corSendoMostrada);
                console.log('- Cor alvo:', corAlvo);
                console.log('- Fundo atual:', document.body.style.backgroundColor);
                
                if (corSendoMostrada && corAlvo) {
                    console.log('✅ TESTE PASSOU: Cor sendo exibida após 3 tentativas falhadas');
                    return true;
                } else {
                    console.log('❌ TESTE FALHOU: Cor NÃO sendo exibida após 3 tentativas falhadas');
                    return false;
                }
            }, 1000);
            return;
        }
        
        inputElement.value = palpitesIncorretos[tentativaAtual];
        inputElement.dispatchEvent(new Event('input'));
        
        setTimeout(() => {
            guessBtn.click();
            tentativaAtual++;
        }, 500);
    }, 1500);
}

// Função para testar o problema da pontuação persistente
function testPontuacaoPersistente() {
    console.log('🧪 TESTE: Pontuação persistente entre níveis');
    
    const scoreElement = document.getElementById('score-count');
    const levelSelector = document.getElementById('difficulty-select');
    
    if (!scoreElement || !levelSelector) {
        console.error('❌ Elementos não encontrados');
        return false;
    }
    
    // Verificar pontuação atual
    const pontuacaoInicial = parseInt(scoreElement.textContent) || 0;
    console.log('📊 Pontuação inicial:', pontuacaoInicial);
    
    // Simular mudança de nível
    const nivelAtual = levelSelector.value;
    const niveisDisponiveis = Array.from(levelSelector.options)
        .filter(opt => !opt.disabled)
        .map(opt => opt.value);
    
    console.log('📊 Níveis disponíveis:', niveisDisponiveis);
    
    if (niveisDisponiveis.length > 1) {
        const novoNivel = niveisDisponiveis.find(n => n !== nivelAtual);
        
        console.log('🔄 Mudando nível de', nivelAtual, 'para', novoNivel);
        
        // Simular mudança de nível
        levelSelector.value = novoNivel;
        levelSelector.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            const pontuacaoAposMudanca = parseInt(scoreElement.textContent) || 0;
            
            console.log('🔍 RESULTADO TESTE PONTUAÇÃO:');
            console.log('- Pontuação antes:', pontuacaoInicial);
            console.log('- Pontuação depois:', pontuacaoAposMudanca);
            
            if (pontuacaoAposMudanca === 0) {
                console.log('✅ TESTE PASSOU: Pontuação foi zerada ao mudar nível');
                return true;
            } else {
                console.log('❌ TESTE FALHOU: Pontuação persistiu ao mudar nível');
                return false;
            }
        }, 1000);
    } else {
        console.log('⚠️ Apenas um nível disponível, não é possível testar mudança');
        return null;
    }
}

// Função para analisar o código em busca dos problemas
function analisarProblemas() {
    console.log('🔍 ANÁLISE DOS PROBLEMAS NO CÓDIGO:');
    console.log('='.repeat(50));
    
    // Análise 1: Problema das 3 tentativas
    console.log('📋 PROBLEMA 1: Cor não exibida após 3 tentativas falhadas');
    
    console.log('🔍 Verificando função handleIncorrectGuess...');
    
    // Verificar se a função showTargetColorInBackground está sendo chamada
    const codigoScript = document.querySelector('script[src*="script-fixed-visibility.js"]');
    if (codigoScript) {
        console.log('✅ Script principal encontrado');
        
        // Verificar se as funções existem no debug
        if (window.gameDebug) {
            console.log('✅ Modo debug disponível');
            const gameState = window.gameDebug.getGameState();
            
            console.log('📊 Estado atual do jogo:', {
                targetColor: gameState.targetColor,
                attemptsLeft: gameState.attemptsLeft,
                isShowingTargetColor: gameState.isShowingTargetColor,
                gamePhase: gameState.gamePhase
            });
        }
    }
    
    // Análise 2: Problema da pontuação persistente
    console.log('📋 PROBLEMA 2: Pontuação persistente entre níveis');
    
    console.log('🔍 Verificando mudança de nível...');
    const levelSelector = document.getElementById('difficulty-select');
    if (levelSelector) {
        console.log('✅ Seletor de nível encontrado');
        
        // Verificar event listener
        const eventListeners = getEventListeners ? getEventListeners(levelSelector) : null;
        if (eventListeners && eventListeners.change) {
            console.log('✅ Event listener de mudança encontrado:', eventListeners.change.length);
        } else {
            console.log('⚠️ Event listener pode não estar configurado corretamente');
        }
    }
}

// Função para executar todos os testes
function executarTodosTestes() {
    console.log('🚀 INICIANDO BATERIA DE TESTES COMPLETA');
    console.log('='.repeat(60));
    
    analisarProblemas();
    
    setTimeout(() => {
        console.log('🧪 Executando teste de 3 tentativas em 3 segundos...');
        setTimeout(testTresTentativasFalhadas, 3000);
    }, 2000);
    
    setTimeout(() => {
        console.log('🧪 Executando teste de pontuação em 15 segundos...');
        setTimeout(testPontuacaoPersistente, 15000);
    }, 5000);
}

// Auto-executar se estiver no ambiente correto
if (typeof window !== 'undefined' && window.location && 
    window.location.pathname.includes('desafio-cores')) {
    
    console.log('🔍 Script de análise de problemas carregado');
    console.log('💡 Execute executarTodosTestes() para iniciar a análise completa');
    
    // Disponibilizar funções globalmente para debug
    window.testProblemas = {
        analisar: analisarProblemas,
        testTentativas: testTresTentativasFalhadas,
        testPontuacao: testPontuacaoPersistente,
        executarTodos: executarTodosTestes
    };
    
    // Auto-executar após 2 segundos se o jogo estiver carregado
    setTimeout(() => {
        if (window.gameDebug) {
            console.log('🎮 Jogo detectado, executando análise automática...');
            executarTodosTestes();
        }
    }, 2000);
}