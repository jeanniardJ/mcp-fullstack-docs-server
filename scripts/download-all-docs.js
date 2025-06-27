#!/usr/bin/env node

/**
 * Script maître pour télécharger la documentation complète de toutes les technologies
 * Symfony, PHP, Doctrine, MySQL, JavaScript, HTML, CSS, Webpack
 * Avec indicateurs de proasync function downloadGeneratedDocs(tech, config, techDir) {
    try {
        logStatus('info', `Téléchargement de la documentation ${tech}...`);
        
        if (tech === 'npm') {
            const created = await downloadNpmDocs();
            logStatus('success', `Documentation ${tech} téléchargée: ${created} pages`);
        } else {
            logStatus('warning', `Type de documentation générée non supporté: ${tech}`);
        }
    } catch (error) {
        logStatus('error', `Erreur lors du téléchargement ${tech}:`, error.message);
    }
}atuts de téléchargement
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync, rmSync, readdirSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { downloadNpmDocs } from './download-npm-docs-official.js';
import { downloadMysqlDocs } from './download-mysql-official.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs');
const TEMP_DIR = join(__dirname, '..', 'temp');

// 🎨 Fonctions d'affichage avec couleurs et statuts
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
    const barLength = 20;
    const filledLength = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    
    process.stdout.write(`\r${colors.cyan}Progress: [${bar}] ${percentage}% (${current}/${total})${colors.reset} ${item}`);
    if (current === total) console.log(''); // Nouvelle ligne à la fin
}

logStatus('start', 'Téléchargement complet de toutes les documentations...');

// Configuration des sources de documentation
const documentationSources = {
    symfony: {
        type: 'github',
        repo: 'symfony/symfony-docs',
        branch: '7.1',
        files: [
            { path: 'controller.rst', category: 'controller', name: 'controller-official.md' },
            { path: 'routing.rst', category: 'routing', name: 'routing-official.md' },
            { path: 'forms.rst', category: 'forms', name: 'forms-official.md' },
            { path: 'security.rst', category: 'security', name: 'security-official.md' },
            { path: 'cache.rst', category: 'cache', name: 'cache-official.md' },
            { path: 'service_container.rst', category: 'services', name: 'services-official.md' },
            { path: 'validation.rst', category: 'validation', name: 'validation-official.md' },
            { path: 'serializer.rst', category: 'serializer', name: 'serializer-official.md' },
            { path: 'testing.rst', category: 'testing', name: 'testing-official.md' },
            { path: 'console.rst', category: 'commands', name: 'console-official.md' },
            { path: 'event_dispatcher.rst', category: 'events', name: 'events-official.md' },
            { path: 'templating.rst', category: 'templates', name: 'templates-official.md' },
            { path: 'configuration.rst', category: 'configuration', name: 'configuration-official.md' },
            { path: 'deployment.rst', category: 'deployment', name: 'deployment-official.md' }
        ]
    },
    
    doctrine: {
        type: 'github',
        repo: 'doctrine/orm-documentation',
        branch: '3.0',
        files: [
            { path: 'en/tutorials/getting-started.rst', category: 'getting-started', name: 'getting-started.md' },
            { path: 'en/reference/basic-mapping.rst', category: 'entities', name: 'basic-mapping.md' },
            { path: 'en/reference/association-mapping.rst', category: 'entities', name: 'associations.md' },
            { path: 'en/reference/query-builder.rst', category: 'queries', name: 'query-builder.md' },
            { path: 'en/reference/dql-doctrine-query-language.rst', category: 'queries', name: 'dql.md' },
            { path: 'en/reference/working-with-objects.rst', category: 'orm', name: 'working-with-objects.md' },
            { path: 'en/reference/inheritance-mapping.rst', category: 'entities', name: 'inheritance.md' },
            { path: 'en/reference/events.rst', category: 'events', name: 'doctrine-events.md' },
            { path: 'en/reference/caching.rst', category: 'cache', name: 'doctrine-cache.md' },
            { path: 'en/reference/transactions-and-concurrency.rst', category: 'transactions', name: 'transactions.md' }
        ]
    },
    
    php: {
        type: 'manual',
        baseUrl: 'https://www.php.net/manual/en/',
        files: [
            { path: 'language.oop5.php', category: 'oop', name: 'oop-basics.md' },
            { path: 'language.oop5.basic.php', category: 'oop', name: 'classes-objects.md' },
            { path: 'language.oop5.inheritance.php', category: 'oop', name: 'inheritance.md' },
            { path: 'language.oop5.interfaces.php', category: 'oop', name: 'interfaces.md' },
            { path: 'language.oop5.traits.php', category: 'oop', name: 'traits.md' },
            { path: 'language.attributes.php', category: 'attributes', name: 'attributes.md' },
            { path: 'language.namespaces.php', category: 'namespaces', name: 'namespaces.md' },
            { path: 'language.functions.php', category: 'functions', name: 'functions.md' },
            { path: 'language.exceptions.php', category: 'exceptions', name: 'exceptions.md' },
            { path: 'features.commandline.php', category: 'cli', name: 'command-line.md' }
        ]
    },
    
    mysql: {
        type: 'official',
        description: 'Documentation MySQL officielle téléchargée depuis dev.mysql.com'
    },
    
    javascript: {
        type: 'mdn',
        baseUrl: 'https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/',
        files: [
            { path: 'reference/functions/arrow_functions/index.md', category: 'syntax', name: 'arrow-functions.md' },
            { path: 'reference/statements/async_function/index.md', category: 'async', name: 'async-functions.md' },
            { path: 'reference/global_objects/promise/index.md', category: 'async', name: 'promises.md' },
            { path: 'reference/operators/await/index.md', category: 'async', name: 'await.md' },
            { path: 'reference/statements/class/index.md', category: 'classes', name: 'classes.md' },
            { path: 'reference/operators/destructuring_assignment/index.md', category: 'syntax', name: 'destructuring.md' },
            { path: 'reference/template_literals/index.md', category: 'syntax', name: 'template-literals.md' },
            { path: 'reference/statements/import/index.md', category: 'modules', name: 'import.md' },
            { path: 'reference/statements/export/index.md', category: 'modules', name: 'export.md' },
            { path: 'guide/modules/index.md', category: 'modules', name: 'modules-guide.md' }
        ]
    },
    
    css: {
        type: 'mdn',
        baseUrl: 'https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/',
        files: [
            { path: 'css_grid_layout/index.md', category: 'layout', name: 'grid-layout-mdn.md' },
            { path: 'css_flexible_box_layout/index.md', category: 'layout', name: 'flexbox-mdn.md' },
            { path: 'css_positioning/index.md', category: 'layout', name: 'positioning.md' },
            { path: 'css_animations/index.md', category: 'animations', name: 'animations.md' },
            { path: 'css_transitions/index.md', category: 'animations', name: 'transitions.md' },
            { path: 'css_transforms/index.md', category: 'animations', name: 'transforms.md' },
            { path: 'media_queries/index.md', category: 'responsive', name: 'media-queries.md' },
            { path: 'css_container_queries/index.md', category: 'responsive', name: 'container-queries.md' },
            { path: 'using_css_custom_properties/index.md', category: 'variables', name: 'custom-properties.md' }
        ]
    },
    
    html: {
        type: 'mdn',
        baseUrl: 'https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/',
        files: [
            { path: 'element/form/index.md', category: 'forms', name: 'forms.md' },
            { path: 'element/input/index.md', category: 'forms', name: 'input.md' },
            { path: 'element/canvas/index.md', category: 'graphics', name: 'canvas.md' },
            { path: 'element/video/index.md', category: 'media', name: 'video.md' },
            { path: 'element/audio/index.md', category: 'media', name: 'audio.md' },
            { path: 'global_attributes/index.md', category: 'attributes', name: 'global-attributes.md' },
            { path: 'element/meta/index.md', category: 'metadata', name: 'meta.md' },
            { path: 'element/link/index.md', category: 'metadata', name: 'link.md' }
        ]
    },
    
    webpack: {
        type: 'github',
        repo: 'webpack/webpack.js.org',
        branch: 'main',
        files: [
            { path: 'src/content/concepts/index.mdx', category: 'concepts', name: 'concepts.md' },
            { path: 'src/content/configuration/index.mdx', category: 'config', name: 'configuration.md' },
            { path: 'src/content/loaders/index.mdx', category: 'loaders', name: 'loaders.md' },
            { path: 'src/content/plugins/index.mdx', category: 'plugins', name: 'plugins.md' },
            { path: 'src/content/guides/getting-started.mdx', category: 'getting-started', name: 'getting-started.md' },
            { path: 'src/content/guides/development.mdx', category: 'development', name: 'development.md' },
            { path: 'src/content/guides/production.mdx', category: 'production', name: 'production.md' },
            { path: 'src/content/guides/code-splitting.mdx', category: 'optimization', name: 'code-splitting.md' }
        ]
    },
    
    npm: {
        type: 'official',
        description: 'Documentation NPM officielle téléchargée depuis docs.npmjs.com'
    }
};

/**
 * Télécharge la documentation depuis les sources officielles (NPM, MySQL)
 */
