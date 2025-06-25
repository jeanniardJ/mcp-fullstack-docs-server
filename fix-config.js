#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';

console.log('🔧 Correction automatique de la configuration MCP');
console.log('='.repeat(50));

// 1. Vérifier le dossier build
const buildDir = './build';
if (!existsSync(buildDir)) {
    console.log('❌ Dossier build manquant');
    console.log('💡 Exécutez: npm run build');
    process.exit(1);
}

// 2. Vérifier et créer le dossier config dans build
const buildConfigDir = join(buildDir, 'config');
if (!existsSync(buildConfigDir)) {
    console.log('📁 Création du dossier build/config...');
    mkdirSync(buildConfigDir, { recursive: true });
}

// 3. Copier le fichier de configuration
const srcConfig = './src/config/technologies.json';
const buildConfig = join(buildConfigDir, 'technologies.json');

if (existsSync(srcConfig) && !existsSync(buildConfig)) {
    console.log('📋 Copie du fichier de configuration...');
    copyFileSync(srcConfig, buildConfig);
}

// 4. Vérifier les dossiers de documentation
const docsDir = './docs';
if (!existsSync(docsDir)) {
    console.log('❌ Dossier docs manquant');
    console.log('💡 La documentation d\'exemple devrait être dans ./docs/');
}

// 5. Test rapide du serveur
try {
    console.log('🧪 Test rapide...');
    const { DocumentationService } = await import('./build/services/documentationService.js');
    const service = new DocumentationService();
    const techs = service.getTechnologies();
    console.log(`✅ ${techs.length} technologies configurées: ${techs.join(', ')}`);
} catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    process.exit(1);
}

console.log('='.repeat(50));
console.log('✅ Configuration corrigée! Le serveur MCP est prêt.');
console.log('🚀 Démarrage: npm start');
