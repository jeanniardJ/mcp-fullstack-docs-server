# Script PowerShell pour télécharger toute la documentation
# Compatible Windows, télécharge Symfony, PHP, Doctrine, MySQL, JavaScript, CSS, HTML, Webpack

param(
    [switch]$Force,
    [switch]$SkipGit
)

Write-Host "🚀 Téléchargement complet de toutes les documentations..." -ForegroundColor Green

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DocsDir = Join-Path $ScriptDir "..\docs"
$TempDir = Join-Path $ScriptDir "..\temp"

# Configuration des sources
$DocumentationSources = @{
    symfony  = @{
        type   = "github"
        repo   = "symfony/symfony-docs"
        branch = "7.1"
        files  = @(
            @{ path = "controller.rst"; category = "controller"; name = "controller-official.md" },
            @{ path = "routing.rst"; category = "routing"; name = "routing-official.md" },
            @{ path = "forms.rst"; category = "forms"; name = "forms-official.md" },
            @{ path = "security.rst"; category = "security"; name = "security-official.md" },
            @{ path = "cache.rst"; category = "cache"; name = "cache-official.md" },
            @{ path = "service_container.rst"; category = "services"; name = "services-official.md" },
            @{ path = "validation.rst"; category = "validation"; name = "validation-official.md" },
            @{ path = "serializer.rst"; category = "serializer"; name = "serializer-official.md" },
            @{ path = "testing.rst"; category = "testing"; name = "testing-official.md" },
            @{ path = "console.rst"; category = "commands"; name = "console-official.md" },
            @{ path = "event_dispatcher.rst"; category = "events"; name = "events-official.md" },
            @{ path = "templating.rst"; category = "templates"; name = "templates-official.md" }
        )
    }
    
    doctrine = @{
        type   = "github"
        repo   = "doctrine/orm-documentation"
        branch = "3.0"
        files  = @(
            @{ path = "en/tutorials/getting-started.rst"; category = "getting-started"; name = "getting-started.md" },
            @{ path = "en/reference/basic-mapping.rst"; category = "entities"; name = "basic-mapping.md" },
            @{ path = "en/reference/association-mapping.rst"; category = "entities"; name = "associations.md" },
            @{ path = "en/reference/query-builder.rst"; category = "queries"; name = "query-builder.md" },
            @{ path = "en/reference/dql-doctrine-query-language.rst"; category = "queries"; name = "dql.md" },
            @{ path = "en/reference/working-with-objects.rst"; category = "orm"; name = "working-with-objects.md" }
        )
    }
    
    webpack  = @{
        type   = "github"
        repo   = "webpack/webpack.js.org"
        branch = "main"
        files  = @(
            @{ path = "src/content/concepts/index.mdx"; category = "concepts"; name = "concepts.md" },
            @{ path = "src/content/configuration/index.mdx"; category = "config"; name = "configuration.md" },
            @{ path = "src/content/loaders/index.mdx"; category = "loaders"; name = "loaders.md" },
            @{ path = "src/content/plugins/index.mdx"; category = "plugins"; name = "plugins.md" },
            @{ path = "src/content/guides/getting-started.mdx"; category = "getting-started"; name = "getting-started.md" }
        )
    }
}

# URLs directes pour les autres technologies
$DirectUrls = @{
    javascript = @(
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/functions/arrow_functions/index.md"; category = "syntax"; name = "arrow-functions.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/statements/async_function/index.md"; category = "async"; name = "async-functions.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/global_objects/promise/index.md"; category = "async"; name = "promises.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/statements/class/index.md"; category = "classes"; name = "classes.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/statements/import/index.md"; category = "modules"; name = "import.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/statements/export/index.md"; category = "modules"; name = "export.md" }
    )
    
    css        = @(
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/css_grid_layout/index.md"; category = "layout"; name = "grid-layout-mdn.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/css_flexible_box_layout/index.md"; category = "layout"; name = "flexbox-mdn.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/css_animations/index.md"; category = "animations"; name = "animations.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/css_transitions/index.md"; category = "animations"; name = "transitions.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/media_queries/index.md"; category = "responsive"; name = "media-queries.md" }
    )
    
    html       = @(
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/form/index.md"; category = "forms"; name = "forms.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/input/index.md"; category = "forms"; name = "input.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/canvas/index.md"; category = "graphics"; name = "canvas.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/element/video/index.md"; category = "media"; name = "video.md" },
        @{ url = "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/global_attributes/index.md"; category = "attributes"; name = "global-attributes.md" }
    )
}

