#!/usr/bin/env node

/**
 * Script simplifié pour télécharger la documentation Symfony
 * Version robuste avec gestion d'erreurs
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync, rmSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs', 'symfony');
const TEMP_DIR = join(__dirname, '..', 'temp');

console.log('📥 Téléchargement simplifié de la documentation Symfony...');

async function downloadSymfonyDocsSimple() {
    try {
        // Créer les dossiers nécessaires
        if (!existsSync(DOCS_DIR)) {
            mkdirSync(DOCS_DIR, { recursive: true });
        }

        // URLs des pages principales de la documentation Symfony
        const docPages = [
            {
                url: 'https://raw.githubusercontent.com/symfony/symfony-docs/7.1/controller.rst',
                category: 'controller',
                name: 'controllers-basics.md'
            },
            {
                url: 'https://raw.githubusercontent.com/symfony/symfony-docs/7.1/routing.rst', 
                category: 'routing',
                name: 'routing-advanced.md'
            },
            {
                url: 'https://raw.githubusercontent.com/symfony/symfony-docs/7.1/forms.rst',
                category: 'forms', 
                name: 'forms-basics.md'
            },
            {
                url: 'https://raw.githubusercontent.com/symfony/symfony-docs/7.1/security.rst',
                category: 'security',
                name: 'security-basics.md'
            },
            {
                url: 'https://raw.githubusercontent.com/symfony/symfony-docs/7.1/cache.rst',
                category: 'cache',
                name: 'cache-basics.md'
            },
            {
                url: 'https://raw.githubusercontent.com/symfony/symfony-docs/7.1/service_container.rst',
                category: 'services',
                name: 'service-container.md'
            }
        ];

        // Alternative: utiliser curl/wget si disponible
        console.log('🔍 Vérification des outils de téléchargement...');
        
        let downloadCmd = null;
        try {
            execSync('curl --version', { stdio: 'ignore' });
            downloadCmd = 'curl';
            console.log('✓ curl détecté');
        } catch {
            try {
                execSync('wget --version', { stdio: 'ignore' });
                downloadCmd = 'wget';
                console.log('✓ wget détecté');
            } catch {
                console.log('ℹ️  curl/wget non disponibles, utilisation de Node.js fetch...');
            }
        }

        for (const doc of docPages) {
            console.log(`📄 Téléchargement: ${doc.name}...`);
            
            const categoryDir = join(DOCS_DIR, doc.category);
            if (!existsSync(categoryDir)) {
                mkdirSync(categoryDir, { recursive: true });
            }

            try {
                let content = '';
                
                if (downloadCmd === 'curl') {
                    content = execSync(`curl -s "${doc.url}"`, { encoding: 'utf-8' });
                } else if (downloadCmd === 'wget') {
                    content = execSync(`wget -qO- "${doc.url}"`, { encoding: 'utf-8' });
                } else {
                    // Utiliser Node.js fetch (Node 18+)
                    const response = await fetch(doc.url);
                    content = await response.text();
                }

                if (content && content.length > 100) {
                    const markdown = convertRstToMarkdown(content, doc.name);
                    const filePath = join(categoryDir, doc.name);
                    writeFileSync(filePath, markdown);
                    console.log(`  ✓ ${doc.name} téléchargé`);
                } else {
                    console.log(`  ⚠️ ${doc.name} - contenu vide ou erreur`);
                }
            } catch (error) {
                console.log(`  ❌ Erreur pour ${doc.name}: ${error.message}`);
            }
        }

        console.log('✅ Téléchargement terminé!');
        console.log(`📁 Fichiers disponibles dans: ${DOCS_DIR}`);

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

function convertRstToMarkdown(content, filename) {
    let markdown = content;
    
    // Conversions RST → Markdown basiques
    markdown = markdown.replace(/^(.+)\n={3,}$/gm, '# $1');
    markdown = markdown.replace(/^(.+)\n-{3,}$/gm, '## $1');
    markdown = markdown.replace(/^(.+)\n~{3,}$/gm, '### $1');
    
    // Blocs de code
    markdown = markdown.replace(/\.\. code-block:: (\w+)\n\n((?:    .+\n?)*)/g, (match, lang, code) => {
        const cleanCode = code.replace(/^    /gm, '');
        return `\`\`\`${lang}\n${cleanCode}\`\`\`\n`;
    });
    
    // Liens
    markdown = markdown.replace(/`([^`]+) <([^>]+)>`_/g, '[$1]($2)');
    
    // Notes
    markdown = markdown.replace(/\.\. note::\n\n((?:    .+\n?)*)/g, (match, note) => {
        const cleanNote = note.replace(/^    /gm, '');
        return `> **📝 Note:**\n> ${cleanNote}\n`;
    });
    
    // Avertissements  
    markdown = markdown.replace(/\.\. warning::\n\n((?:    .+\n?)*)/g, (match, warning) => {
        const cleanWarning = warning.replace(/^    /gm, '');
        return `> **⚠️ Attention:**\n> ${cleanWarning}\n`;
    });

    // En-tête
    const header = `# ${filename.replace('.md', '')} - Documentation Symfony\n\n> Source: Documentation officielle Symfony 7.1\n> Téléchargé le ${new Date().toLocaleDateString('fr-FR')}\n\n---\n\n`;
    
    return header + markdown;
}

// Exécuter
downloadSymfonyDocsSimple().catch(console.error);
