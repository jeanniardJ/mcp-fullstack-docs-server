#!/usr/bin/env node

/**
 * Script de test pour vérifier les nouvelles fonctionnalités
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('🧪 Test des nouvelles fonctionnalités MCP');
console.log('=====================================\n');

const DOCS_DIR = './docs';

function checkDirectory(path, name) {
    if (existsSync(path)) {
        const files = readdirSync(path);
        console.log(`✅ ${name}: ${files.length} éléments`);
        return true;
    } else {
        console.log(`❌ ${name}: Dossier manquant`);
        return false;
    }
}

function countFiles(dir) {
    let count = 0;
    try {
        const items = readdirSync(dir);
        for (const item of items) {
            const itemPath = join(dir, item);
            const stat = statSync(itemPath);
            if (stat.isDirectory()) {
                count += countFiles(itemPath);
            } else if (item.endsWith('.md')) {
                count++;
            }
        }
    } catch (error) {
        // Ignore les erreurs
    }
    return count;
}

// Vérification des dossiers
console.log('📁 Vérification des dossiers de documentation:\n');

const checks = [
    { path: join(DOCS_DIR, 'symfony'), name: 'Symfony (existant)' },
    { path: join(DOCS_DIR, 'symfony-6.4'), name: 'Symfony 6.4 LTS' },
    { path: join(DOCS_DIR, 'symfony-7.3'), name: 'Symfony 7.3 Latest' },
    { path: join(DOCS_DIR, 'html'), name: 'HTML MDN' },
    { path: join(DOCS_DIR, 'php'), name: 'PHP' },
    { path: join(DOCS_DIR, 'mysql'), name: 'MySQL' },
    { path: join(DOCS_DIR, 'javascript'), name: 'JavaScript' },
    { path: join(DOCS_DIR, 'css'), name: 'CSS' },
    { path: join(DOCS_DIR, 'doctrine'), name: 'Doctrine' },
    { path: join(DOCS_DIR, 'webpack'), name: 'Webpack' }
];

let successCount = 0;
for (const check of checks) {
    if (checkDirectory(check.path, check.name)) {
        successCount++;
    }
}

console.log(`\n📊 Résultat: ${successCount}/${checks.length} dossiers trouvés\n`);

// Comptage détaillé des fichiers
console.log('📄 Comptage des fichiers de documentation:\n');

for (const check of checks) {
    if (existsSync(check.path)) {
        const fileCount = countFiles(check.path);
        console.log(`   ${check.name}: ${fileCount} fichiers .md`);
    }
}

console.log('\n🔧 Test des commandes MCP:\n');

// Test du serveur MCP
try {
    console.log('🔄 Compilation du projet...');
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Compilation réussie');
} catch (error) {
    console.log('❌ Erreur de compilation:', error.message);
}

// Test des scripts
const scripts = [
    'docs:report',
    'test:basic'
];

for (const script of scripts) {
    try {
        console.log(`🔄 Test de: npm run ${script}`);
        const output = execSync(`npm run ${script}`, { 
            encoding: 'utf-8',
            timeout: 30000
        });
        console.log(`✅ ${script}: OK`);
    } catch (error) {
        console.log(`⚠️ ${script}: ${error.message.split('\n')[0]}`);
    }
}

console.log('\n🎯 Résumé des nouvelles fonctionnalités:');
console.log('• Multi-versions Symfony (6.4 LTS + 7.3 Latest)');
console.log('• Documentation HTML complète MDN');
console.log('• PHP 8.2+ avec fonctionnalités modernes');
console.log('• Scripts optimisés et configuration automatique');

console.log('\n💡 Commandes disponibles:');
console.log('• npm run docs:download:complete  # Tout télécharger');
console.log('• npm run docs:symfony:multi      # Symfony multi-versions');
console.log('• npm run docs:html:mdn          # HTML MDN complet');
console.log('• npm run docs:php:complete      # PHP moderne');
console.log('• npm run docs:report            # Rapport détaillé');