function Convert-RstToMarkdown {
    param([string]$Content, [string]$FileName, [string]$Tech)
    
    $markdown = $Content
    
    # Conversions RST vers Markdown
    $markdown = $markdown -replace "^(.+)`n={3,}$", "# `$1"
    $markdown = $markdown -replace "^(.+)`n-{3,}$", "## `$1"
    $markdown = $markdown -replace "^(.+)`n~{3,}$", "### `$1"
    
    # Blocs de code RST
    $markdown = $markdown -replace "\.\. code-block:: (\w+)`n`n((?:    .+`n?)*)", {
        param($match)
        $lang = $match.Groups[1].Value
        $code = $match.Groups[2].Value -replace "^    ", "" -replace "`n    ", "`n"
        return "``````$lang`n$code```````n"
    }
    
    # Liens RST
    $markdown = $markdown -replace "``([^``]+) <([^>]+)>``_", "[$1]($2)"
    
    # Notes RST
    $markdown = $markdown -replace "\.\. note::`n`n((?:    .+`n?)*)", {
        param($match)
        $note = $match.Groups[1].Value -replace "^    ", "" -replace "`n    ", "`n"
        return "> **📝 Note:**`n> $note`n"
    }
    
    # En-tête
    $header = @"
# $($FileName -replace '\.md$', '') - Documentation $($Tech.ToUpper())

> Source: Documentation officielle $Tech
> Téléchargé le $(Get-Date -Format 'dd/MM/yyyy')

---

"@
    
    return $header + $markdown
}

function Download-FromGitHub {
    param($Tech, $Config, $TechDir)
    
    if ($SkipGit) {
        Write-Host "  ⏭️ Git ignoré pour $Tech" -ForegroundColor Yellow
        return
    }
    
    $repoDir = Join-Path $TempDir $Tech
    
    Write-Host "📥 Clonage de $($Config.repo)..." -ForegroundColor Blue
    
    try {
        & git clone --depth 1 --branch $Config.branch "https://github.com/$($Config.repo).git" $repoDir
        
        foreach ($file in $Config.files) {
            $sourcePath = Join-Path $repoDir $file.path
            if (Test-Path $sourcePath) {
                $content = Get-Content -Path $sourcePath -Raw -Encoding UTF8
                $markdown = Convert-RstToMarkdown -Content $content -FileName $file.name -Tech $Tech
                
                $categoryDir = Join-Path $TechDir $file.category
                if (-not (Test-Path $categoryDir)) {
                    New-Item -ItemType Directory -Path $categoryDir -Force | Out-Null
                }
                
                $targetPath = Join-Path $categoryDir $file.name
                $markdown | Out-File -FilePath $targetPath -Encoding UTF8
                Write-Host "  ✅ $($file.name)" -ForegroundColor Green
            }
            else {
                Write-Host "  ⚠️ Fichier non trouvé: $($file.path)" -ForegroundColor Yellow
            }
        }
    }
    catch {
        Write-Host "  ❌ Erreur Git pour $Tech : $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Download-FromUrls {
    param($Tech, $Files, $TechDir)
    
    foreach ($file in $Files) {
        Write-Host "📄 Téléchargement: $($file.name)..." -ForegroundColor Blue
        
        try {
            $response = Invoke-WebRequest -Uri $file.url -UseBasicParsing
            
            if ($response.StatusCode -eq 200) {
                $markdown = Convert-RstToMarkdown -Content $response.Content -FileName $file.name -Tech $Tech
                
                $categoryDir = Join-Path $TechDir $file.category
                if (-not (Test-Path $categoryDir)) {
                    New-Item -ItemType Directory -Path $categoryDir -Force | Out-Null
                }
                
                $targetPath = Join-Path $categoryDir $file.name
                $markdown | Out-File -FilePath $targetPath -Encoding UTF8
                Write-Host "  ✅ $($file.name)" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "  ❌ Erreur pour $($file.name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Créer les dossiers
if (-not (Test-Path $DocsDir)) {
    New-Item -ItemType Directory -Path $DocsDir -Force | Out-Null
}

if (Test-Path $TempDir) {
    if ($Force) {
        Write-Host "🧹 Nettoyage du dossier temporaire..." -ForegroundColor Yellow
        Remove-Item -Path $TempDir -Recurse -Force
    }
}

if (-not (Test-Path $TempDir)) {
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
}

# Télécharger depuis GitHub
foreach ($tech in $DocumentationSources.Keys) {
    Write-Host "`n📚 Téléchargement de la documentation $($tech.ToUpper())..." -ForegroundColor Magenta
    
    $techDir = Join-Path $DocsDir $tech
    if (-not (Test-Path $techDir)) {
        New-Item -ItemType Directory -Path $techDir -Force | Out-Null
    }
    
    Download-FromGitHub -Tech $tech -Config $DocumentationSources[$tech] -TechDir $techDir
}

# Télécharger depuis les URLs directes
foreach ($tech in $DirectUrls.Keys) {
    Write-Host "`n📚 Téléchargement de la documentation $($tech.ToUpper())..." -ForegroundColor Magenta
    
    $techDir = Join-Path $DocsDir $tech
    if (-not (Test-Path $techDir)) {
        New-Item -ItemType Directory -Path $techDir -Force | Out-Null
    }
    
    Download-FromUrls -Tech $tech -Files $DirectUrls[$tech] -TechDir $techDir
}

# Nettoyer
Write-Host "`n🧹 Nettoyage..." -ForegroundColor Yellow
if (Test-Path $TempDir) {
    Remove-Item -Path $TempDir -Recurse -Force
}

Write-Host "`n✅ Toutes les documentations ont été téléchargées!" -ForegroundColor Green
Write-Host "📁 Fichiers disponibles dans: $DocsDir" -ForegroundColor Cyan

# Reconstruire le projet
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

Write-Host "`n🎉 Documentation complète prête à être utilisée avec le serveur MCP!" -ForegroundColor Magenta
