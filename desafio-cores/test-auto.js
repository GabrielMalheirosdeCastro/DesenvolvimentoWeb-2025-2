/**
 * 🧪 TESTE AUTOMATIZADO - Jogo de Cores
 * Script para testar automaticamente todas as funcionalidades
 */

console.log('🧪 Iniciando testes automatizados do jogo...');

// Aguardar página carregar completamente
window.addEventListener('load', function() {
    setTimeout(runTests, 2000);
});

function runTests() {
    console.log('🚀 Executando testes...');
    
    // Teste 1: Verificar elementos DOM
    console.log('📋 Teste 1: Verificando elementos DOM...');
    const elementos = {
        input: document.getElementById('color-guess'),
        botao: document.getElementById('guess-btn'),
        contador: document.getElementById('attempts-count'),
        feedback: document.getElementById('feedback-message')
    };
    
    const elementosFaltando = Object.entries(elementos)
        .filter(([nome, elemento]) => !elemento)
        .map(([nome]) => nome);
    
    if (elementosFaltando.length > 0) {
        console.error('❌ Elementos faltando:', elementosFaltando);
        return;
    }
    console.log('✅ Todos os elementos encontrados');
    
    // Teste 2: Estado inicial
    console.log('📋 Teste 2: Verificando estado inicial...');
    const contadorInicial = elementos.contador.textContent;
    console.log('🔢 Contador inicial:', contadorInicial);
    
    if (contadorInicial !== '3') {
        console.error('❌ Contador inicial incorreto:', contadorInicial);
        return;
    }
    console.log('✅ Estado inicial correto');
    
    // Teste 3: Simular tentativa incorreta
    console.log('📋 Teste 3: Simulando tentativa incorreta...');
    
    // Simular entrada de cor incorreta
    elementos.input.value = 'wrongcolor';
    elementos.input.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Simular click no botão
    setTimeout(() => {
        elementos.botao.click();
        
        // Verificar se contador mudou
        setTimeout(() => {
            const novoContador = elementos.contador.textContent;
            console.log('🔢 Contador após 1ª tentativa:', novoContador);
            
            if (novoContador === '2') {
                console.log('✅ Contador atualizou corretamente para 2');
                
                // Teste 4: Segunda tentativa
                console.log('📋 Teste 4: Simulando segunda tentativa...');
                elementos.input.value = 'anotherwrong';
                elementos.input.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                    elementos.botao.click();
                    
                    setTimeout(() => {
                        const segundoContador = elementos.contador.textContent;
                        console.log('🔢 Contador após 2ª tentativa:', segundoContador);
                        
                        if (segundoContador === '1') {
                            console.log('✅ Segunda tentativa funcionou corretamente');
                            
                            // Teste 5: Terceira tentativa (game over)
                            console.log('📋 Teste 5: Simulando terceira tentativa (game over)...');
                            elementos.input.value = 'finalwrong';
                            elementos.input.dispatchEvent(new Event('input', { bubbles: true }));
                            
                            setTimeout(() => {
                                elementos.botao.click();
                                
                                setTimeout(() => {
                                    const finalContador = elementos.contador.textContent;
                                    console.log('🔢 Contador final:', finalContador);
                                    
                                    if (finalContador === '0') {
                                        console.log('🎉 ✅ TODOS OS TESTES PASSARAM! O contador está funcionando corretamente.');
                                        showTestResult('✅ SUCESSO: O jogo está funcionando corretamente!');
                                    } else {
                                        console.error('❌ Terceira tentativa falhou. Contador:', finalContador);
                                        showTestResult('❌ ERRO: Problema na terceira tentativa');
                                    }
                                }, 500);
                            }, 100);
                        } else {
                            console.error('❌ Segunda tentativa falhou. Contador:', segundoContador);
                            showTestResult('❌ ERRO: Problema na segunda tentativa');
                        }
                    }, 500);
                }, 100);
            } else {
                console.error('❌ Primeira tentativa falhou. Contador:', novoContador);
                showTestResult('❌ ERRO: Problema na primeira tentativa');
            }
        }, 500);
    }, 100);
}

function showTestResult(message) {
    // Criar overlay de resultado
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: monospace;
        font-size: 24px;
        text-align: center;
    `;
    
    overlay.innerHTML = `
        <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 10px; margin: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🧪</div>
            <div style="margin-bottom: 20px;">${message}</div>
            <div style="font-size: 16px; opacity: 0.8;">
                Clique para fechar
            </div>
        </div>
    `;
    
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 5000);
}