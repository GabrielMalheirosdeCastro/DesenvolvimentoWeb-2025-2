# 🚀 Script de Deploy com Navegação Externa
# Atualiza o projeto com as novas funcionalidades de setas laterais

Write-Host "🎯 Iniciando deploy com navegação externa..." -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script no diretório raiz do projeto" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

Write-Host "🔧 Fazendo build de produção..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    
    Write-Host "🔍 Funcionalidades implementadas:" -ForegroundColor Cyan
    Write-Host "  ✓ Seta esquerda: Voltar ao site anterior com segurança" -ForegroundColor White
    Write-Host "  ✓ Seta direita: Acesso direto à Galeria Figma" -ForegroundColor White
    Write-Host "  ✓ Botão Home: Voltar à página principal" -ForegroundColor White
    Write-Host "  ✓ Seção destacada da Galeria Figma na tela principal" -ForegroundColor White
    Write-Host "  ✓ Navegação segura entre sites" -ForegroundColor White
    
    Write-Host "🌐 URLs disponíveis:" -ForegroundColor Cyan
    Write-Host "  🏠 Local: http://localhost:3000" -ForegroundColor White
    Write-Host "  🚀 Vercel: https://desenvolvimento-web-2025-2.vercel.app" -ForegroundColor White
    Write-Host "  🔧 GitHub: https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎮 Para testar localmente:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "📤 Para fazer deploy:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'feat: adiciona navegação externa com setas laterais'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
    
} else {
    Write-Host "❌ Erro no build. Verifique os arquivos e tente novamente." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Deploy com navegação externa concluído!" -ForegroundColor Green