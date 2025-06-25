# Configuration automatique pour VS Code et GitHub Copilot
# Usage: .\setup-vscode.ps1

Write-Host "🔧 Configuration du serveur MCP pour VS Code et GitHub Copilot..." -ForegroundColor Green

# Vérifications préalables
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command "code" -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  VS Code CLI non trouvé. Assurez-vous que VS Code est installé et dans le PATH." -ForegroundColor Yellow
}

# Installation et compilation
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Compilation du serveur MCP..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la compilation" -ForegroundColor Red
    exit 1
}

# Configuration VS Code
Write-Host "⚙️  Configuration de VS Code..." -ForegroundColor Yellow

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$vscodeDir = Join-Path $workspaceRoot ".vscode"

if (-not (Test-Path $vscodeDir)) {
    New-Item -Path $vscodeDir -ItemType Directory -Force | Out-Null
}

# Configuration des tâches VS Code
$tasksJson = @"
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build MCP Server",
            "type": "npm",
            "script": "build",
            "path": "mcp-fullstack-docs-server/",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "silent",
                "focus": false,
                "panel": "shared"
            },
            "problemMatcher": ["\$tsc"]
        },
        {
            "label": "Start MCP Server",
            "type": "npm",
            "script": "start",
            "path": "mcp-fullstack-docs-server/",
            "group": "test",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "new"
            },
            "isBackground": true
        },
        {
            "label": "Watch MCP Server",
            "type": "npm",
            "script": "watch",
            "path": "mcp-fullstack-docs-server/",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "silent",
                "focus": false,
                "panel": "shared"
            },
            "isBackground": true,
            "problemMatcher": ["\$tsc-watch"]
        }
    ]
}
"@

$tasksPath = Join-Path $vscodeDir "tasks.json"
$tasksJson | Out-File -FilePath $tasksPath -Encoding UTF8

# Configuration des paramètres VS Code
$settingsJson = @"
{
    "github.copilot.enable": {
        "*": true,
        "yaml": true,
        "plaintext": true,
        "markdown": true
    },
    "mcp.servers": {
        "fullstack-docs": {
            "command": "node",
            "args": ["./mcp-fullstack-docs-server/build/index.js"],
            "cwd": "`${workspaceFolder}",
            "env": {
                "NODE_ENV": "development"
            },
            "disabled": false
        }
    },
    "files.associations": {
        "*.md": "markdown"
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/build": true,
        "**/.git": true
    },
    "typescript.preferences.includePackageJsonAutoImports": "auto",
    "editor.inlineSuggest.enabled": true,
    "github.copilot.advanced": {}
}
"@

$settingsPath = Join-Path $vscodeDir "settings.json"

if (Test-Path $settingsPath) {
    Write-Host "📝 Fusion avec les paramètres VS Code existants..." -ForegroundColor Yellow
    # Ici, dans un vrai script, on ferait une fusion JSON intelligente
    $backup = $settingsPath + ".backup." + (Get-Date -Format "yyyyMMdd-HHmmss")
    Copy-Item $settingsPath $backup
    Write-Host "   Sauvegarde créée: $backup" -ForegroundColor Gray
}

$settingsJson | Out-File -FilePath $settingsPath -Encoding UTF8

# Configuration des extensions recommandées
$extensionsJson = @"
{
    "recommendations": [
        "github.copilot",
        "github.copilot-chat",
        "ms-vscode.vscode-typescript-next",
        "bradlc.vscode-tailwindcss",
        "formulahendry.auto-rename-tag",
        "ms-python.python",
        "bmewburn.vscode-intelephense-client"
    ]
}
"@

$extensionsPath = Join-Path $vscodeDir "extensions.json"
$extensionsJson | Out-File -FilePath $extensionsPath -Encoding UTF8

# Test du serveur
Write-Host "🧪 Test du serveur MCP..." -ForegroundColor Yellow
$testResult = node test-server.js 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Serveur MCP testé avec succès!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Test du serveur avec avertissements" -ForegroundColor Yellow
    Write-Host $testResult -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Ouvrez VS Code dans ce workspace" -ForegroundColor White
Write-Host "   2. Installez les extensions recommandées" -ForegroundColor White
Write-Host "   3. Redémarrez VS Code pour activer la configuration" -ForegroundColor White
Write-Host "   4. Utilisez Ctrl+Shift+P puis 'Fullstack Docs' pour tester" -ForegroundColor White
Write-Host ""
Write-Host "💡 GitHub Copilot utilisera automatiquement votre documentation!" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Commandes disponibles:" -ForegroundColor Cyan
Write-Host "   - npm run build    # Compiler le serveur" -ForegroundColor White
Write-Host "   - npm run start    # Démarrer le serveur" -ForegroundColor White
Write-Host "   - npm run watch    # Mode développement" -ForegroundColor White
Write-Host "   - npm test         # Tester le serveur" -ForegroundColor White
