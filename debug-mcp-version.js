#!/usr/bin/env node

/**
 * Script de débogage pour identifier quelle configuration MCP est utilisée
 */

import { DocumentationService } from './build/services/documentationService.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Debug - Diagnostic de la configuration MCP');
console.log('============================================\n');

// Tester différents emplacements de configuration
const configPaths = [
    join(__dirname, 'src', 'config', 'technologies.json'),
    join(__dirname, 'build', 'config', 'technologies.json'),
    join(__dirname, 'config', 'technologies.json'),
    join(__dirname, '..', 'config', 'technologies.json')
];

console.log('📁 Fichiers de configuration trouvés:');
for (const path of configPaths) {
    if (existsSync(path)) {
        console.log(`✅ ${path}`);
        try {
            const config = JSON.parse(readFileSync(path, 'utf-8'));
            const symfonyVersion = config.technologies?.symfony?.version;
            console.log(`   Version Symfony: ${symfonyVersion}\n`);
        } catch (error) {
            console.log(`   ❌ Erreur de lecture: ${error.message}\n`);
        }
    } else {
        console.log(`❌ ${path} (non trouvé)`);
    }
}

console.log('\n🧪 Test du service de documentation:');
try {
    // Tester avec le chemin par défaut
    const docService = new DocumentationService();
    const technologies = docService.getTechnologies();
    
    console.log('Technologies disponibles:');
    for (const tech of technologies) {
        const info = docService.getTechnologyInfo(tech);
        console.log(`- ${info?.name || tech}: ${info?.version || 'N/A'}`);
    }
    
    console.log('\n📍 Configuration utilisée par DocumentationService:');
    console.log('Chemin par défaut résolu vers le fichier de configuration');
    
} catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
}

console.log('\n📊 Variables d\'environnement:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`);
console.log(`PWD: ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);

console.log('\n🔍 Diagnostic terminé');
