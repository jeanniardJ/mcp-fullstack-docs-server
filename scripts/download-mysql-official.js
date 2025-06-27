#!/usr/bin/env node

/**
 * Script pour télécharger la documentation MySQL officielle depuis dev.mysql.com
 * Utilise curl pour récupérer les pages HTML officielles et les convertir en Markdown
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs', 'mysql');
const TEMP_DIR = join(__dirname, '..', 'temp', 'mysql-html');

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
 * Pages officielles MySQL à télécharger
 */
const mysqlPages = [
    {
        url: 'https://dev.mysql.com/doc/refman/8.0/en/select.html',
        category: 'queries',
        name: 'select-statement.md',
        title: 'SELECT Statement'
    },
    {
        url: 'https://dev.mysql.com/doc/refman/8.0/en/insert.html',
        category: 'queries',
        name: 'insert-statement.md', 
        title: 'INSERT Statement'
    },
    {
        url: 'https://dev.mysql.com/doc/refman/8.0/en/update.html',
        category: 'queries',
        name: 'update-statement.md',
        title: 'UPDATE Statement'
    },
    {
        url: 'https://dev.mysql.com/doc/refman/8.0/en/delete.html',
        category: 'queries',
        name: 'delete-statement.md',
        title: 'DELETE Statement'
    },
    {
        url: 'https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html',
        category: 'optimization',
        name: 'optimization-indexes.md',
        title: 'Optimization and Indexes'
    },
    {
        url: 'https://dev.mysql.com/doc/refman/8.0/en/security.html',
        category: 'security',
        name: 'general-security.md',
        title: 'General Security Issues'
    },
    {
        url: 'https://dev.mysql.com/doc/refman/8.0/en/backup-and-recovery.html',
        category: 'administration',
        name: 'backup-recovery.md',
        title: 'Backup and Recovery'
    },
    {
        url: 'https://dev.mysql.com/doc/refman/8.0/en/json.html',
        category: 'json',
        name: 'json-data-type.md',
        title: 'The JSON Data Type'
    }
];

/**
 * Convertit HTML en Markdown basique
 */
function htmlToMarkdown(html, title, url) {
    let markdown = html;
    
    // Extraire le contenu principal (entre les balises principales)
    const contentMatch = markdown.match(/<div class="section"[^>]*>([\s\S]*?)<\/div>/i) || 
                        markdown.match(/<div class="titlepage"[^>]*>[\s\S]*?<\/div>([\s\S]*?)(?=<div class="navigation"|$)/i) ||
                        markdown.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    
    if (contentMatch) {
        markdown = contentMatch[1] || contentMatch[0];
    }
    
    // Supprimer les scripts, styles et navigation
    markdown = markdown.replace(/<script[\s\S]*?<\/script>/gi, '');
    markdown = markdown.replace(/<style[\s\S]*?<\/style>/gi, '');
    markdown = markdown.replace(/<nav[\s\S]*?<\/nav>/gi, '');
    markdown = markdown.replace(/<footer[\s\S]*?<\/footer>/gi, '');
    markdown = markdown.replace(/<div class="navigation"[\s\S]*?<\/div>/gi, '');
    
    // Convertir les titres
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1');
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1');
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1');
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1');
    markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1');
    markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1');
    
    // Convertir les blocs de code SQL
    markdown = markdown.replace(/<pre[^>]*class="[^"]*programlisting[^"]*"[^>]*>([\s\S]*?)<\/pre>/gi, '```sql\n$1\n```');
    markdown = markdown.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '```\n$1\n```');
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

> **Source:** [Documentation officielle MySQL](${url})  
> **Type:** Documentation MySQL 8.0 officielle  
> **Version:** MySQL 8.0

---

`;
    
    const footer = `

---

## 📚 Documentation officielle

Cette page provient de la documentation officielle MySQL :
- **URL source:** ${url}
- **Site officiel:** [dev.mysql.com](https://dev.mysql.com/doc/)
- **Téléchargé le:** ${new Date().toLocaleDateString('fr-FR')}

---
`;
    
    return header + markdown + footer;
}

/**
 * Télécharge une page MySQL officielle
 */
async function downloadMysqlPage(pageInfo) {
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
 * Télécharge toute la documentation MySQL officielle
 */
async function downloadMysqlDocs() {
    logStatus('start', 'Téléchargement de la documentation MySQL officielle...');
    
    // Créer les dossiers
    if (!existsSync(DOCS_DIR)) {
        mkdirSync(DOCS_DIR, { recursive: true });
    }
    if (!existsSync(TEMP_DIR)) {
        mkdirSync(TEMP_DIR, { recursive: true });
    }
    
    let successCount = 0;
    let totalPages = mysqlPages.length;
    
    // Télécharger chaque page
    for (const pageInfo of mysqlPages) {
        const success = await downloadMysqlPage(pageInfo);
        if (success) successCount++;
    }
    
    // Créer le README
    const readmePath = join(DOCS_DIR, 'README.md');
    const categories = [...new Set(mysqlPages.map(p => p.category))];
    
    const readmeContent = `# Documentation MySQL Officielle

Documentation MySQL téléchargée depuis le site officiel dev.mysql.com.

## 📊 Statistiques
- **Pages téléchargées:** ${successCount}/${totalPages}
- **Catégories:** ${categories.length}
- **Source:** Documentation officielle MySQL 8.0

## 📚 Catégories disponibles

${categories.map(cat => `- **${cat}** - Documentation ${cat}`).join('\n')}

## 🌐 Source officielle

Toute cette documentation provient directement du site officiel MySQL :
- **Site:** [dev.mysql.com](https://dev.mysql.com/doc/)
- **Manuel de référence:** [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- **Version:** MySQL 8.0

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
    
    logStatus('success', `Documentation MySQL téléchargée: ${successCount}/${totalPages} pages`);
    console.log(`📁 Documentation disponible dans: docs/mysql/`);
    
    return successCount;
}

// Exécuter si appelé directement
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
    downloadMysqlDocs().catch(console.error);
}

export { downloadMysqlDocs };
