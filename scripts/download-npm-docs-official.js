#!/usr/bin/env node

/**
 * Script pour télécharger la documentation NPM officielle depuis docs.npmjs.com
 * Utilise curl pour récupérer les pages HTML officielles et les convertir en Markdown
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs', 'npm');
const TEMP_DIR = join(__dirname, '..', 'temp', 'npm-html');

// 🎨 Système de statuts
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function logStatus(status, message) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const statusIcons = {
        'start': '🚀',
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️',
        'warning': '⚠️'
    };
    
    const statusColors = {
        'start': colors.blue,
        'success': colors.green,
        'error': colors.red,
        'info': colors.cyan,
        'warning': colors.yellow
    };
    
    const icon = statusIcons[status] || '📄';
    const color = statusColors[status] || colors.reset;
    
    console.log(`${color}[${timestamp}] ${icon} ${message}${colors.reset}`);
}

/**
 * Pages officielles NPM à télécharger
 */
const npmPages = [
    {
        url: 'https://docs.npmjs.com/cli/v10/commands/npm-install',
        category: 'commands',
        name: 'npm-install.md',
        title: 'npm install'
    },
    {
        url: 'https://docs.npmjs.com/cli/v10/commands/npm-init',
        category: 'commands', 
        name: 'npm-init.md',
        title: 'npm init'
    },
    {
        url: 'https://docs.npmjs.com/cli/v10/commands/npm-run-script',
        category: 'commands',
        name: 'npm-run-script.md',
        title: 'npm run-script'
    },
    {
        url: 'https://docs.npmjs.com/cli/v10/commands/npm-publish',
        category: 'publishing',
        name: 'npm-publish.md',
        title: 'npm publish'
    },
    {
        url: 'https://docs.npmjs.com/cli/v10/commands/npm-audit',
        category: 'security',
        name: 'npm-audit.md',
        title: 'npm audit'
    },
    {
        url: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json',
        category: 'package-json',
        name: 'package-json.md',
        title: 'package.json'
    },
    {
        url: 'https://docs.npmjs.com/cli/v10/using-npm/workspaces',
        category: 'workspaces',
        name: 'workspaces.md',
        title: 'workspaces'
    },
    {
        url: 'https://docs.npmjs.com/about-npm',
        category: 'basics',
        name: 'about-npm.md',
        title: 'About npm'
    }
];

/**
 * Convertit HTML en Markdown basique
 */
function htmlToMarkdown(html, title, url) {
    let markdown = html;
    
    // Extraire le contenu principal (entre les balises main ou article)
    const mainMatch = markdown.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || 
                     markdown.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                     markdown.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    
    if (mainMatch) {
        markdown = mainMatch[1];
    }
    
    // Supprimer les scripts et styles
    markdown = markdown.replace(/<script[\s\S]*?<\/script>/gi, '');
    markdown = markdown.replace(/<style[\s\S]*?<\/style>/gi, '');
    markdown = markdown.replace(/<nav[\s\S]*?<\/nav>/gi, '');
    markdown = markdown.replace(/<footer[\s\S]*?<\/footer>/gi, '');
    
    // Convertir les titres
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1');
    
    // Convertir les blocs de code
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```');
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    
    // Convertir les listes
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1');
    });
    
    markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1`);
    });
    
    // Convertir les liens
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // Convertir les paragraphes
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    
    // Convertir le gras et italique
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    
    // Supprimer toutes les autres balises HTML
    markdown = markdown.replace(/<[^>]*>/g, '');
    
    // Décoder les entités HTML
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");
    markdown = markdown.replace(/&nbsp;/g, ' ');
    
    // Nettoyer les espaces multiples et retours à la ligne
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.replace(/^\s+/gm, '');
    markdown = markdown.trim();
    
    // Ajouter l'en-tête
    const header = `# ${title}

> **Source:** [Documentation officielle NPM](${url})  
> **Type:** Documentation NPM officielle  
> **Version:** NPM 10.x

---

`;
    
    const footer = `

---

## 📚 Documentation officielle

Cette page provient de la documentation officielle NPM :
- **URL source:** ${url}
- **Site officiel:** [docs.npmjs.com](https://docs.npmjs.com/)
- **Téléchargé le:** ${new Date().toLocaleDateString('fr-FR')}

---
`;
    
    return header + markdown + footer;
}

