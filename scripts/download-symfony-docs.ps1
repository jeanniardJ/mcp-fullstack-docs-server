# Script PowerShell pour télécharger la documentation Symfony
# Compatible Windows, utilise PowerShell natif

param(
    [string]$Version = "7.1",
    [switch]$Force
)

Write-Host "📥 Téléchargement de la documentation Symfony $Version..." -ForegroundColor Green

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DocsDir = Join-Path $ScriptDir "..\docs\symfony"

# Créer les dossiers
if (-not (Test-Path $DocsDir)) {
    New-Item -ItemType Directory -Path $DocsDir -Force | Out-Null
}

# URLs des fichiers de documentation principaux
$DocPages = @(
    @{
        Url      = "https://raw.githubusercontent.com/symfony/symfony-docs/$Version/controller.rst"
        Category = "controller"
        Name     = "controllers-official.md"
    },
    @{
        Url      = "https://raw.githubusercontent.com/symfony/symfony-docs/$Version/routing.rst"
        Category = "routing" 
        Name     = "routing-official.md"
    },
    @{
        Url      = "https://raw.githubusercontent.com/symfony/symfony-docs/$Version/forms.rst"
        Category = "forms"
        Name     = "forms-official.md"
    },
    @{
        Url      = "https://raw.githubusercontent.com/symfony/symfony-docs/$Version/security.rst"
        Category = "security"
        Name     = "security-official.md"
    },
    @{
        Url      = "https://raw.githubusercontent.com/symfony/symfony-docs/$Version/cache.rst"
        Category = "cache"
        Name     = "cache-official.md"
    },
    @{
        Url      = "https://raw.githubusercontent.com/symfony/symfony-docs/$Version/service_container.rst"
        Category = "services"
        Name     = "services-official.md"
    }
)

function Convert-RstToMarkdown {
    param([string]$Content, [string]$FileName)
    
    $markdown = $Content
    
    # Titres RST vers Markdown
    $markdown = $markdown -replace "^(.+)`n={3,}$", "# `$1" -replace "`n", "`n"
    $markdown = $markdown -replace "^(.+)`n-{3,}$", "## `$1"
    $markdown = $markdown -replace "^(.+)`n~{3,}$", "### `$1"
    
    # Blocs de code
    $markdown = $markdown -replace "\.\. code-block:: (\w+)`n`n((?:    .+`n?)*)", {
        param($match)
        $lang = $match.Groups[1].Value
        $code = $match.Groups[2].Value -replace "^    ", "" -replace "`n    ", "`n"
        return "``````$lang`n$code```````n"
    }
    
    # Liens
    $markdown = $markdown -replace "``([^``]+) <([^>]+)>``_", "[$1]($2)"
    
    # Notes et avertissements
    $markdown = $markdown -replace "\.\. note::`n`n((?:    .+`n?)*)", {
        param($match)
        $note = $match.Groups[1].Value -replace "^    ", "" -replace "`n    ", "`n"
        return "> **📝 Note:**`n> $note`n"
    }
    
    $markdown = $markdown -replace "\.\. warning::`n`n((?:    .+`n?)*)", {
        param($match)
        $warning = $match.Groups[1].Value -replace "^    ", "" -replace "`n    ", "`n"
        return "> **⚠️ Attention:**`n> $warning`n"
    }
    
    # En-tête
    $header = @"
# $($FileName -replace '\.md$', '') - Documentation Symfony

> Source: Documentation officielle Symfony $Version
> Téléchargé le $(Get-Date -Format 'dd/MM/yyyy')

---

"@
    
    return $header + $markdown
}

foreach ($doc in $DocPages) {
    Write-Host "📄 Téléchargement: $($doc.Name)..." -ForegroundColor Blue
    
    $categoryDir = Join-Path $DocsDir $doc.Category
    if (-not (Test-Path $categoryDir)) {
        New-Item -ItemType Directory -Path $categoryDir -Force | Out-Null
    }
    
    $filePath = Join-Path $categoryDir $doc.Name
    
    if ((Test-Path $filePath) -and -not $Force) {
        Write-Host "  ⏭️ Fichier existant (utilisez -Force pour remplacer)" -ForegroundColor Yellow
        continue
    }
    
    try {
        # Télécharger avec Invoke-WebRequest
        $response = Invoke-WebRequest -Uri $doc.Url -UseBasicParsing
        
        if ($response.StatusCode -eq 200 -and $response.Content.Length -gt 100) {
            $markdown = Convert-RstToMarkdown -Content $response.Content -FileName $doc.Name
            $markdown | Out-File -FilePath $filePath -Encoding UTF8
            Write-Host "  ✅ $($doc.Name) téléchargé" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️ Contenu vide ou erreur HTTP" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "  ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n✅ Téléchargement terminé!" -ForegroundColor Green
Write-Host "📁 Fichiers disponibles dans: $DocsDir" -ForegroundColor Cyan

# Optionnel: Reconstruire le projet
$ProjectDir = Join-Path $ScriptDir ".."
if (Test-Path (Join-Path $ProjectDir "package.json")) {
    Write-Host "`n🔧 Reconstruction du projet..." -ForegroundColor Yellow
    Push-Location $ProjectDir
    try {
        & npm run build
        Write-Host "✅ Projet reconstruit" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Erreur lors de la reconstruction: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    finally {
        Pop-Location
    }
}

Write-Host "`n🎉 Documentation Symfony prête à être utilisée avec le serveur MCP!" -ForegroundColor Magenta
