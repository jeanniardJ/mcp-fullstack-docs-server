#!/usr/bin/env node

/**
 * Script pour télécharger la documentation HTML depuis le dépôt officiel MDN
 * Utilise le dépôt github.com/mdn/content au lieu de scraper le site web
 * Évite les blocages de Mozilla et garantit une source fiable
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs', 'html');
const TEMP_DIR = join(__dirname, '..', 'temp', 'mdn-content');

// 🎨 Système de statuts et de progression
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function logStatus(status, message, details = '') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const statusIcons = {
        'start': '🚀',
        'progress': '⏳',
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️',
        'warning': '⚠️'
    };
    
    const statusColors = {
        'start': colors.blue,
        'progress': colors.yellow,
        'success': colors.green,
        'error': colors.red,
        'info': colors.cyan,
        'warning': colors.magenta
    };
    
    const icon = statusIcons[status] || '📄';
    const color = statusColors[status] || colors.reset;
    
    console.log(`${color}[${timestamp}] ${icon} ${message}${colors.reset}${details ? ` ${details}` : ''}`);
}

function showProgress(current, total, item = '') {
    const percentage = Math.round((current / total) * 100);
    const barLength = 25;
    const filledLength = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    
    process.stdout.write(`\r${colors.cyan}Progress: [${bar}] ${percentage}% (${current}/${total})${colors.reset} ${item}`);
    if (current === total) console.log(''); // Nouvelle ligne à la fin
}

/**
 * Clone ou met à jour le dépôt MDN
 */
function cloneMdnRepo() {
    logStatus('start', 'Téléchargement du dépôt MDN officiel...');
    
    try {
        if (existsSync(TEMP_DIR)) {
            logStatus('info', 'Mise à jour du dépôt existant...');
            execSync('git pull origin main', { 
                cwd: TEMP_DIR, 
                stdio: 'pipe' 
            });
        } else {
            logStatus('info', 'Clone du dépôt MDN (shallow clone)...');
            mkdirSync(dirname(TEMP_DIR), { recursive: true });
            
            // Clone shallow pour économiser l'espace (sans l'historique git)
            execSync(`git clone --depth 1 https://github.com/mdn/content.git "${TEMP_DIR}"`, {
                stdio: 'pipe'
            });
        }
        
        logStatus('success', 'Dépôt MDN téléchargé avec succès');
        return true;
    } catch (error) {
        logStatus('error', `Erreur lors du téléchargement: ${error.message}`);
        return false;
    }
}

/**
 * Convertit un fichier MDN Markdown en notre format
 */
function convertMdnFile(filePath, category) {
    try {
        const content = readFileSync(filePath, 'utf-8');
        const fileName = basename(filePath, '.md');
        
        // Extraire le titre du fichier
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : fileName;
        
        // Nettoyer le contenu
        let cleanContent = content
            // Supprimer les métadonnées YAML
            .replace(/^---[\s\S]*?---\n/m, '')
            // Supprimer les directives spéciales MDN
            .replace(/{{[^}]+}}/g, '')
            .replace(/\[([^\]]+)\]\(\{\{[^}]+\}\}\)/g, '$1')
            // Nettoyer les liens relatifs
            .replace(/\]\(\/([^)]+)\)/g, '](https://developer.mozilla.org/$1)')
            .trim();
        
        // Ajouter notre en-tête
        const header = `# ${title}

> **Source MDN:** [Documentation officielle](https://developer.mozilla.org/en-US/docs/Web/HTML/)  
> **Catégorie:** ${category}  
> **Type:** Documentation HTML5 officielle  
> **Dépôt:** [mdn/content](https://github.com/mdn/content)

---

`;

        // Note de source
        const footer = `

---

## 📚 À propos de cette documentation

Cette documentation provient du **dépôt officiel MDN** (Mozilla Developer Network).

- **Source:** Dépôt GitHub [mdn/content](https://github.com/mdn/content)
- **Mise à jour:** ${new Date().toLocaleDateString('fr-FR')}
- **Licence:** CC-BY-SA 2.5

> **💡 Conseil:** Cette documentation est synchronisée avec les sources officielles MDN.
> Pour la version interactive complète, consultez [developer.mozilla.org](https://developer.mozilla.org).

`;

        return header + cleanContent + footer;
    } catch (error) {
        logStatus('error', `Erreur lors de la conversion: ${error.message}`);
        return null;
    }
}

/**
 * Parcourt les fichiers HTML du dépôt MDN
 */
