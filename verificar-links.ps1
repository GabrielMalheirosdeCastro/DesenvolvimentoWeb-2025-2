# 🔍 Script de Verificação de Links e Funcionalidades
# Gabriel Malheiros - FAESA 2025-2

Write-Host "🚀 Iniciando verificação completa do projeto..." -ForegroundColor Green

# Verificar se o servidor está rodando
Write-Host "`n📡 Verificando servidores..."

# URLs para testar
$urls = @(
    "http://localhost:3000/",
    "http://localhost:3000/?screen=figma",
    "http://localhost:3000/galeria-naves-espaciais.html",
    "http://localhost:3000/tipografia.html",
    "http://localhost:3000/lab-fundamentos-css.html",
    "http://localhost:4173/",
    "http://localhost:4173/?screen=figma",
    "http://localhost:4173/galeria-naves-espaciais.html"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $url - OK" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $url - Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ $url - Não acessível" -ForegroundColor Red
    }
}

Write-Host "`n📂 Verificando arquivos essenciais..."

# Arquivos para verificar
$files = @(
    "src/assets/dd18ec3bf35c35cc0e58cd61147ab94926272d3c.png",
    "src/assets/681ee2140d8a3dfb23dc398515d8e9539fb56338.png", 
    "src/assets/55baa85e8789d73e4e943d1a375f594add7941b3.png",
    "src/assets/df4077de47a65010f0db03b4bde4b1720336789e.png",
    "src/components/ui/naves-espaciais.tsx",
    "src/components/gallery/SpaceGallery.tsx",
    "src/data/spaceFleetData.ts",
    "public/galeria-naves-espaciais.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Write-Host "✅ $file - $([math]::Round($size/1KB, 2)) KB" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - Não encontrado" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Verificação completa!"
Write-Host "✅ React App: http://localhost:3000/" -ForegroundColor Cyan
Write-Host "✅ Galeria Figma: http://localhost:3000/?screen=figma" -ForegroundColor Cyan
Write-Host "✅ Build Preview: http://localhost:4173/" -ForegroundColor Cyan
Write-Host "✅ Galeria HTML: http://localhost:3000/galeria-naves-espaciais.html" -ForegroundColor Cyan

Write-Host "`n📝 Para testar:"
Write-Host "1. npm run dev (porta 3000)" -ForegroundColor Yellow
Write-Host "2. npm run build && npm run preview (porta 4173)" -ForegroundColor Yellow
Write-Host "3. Navegar para 'Galeria Figma' na barra inferior" -ForegroundColor Yellow
Write-Host "4. Verificar se mostra GALERIA ESPACIAL (não LEGO)" -ForegroundColor Yellow