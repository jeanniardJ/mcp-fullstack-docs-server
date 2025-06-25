#!/usr/bin/env node

/**
 * Script pour télécharger la documentation HTML complète depuis MDN Mozilla
 * Récupère les guides et références HTML5 essentiels
 * Avec indicateurs de progression et statuts détaillés
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs', 'html');

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

logStatus('start', 'Téléchargement de la documentation HTML depuis MDN Mozilla...');

// URLs de la documentation HTML sur MDN
const HTML_DOCS = [
    // Bases HTML
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
        category: 'elements',
        name: 'html-elements-reference.md',
        title: 'Référence des éléments HTML'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes',
        category: 'attributes', 
        name: 'html-attributes-reference.md',
        title: 'Référence des attributs HTML'
    },
    
    // Formulaires
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form',
        category: 'forms',
        name: 'forms-element.md',
        title: 'Élément form'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input',
        category: 'forms',
        name: 'input-element.md', 
        title: 'Élément input'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select',
        category: 'forms',
        name: 'select-element.md',
        title: 'Élément select'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea',
        category: 'forms',
        name: 'textarea-element.md',
        title: 'Élément textarea'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms',
        category: 'forms',
        name: 'forms-guide.md',
        title: 'Guide des formulaires HTML'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation',
        category: 'forms',
        name: 'forms-validation.md',
        title: 'Validation des formulaires'
    },
    
    // Sémantique
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header',
        category: 'semantic',
        name: 'header-element.md',
        title: 'Élément header'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav',
        category: 'semantic',
        name: 'nav-element.md',
        title: 'Élément nav'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main',
        category: 'semantic',
        name: 'main-element.md',
        title: 'Élément main'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section',
        category: 'semantic',
        name: 'section-element.md',
        title: 'Élément section'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article',
        category: 'semantic',
        name: 'article-element.md',
        title: 'Élément article'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside',
        category: 'semantic',
        name: 'aside-element.md',
        title: 'Élément aside'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer',
        category: 'semantic',
        name: 'footer-element.md',
        title: 'Élément footer'
    },
    
    // Média
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img',
        category: 'media',
        name: 'img-element.md',
        title: 'Élément img'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture',
        category: 'media',
        name: 'picture-element.md',
        title: 'Élément picture'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video',
        category: 'media',
        name: 'video-element.md',
        title: 'Élément video'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio',
        category: 'media',
        name: 'audio-element.md',
        title: 'Élément audio'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas',
        category: 'media',
        name: 'canvas-element.md',
        title: 'Élément canvas'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/svg',
        category: 'media',
        name: 'svg-element.md',
        title: 'Élément SVG'
    },
    
    // Tables
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table',
        category: 'tables',
        name: 'table-element.md',
        title: 'Élément table'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables',
        category: 'tables',
        name: 'tables-guide.md',
        title: 'Guide des tableaux HTML'
    },
    
    // Métadonnées
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta',
        category: 'metadata',
        name: 'meta-element.md',
        title: 'Élément meta'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link',
        category: 'metadata',
        name: 'link-element.md',
        title: 'Élément link'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title',
        category: 'metadata',
        name: 'title-element.md',
        title: 'Élément title'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes',
        category: 'attributes',
        name: 'global-attributes.md',
        title: 'Attributs globaux'
    },
    
    // Accessibilité
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA',
        category: 'accessibility',
        name: 'aria-basics.md',
        title: 'ARIA - Accessibilité'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG',
        category: 'accessibility',
        name: 'wcag-guidelines.md',
        title: 'Guidelines WCAG'
    },
    
    // Web Components
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/Web_Components',
        category: 'components',
        name: 'web-components.md',
        title: 'Web Components'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements',
        category: 'components',
        name: 'custom-elements.md',
        title: 'Éléments personnalisés'
    },
    
    // Performance et bonnes pratiques
    {
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Performance',
        category: 'performance',
        name: 'performance-html.md',
        title: 'Performance HTML'
    },
    {
        url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto',
        category: 'guides',
        name: 'html-howto.md',
        title: 'Comment faire avec HTML'
    }
];

/**
 * Nettoie et convertit le contenu HTML de MDN en Markdown
 */