function processHtmlDocs() {
    const mdnHtmlPath = join(TEMP_DIR, 'files', 'en-us', 'web', 'html');
    
    if (!existsSync(mdnHtmlPath)) {
        logStatus('error', 'Dossier HTML non trouvé dans le dépôt MDN');
        return [];
    }
    
    const categories = {
        'element': 'elements',
        'attributes': 'attributes',
        'global_attributes': 'attributes',
        'reference': 'reference',
        'guide': 'guides'
    };
    
    const processedFiles = [];
    
    function processDirectory(dirPath, category = 'guides') {
        if (!existsSync(dirPath)) return;
        
        const items = readdirSync(dirPath);
        
        for (const item of items) {
            const itemPath = join(dirPath, item);
            const stat = statSync(itemPath);
            
            if (stat.isDirectory()) {
                // Déterminer la catégorie basée sur le nom du dossier
                const folderCategory = categories[item.toLowerCase()] || item.toLowerCase();
                processDirectory(itemPath, folderCategory);
            } else if (item.endsWith('.md') && item !== 'index.md') {
                // Traiter le fichier Markdown
                const convertedContent = convertMdnFile(itemPath, category);
                
                if (convertedContent) {
                    const outputDir = join(DOCS_DIR, category);
                    if (!existsSync(outputDir)) {
                        mkdirSync(outputDir, { recursive: true });
                    }
                    
                    const outputFile = join(outputDir, item);
                    writeFileSync(outputFile, convertedContent);
                    processedFiles.push({
                        original: itemPath,
                        output: outputFile,
                        category: category,
                        title: basename(item, '.md')
                    });
                }
            }
        }
    }
    
    logStatus('progress', 'Traitement des fichiers HTML du dépôt...');
    processDirectory(mdnHtmlPath);
    
    return processedFiles;
}

/**
 * Crée des fichiers de documentation HTML de base
 */
function createBasicHtmlDocs() {
    logStatus('info', 'Création de la documentation HTML de base...');
    
    const basicDocs = [
        {
            category: 'elements',
            name: 'html-elements-basics.md',
            title: 'Éléments HTML de base',
            content: `# Éléments HTML de base

Les éléments HTML forment la structure de base de toute page web.

## Éléments de structure

### \`<html>\`
L'élément racine qui contient tout le contenu de la page.

### \`<head>\`
Contient les métadonnées de la page (titre, liens vers CSS, etc.).

### \`<body>\`
Contient le contenu visible de la page.

## Éléments de texte

### \`<h1>\` à \`<h6>\`
Titres hiérarchiques, \`<h1>\` étant le plus important.

### \`<p>\`
Paragraphes de texte.

### \`<a>\`
Liens hypertexte avec l'attribut \`href\`.

### \`<strong>\` et \`<em>\`
Texte important (\`<strong>\`) et emphase (\`<em>\`).

## Éléments de liste

### \`<ul>\` et \`<ol>\`
Listes non ordonnées et ordonnées.

### \`<li>\`
Éléments de liste.

## Exemple de base

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ma page</title>
</head>
<body>
    <h1>Titre principal</h1>
    <p>Un paragraphe avec un <a href="#">lien</a>.</p>
    <ul>
        <li>Premier élément</li>
        <li>Deuxième élément</li>
    </ul>
</body>
</html>
\`\`\`
`
        },
        {
            category: 'forms',
            name: 'html-forms-basics.md',
            title: 'Formulaires HTML',
            content: `# Formulaires HTML

Les formulaires permettent aux utilisateurs d'interagir avec votre site.

## Élément \`<form>\`

\`\`\`html
<form action="/submit" method="POST">
    <!-- Contenu du formulaire -->
</form>
\`\`\`

## Champs de saisie

### \`<input>\`
Champ de saisie polyvalent avec différents types :

\`\`\`html
<input type="text" name="nom" placeholder="Votre nom">
<input type="email" name="email" required>
<input type="password" name="motdepasse">
<input type="submit" value="Envoyer">
\`\`\`

### \`<textarea>\`
Zone de texte multi-lignes :

\`\`\`html
<textarea name="message" rows="4" cols="50">
Votre message...
</textarea>
\`\`\`

### \`<select>\`
Liste déroulante :

\`\`\`html
<select name="pays">
    <option value="fr">France</option>
    <option value="be">Belgique</option>
    <option value="ch">Suisse</option>
</select>
\`\`\`

## Validation

### Attributs de validation
- \`required\` : Champ obligatoire
- \`pattern\` : Expression régulière
- \`min\`, \`max\` : Valeurs min/max
- \`minlength\`, \`maxlength\` : Longueur du texte

\`\`\`html
<input type="email" required pattern="[^@]+@[^@]+\\.[a-zA-Z]{2,}">
\`\`\`
`
        },
        {
            category: 'semantic',
            name: 'html-semantic-elements.md',
            title: 'Éléments sémantiques HTML5',
            content: `# Éléments sémantiques HTML5

HTML5 introduit des éléments sémantiques qui donnent du sens au contenu.

## Structure de page

### \`<header>\`
En-tête de page ou de section.

### \`<nav>\`
Navigation principale.

### \`<main>\`
Contenu principal de la page (unique).

### \`<section>\`
Section thématique du contenu.

### \`<article>\`
Contenu autonome et réutilisable.

### \`<aside>\`
Contenu complémentaire (sidebar).

### \`<footer>\`
Pied de page ou de section.

## Exemple de structure

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Structure sémantique</title>
</head>
<body>
    <header>
        <h1>Mon site</h1>
        <nav>
            <ul>
                <li><a href="#accueil">Accueil</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>Actualités</h2>
            <article>
                <h3>Titre de l'article</h3>
                <p>Contenu de l'article...</p>
            </article>
        </section>
        
        <aside>
            <h3>À propos</h3>
            <p>Informations complémentaires...</p>
        </aside>
    </main>
    
    <footer>
        <p>&copy; 2025 Mon site</p>
    </footer>
</body>
</html>
\`\`\`

## Avantages

- **SEO amélioré** : Les moteurs de recherche comprennent mieux
- **Accessibilité** : Meilleure navigation pour les lecteurs d'écran
- **Maintenance** : Code plus lisible et organisé
`
        }
    ];
    
    for (const doc of basicDocs) {
        const categoryDir = join(DOCS_DIR, doc.category);
        if (!existsSync(categoryDir)) {
            mkdirSync(categoryDir, { recursive: true });
        }
        
        const header = `# ${doc.title}

> **Source:** Documentation créée pour le serveur MCP  
> **Catégorie:** ${doc.category}  
> **Type:** Guide HTML5

---

`;

        const footer = `

---

## 📚 Complément

Cette documentation est un guide de base. Pour une référence complète :
- [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTML)
- [W3C HTML Specification](https://www.w3.org/TR/html52/)

---
*Documentation générée le ${new Date().toLocaleDateString('fr-FR')}*
`;

        const fullContent = header + doc.content + footer;
        const filePath = join(categoryDir, doc.name);
        writeFileSync(filePath, fullContent);
    }
    
    return basicDocs.length;
}

