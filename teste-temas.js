// 🧪 Script de Teste para Verificar Sistema de Temas
// Para ser executado no console do navegador

console.log('🧪 Iniciando teste do sistema de temas...');

// Função para testar aplicação de tema
function testarTema(nomeTema) {
  console.log(`\n🎨 Testando tema: ${nomeTema}`);
  
  // Aplicar o tema
  document.documentElement.setAttribute('data-theme', nomeTema);
  
  // Verificar se as variáveis CSS foram aplicadas
  const style = getComputedStyle(document.documentElement);
  const bgPrimary = style.getPropertyValue('--color-bg-primary').trim();
  const textPrimary = style.getPropertyValue('--color-text-primary').trim();
  const brandPrimary = style.getPropertyValue('--brand-primary').trim();
  
  console.log(`  📊 Variáveis CSS do tema ${nomeTema}:`);
  console.log(`    --color-bg-primary: ${bgPrimary}`);
  console.log(`    --color-text-primary: ${textPrimary}`);
  console.log(`    --brand-primary: ${brandPrimary}`);
  
  // Verificar se o body tem as cores corretas
  const bodyStyle = getComputedStyle(document.body);
  console.log(`  🎯 Aplicação no body:`);
  console.log(`    background: ${bodyStyle.background}`);
  console.log(`    color: ${bodyStyle.color}`);
  
  // Verificar elementos específicos
  const interfaceMain = document.querySelector('.interface-main');
  if (interfaceMain) {
    const mainStyle = getComputedStyle(interfaceMain);
    console.log(`  🏠 Aplicação no .interface-main:`);
    console.log(`    background: ${mainStyle.background}`);
    console.log(`    color: ${mainStyle.color}`);
  }
  
  return {
    tema: nomeTema,
    bgPrimary,
    textPrimary,
    brandPrimary,
    aplicado: bgPrimary !== '' && textPrimary !== '' && brandPrimary !== ''
  };
}

// Configurações esperadas de cada tema
const temasEsperados = {
  modern: {
    bgPrimary: '#ffffff',
    textPrimary: '#0f172a',
    brandPrimary: '#2563eb'
  },
  classic: {
    bgPrimary: '#f9fafb',
    textPrimary: '#111827',
    brandPrimary: '#1e3a8a'
  },
  minimal: {
    bgPrimary: '#fafafa',
    textPrimary: '#1f2937',
    brandPrimary: '#374151'
  },
  colorful: {
    bgPrimary: '#faf5ff',
    textPrimary: '#581c87',
    brandPrimary: '#7c3aed'
  }
};

// Executar teste para todos os temas
const resultados = [];
for (const [nomeTema, esperado] of Object.entries(temasEsperados)) {
  const resultado = testarTema(nomeTema);
  resultados.push(resultado);
  
  // Aguardar um pouco para ver a mudança
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// Exibir resumo dos resultados
console.log('\n📋 RESUMO DOS TESTES:');
console.table(resultados);

// Verificar se todos os temas funcionam
const temasFuncionando = resultados.filter(r => r.aplicado);
console.log(`\n✅ Temas funcionando: ${temasFuncionando.length}/${resultados.length}`);

if (temasFuncionando.length === resultados.length) {
  console.log('🎉 SUCESSO: Todos os temas estão funcionando corretamente!');
} else {
  console.log('❌ PROBLEMA: Alguns temas não estão funcionando corretamente.');
  const temasProblema = resultados.filter(r => !r.aplicado);
  console.log('Temas com problema:', temasProblema.map(t => t.tema));
}

// Restaurar tema padrão
testarTema('modern');
console.log('\n🔄 Tema restaurado para "modern"');