function convertMdnToMarkdown(content, title) {
    // Extraire le contenu principal (très basique)
    let markdown = content
        // Supprimer les balises script et style
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        
        // Convertir les titres
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1')
        .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1')
        .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1')
        
        // Convertir les liens
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        
        // Convertir les listes
        .replace(/<ul[^>]*>/gi, '')
        .replace(/<\/ul>/gi, '')
        .replace(/<ol[^>]*>/gi, '')
        .replace(/<\/ol>/gi, '')
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1')
        
        // Convertir les paragraphes
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        
        // Convertir le code
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```')
        
        // Convertir les emphasis
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
        
        // Supprimer les autres balises HTML
        .replace(/<[^>]*>/g, '')
        
        // Décoder les entités HTML
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        
        // Nettoyer les espaces
        .replace(/\n\n\n+/g, '\n\n')
        .trim();

    return markdown;
}

/**
 * Télécharge un document depuis MDN
 */
async function downloadHtmlDoc(doc) {
    console.log(`  📄 ${doc.title}...`);
    
    const categoryDir = join(DOCS_DIR, doc.category);
    if (!existsSync(categoryDir)) {
        mkdirSync(categoryDir, { recursive: true });
    }

    const filePath = join(categoryDir, doc.name);
    
    try {
        let content = '';
        
        try {
            // Essayer avec curl d'abord
            content = execSync(`curl -s "${doc.url}"`, { encoding: 'utf-8' });
        } catch {
            try {
                // Fallback vers Node.js fetch
                const response = await fetch(doc.url);
                content = await response.text();
            } catch (fetchError) {
                throw new Error(`Erreur de téléchargement: ${fetchError.message}`);
            }
        }

        // Vérifier si le contenu est valide
        if (content.includes('404') || content.length < 500) {
            throw new Error('Page non trouvée ou contenu insuffisant');
        }

        // Convertir en Markdown basique
        const markdown = convertMdnToMarkdown(content, doc.title);
        
        // Ajouter un en-tête avec les métadonnées
        const header = `# ${doc.title}

> **Source MDN:** [${doc.title}](${doc.url})  
> **Catégorie:** ${doc.category}  
> **Type:** Documentation HTML5

---

`;

        // Note importante pour MDN
        const note = `

---

## 📚 À propos de cette documentation

Cette documentation a été extraite automatiquement depuis **MDN Web Docs** (Mozilla Developer Network), 
la référence officielle pour les technologies web.

- **Source complète:** ${doc.url}
- **Mise à jour:** ${new Date().toLocaleDateString('fr-FR')}
- **Licence:** CC-BY-SA 2.5

> **💡 Conseil:** Pour une documentation interactive complète avec exemples en direct, 
> consultez directement la page source sur MDN.

`;

        writeFileSync(filePath, header + markdown + note);
        return true;
        
    } catch (error) {
        console.log(`    ❌ Erreur: ${error.message}`);
        
        // Créer un fichier de référence même en cas d'erreur
        const fallbackContent = `# ${doc.title}

> **⚠️ Contenu non disponible localement**  
> **Source MDN:** [${doc.title}](${doc.url})

Cette documentation n'a pas pu être téléchargée automatiquement.

## 🔗 Accès direct

Pour consulter cette documentation, visitez directement : ${doc.url}

## 📱 Alternative

Vous pouvez également rechercher "${doc.title}" sur :
- [MDN Web Docs](https://developer.mozilla.org)
- [Can I Use](https://caniuse.com) pour la compatibilité navigateurs

---
*Généré le ${new Date().toLocaleDateString('fr-FR')}*
`;
        
        writeFileSync(filePath, fallbackContent);
        return false;
    }
}

/**
 * Fonction principale
 */
async function downloadHtmlDocs() {
    console.log('🚀 Début du téléchargement de la documentation HTML MDN...\n');
    
    // Créer le dossier de destination
    if (!existsSync(DOCS_DIR)) {
        mkdirSync(DOCS_DIR, { recursive: true });
    }

    let successCount = 0;
    let errorCount = 0;

    for (const doc of HTML_DOCS) {
        const success = await downloadHtmlDoc(doc);
        if (success) {
            successCount++;
        } else {
            errorCount++;
        }
        showProgress(successCount + errorCount, HTML_DOCS.length, doc.title);
    }

    // Créer un fichier de résumé
    const summaryPath = join(DOCS_DIR, 'README.md');
    const summaryContent = `# Documentation HTML5 - MDN Mozilla

Documentation complète HTML5 extraite depuis **MDN Web Docs**.

## 📊 Statistiques
- **Fichiers téléchargés:** ${successCount}
- **Fichiers de référence:** ${errorCount}
- **Total:** ${HTML_DOCS.length}

## 📚 Catégories disponibles

${Array.from(new Set(HTML_DOCS.map(d => d.category)))
  .map(cat => {
    const docs = HTML_DOCS.filter(d => d.category === cat);
    return `### ${cat}
${docs.map(d => `- [${d.title}](${cat}/${d.name})`).join('\n')}`;
  }).join('\n\n')}

## 🌐 À propos de MDN

**MDN Web Docs** est la référence officielle pour :
- HTML, CSS, JavaScript
- APIs Web
- Standards du Web
- Guides et tutoriels

**Site officiel:** https://developer.mozilla.org

## 📖 Utilisation

Cette documentation est intégrée au serveur MCP et accessible via :
- \`mcp_fullstack-doc_search_docs\` avec technology="html"
- \`mcp_fullstack-doc_get_categories\` pour technology="html"

---
*Documentation générée automatiquement le ${new Date().toLocaleString('fr-FR')}*
`;
    
    writeFileSync(summaryPath, summaryContent);
    
    console.log(`\n🎉 Téléchargement HTML terminé !`);
    console.log(`📊 Résultat: ${successCount} téléchargements réussis, ${errorCount} références créées`);
    console.log(`📁 Documentation disponible dans: docs/html/`);
    
    return { successCount, errorCount };
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    downloadHtmlDocs().catch(console.error);
}

export { downloadHtmlDocs };