async function downloadOfficialDocs(tech, config, techDir) {
    try {
        logStatus('info', `Téléchargement depuis les sources officielles: ${tech}...`);
        
        if (tech === 'npm') {
            const created = await downloadNpmDocs();
            logStatus('success', `Documentation ${tech} téléchargée: ${created} fichiers depuis docs.npmjs.com`);
        } else if (tech === 'mysql') {
            const created = await downloadMysqlDocs();
            logStatus('success', `Documentation ${tech} téléchargée: ${created} fichiers depuis dev.mysql.com`);
        } else {
            logStatus('warning', `Sources officielles non configurées pour: ${tech}`);
        }
    } catch (error) {
        logStatus('error', `Erreur lors du téléchargement officiel ${tech}:`, error.message);
    }
}

async function downloadAllDocumentation() {
    const startTime = Date.now();
    
    try {
        // Créer les dossiers nécessaires
        if (existsSync(TEMP_DIR)) {
            logStatus('progress', 'Nettoyage du dossier temporaire...');
            rmSync(TEMP_DIR, { recursive: true, force: true });
        }
        mkdirSync(TEMP_DIR, { recursive: true });

        const technologies = Object.keys(documentationSources);
        const totalTechs = technologies.length;
        let processedTechs = 0;

        logStatus('info', `Technologies à traiter: ${totalTechs}`, `(${technologies.join(', ')})`);

        for (const [tech, config] of Object.entries(documentationSources)) {
            processedTechs++;
            console.log(`\n${colors.bright}=== ${tech.toUpperCase()} (${processedTechs}/${totalTechs}) ===${colors.reset}`);
            logStatus('start', `Téléchargement de la documentation ${tech.toUpperCase()}...`);
            
            const techDir = join(DOCS_DIR, tech);
            if (!existsSync(techDir)) {
                mkdirSync(techDir, { recursive: true });
            }

            switch (config.type) {
                case 'github':
                    await downloadFromGitHub(tech, config, techDir);
                    break;
                case 'mdn':
                    await downloadFromMDN(tech, config, techDir);
                    break;
                case 'manual':
                    await downloadFromManual(tech, config, techDir);
                    break;
                case 'official':
                    await downloadOfficialDocs(tech, config, techDir);
                    break;
                default:
                    logStatus('error', `Type de documentation non supporté: ${config.type} pour ${tech}`);
            }
            
            showProgress(processedTechs, totalTechs, `${tech} terminé`);
        }

        // Nettoyer
        logStatus('progress', 'Nettoyage final...');
        if (existsSync(TEMP_DIR)) {
            rmSync(TEMP_DIR, { recursive: true, force: true });
        }

        const duration = Math.round((Date.now() - startTime) / 1000);
        logStatus('success', `Toutes les documentations ont été téléchargées!`, `(${duration}s)`);
        console.log(`\n📁 Fichiers disponibles dans: ${DOCS_DIR}`);

        // Afficher un résumé final
        await showFinalSummary();

        // Mettre à jour la configuration
        await updateTechnologiesConfig();

    } catch (error) {
        logStatus('error', 'Erreur lors du téléchargement:', error.message);
        process.exit(1);
    }
}

