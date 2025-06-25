# Script de test du serveur MCP HTTP
Write-Host "🚀 Test du serveur MCP HTTP..." -ForegroundColor Green

# Démarrage du serveur en arrière-plan
Write-Host "Démarrage du serveur sur le port 3002..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock {
    Set-Location "f:\GitHub\JJA-DEV\Mcp_local\mcp-fullstack-docs-server"
    node build/http-server.js 3002
}

# Attendre un peu pour que le serveur démarre
Start-Sleep -Seconds 3

# Test des endpoints
Write-Host "`n🔍 Tests des endpoints..." -ForegroundColor Cyan

try {
    # Test de santé
    Write-Host "Test /health..." -ForegroundColor White
    $health = Invoke-RestMethod -Uri "http://localhost:3002/health" -Method Get
    Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
    
    # Test API technologies
    Write-Host "Test /api/technologies..." -ForegroundColor White
    $techs = Invoke-RestMethod -Uri "http://localhost:3002/api/technologies" -Method Get
    Write-Host "✅ Technologies: $($techs.content.Count) résultats" -ForegroundColor Green
    
    # Test recherche
    Write-Host "Test /api/search..." -ForegroundColor White
    $search = Invoke-RestMethod -Uri "http://localhost:3002/api/search?q=controller&tech=symfony" -Method Get
    Write-Host "✅ Recherche: $($search.content.Count) résultats" -ForegroundColor Green
    
    Write-Host "`n🎉 Tous les tests HTTP sont passés avec succès!" -ForegroundColor Green
    Write-Host "📡 Interface web: http://localhost:3002" -ForegroundColor Cyan
    Write-Host "🔧 Health check: http://localhost:3002/health" -ForegroundColor Cyan
    Write-Host "📡 Endpoint MCP: http://localhost:3002/mcp" -ForegroundColor Cyan
    
}
catch {
    Write-Host "❌ Erreur lors du test: $($_.Exception.Message)" -ForegroundColor Red
}

# Arrêt du serveur
Write-Host "`n🛑 Arrêt du serveur..." -ForegroundColor Yellow
Stop-Job $job
Remove-Job $job

Write-Host "✅ Test terminé!" -ForegroundColor Green
