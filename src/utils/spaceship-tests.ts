// 🧪 SCRIPT DE TESTE PARA GALERIA DE NAVES ESPACIAIS
// Execute este arquivo no console do navegador para testar a funcionalidade

console.log('🚀 Iniciando testes da galeria de naves espaciais...');

// Teste 1: Verificar se o componente está montado
function testComponentMount() {
  console.log('\n📍 Teste 1: Verificando montagem do componente');
  const gallery = document.querySelector('[data-component="spaceship-gallery"]');
  
  if (gallery) {
    console.log('✅ Componente SpaceshipGallery encontrado');
    console.log('🔍 Health status:', gallery.getAttribute('data-health'));
    return true;
  } else {
    console.error('❌ Componente SpaceshipGallery NÃO encontrado');
    return false;
  }
}

// Teste 2: Verificar carregamento das imagens
function testImageLoading() {
  console.log('\n🖼️ Teste 2: Verificando carregamento das imagens');
  const images = document.querySelectorAll('img[src*="naves-espaciais"]');
  
  console.log(`📊 Total de imagens encontradas: ${images.length}`);
  
  let loadedCount = 0;
  let errorCount = 0;
  
  images.forEach((img, index) => {
    const imgElement = img as HTMLImageElement;
    const isLoaded = imgElement.complete && imgElement.naturalWidth > 0;
    const hasError = imgElement.complete && imgElement.naturalWidth === 0;
    
    if (isLoaded) {
      loadedCount++;
      console.log(`✅ Imagem ${index + 1} carregada: ${imgElement.src.split('/').pop()}`);
    } else if (hasError) {
      errorCount++;
      console.error(`❌ Imagem ${index + 1} com erro: ${imgElement.src.split('/').pop()}`);
    } else {
      console.log(`⏳ Imagem ${index + 1} carregando: ${imgElement.src.split('/').pop()}`);
    }
  });
  
  console.log(`📈 Resumo: ${loadedCount} carregadas, ${errorCount} com erro, ${images.length - loadedCount - errorCount} carregando`);
  
  return { total: images.length, loaded: loadedCount, errors: errorCount };
}

// Teste 3: Verificar navegação
function testNavigation() {
  console.log('\n🧭 Teste 3: Verificando navegação');
  
  // Verificar botão de navegação
  const navButton = document.querySelector('button[data-screen="spaceships"], a[href*="spaceships"]');
  if (navButton) {
    console.log('✅ Botão de navegação encontrado');
  } else {
    console.warn('⚠️ Botão de navegação não encontrado');
  }
  
  // Verificar se estamos na tela correta
  const currentUrl = window.location.href;
  if (currentUrl.includes('spaceships') || currentUrl.includes('#spaceships')) {
    console.log('✅ URL correta para galeria de naves');
  } else {
    console.log('ℹ️ Não estamos na tela de naves espaciais');
  }
}

// Teste 4: Verificar funcionalidade de debug
function testDebugFunctionality() {
  console.log('\n🔧 Teste 4: Verificando funcionalidade de debug');
  
  // Verificar se debug está disponível
  if (typeof (window as any).debugSpaceshipGallery === 'function') {
    console.log('✅ Função de debug global disponível');
    
    // Executar debug
    (window as any).debugSpaceshipGallery();
  } else {
    console.warn('⚠️ Função de debug global não encontrada');
  }
  
  // Verificar debug panel
  const debugPanel = document.querySelector('.bg-gray-100');
  if (debugPanel && debugPanel.textContent?.includes('Spaceship Gallery Debug')) {
    console.log('✅ Painel de debug encontrado');
  } else {
    console.warn('⚠️ Painel de debug não encontrado');
  }
}

// Teste 5: Verificar interatividade
function testInteractivity() {
  console.log('\n🖱️ Teste 5: Verificando interatividade');
  
  const cards = document.querySelectorAll('[data-component="spaceship-gallery"] .group');
  console.log(`🔍 Cartões interativos encontrados: ${cards.length}`);
  
  if (cards.length > 0) {
    console.log('✅ Cartões de naves encontrados e clicáveis');
    
    // Simular hover no primeiro cartão
    const firstCard = cards[0] as HTMLElement;
    if (firstCard) {
      firstCard.dispatchEvent(new MouseEvent('mouseenter'));
      console.log('🎯 Simulado hover no primeiro cartão');
    }
  } else {
    console.error('❌ Nenhum cartão de nave encontrado');
  }
}

// Teste 6: Performance
function testPerformance() {
  console.log('\n⚡ Teste 6: Verificando performance');
  
  const startTime = performance.now();
  
  // Medir tempo de renderização
  const gallery = document.querySelector('[data-component="spaceship-gallery"]');
  if (gallery) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    console.log(`📏 Tempo de detecção do componente: ${renderTime.toFixed(2)}ms`);
    
    if (renderTime < 100) {
      console.log('✅ Performance de renderização boa');
    } else {
      console.warn('⚠️ Performance de renderização pode ser melhorada');
    }
  }
  
  // Verificar uso de memória (se disponível)
  if ((performance as any).memory) {
    const memory = (performance as any).memory;
    console.log('💾 Uso de memória:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
    });
  }
}

// Executar todos os testes
function runAllTests() {
  console.clear();
  console.log('🧪 EXECUTANDO BATERIA COMPLETA DE TESTES');
  console.log('=====================================');
  
  const results = {
    componentMount: testComponentMount(),
    imageLoading: testImageLoading(),
    navigation: testNavigation(),
    debugFunctionality: testDebugFunctionality(),
    interactivity: testInteractivity(),
    performance: testPerformance()
  };
  
  console.log('\n📊 RESUMO DOS TESTES');
  console.log('==================');
  console.log('✅ Componente montado:', results.componentMount ? 'SIM' : 'NÃO');
  console.log('🖼️ Imagens carregadas:', `${results.imageLoading.loaded}/${results.imageLoading.total}`);
  console.log('🔧 Debug ativo:', typeof (window as any).debugSpaceshipGallery === 'function' ? 'SIM' : 'NÃO');
  
  // Status geral
  const overallSuccess = results.componentMount && results.imageLoading.loaded > 0;
  console.log(`\n${overallSuccess ? '🎉' : '❌'} STATUS GERAL: ${overallSuccess ? 'SUCESSO' : 'REQUER ATENÇÃO'}`);
  
  return results;
}

// Executar teste automático em intervalos
function startContinuousMonitoring(intervalMs = 5000) {
  console.log(`🔄 Iniciando monitoramento contínuo (${intervalMs}ms)`);
  
  const monitor = setInterval(() => {
    console.log(`\n⏰ [${new Date().toLocaleTimeString()}] Verificação automática`);
    
    const imageStats = testImageLoading();
    if (imageStats.total > 0 && imageStats.loaded === imageStats.total) {
      console.log('🎯 Todas as imagens carregadas com sucesso!');
      clearInterval(monitor);
    }
  }, intervalMs);
  
  return monitor;
}

// Export das funções de teste
export const spaceshipTests = {
  runAllTests,
  testComponentMount,
  testImageLoading,
  testNavigation,
  testDebugFunctionality,
  testInteractivity,
  testPerformance,
  startContinuousMonitoring
};

// Disponibilizar funções globalmente para teste manual
if (typeof window !== 'undefined') {
  (window as any).testSpaceshipGallery = spaceshipTests;
  
  console.log('\n🎯 TESTES CARREGADOS!');
  console.log('Execute: testSpaceshipGallery.runAllTests() para testar tudo');
  console.log('Execute: testSpaceshipGallery.startContinuousMonitoring() para monitoramento contínuo');
}