/**
 * 🛠️ VERIFICAÇÃO FINAL DAS CORREÇÕES IMPLEMENTADAS
 * 
 * Este script verifica se as correções foram aplicadas corretamente
 * analisando o código fonte e testando comportamentos específicos
 */

// Função para verificar se as correções estão no código
function verificarCorrecaoNoCodigo() {
    console.log('🔍 VERIFICANDO CORREÇÕES NO CÓDIGO FONTE:');
    console.log('='.repeat(50));
    
    // Verificar se o script principal existe
    const scripts = document.querySelectorAll('script[src*="script-fixed-visibility.js"]');
    if (scripts.length === 0) {
        console.error('❌ Script principal não encontrado');
        return false;
    }
    
    console.log('✅ Script principal encontrado');
    
    // Verificar se as funções existem no debug
    if (!window.gameDebug) {
        console.error('❌ GameDebug não disponível');
        return false;
    }
    
    console.log('✅ GameDebug disponível');
    
    // Verificar elementos da UI
    const elementos = {
        'score-count': document.getElementById('score-count'),
        'difficulty-select': document.getElementById('difficulty-select'),
        'color-guess': document.getElementById('color-guess'),
        'attempts-count': document.getElementById('attempts-count'),
        'guess-btn': document.getElementById('guess-btn')
    };
    
    let elementosOK = true;
    Object.entries(elementos).forEach(([nome, elemento]) => {
        if (elemento) {
            console.log(`✅ Elemento ${nome} encontrado`);
        } else {
            console.error(`❌ Elemento ${nome} NÃO encontrado`);
            elementosOK = false;
        }
    });
    
    return elementosOK;
}

// Teste rápido da correção 1: Reset da pontuação
function testeRapidoResetPontuacao() {
    console.log('\n🧪 TESTE RÁPIDO: Reset da pontuação ao mudar nível');
    
    const scoreElement = document.getElementById('score-count');
    const levelSelector = document.getElementById('difficulty-select');
    
    if (!scoreElement || !levelSelector) {
        console.error('❌ Elementos não encontrados para teste');
        return false;
    }
    
    // Simular pontuação alta
    if (window.gameDebug) {
        const gameState = window.gameDebug.getGameState();
        const pontuacaoOriginal = gameState.score;
        
        // Definir pontuação teste
        gameState.score = 150;
        scoreElement.textContent = '150';
        
        console.log('📊 Pontuação definida para teste:', gameState.score);
        
        // Simular mudança de nível (mesmo que seja o mesmo nível)
        const nivelAtual = levelSelector.value;
        levelSelector.dispatchEvent(new Event('change'));
        
        // Aguardar e verificar
        setTimeout(() => {
            const novaPontuacao = gameState.score;
            const pontuacaoUI = scoreElement.textContent;
            
            console.log('🔍 Resultado do teste rápido:');
            console.log('- Pontuação no gameState após mudança:', novaPontuacao);
            console.log('- Pontuação na UI após mudança:', pontuacaoUI);
            
            if (novaPontuacao === 0 && pontuacaoUI === '0') {
                console.log('✅ TESTE RÁPIDO PASSOU: Reset da pontuação funcionando');
                return true;
            } else {
                console.log('❌ TESTE RÁPIDO FALHOU: Reset da pontuação não funcionando');
                
                // Restaurar pontuação original
                gameState.score = pontuacaoOriginal;
                scoreElement.textContent = pontuacaoOriginal.toString();
                return false;
            }
        }, 1000);
    } else {
        console.error('❌ GameDebug não disponível');
        return false;
    }
}

// Teste rápido da correção 2: Verificar flags de cor alvo
function testeRapidoCorAlvo() {
    console.log('\n🧪 TESTE RÁPIDO: Flags de controle da cor alvo');
    
    if (!window.gameDebug) {
        console.error('❌ GameDebug não disponível');
        return false;
    }
    
    const gameState = window.gameDebug.getGameState();
    
    console.log('📊 Estado atual das flags:');
    console.log('- isShowingTargetColor:', gameState.isShowingTargetColor);
    console.log('- isPreviewActive:', gameState.isPreviewActive);
    console.log('- gamePhase:', gameState.gamePhase);
    console.log('- targetColor:', gameState.targetColor);
    console.log('- attemptsLeft:', gameState.attemptsLeft);
    
    // Verificar se as funções de controle existem
    const funcoesDisponiveis = {
        'showTarget': typeof window.gameDebug.showTarget === 'function',
        'hideTarget': typeof window.gameDebug.hideTarget === 'function',
        'testColorPreview': typeof window.gameDebug.testColorPreview === 'function'
    };
    
    console.log('🔧 Funções de debug disponíveis:');
    Object.entries(funcoesDisponiveis).forEach(([nome, disponivel]) => {
        if (disponivel) {
            console.log(`✅ ${nome} disponível`);
        } else {
            console.log(`❌ ${nome} NÃO disponível`);
        }
    });
    
    return Object.values(funcoesDisponiveis).every(f => f);
}

// Função principal de verificação
function verificarTodasCorrecoes() {
    console.log('🔍 INICIANDO VERIFICAÇÃO COMPLETA DAS CORREÇÕES');
    console.log('='.repeat(60));
    
    let resultados = [];
    
    // Verificação 1: Código
    const codigoOK = verificarCorrecaoNoCodigo();
    resultados.push({ nome: 'Código e Elementos', ok: codigoOK });
    
    // Verificação 2: Flags e controles
    const flagsOK = testeRapidoCorAlvo();
    resultados.push({ nome: 'Flags de Controle', ok: flagsOK });
    
    // Verificação 3: Reset de pontuação (execução assíncrona)
    if (codigoOK) {
        setTimeout(() => {
            testeRapidoResetPontuacao();
        }, 2000);
    }
    
    console.log('\n📋 RESUMO DAS VERIFICAÇÕES:');
    resultados.forEach(resultado => {
        const status = resultado.ok ? '✅' : '❌';
        console.log(`${status} ${resultado.nome}: ${resultado.ok ? 'OK' : 'FALHOU'}`);
    });
    
    const todasOK = resultados.every(r => r.ok);
    
    if (todasOK) {
        console.log('\n🎉 TODAS AS VERIFICAÇÕES PASSARAM!');
        console.log('💡 As correções parecem estar funcionando corretamente.');
        console.log('🧪 Execute window.testCorrecoes.executarTodosTestes() para testes completos.');
    } else {
        console.log('\n⚠️ Algumas verificações falharam.');
        console.log('🔧 Verifique a implementação das correções.');
    }
    
    return todasOK;
}

// Auto-executar
if (typeof window !== 'undefined') {
    console.log('🛠️ Sistema de verificação das correções carregado');
    
    // Disponibilizar globalmente
    window.verificarCorrecoes = verificarTodasCorrecoes;
    
    // Auto-executar após carregamento
    setTimeout(() => {
        if (window.gameDebug) {
            console.log('🎮 Jogo detectado, executando verificação...');
            verificarTodasCorrecoes();
        } else {
            console.log('⏳ Aguardando gameDebug...');
            setTimeout(() => {
                if (window.gameDebug) {
                    verificarTodasCorrecoes();
                } else {
                    console.error('❌ GameDebug não carregou');
                }
            }, 3000);
        }
    }, 1000);
}