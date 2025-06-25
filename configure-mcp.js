#!/usr/bin/env node

/**
 * Script de configuration automatique pour serveur MCP standalone
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Configuration du serveur MCP Fullstack Docs');
console.log('===============================================\n');

const PROJECT_ROOT = resolve(__dirname, '..');
const BUILD_PATH = join(PROJECT_ROOT, 'build', 'index.js');

// Chemin de configuration Claude Desktop (exemples)
const CLAUDE_CONFIG_PATHS = [
    join(homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json'), // Windows
    join(homedir(), '.config', 'claude', 'claude_desktop_config.json'), // Linux
    join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json') // macOS
];

// Configuration MCP pour le projet
const MCP_CONFIG = {
    "mcpServers": {
        "fullstack-docs": {
            "command": "node",
            "args": [BUILD_PATH],
            "cwd": PROJECT_ROOT,
            "env": {
                "NODE_ENV": "production"
            }
        }
    }
};

// Configuration Claude Desktop
const CLAUDE_CONFIG = {
    "mcpServers": {
        "fullstack-docs": {
            "command": "node",
            "args": [BUILD_PATH],
            "cwd": PROJECT_ROOT,
            "env": {
                "NODE_ENV": "production"
            }
        }
    }
};

/**
 * Sauvegarde la configuration MCP locale
 */
function saveMcpConfig() {
    const configPath = join(PROJECT_ROOT, 'mcp.json');
    writeFileSync(configPath, JSON.stringify(MCP_CONFIG, null, 2));
    console.log(`✅ Configuration MCP sauvegardée: ${configPath}`);
}

/**
 * Met à jour ou crée la configuration Claude Desktop
 */
function updateClaudeConfig() {
    let configPath = null;
    
    // Trouver le fichier de config Claude existant
    for (const path of CLAUDE_CONFIG_PATHS) {
        if (existsSync(path)) {
            configPath = path;
            break;
        }
    }
    
    // Si aucun trouvé, utiliser le chemin Windows par défaut
    if (!configPath) {
        configPath = CLAUDE_CONFIG_PATHS[0];
        const configDir = dirname(configPath);
        if (!existsSync(configDir)) {
            mkdirSync(configDir, { recursive: true });
        }
    }
    
    let existingConfig = {};
    
    // Lire la configuration existante
    if (existsSync(configPath)) {
        try {
            const content = readFileSync(configPath, 'utf-8');
            existingConfig = JSON.parse(content);
            console.log(`📖 Configuration Claude existante trouvée: ${configPath}`);
        } catch (error) {
            console.log(`⚠️ Erreur lecture config Claude, création d'une nouvelle: ${error.message}`);
        }
    } else {
        console.log(`📝 Création nouvelle configuration Claude: ${configPath}`);
    }
    
    // Fusionner les configurations
    if (!existingConfig.mcpServers) {
        existingConfig.mcpServers = {};
    }
    
    existingConfig.mcpServers["fullstack-docs"] = CLAUDE_CONFIG.mcpServers["fullstack-docs"];
    
    // Sauvegarder
    writeFileSync(configPath, JSON.stringify(existingConfig, null, 2));
    console.log(`✅ Configuration Claude mise à jour: ${configPath}`);
    
    return configPath;
}

/**
 * Génère un exemple de configuration pour VS Code
 */
function generateVSCodeConfig() {
    const vscodeConfig = {
        "mcp.servers": {
            "fullstack-docs": {
                "command": "node",
                "args": [BUILD_PATH],
                "cwd": PROJECT_ROOT
            }
        }
    };
    
    const configPath = join(PROJECT_ROOT, 'vscode-mcp-config.json');
    writeFileSync(configPath, JSON.stringify(vscodeConfig, null, 2));
    console.log(`✅ Configuration VS Code générée: ${configPath}`);
}

/**
 * Vérifie que le build existe
 */
function checkBuild() {
    if (!existsSync(BUILD_PATH)) {
        console.log(`❌ Build non trouvé: ${BUILD_PATH}`);
        console.log(`   Exécutez d'abord: npm run build`);
        return false;
    }
    
    console.log(`✅ Build trouvé: ${BUILD_PATH}`);
    return true;
}

/**
 * Affiche les instructions d'utilisation
 */
function showUsageInstructions(claudeConfigPath) {
    console.log('\n🚀 Configuration terminée !');
    console.log('============================\n');
    
    console.log('📋 Serveur MCP configuré:');
    console.log(`   Nom: fullstack-docs`);
    console.log(`   Commande: node ${BUILD_PATH}`);
    console.log(`   Répertoire: ${PROJECT_ROOT}\n`);
    
    console.log('🎯 Utilisation:');
    console.log('1. **Claude Desktop:**');
    console.log(`   - Configuration mise à jour: ${claudeConfigPath}`);
    console.log('   - Redémarrez Claude Desktop');
    console.log('   - Le serveur sera disponible automatiquement\n');
    
    console.log('2. **VS Code (avec extension MCP):**');
    console.log('   - Utilisez le fichier: vscode-mcp-config.json');
    console.log('   - Ou ajoutez la config dans settings.json\n');
    
    console.log('3. **Ligne de commande (test direct):**');
    console.log(`   cd "${PROJECT_ROOT}"`);
    console.log('   node build/index.js\n');
    
    console.log('🔧 Commandes disponibles dans le serveur MCP:');
    console.log('   • mcp_fullstack-doc_list_technologies');
    console.log('   • mcp_fullstack-doc_get_categories');
    console.log('   • mcp_fullstack-doc_search_docs');
    console.log('   • mcp_fullstack-doc_search_cross_reference\n');
    
    console.log('📚 Documentation disponible:');
    console.log('   • Symfony 6.4 LTS + 7.3 Latest');
    console.log('   • PHP 8.2+ (Enums, Attributs, Fibers)');
    console.log('   • HTML5 complet (MDN)');
    console.log('   • MySQL 8.0, JavaScript ES2023, CSS3');
    console.log('   • Doctrine ORM, Webpack');
}

/**
 * Fonction principale
 */
async function configureMcpServer() {
    // Vérifier le build
    if (!checkBuild()) {
        console.log('\n🔨 Construction du projet...');
        try {
            const { execSync } = await import('child_process');
            execSync('npm run build', { 
                cwd: PROJECT_ROOT,
                stdio: 'inherit'
            });
            console.log('✅ Build réussi');
        } catch (error) {
            console.log('❌ Erreur de build:', error.message);
            process.exit(1);
        }
    }
    
    // Sauvegarder les configurations
    saveMcpConfig();
    const claudeConfigPath = updateClaudeConfig();
    generateVSCodeConfig();
    
    // Afficher les instructions
    showUsageInstructions(claudeConfigPath);
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    configureMcpServer().catch(console.error);
}

export { configureMcpServer };