async function showFinalSummary() {
    console.log(`\n${colors.bright}📊 RÉSUMÉ FINAL${colors.reset}`);
    
    const technologies = Object.keys(documentationSources);
    for (const tech of technologies) {
        const techDir = join(DOCS_DIR, tech);
        if (existsSync(techDir)) {
            const categories = readdirSync(techDir, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            
            let totalFiles = 0;
            let totalSize = 0;
            
            for (const category of categories) {
                const categoryDir = join(techDir, category);
                const files = readdirSync(categoryDir, { withFileTypes: true })
                    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'));
                
                totalFiles += files.length;
                
                for (const file of files) {
                    const filePath = join(categoryDir, file.name);
                    const stats = statSync(filePath);
                    totalSize += stats.size;
                }
            }
            
            const sizeKB = Math.round(totalSize / 1024);
            logStatus('info', `${tech.toUpperCase()}:`, `${totalFiles} fichiers, ${categories.length} catégories, ${sizeKB}KB`);
        } else {
            logStatus('warning', `${tech.toUpperCase()}:`, 'Dossier non trouvé');
        }
    }
}

async function downloadFromGitHub(tech, config, techDir) {
    const repoDir = join(TEMP_DIR, tech);
    
    logStatus('progress', `Clonage de ${config.repo}...`);
    try {
        execSync(`git clone --depth 1 --branch ${config.branch} https://github.com/${config.repo}.git ${repoDir}`, {
            stdio: 'pipe'
        });
        logStatus('success', `Repository cloné: ${config.repo}`);
    } catch (error) {
        logStatus('error', `Erreur de clonage: ${error.message}`);
        return;
    }

    const totalFiles = config.files.length;
    let processedFiles = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const file of config.files) {
        processedFiles++;
        showProgress(processedFiles, totalFiles, file.name);
        
        const sourcePath = join(repoDir, file.path);
        if (existsSync(sourcePath)) {
            try {
                const content = readFileSync(sourcePath, 'utf-8');
                const markdown = convertToMarkdown(content, file.name, tech);
                
                const categoryDir = join(techDir, file.category);
                if (!existsSync(categoryDir)) {
                    mkdirSync(categoryDir, { recursive: true });
                }
                
                const targetPath = join(categoryDir, file.name);
                writeFileSync(targetPath, markdown);
                successCount++;
                logStatus('success', `✓ ${file.name}`, `(${file.category})`);
            } catch (error) {
                errorCount++;
                logStatus('error', `✗ Erreur processing ${file.name}:`, error.message);
            }
        } else {
            errorCount++;
            logStatus('warning', `⚠ Fichier non trouvé: ${file.path}`);
        }
    }
    
    logStatus('info', `${tech.toUpperCase()} terminé:`, `${successCount} succès, ${errorCount} erreurs`);
}