/**
 * Fonction principale
 */
async function downloadHtmlDocs() {
    logStatus('start', 'Téléchargement de la documentation HTML depuis le dépôt officiel MDN...');
    
    // Créer le dossier de destination
    if (!existsSync(DOCS_DIR)) {
        mkdirSync(DOCS_DIR, { recursive: true });
    }
    
    // Étape 1: Télécharger le dépôt MDN
    const repoSuccess = cloneMdnRepo();
    let processedFiles = [];
    
    if (repoSuccess) {
        // Étape 2: Traiter les fichiers du dépôt
        processedFiles = processHtmlDocs();
        logStatus('success', `${processedFiles.length} fichiers traités depuis le dépôt MDN`);
    } else {
        logStatus('warning', 'Impossible de télécharger le dépôt, création de documentation de base...');
    }
    
    // Étape 3: Créer la documentation de base
    const basicDocsCount = createBasicHtmlDocs();
    logStatus('success', `${basicDocsCount} fichiers de documentation de base créés`);
    
    // Étape 4: Créer le fichier de résumé
    const summaryPath = join(DOCS_DIR, 'README.md');
    const categories = [...new Set([
        ...processedFiles.map(f => f.category),
        'elements', 'forms', 'semantic'
    ])];
    
    const summaryContent = `# Documentation HTML5

Documentation HTML5 combinant les sources officielles MDN et des guides pratiques.

## 📊 Statistiques
- **Fichiers du dépôt MDN:** ${processedFiles.length}
- **Guides créés:** ${basicDocsCount}
- **Total:** ${processedFiles.length + basicDocsCount}

## 📚 Catégories disponibles

${categories.map(cat => `- **${cat}** - Documentation ${cat === 'elements' ? 'des éléments' : cat === 'forms' ? 'des formulaires' : cat === 'semantic' ? 'sémantique' : cat}`).join('\n')}

## 🌐 Sources

- **Dépôt officiel:** [mdn/content](https://github.com/mdn/content)
- **Documentation en ligne:** [developer.mozilla.org](https://developer.mozilla.org)
- **Guides pratiques:** Créés spécialement pour ce serveur MCP

## 📖 Utilisation MCP

Cette documentation est accessible via :
- \`mcp_fullstack-doc_search_docs\` avec technology="html"
- \`mcp_fullstack-doc_get_categories\` pour technology="html"

---
*Documentation générée automatiquement le ${new Date().toLocaleString('fr-FR')}*
`;
    
    writeFileSync(summaryPath, summaryContent);
    
    console.log(`\n🎉 Documentation HTML terminée !`);
    console.log(`📊 Résultat: ${processedFiles.length} fichiers MDN + ${basicDocsCount} guides`);
    console.log(`📁 Documentation disponible dans: docs/html/`);
    
    return {
        mdnFiles: processedFiles.length,
        basicFiles: basicDocsCount,
        totalFiles: processedFiles.length + basicDocsCount
    };
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    downloadHtmlDocs().catch(console.error);
}

export { downloadHtmlDocs };
