#!/usr/bin/env node

/**
 * Script de statistiques des téléchargements MCP Fullstack Docs
 * Affiche le statut détaillé de toutes les documentations
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'src', 'config', 'technologies.json');

/**
 * Formate la taille en bytes de manière lisible
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formate une date de manière lisible
 */
function formatDate(date) {
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Calcule récursivement la taille et le nombre de fichiers d'un dossier
 */
function getDirStats(dirPath) {
    if (!existsSync(dirPath)) {
        return { files: 0, size: 0, lastModified: null };
    }

    let totalSize = 0;
    let totalFiles = 0;
    let lastModified = new Date(0);

    function scanDir(path) {
        try {
            const items = readdirSync(path);
            for (const item of items) {
                const itemPath = join(path, item);
                const stats = statSync(itemPath);
                
                if (stats.isDirectory()) {
                    scanDir(itemPath);
                } else {
                    totalFiles++;
                    totalSize += stats.size;
                    if (stats.mtime > lastModified) {
                        lastModified = stats.mtime;
                    }
                }
            }
        } catch (error) {
            // Ignore les erreurs d'accès
        }
    }

    scanDir(dirPath);
    return {
        files: totalFiles,
        size: totalSize,
        lastModified: lastModified.getTime() > 0 ? lastModified : null
    };
}

/**
 * Vérifie le statut d'une technologie
 */
function getTechStatus(techName, techConfig) {
    const docsPath = join(__dirname, '..', techConfig.docsPath);
    const stats = getDirStats(docsPath);
    
    let status = '❌ Non téléchargé';
    let statusIcon = '❌';
    
    if (stats.files > 0) {
        const daysSinceUpdate = stats.lastModified ? 
            Math.floor((Date.now() - stats.lastModified.getTime()) / (1000 * 60 * 60 * 24)) : null;
        
        if (daysSinceUpdate === null) {
            status = '⚠️ Statut inconnu';
            statusIcon = '⚠️';
        } else if (daysSinceUpdate === 0) {
            status = '✅ À jour (aujourd\'hui)';
            statusIcon = '✅';
        } else if (daysSinceUpdate <= 7) {
            status = `✅ Récent (${daysSinceUpdate}j)`;
            statusIcon = '✅';
        } else if (daysSinceUpdate <= 30) {
            status = `⚠️ Ancien (${daysSinceUpdate}j)`;
            statusIcon = '⚠️';
        } else {
            status = `❌ Très ancien (${daysSinceUpdate}j)`;
            statusIcon = '❌';
        }
    }

    return {
        name: techConfig.name || techName,
        version: techConfig.version || 'N/A',
        description: techConfig.description || '',
        path: docsPath,
        exists: existsSync(docsPath),
        files: stats.files,
        size: stats.size,
        formattedSize: formatFileSize(stats.size),
        lastModified: stats.lastModified,
        formattedDate: stats.lastModified ? formatDate(stats.lastModified) : 'Jamais',
        status,
        statusIcon,
        categories: techConfig.categories?.length || 0
    };
}

/**
 * Affiche les statistiques globales
 */
function displayGlobalStats(technologies) {
    const totalTechs = Object.keys(technologies).length;
    const availableTechs = Object.values(technologies).filter(tech => tech.exists).length;
    const totalFiles = Object.values(technologies).reduce((sum, tech) => sum + tech.files, 0);
    const totalSize = Object.values(technologies).reduce((sum, tech) => sum + tech.size, 0);
    
    console.log('\n🏠====================================');
    console.log('📊 STATISTIQUES GLOBALES MCP FULLSTACK DOCS');
    console.log('======================================🏠\n');
    
    console.log(`📦 Technologies configurées : ${totalTechs}`);
    console.log(`✅ Technologies disponibles : ${availableTechs}/${totalTechs}`);
    console.log(`📄 Total fichiers : ${totalFiles}`);
    console.log(`💾 Taille totale : ${formatFileSize(totalSize)}`);
    console.log(`🔄 Couverture : ${Math.round((availableTechs / totalTechs) * 100)}%`);
    
    // Statut global
    if (availableTechs === totalTechs) {
        console.log(`🎉 Statut global : ✅ COMPLET`);
    } else if (availableTechs > totalTechs / 2) {
        console.log(`⚠️ Statut global : 🟡 PARTIEL`);
    } else {
        console.log(`❌ Statut global : 🔴 INCOMPLET`);
    }
}

/**
 * Affiche le détail de chaque technologie
 */
function displayTechDetails(technologies) {
    console.log('\n📚 DÉTAIL PAR TECHNOLOGIE\n');
    console.log('┌─' + '─'.repeat(78) + '┐');
    console.log('│ Tech' + ' '.repeat(12) + '│ Version' + ' '.repeat(9) + '│ Fichiers │ Taille  │ Mise à jour' + ' '.repeat(5) + '│');
    console.log('├─' + '─'.repeat(78) + '┤');
    
    for (const [techName, tech] of Object.entries(technologies)) {
        const name = `${tech.statusIcon} ${tech.name}`.padEnd(16);
        const version = tech.version.padEnd(16);
        const files = tech.files.toString().padStart(8);
        const size = tech.formattedSize.padStart(8);
        const date = tech.formattedDate.padEnd(16);
        
        console.log(`│ ${name} │ ${version} │ ${files} │ ${size} │ ${date} │`);
    }
    
    console.log('└─' + '─'.repeat(78) + '┘');
}

/**
 * Affiche les détails étendus
 */
function displayExtendedDetails(technologies) {
    console.log('\n🔍 DÉTAILS ÉTENDUS\n');
    
    for (const [techName, tech] of Object.entries(technologies)) {
        console.log(`${tech.statusIcon} ${tech.name} (${tech.version})`);
        console.log(`   📂 Chemin: ${tech.path}`);
        console.log(`   📄 Fichiers: ${tech.files}`);
        console.log(`   💾 Taille: ${tech.formattedSize}`);
        console.log(`   📅 Dernière maj: ${tech.formattedDate}`);
        console.log(`   🏷️ Catégories: ${tech.categories}`);
        console.log(`   ℹ️ Statut: ${tech.status}`);
        if (tech.description) {
            console.log(`   📝 Description: ${tech.description}`);
        }
        console.log('');
    }
}

/**
 * Affiche les actions recommandées
 */
function displayRecommendations(technologies) {
    console.log('\n💡 ACTIONS RECOMMANDÉES\n');
    
    const missingTechs = Object.entries(technologies).filter(([, tech]) => !tech.exists);
    const oldTechs = Object.entries(technologies).filter(([, tech]) => {
        if (!tech.lastModified) return false;
        const daysSince = Math.floor((Date.now() - tech.lastModified.getTime()) / (1000 * 60 * 60 * 24));
        return daysSince > 30;
    });
    
    if (missingTechs.length > 0) {
        console.log('📥 Télécharger les technologies manquantes:');
        missingTechs.forEach(([techName]) => {
            console.log(`   npm run docs:download:${techName} # ou`);
        });
        console.log('   npm run docs:download:complete  # Tout télécharger\n');
    }
    
    if (oldTechs.length > 0) {
        console.log('🔄 Mettre à jour les technologies anciennes:');
        oldTechs.forEach(([techName, tech]) => {
            const daysSince = Math.floor((Date.now() - tech.lastModified.getTime()) / (1000 * 60 * 60 * 24));
            console.log(`   ${tech.name}: ${daysSince} jours`);
        });
        console.log('   npm run docs:update  # Mettre à jour tout\n');
    }
    
    if (missingTechs.length === 0 && oldTechs.length === 0) {
        console.log('🎉 Toutes les documentations sont à jour !');
        console.log('🚀 Vous pouvez démarrer le serveur MCP:');
        console.log('   npm start              # Mode stdio');
        console.log('   npm run start:http     # Mode HTTP\n');
    }
}

/**
 * Fonction principale
 */
async function main() {
    try {
        console.log('📊 Analyse des téléchargements MCP Fullstack Docs...\n');
        
        // Chargement de la configuration
        if (!existsSync(configPath)) {
            console.error(`❌ Configuration non trouvée: ${configPath}`);
            process.exit(1);
        }
        
        const config = JSON.parse(readFileSync(configPath, 'utf-8'));
        const technologies = {};
        
        // Analyse de chaque technologie
        for (const [techName, techConfig] of Object.entries(config.technologies || {})) {
            technologies[techName] = getTechStatus(techName, techConfig);
        }
        
        // Affichage des résultats
        displayGlobalStats(technologies);
        displayTechDetails(technologies);
        
        // Mode verbose avec détails étendus
        if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
            displayExtendedDetails(technologies);
        }
        
        displayRecommendations(technologies);
        
        console.log('✅ Analyse terminée!\n');
        console.log('💡 Utilisez --verbose pour plus de détails');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'analyse:', error.message);
        process.exit(1);
    }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
