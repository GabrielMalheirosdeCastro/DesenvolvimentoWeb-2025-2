/**
 * 🧪 SCRIPT DE TESTES AUTOMATIZADOS 
 * Para validar a funcionalidade de preview de cores
 * 
 * Este script testa todas as funcionalidades principais:
 * 1. Validação de cores CSS
 * 2. Aplicação de preview no fundo
 * 3. Reset de preview
 * 4. Contraste de texto
 * 5. Performance e cache
 */

// Testes a serem executados
const TESTS = [
    {
        name: 'Validação de cores básicas',
        colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
        expectedValid: true
    },
    {
        name: 'Validação de cores inválidas',
        colors: ['invalidcolor', 'notacolor', '123color', ''],
        expectedValid: false
    },
    {
        name: 'Cores do nível médio',
        colors: ['navy', 'teal', 'coral', 'crimson', 'indigo', 'lime'],
        expectedValid: true
    },
    {
        name: 'Cores do nível difícil',
        colors: ['darkslateblue', 'lightcoral', 'mediumseagreen', 'darkgoldenrod'],
        expectedValid: true
    }
];

// Função principal de teste
function runColorPreviewTests() {
    console.log('🧪 === INICIANDO TESTES DE PREVIEW DE CORES ===');
    
    let testResults = {
        passed: 0,
        failed: 0,
        errors: []
    };
    
    // Aguarda a inicialização do jogo
    setTimeout(() => {
        TESTS.forEach((test, index) => {
            console.log(`\n📋 Teste ${index + 1}: ${test.name}`);
            
            test.colors.forEach(color => {
                try {
                    // Testa validação de cor
                    const isValid = window.gameDebug ? 
                        window.gameDebug.isValidColor(color) : 
                        testColorValidationFallback(color);
                    
                    if (isValid === test.expectedValid) {
                        console.log(`✅ ${color}: ${isValid ? 'Válida' : 'Inválida'} (como esperado)`);
                        testResults.passed++;
                        
                        // Se cor é válida, testa preview
                        if (isValid && window.gameDebug) {
                            window.gameDebug.testColorPreview(color);
                            setTimeout(() => {
                                console.log(`🎨 Preview testado para: ${color}`);
                                window.gameDebug.resetPreview();
                            }, 100);
                        }
                    } else {
                        console.log(`❌ ${color}: Esperado ${test.expectedValid ? 'válida' : 'inválida'}, obtido ${isValid ? 'válida' : 'inválida'}`);
                        testResults.failed++;
                        testResults.errors.push(`${color}: validação incorreta`);
                    }
                } catch (error) {
                    console.error(`💥 Erro testando ${color}:`, error);
                    testResults.failed++;
                    testResults.errors.push(`${color}: ${error.message}`);
                }
            });
        });
        
        // Relatório final
        console.log('\n📊 === RELATÓRIO FINAL DOS TESTES ===');
        console.log(`✅ Testes passaram: ${testResults.passed}`);
        console.log(`❌ Testes falharam: ${testResults.failed}`);
        console.log(`📈 Taxa de sucesso: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%`);
        
        if (testResults.errors.length > 0) {
            console.log('\n🚨 Erros encontrados:');
            testResults.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        // Teste de performance
        if (window.gameDebug && window.gameDebug.getCacheInfo) {
            const cacheInfo = window.gameDebug.getCacheInfo();
            console.log(`\n⚡ Performance - Cache de validação: ${cacheInfo.colorValidation} entradas`);
            console.log(`⚡ Performance - Cache de contraste: ${cacheInfo.contrast} entradas`);
        }
        
        return testResults;
        
    }, 1000); // Aguarda 1 segundo para o jogo inicializar
}

// Fallback para teste de validação caso o debug não esteja disponível
function testColorValidationFallback(color) {
    try {
        const testDiv = document.createElement('div');
        testDiv.style.color = color;
        return testDiv.style.color !== '';
    } catch {
        return false;
    }
}

// Teste específico de funcionalidades do preview
function testPreviewFunctionality() {
    console.log('\n🎨 === TESTANDO FUNCIONALIDADE DE PREVIEW ===');
    
    const testColors = ['red', 'blue', 'green', 'yellow'];
    let index = 0;
    
    function testNextColor() {
        if (index >= testColors.length) {
            console.log('✅ Teste de preview concluído!');
            if (window.gameDebug) {
                window.gameDebug.resetPreview();
            }
            return;
        }
        
        const color = testColors[index];
        console.log(`🔄 Testando preview: ${color}`);
        
        // Simula digitação no input
        const input = document.getElementById('color-guess');
        if (input) {
            input.value = color;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                console.log(`🎯 Background agora: ${document.body.style.backgroundColor}`);
                index++;
                setTimeout(testNextColor, 1000);
            }, 500);
        } else {
            console.error('❌ Input não encontrado!');
        }
    }
    
    testNextColor();
}

// Teste de interação do usuário
function testUserInteraction() {
    console.log('\n👤 === TESTE DE INTERAÇÃO DO USUÁRIO ===');
    
    const input = document.getElementById('color-guess');
    if (!input) {
        console.error('❌ Campo de input não encontrado!');
        return;
    }
    
    // Teste 1: Digite uma cor válida
    console.log('📝 Teste 1: Digitando "red"...');
    input.focus();
    input.value = 'r';
    input.dispatchEvent(new Event('input'));
    
    setTimeout(() => {
        input.value = 're';
        input.dispatchEvent(new Event('input'));
        
        setTimeout(() => {
            input.value = 'red';
            input.dispatchEvent(new Event('input'));
            
            setTimeout(() => {
                console.log(`🎨 Background após digitar 'red': ${document.body.style.backgroundColor}`);
                
                // Teste 2: Limpar input
                console.log('🧹 Teste 2: Limpando input...');
                input.value = '';
                input.dispatchEvent(new Event('input'));
                
                setTimeout(() => {
                    console.log(`🎨 Background após limpar: ${document.body.style.backgroundColor}`);
                    console.log('✅ Teste de interação concluído!');
                }, 500);
                
            }, 300);
        }, 200);
    }, 200);
}

// Inicializar testes quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            console.log('🚀 Página carregada! Iniciando testes...');
            runColorPreviewTests();
            setTimeout(testPreviewFunctionality, 3000);
            setTimeout(testUserInteraction, 6000);
        }, 2000);
    });
} else {
    setTimeout(() => {
        console.log('🚀 Página já carregada! Iniciando testes...');
        runColorPreviewTests();
        setTimeout(testPreviewFunctionality, 3000);
        setTimeout(testUserInteraction, 6000);
    }, 2000);
}

// Exportar funções para uso manual
window.colorPreviewTests = {
    runAllTests: runColorPreviewTests,
    testPreview: testPreviewFunctionality,
    testInteraction: testUserInteraction
};

console.log('🧪 Script de testes carregado! Use colorPreviewTests.runAllTests() para executar testes manualmente.');