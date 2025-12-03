/**
 * 🧪 TESTES AUTOMATIZADOS - Jogo de Adivinhação de Cores com Cor Visível
 * Validação das funcionalidades implementadas
 */

// Aguardar carregamento da página
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(runAutomatedTests, 2000); // Aguarda 2 segundos para carregamento completo
});

function runAutomatedTests() {
    console.log('🧪 Iniciando testes automatizados...');
    
    const results = {
        targetColorDisplay: false,
        previewFunctionality: false,
        gameLogic: false,
        overallPass: false
    };
    
    try {
        // Teste 1: Verificar se cor alvo está visível
        console.log('🔍 Teste 1: Verificando exibição da cor alvo...');
        const targetDisplay = document.getElementById('target-color-display');
        if (targetDisplay && targetDisplay.style.display !== 'none') {
            console.log('✅ Cor alvo está visível');
            results.targetColorDisplay = true;
        } else {
            console.log('❌ Cor alvo não está visível');
        }
        
        // Teste 2: Verificar funcionalidade de preview
        console.log('🔍 Teste 2: Verificando preview de cores...');
        const colorInput = document.getElementById('color-guess');
        if (colorInput) {
            // Simular digitação
            colorInput.value = 'red';
            colorInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                const bgColor = document.body.style.backgroundColor;
                if (bgColor && bgColor !== '') {
                    console.log('✅ Preview de cores funcionando');
                    results.previewFunctionality = true;
                } else {
                    console.log('❌ Preview de cores não funcionando');
                }
                
                // Limpar teste
                colorInput.value = '';
                colorInput.dispatchEvent(new Event('input', { bubbles: true }));
            }, 1000);
        }
        
        // Teste 3: Verificar elementos críticos do jogo
        console.log('🔍 Teste 3: Verificando elementos do jogo...');
        const criticalElements = [
            'attempts-count',
            'score-count', 
            'guess-btn',
            'feedback-message'
        ];
        
        let elementsFound = 0;
        criticalElements.forEach(id => {
            if (document.getElementById(id)) {
                elementsFound++;
            }
        });
        
        if (elementsFound === criticalElements.length) {
            console.log('✅ Todos os elementos críticos encontrados');
            results.gameLogic = true;
        } else {
            console.log(`❌ Apenas ${elementsFound}/${criticalElements.length} elementos encontrados`);
        }
        
        // Teste 4: Verificar se gameState está disponível
        if (window.gameDebug && window.gameDebug.getGameState) {
            const gameState = window.gameDebug.getGameState();
            if (gameState && gameState.targetColor) {
                console.log(`🎯 Cor alvo atual: ${gameState.targetColor}`);
            }
        }
        
        // Resultado final
        setTimeout(() => {
            results.overallPass = results.targetColorDisplay && 
                                results.previewFunctionality && 
                                results.gameLogic;
            
            console.log('\n📊 RESULTADO DOS TESTES:');
            console.log(`🎯 Cor alvo visível: ${results.targetColorDisplay ? '✅' : '❌'}`);
            console.log(`🎨 Preview funcionando: ${results.previewFunctionality ? '✅' : '❌'}`);
            console.log(`🎮 Elementos do jogo: ${results.gameLogic ? '✅' : '❌'}`);
            console.log(`\n🏆 RESULTADO GERAL: ${results.overallPass ? '✅ PASSOU' : '❌ FALHOU'}`);
            
            // Mostrar resultado na tela
            showTestResults(results);
        }, 2000);
        
    } catch (error) {
        console.error('🚨 Erro durante os testes:', error);
        showTestResults({ overallPass: false, error: error.message });
    }
}

function showTestResults(results) {
    // Criar elemento para mostrar resultados na tela
    const resultDisplay = document.createElement('div');
    resultDisplay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${results.overallPass ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-family: Arial, sans-serif;
        text-align: center;
        min-width: 300px;
    `;
    
    const status = results.overallPass ? '✅ TESTES PASSARAM' : '❌ TESTES FALHARAM';
    const details = results.error ? `Erro: ${results.error}` : 
                   `
                   Cor visível: ${results.targetColorDisplay ? '✅' : '❌'}<br>
                   Preview: ${results.previewFunctionality ? '✅' : '❌'}<br>
                   Elementos: ${results.gameLogic ? '✅' : '❌'}
                   `;
    
    resultDisplay.innerHTML = `
        <h3>${status}</h3>
        <p>${details}</p>
        <button onclick="this.parentElement.remove()">Fechar</button>
    `;
    
    document.body.appendChild(resultDisplay);
    
    // Auto-remover após 10 segundos
    setTimeout(() => {
        if (resultDisplay.parentElement) {
            resultDisplay.remove();
        }
    }, 10000);
}

console.log('🧪 Script de teste carregado e aguardando execução...');