async function downloadFromMDN(tech, config, techDir) {
    const totalFiles = config.files.length;
    let processedFiles = 0;
    let successCount = 0;
    let errorCount = 0;

    logStatus('start', `Téléchargement MDN pour ${tech.toUpperCase()}...`);

    for (const file of config.files) {
        processedFiles++;
        showProgress(processedFiles, totalFiles, file.name);
        
        try {
            const url = config.baseUrl + file.path;
            logStatus('progress', `📥 ${file.name}...`);
            
            const response = await fetch(url);
            if (response.ok) {
                const content = await response.text();
                const markdown = convertToMarkdown(content, file.name, tech);
                
                const categoryDir = join(techDir, file.category);
                if (!existsSync(categoryDir)) {
                    mkdirSync(categoryDir, { recursive: true });
                }
                
                const targetPath = join(categoryDir, file.name);
                writeFileSync(targetPath, markdown);
                successCount++;
                logStatus('success', `✓ ${file.name}`, `(${content.length} chars)`);
            } else {
                errorCount++;
                logStatus('error', `✗ HTTP ${response.status} pour ${file.name}`);
            }
        } catch (error) {
            errorCount++;
            logStatus('error', `✗ Erreur ${file.name}:`, error.message);
        }
    }
    
    logStatus('info', `${tech.toUpperCase()} terminé:`, `${successCount} succès, ${errorCount} erreurs`);
}

async function downloadFromManual(tech, config, techDir) {
    for (const file of config.files) {
        try {
            const url = config.baseUrl + file.path;
            logStatus('progress', `Téléchargement: ${file.name}...`);
            
            const response = await fetch(url);
            if (response.ok) {
                const content = await response.text();
                // Extraire le contenu principal de la page PHP manual
                const cleanContent = extractPHPManualContent(content);
                const markdown = convertToMarkdown(cleanContent, file.name, tech);
                
                const categoryDir = join(techDir, file.category);
                if (!existsSync(categoryDir)) {
                    mkdirSync(categoryDir, { recursive: true });
                }
                
                const targetPath = join(categoryDir, file.name);
                writeFileSync(targetPath, markdown);
                logStatus('success', `Fichier téléchargé: ${file.name}`);
            } else {
                logStatus('error', `Erreur HTTP ${response.status} pour ${file.name}`);
            }
        } catch (error) {
            logStatus('error', `Erreur pour ${file.name}: ${error.message}`);
        }
    }
}

function extractPHPManualContent(html) {
    // Extraire le contenu principal du manuel PHP
    const mainContentMatch = html.match(/<div class="sect1"[^>]*>([\s\S]*?)<\/div>/);
    if (mainContentMatch) {
        return mainContentMatch[1];
    }
    
    // Fallback: chercher le contenu dans d'autres balises
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    return bodyMatch ? bodyMatch[1] : html;
}