/**
 * Télécharge une page NPM officielle
 */
async function downloadNpmPage(pageInfo) {
    try {
        logStatus('info', `Téléchargement: ${pageInfo.title}...`);
        
        // Créer le dossier de catégorie
        const categoryDir = join(DOCS_DIR, pageInfo.category);
        if (!existsSync(categoryDir)) {
            mkdirSync(categoryDir, { recursive: true });
        }
        
        // Télécharger avec curl
        const tempFile = join(TEMP_DIR, `${pageInfo.name}.html`);
        execSync(`curl -s -L "${pageInfo.url}" -o "${tempFile}"`, { 
            stdio: 'pipe',
            timeout: 30000 
        });
        
        // Lire le contenu HTML
        const htmlContent = readFileSync(tempFile, 'utf-8');
        
        // Convertir en Markdown
        const markdownContent = htmlToMarkdown(htmlContent, pageInfo.title, pageInfo.url);
        
        // Sauvegarder
        const outputFile = join(categoryDir, pageInfo.name);
        writeFileSync(outputFile, markdownContent);
        
        logStatus('success', `${pageInfo.title} téléchargé`);
        return true;
        
    } catch (error) {
        logStatus('error', `Erreur pour ${pageInfo.title}: ${error.message}`);
        return false;
    }
}

/**
 * Télécharge toute la documentation NPM officielle
 */
async function downloadNpmDocs() {
    logStatus('start', 'Téléchargement de la documentation NPM officielle...');
    
    // Créer les dossiers
    if (!existsSync(DOCS_DIR)) {
        mkdirSync(DOCS_DIR, { recursive: true });
    }
    if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR, { recursive: true });
    }
    
    let successCount = 0;
    let totalPages = npmPages.length;
    
    // Télécharger chaque page
    for (const pageInfo of npmPages) {
        const success = await downloadNpmPage(pageInfo);
        if (success) successCount++;
    }
    
    // Créer le README
    const readmePath = join(DOCS_DIR, 'README.md');
    const categories = [...new Set(npmPages.map(p => p.category))];
    
    const readmeContent = `# Documentation NPM Officielle

Documentation NPM téléchargée depuis le site officiel docs.npmjs.com.

## 📊 Statistiques
- **Pages téléchargées:** ${successCount}/${totalPages}
- **Catégories:** ${categories.length}
- **Source:** Documentation officielle NPM

## 📚 Catégories disponibles

${categories.map(cat => `- **${cat}** - Documentation ${cat}`).join('\n')}

## 🌐 Source officielle

Toute cette documentation provient directement du site officiel NPM :
- **Site:** [docs.npmjs.com](https://docs.npmjs.com/)
- **CLI:** [NPM CLI Documentation](https://docs.npmjs.com/cli/v10)
- **API:** [NPM Registry API](https://github.com/npm/registry)

---
*Documentation téléchargée automatiquement le ${new Date().toLocaleString('fr-FR')}*
`;
    
    writeFileSync(readmePath, readmeContent);
    
    // Nettoyer
    if (existsSync(TEMP_DIR)) {
        try {
            execSync(`Remove-Item -Recurse -Force "${TEMP_DIR}"`, { stdio: 'pipe' });
        } catch (e) {
            // Ignore les erreurs de nettoyage
        }
    }
    
    logStatus('success', `Documentation NPM téléchargée: ${successCount}/${totalPages} pages`);
    console.log(`📁 Documentation disponible dans: docs/npm/`);
    
    return successCount;
}

// Exécuter directement
downloadNpmDocs().catch(console.error);

export { downloadNpmDocs };
