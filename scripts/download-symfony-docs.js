#!/usr/bin/env node

/**
 * Script pour télécharger la documentation officielle de Symfony
 * et l'intégrer dans notre serveur MCP
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SYMFONY_DOCS_REPO = 'https://github.com/symfony/symfony-docs.git';
const TEMP_DIR = join(__dirname, '..', 'temp');
const DOCS_DIR = join(__dirname, '..', 'docs', 'symfony');
const SYMFONY_VERSION = '7.1'; // Version à télécharger

console.log('🚀 Téléchargement de la documentation Symfony...');

async function downloadSymfonyDocs() {
    try {
        // 1. Créer le dossier temporaire
        if (existsSync(TEMP_DIR)) {
            console.log('🧹 Nettoyage du dossier temporaire...');
            rmSync(TEMP_DIR, { recursive: true, force: true });
        }
        mkdirSync(TEMP_DIR, { recursive: true });

        // 2. Cloner le dépôt Symfony Docs
        console.log('📥 Clonage du dépôt symfony/symfony-docs...');
        execSync(`git clone --depth 1 --branch ${SYMFONY_VERSION} ${SYMFONY_DOCS_REPO} ${join(TEMP_DIR, 'symfony-docs')}`, {
            stdio: 'inherit'
        });

        // 3. Identifier les catégories principales
        const categories = {
            'controller': ['controller', 'http_foundation'],
            'routing': ['routing'],
            'forms': ['forms'],
            'security': ['security'],
            'cache': ['cache', 'http_cache'],
            'services': ['service_container', 'dependency_injection'],
            'commands': ['console'],
            'events': ['event_dispatcher', 'events'],
            'database': ['doctrine'],
            'templates': ['templates', 'twig'],
            'validation': ['validation'],
            'serializer': ['serializer'],
            'testing': ['testing'],
            'configuration': ['configuration'],
            'deployment': ['deployment'],
            'performance': ['performance']
        };

        // 4. Traiter chaque catégorie
        const sourceDir = join(TEMP_DIR, 'symfony-docs');
        
        for (const [category, folders] of Object.entries(categories)) {
            console.log(`📂 Traitement de la catégorie: ${category}`);
            
            const categoryDir = join(DOCS_DIR, category);
            if (!existsSync(categoryDir)) {
                mkdirSync(categoryDir, { recursive: true });
            }

            for (const folder of folders) {
                const sourcePath = join(sourceDir, folder);
                if (existsSync(sourcePath)) {
                    await processDocumentationFolder(sourcePath, categoryDir, folder);
                }
            }
        }

        // 5. Copier les fichiers de référence principaux
        console.log('📋 Copie des fichiers de référence...');
        const mainFiles = [
            'index.rst',
            'setup.rst',
            'quick_tour/the_big_picture.rst',
            'create_framework/index.rst'
        ];

        const referenceDir = join(DOCS_DIR, 'reference');
        if (!existsSync(referenceDir)) {
            mkdirSync(referenceDir, { recursive: true });
        }

        for (const file of mainFiles) {
            const sourcePath = join(sourceDir, file);
            if (existsSync(sourcePath)) {
                const content = readFileSync(sourcePath, 'utf-8');
                const convertedContent = convertRstToMarkdown(content, file);
                const fileName = file.replace('.rst', '.md').replace(/\//g, '_');
                writeFileSync(join(referenceDir, fileName), convertedContent);
            }
        }

        // 6. Nettoyer
        console.log('🧹 Nettoyage...');
        rmSync(TEMP_DIR, { recursive: true, force: true });

        console.log('✅ Documentation Symfony téléchargée et intégrée avec succès !');
        console.log(`📁 Fichiers disponibles dans: ${DOCS_DIR}`);
        
        // 7. Mettre à jour la configuration
        await updateTechnologiesConfig();

    } catch (error) {
        console.error('❌ Erreur lors du téléchargement:', error.message);
        process.exit(1);
    }
}

async function processDocumentationFolder(sourceDir, targetDir, folderName) {
    try {
        const { readdirSync, statSync } = await import('fs');
        const items = readdirSync(sourceDir);
        
        for (const item of items) {
            const sourcePath = join(sourceDir, item);
            const stat = statSync(sourcePath);
            
            if (stat.isFile() && item.endsWith('.rst')) {
                const content = readFileSync(sourcePath, 'utf-8');
                const convertedContent = convertRstToMarkdown(content, item);
                const fileName = item.replace('.rst', '.md');
                const targetPath = join(targetDir, `${folderName}_${fileName}`);
                writeFileSync(targetPath, convertedContent);
                console.log(`  ✓ ${item} → ${fileName}`);
            }
        }
    } catch (error) {
        console.warn(`⚠️  Erreur lors du traitement de ${sourceDir}:`, error.message);
    }
}

function convertRstToMarkdown(content, filename) {
    let markdown = content;
    
    // Convertir les titres RST en Markdown
    markdown = markdown.replace(/^(.+)\n[=]{3,}$/gm, '# $1');
    markdown = markdown.replace(/^(.+)\n[-]{3,}$/gm, '## $1');
    markdown = markdown.replace(/^(.+)\n[~]{3,}$/gm, '### $1');
    markdown = markdown.replace(/^(.+)\n[^]{3,}$/gm, '#### $1');
    
    // Convertir les blocs de code
    markdown = markdown.replace(/\.\. code-block:: (\w+)\n\n((?:    .+\n)*)/g, '```$1\n$2```\n');
    markdown = markdown.replace(/^    (.+)$/gm, '$1'); // Retirer l'indentation des blocs de code
    
    // Convertir les liens
    markdown = markdown.replace(/`([^`]+) <([^>]+)>`_/g, '[$1]($2)');
    
    // Convertir les références internes
    markdown = markdown.replace(/:doc:`([^`]+)`/g, '[$1]($1.md)');
    markdown = markdown.replace(/:ref:`([^`]+)`/g, '[$1](#$1)');
    
    // Convertir les notes et avertissements
    markdown = markdown.replace(/\.\. note::\n\n((?:    .+\n)*)/g, '> **Note:** $1\n');
    markdown = markdown.replace(/\.\. warning::\n\n((?:    .+\n)*)/g, '> **⚠️ Attention:** $1\n');
    markdown = markdown.replace(/\.\. tip::\n\n((?:    .+\n)*)/g, '> **💡 Astuce:** $1\n');
    
    // Nettoyer les espaces et retours à la ligne
    markdown = markdown.replace(/^    /gm, ''); // Retirer l'indentation
    markdown = markdown.replace(/\n{3,}/g, '\n\n'); // Réduire les retours à la ligne multiples
    
    // Ajouter un en-tête avec métadonnées
    const header = `# Symfony Documentation - ${filename.replace('.rst', '')}\n\n> Source: Documentation officielle Symfony\n> Version: ${SYMFONY_VERSION}\n> Converti automatiquement le ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    return header + markdown;
}

async function updateTechnologiesConfig() {
    console.log('🔧 Mise à jour de la configuration...');
    
    const configPath = join(__dirname, '..', 'src', 'config', 'technologies.json');
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    
    // Mettre à jour les catégories Symfony avec les nouvelles
    config.technologies.symfony.categories = [
        'controller',
        'routing', 
        'forms',
        'security',
        'cache',
        'services',
        'commands',
        'events',
        'database',
        'templates',
        'validation',
        'serializer',
        'testing',
        'configuration',
        'deployment',
        'performance',
        'reference'
    ];
    
    config.technologies.symfony.version = SYMFONY_VERSION;
    
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    // Copier vers le dossier build aussi
    const buildConfigPath = join(__dirname, '..', 'build', 'config', 'technologies.json');
    if (existsSync(dirname(buildConfigPath))) {
        writeFileSync(buildConfigPath, JSON.stringify(config, null, 2));
    }
    
    console.log('✅ Configuration mise à jour!');
}

// Exécuter le script
downloadSymfonyDocs().catch(console.error);
