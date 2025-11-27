/**
 * 🧪 TESTE DE SEGURANÇA - Script para validar proteções implementadas
 * Execute no console do navegador para testar as proteções
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 */

console.log('🧪 INICIANDO TESTES DE SEGURANÇA');
console.log('=====================================');

// 🔄 Função para executar teste com tratamento de erro
function runSecurityTest(testName, testFunction) {
    try {
        console.log(`\n🧪 Testando: ${testName}`);
        const result = testFunction();
        console.log(`✅ FALHOU (sem proteção): ${result}`);
        return false;
    } catch (error) {
        if (error.name.includes('Security') || 
            error.message.includes('not defined') ||
            error.message.includes('disabled') ||
            error.message.includes('blocked')) {
            console.log(`🛡️ PROTEGIDO: ${error.message}`);
            return true;
        } else {
            console.log(`❓ Erro inesperado: ${error.message}`);
            return false;
        }
    }
}

// 📊 Contador de proteções ativas
let protectedCount = 0;
let totalTests = 0;

// 🧪 TESTE 1: ReferenceError - eval()
totalTests++;
if (runSecurityTest('ReferenceError - eval() bloqueado', () => {
    eval('console.log("FALHA DE SEGURANÇA")');
})) protectedCount++;

// 🧪 TESTE 2: ReferenceError - Function constructor
totalTests++;
if (runSecurityTest('ReferenceError - Function constructor bloqueado', () => {
    const func = new Function('return "FALHA DE SEGURANÇA"');
    return func();
})) protectedCount++;

// 🧪 TESTE 3: RangeError - Array gigante
totalTests++;
if (runSecurityTest('RangeError - Array muito grande', () => {
    const arr = new Array(999999);
    return arr.length;
})) protectedCount++;

// 🧪 TESTE 4: Download protection - Blob URL
totalTests++;
if (runSecurityTest('Download Protection - Blob URL', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    return url;
})) protectedCount++;

// 🧪 TESTE 5: Download protection - Link com download
totalTests++;
if (runSecurityTest('Download Protection - Link download', () => {
    const a = document.createElement('a');
    a.setAttribute('download', 'test.txt');
    return 'Link criado';
})) protectedCount++;

// 🧪 TESTE 6: Print protection
totalTests++;
if (runSecurityTest('Print Protection - window.print()', () => {
    window.print();
    return 'Print executado';
})) protectedCount++;

// 🧪 TESTE 7: Console protection (modificação)
totalTests++;
if (runSecurityTest('Console Protection - Redefinição', () => {
    window.console = { log: () => {} };
    return 'Console redefinido';
})) protectedCount++;

// 📊 RELATÓRIO FINAL
console.log('\n📊 RELATÓRIO DE TESTES DE SEGURANÇA');
console.log('=====================================');
console.log(`✅ Proteções ativas: ${protectedCount}/${totalTests}`);
console.log(`📈 Taxa de proteção: ${(protectedCount/totalTests*100).toFixed(1)}%`);

if (protectedCount === totalTests) {
    console.log('🛡️ TODAS AS PROTEÇÕES ESTÃO ATIVAS! ');
    console.log('🎉 Sistema de segurança funcionando perfeitamente!');
} else if (protectedCount > totalTests * 0.8) {
    console.log('⚠️ Maioria das proteções ativas, algumas podem precisar de ajuste');
} else {
    console.log('❌ Várias proteções não estão funcionando corretamente');
}

// 🔍 Verificar sistemas globais
console.log('\n🔍 VERIFICAÇÃO DE SISTEMAS GLOBAIS');
console.log('==================================');

if (window.portfolioSecurity) {
    console.log('✅ Portfolio Security ativo');
    console.log(`   - Violações detectadas: ${window.portfolioSecurity.getViolations()}`);
    console.log(`   - Sistema ativo: ${window.portfolioSecurity.isActive()}`);
} else {
    console.log('❌ Portfolio Security não encontrado');
}

if (window.antiDownloadProtection) {
    console.log('✅ Anti-Download Protection ativo');
    const stats = window.antiDownloadProtection.getProtectionStats();
    console.log(`   - Proteções ativas: ${stats.isActive}`);
    console.log(`   - Tentativas bloqueadas: ${stats.totalAttempts}`);
} else {
    console.log('❌ Anti-Download Protection não encontrado');
}

if (window.securityMonitor) {
    console.log('✅ Security Monitor ativo');
    const stats = window.securityMonitor.getStats();
    console.log(`   - Monitoramento ativo: ${stats.isMonitoring}`);
    console.log(`   - Violações totais: ${stats.totalViolations}`);
} else {
    console.log('❌ Security Monitor não encontrado');
}

console.log('\n🎓 TESTE COMPLETO - Gabriel Malheiros - FAESA 2025-2');
console.log('===================================================');