function convertToMarkdown(content, filename, tech) {
    let markdown = content;
    
    // Conversions de base RST/HTML vers Markdown
    
    // Titres RST
    markdown = markdown.replace(/^(.+)\n={3,}$/gm, '# $1');
    markdown = markdown.replace(/^(.+)\n-{3,}$/gm, '## $1');
    markdown = markdown.replace(/^(.+)\n~{3,}$/gm, '### $1');
    markdown = markdown.replace(/^(.+)\n\^{3,}$/gm, '#### $1');
    
    // Titres HTML
    markdown = markdown.replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (match, level, text) => {
        const hashes = '#'.repeat(parseInt(level));
        return `${hashes} ${text.replace(/<[^>]*>/g, '')}`;
    });
    
    // Blocs de code RST
    markdown = markdown.replace(/\.\. code-block:: (\w+)\n\n((?:    .+\n?)*)/g, (match, lang, code) => {
        const cleanCode = code.replace(/^    /gm, '');
        return `\`\`\`${lang}\n${cleanCode}\`\`\`\n`;
    });
    
    // Blocs de code HTML
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, code) => {
        const cleanCode = code.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        return `\`\`\`\n${cleanCode}\`\`\`\n`;
    });
    
    // Liens RST
    markdown = markdown.replace(/`([^`]+) <([^>]+)>`_/g, '[$1]($2)');
    
    // Liens HTML
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    
    // Listes HTML
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1') + '\n';
    });
    
    // Paragraphes HTML
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    
    // Code inline HTML
    markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    
    // Gras et italique HTML
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    
    // Notes et avertissements RST
    markdown = markdown.replace(/\.\. note::\n\n((?:    .+\n?)*)/g, (match, note) => {
        const cleanNote = note.replace(/^    /gm, '');
        return `> **📝 Note:**\n> ${cleanNote}\n`;
    });
    
    markdown = markdown.replace(/\.\. warning::\n\n((?:    .+\n?)*)/g, (match, warning) => {
        const cleanWarning = warning.replace(/^    /gm, '');
        return `> **⚠️ Attention:**\n> ${cleanWarning}\n`;
    });
    
    // Nettoyer les balises HTML restantes
    markdown = markdown.replace(/<[^>]*>/g, '');
    
    // Nettoyer les entités HTML
    markdown = markdown.replace(/&lt;/g, '<');
    markdown = markdown.replace(/&gt;/g, '>');
    markdown = markdown.replace(/&amp;/g, '&');
    markdown = markdown.replace(/&quot;/g, '"');
    markdown = markdown.replace(/&#39;/g, "'");
    
    // Nettoyer les espaces et retours à la ligne
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.replace(/^\s+/gm, '');
    
    // En-tête avec métadonnées
    const header = `# ${filename.replace('.md', '')} - Documentation ${tech.toUpperCase()}

> Source: Documentation officielle ${tech}
> Téléchargé le ${new Date().toLocaleDateString('fr-FR')}

---

`;
    
    return header + markdown.trim();
}

async function updateTechnologiesConfig() {
    logStatus('progress', 'Mise à jour de la configuration...');
    
    const configPath = join(__dirname, '..', 'src', 'config', 'technologies.json');
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    
    // Mettre à jour les catégories pour chaque technologie
    const newCategories = {
        symfony: ['controller', 'routing', 'forms', 'security', 'cache', 'services', 'validation', 'serializer', 'testing', 'commands', 'events', 'templates', 'configuration', 'deployment'],
        php: ['oop', 'attributes', 'namespaces', 'functions', 'exceptions', 'cli', 'performance'],
        doctrine: ['getting-started', 'entities', 'queries', 'orm', 'events', 'cache', 'transactions'],
        javascript: ['syntax', 'async', 'classes', 'modules', 'dom', 'functions', 'apis'],
        css: ['layout', 'animations', 'responsive', 'variables', 'selectors'],
        html: ['forms', 'graphics', 'media', 'attributes', 'metadata'],
        webpack: ['concepts', 'config', 'loaders', 'plugins', 'getting-started', 'development', 'production', 'optimization'],
        npm: ['basics', 'commands', 'package-json', 'publishing', 'workspaces', 'security']
    };
    
    for (const [tech, categories] of Object.entries(newCategories)) {
        if (config.technologies[tech]) {
            config.technologies[tech].categories = categories;
        }
    }
    
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    // Copier vers le dossier build aussi
    const buildConfigPath = join(__dirname, '..', 'build', 'config', 'technologies.json');
    if (existsSync(dirname(buildConfigPath))) {
        writeFileSync(buildConfigPath, JSON.stringify(config, null, 2));
    }
    
    logStatus('success', 'Configuration mise à jour!');
}

// Exécuter le script
downloadAllDocumentation().catch(console.error);
