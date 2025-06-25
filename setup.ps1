# Script de démarrage du serveur MCP Fullstack Docs
# Usage: .\setup.ps1

Write-Host "🚀 Configuration du serveur MCP Fullstack Documentation..." -ForegroundColor Green

# Vérification de Node.js
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Installation des dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

# Compilation TypeScript
Write-Host "🔨 Compilation du TypeScript..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la compilation" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Pour démarrer le serveur:" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "📚 Technologies supportées:" -ForegroundColor Cyan
Write-Host "   - Symfony 6.4" -ForegroundColor White
Write-Host "   - PHP 8.2" -ForegroundColor White
Write-Host "   - Doctrine 2.17" -ForegroundColor White
Write-Host "   - MySQL 8.0" -ForegroundColor White
Write-Host "   - JavaScript ES2023" -ForegroundColor White
Write-Host "   - HTML 5" -ForegroundColor White
Write-Host "   - CSS 3" -ForegroundColor White
Write-Host "   - Webpack 5.89" -ForegroundColor White
