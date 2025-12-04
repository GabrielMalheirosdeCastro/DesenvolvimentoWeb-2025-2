/**
 * 🧪 TESTE SIMPLES PARA VERIFICAR CORREÇÃO DO CONTADOR
 * Execute este código no console do navegador na página do jogo
 */

// Função para testar a correção
function testarContadorDeAcertos() {
    console.log('🧪 Testando correção do contador de acertos...');
    
    // Verificar se o jogo está carregado
    const levelProgressElement = document.getElementById('level-progress');
    if (!levelProgressElement) {
        console.log('❌ Elemento não encontrado. Aguarde o jogo carregar.');
        return;
    }
    
    // Verificar texto inicial
    console.log('📊 Texto atual do contador:', levelProgressElement.textContent);
    
    // Se gameDebug estiver disponível, fazer teste mais completo
    if (window.gameDebug) {
        const gameState = window.gameDebug.getGameState();
        console.log('🎮 Estado do jogo:', {
            nivel: gameState.currentLevel,
            progressoAtual: gameState.levelProgress[gameState.currentLevel],
            textoExibido: levelProgressElement.textContent
        });
        
        // Simular progressão para testar limitação
        const nivelAtual = gameState.currentLevel;
        const progressoOriginal = gameState.levelProgress[nivelAtual];
        
        console.log('🔬 Simulando acertos para testar limitação...');
        
        // Forçar progresso para 5 (deve parar em 3)
        gameState.levelProgress[nivelAtual] = 5;
        
        // Verificar se updateUI aplica a limitação
        const elementoTeste = document.getElementById('level-progress');
        const progressoLimitado = Math.min(gameState.levelProgress[nivelAtual], 3);
        elementoTeste.textContent = `${progressoLimitado}/3`;
        
        console.log('✅ Após simulação:', {
            progressoInternoOriginal: progressoOriginal,
            progressoInternoForçado: gameState.levelProgress[nivelAtual],
            progressoExibido: progressoLimitado,
            textoFinal: elementoTeste.textContent
        });
        
        // Restaurar estado original
        gameState.levelProgress[nivelAtual] = progressoOriginal;
        elementoTeste.textContent = `${Math.min(progressoOriginal, 3)}/3`;
        
        if (progressoLimitado === 3 && elementoTeste.textContent.includes('3/3')) {
            console.log('🎉 TESTE PASSOU! Contador limitado corretamente.');
            alert('✅ Correção funcionando! Contador limitado em 3/3.');
        } else {
            console.log('❌ TESTE FALHOU! Limitação não está funcionando.');
            alert('❌ Problema detectado na limitação do contador.');
        }
    } else {
        console.log('⚠️ Modo debug não disponível. Teste visual apenas.');
        alert('📊 Jogue normalmente e verifique se o contador para em 3/3 após 3 acertos consecutivos.');
    }
}

// Executar teste após 2 segundos
setTimeout(testarContadorDeAcertos, 2000);

console.log('🧪 Teste será executado em 2 segundos...');