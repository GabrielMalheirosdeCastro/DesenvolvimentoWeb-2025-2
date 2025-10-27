# 🔗 Script de Teste de Links - Laboratórios HTML
# Autor: Gabriel Malheiros de Castro | FAESA 2025

Write-Host "🔍 Testando Links dos Laboratórios..." -ForegroundColor Green

# URLs para testar
$urls = @(
    "http://localhost:4173/",
    "http://localhost:4173/lab-fundamentos-css.html",
    "http://localhost:4173/tipografia.html",
    "http://localhost:4173/lab-boxmodel.html",
    "http://localhost:4173/galeria-naves-espaciais.html"
)

Write-Host "📋 URLs a serem testadas:" -ForegroundColor Yellow
foreach ($url in $urls) {
    Write-Host "  • $url" -ForegroundColor Cyan
}

Write-Host "`n🚀 Iniciando servidor de preview..." -ForegroundColor Green
Write-Host "⚠️  IMPORTANTE: Deixe este terminal aberto para manter o servidor rodando!" -ForegroundColor Red

# Instruções
Write-Host "`n📝 Instruções de Teste:" -ForegroundColor Yellow
Write-Host "1. Este script iniciará o servidor automaticamente" -ForegroundColor White
Write-Host "2. Abra seu navegador e teste cada URL listada acima" -ForegroundColor White
Write-Host "3. Pressione Ctrl+C para parar o servidor quando terminar" -ForegroundColor White

Write-Host "`n✅ Resultado Esperado:" -ForegroundColor Green
Write-Host "• Página principal: Interface React funcionando" -ForegroundColor White
Write-Host "• lab-fundamentos-css.html: Laboratório 1 - Fundamentos CSS" -ForegroundColor White
Write-Host "• tipografia.html: Laboratório 2 - Tipografia e cores" -ForegroundColor White
Write-Host "• lab-boxmodel.html: Laboratório 3 - Box Model e espaçamentos" -ForegroundColor White
Write-Host "• galeria-naves-espaciais.html: Galeria de naves espaciais" -ForegroundColor White

Write-Host "`n🔧 Executando: npm run preview..." -ForegroundColor Blue

# Executar o preview
npm run preview