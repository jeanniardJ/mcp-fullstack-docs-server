#!/usr/bin/env node

/**
 * Script principal pour télécharger et générer toute la documentation
 * Symfony 6.4 + 7.3, HTML MDN complet, PHP complet
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 TÉLÉCHARGEMENT COMPLET DE LA DOCUMENTATION');
console.log('============================================\n');

/**
 * Met à jour la configuration avec les nouvelles spécifications
 */
function updateConfiguration() {
    console.log('⚙️ Mise à jour de la configuration...\n');
    
    const configPath = join(__dirname, '..', 'src', 'config', 'technologies.json');
    const buildConfigPath = join(__dirname, '..', 'build', 'config', 'technologies.json');
    
    try {
        const config = JSON.parse(readFileSync(configPath, 'utf-8'));
        
        // Symfony multi-versions
        config.symfony = {
            name: "Symfony",
            description: "Framework PHP moderne - Versions 6.4 LTS et 7.3 Latest",
            versions: [
                {
                    version: "6.4",
                    name: "LTS",
                    description: "Version Long Term Support",
                    path: "symfony-6.4"
                },
                {
                    version: "7.3", 
                    name: "Latest",
                    description: "Version stable la plus récente",
                    path: "symfony-7.3"
                }
            ],
            categories: [
                "controller", "routing", "forms", "security", "cache", "services",
                "configuration", "templates", "console", "commands", "events",
                "testing", "validation", "serializer", "deployment"
            ],
            extensions: [".md"],
            lastUpdated: new Date().toISOString()
        };
        
        // PHP complet
        config.php = {
            name: "PHP",
            description: "Langage de programmation - Documentation complète PHP 8.2+",
            version: "8.2+",
            categories: [
                "oop", "types", "modern", "performance", "security", "testing"
            ],
            features: [
                "Union Types", "Enums", "Attributes", "Fibers", "readonly properties",
                "Match expressions", "Propriétés promues", "Intersection Types"
            ],
            extensions: [".md"],
            lastUpdated: new Date().toISOString()
        };
        
        // HTML complet MDN
        config.html = {
            name: "HTML",
            description: "Langage de balisage - Documentation complète MDN Mozilla",
            version: "5",
            source: "MDN Web Docs",
            categories: [
                "elements", "attributes", "forms", "semantic", "media", 
                "tables", "metadata", "accessibility", "components", 
                "performance", "guides"
            ],
            extensions: [".md"],
            lastUpdated: new Date().toISOString()
        };
        
        // Sauvegarder
        writeFileSync(configPath, JSON.stringify(config, null, 2));
        if (existsSync(buildConfigPath)) {
            writeFileSync(buildConfigPath, JSON.stringify(config, null, 2));
        }
        
        console.log('✅ Configuration mise à jour avec succès\n');
        
    } catch (error) {
        console.log(`⚠️ Erreur de mise à jour de la config: ${error.message}\n`);
    }
}

/**
 * Exécute un script et retourne les résultats
 */
async function runScript(scriptName, description) {
    console.log(`🔄 ${description}...`);
    console.log(`   Script: ${scriptName}\n`);
    
    try {
        const result = execSync(`node "${join(__dirname, scriptName)}"`, { 
            encoding: 'utf-8',
            cwd: __dirname
        });
        
        console.log(result);
        return { success: true, output: result };
        
    } catch (error) {
        console.log(`❌ Erreur dans ${scriptName}:`);
        console.log(error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Fonction principale
 */
async function downloadAllDocumentation() {
    const startTime = Date.now();
    const results = [];
    
    console.log('📋 Plan de téléchargement:');
    console.log('1. Symfony 6.4 + 7.3 (multi-versions)');
    console.log('2. HTML complet depuis MDN Mozilla'); 
    console.log('3. PHP 8.2+ documentation complète');
    console.log('4. Configuration et compilation\n');
    
    // 1. Symfony multi-versions
    const symfonyResult = await runScript(
        'download-symfony-multi-versions.js',
        'Téléchargement Symfony 6.4 + 7.3'
    );
    results.push({ name: 'Symfony Multi-versions', ...symfonyResult });
    
    // 2. HTML MDN
    const htmlResult = await runScript(
        'download-html-mdn.js', 
        'Téléchargement HTML complet MDN'
    );
    results.push({ name: 'HTML MDN', ...htmlResult });
    
    // 3. PHP complet
    const phpResult = await runScript(
        'generate-php-complete.js',
        'Génération PHP 8.2+ complet'
    );
    results.push({ name: 'PHP Complete', ...phpResult });
    
    // 4. Autres documentations existantes
    console.log('🔄 Génération des autres documentations...\n');
    try {
        const otherResult = execSync('node generate-all-docs.js', { 
            encoding: 'utf-8',
            cwd: __dirname
        });
        console.log(otherResult);
        results.push({ name: 'Autres docs', success: true, output: otherResult });
    } catch (error) {
        console.log(`⚠️ Erreur génération autres docs: ${error.message}\n`);
        results.push({ name: 'Autres docs', success: false, error: error.message });
    }
    
    // 5. Mise à jour configuration
    updateConfiguration();
    
    // 6. Compilation
    console.log('🔨 Compilation du projet...\n');
    try {
        const buildResult = execSync('npm run build', { 
            encoding: 'utf-8',
            cwd: join(__dirname, '..')
        });
        console.log(buildResult);
        results.push({ name: 'Build', success: true, output: buildResult });
    } catch (error) {
        console.log(`⚠️ Erreur de compilation: ${error.message}\n`);
        results.push({ name: 'Build', success: false, error: error.message });
    }
    
    // Résumé final
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
    console.log('\n🎉 TÉLÉCHARGEMENT TERMINÉ !');
    console.log('=========================\n');
    
    console.log(`⏱️  Durée totale: ${duration}s\n`);
    
    console.log('📊 Résumé:');
    let successCount = 0;
    let errorCount = 0;
    
    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${result.name}`);
        if (result.success) successCount++;
        else errorCount++;
    });
    
    console.log(`\n📈 Total: ${successCount} succès, ${errorCount} erreurs`);
    
    // Documentation disponible
    console.log('\n📚 Documentation maintenant disponible:');
    console.log('• 🎯 Symfony 6.4 LTS + 7.3 Latest (multi-versions)');
    console.log('• 🌐 HTML5 complet depuis MDN Mozilla');
    console.log('• ⚡ PHP 8.2+ avec toutes les fonctionnalités modernes');
    console.log('• 🛢️  MySQL 8.0 (requêtes avancées, JSON, optimisation)');
    console.log('• 🎨 JavaScript ES2023 + CSS3 + Webpack');
    console.log('• 📖 Doctrine ORM');
    
    console.log('\n🔧 Prochaines étapes:');
    console.log('1. Tester: npm run test:basic');
    console.log('2. Vérifier: npm run docs:report');
    console.log('3. Utiliser dans VS Code avec les commandes MCP');
    
    return { 
        results,
        successCount,
        errorCount,
        duration: parseFloat(duration)
    };
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    downloadAllDocumentation().catch(console.error);
}

export { downloadAllDocumentation };
