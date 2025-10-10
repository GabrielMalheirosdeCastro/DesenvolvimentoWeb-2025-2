# Script de Deploy Automático para desenvolvimento-web-2025-2.vercel.app

Write-Host "🚀 Iniciando deploy para desenvolvimento-web-2025-2.vercel.app..." -ForegroundColor Cyan

# 1. Verificar se estamos na pasta correta
if (!(Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute na pasta raiz do projeto" -ForegroundColor Red
    exit 1
}

# 2. Instalar dependências se necessário
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow
npm ci

# 3. Fazer build do projeto
Write-Host "🔨 Criando build de produção..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build!" -ForegroundColor Red
    exit 1
}

# 4. Commit e push das mudanças
Write-Host "📤 Enviando alterações para GitHub..." -ForegroundColor Yellow
git add .
git commit -m "feat: atualização automática $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin main

# 5. Deploy para GitHub Pages
Write-Host "🌐 Fazendo deploy para GitHub Pages..." -ForegroundColor Yellow
npm run deploy:github

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 Site disponível em: https://desenvolvimento-web-2025-2.vercel.app" -ForegroundColor Cyan
Write-Host "📁 GitHub Pages: https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2" -ForegroundColor Cyan
Write-Host "⏰ Aguarde 2-10 minutos para propagação DNS" -ForegroundColor Yellow
