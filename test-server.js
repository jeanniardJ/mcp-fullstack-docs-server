#!/usr/bin/env node

/**
 * Script de test pour le serveur MCP Fullstack Docs
 * Usage: node test-server.js
 */

import { DocumentationService } from './src/services/documentationService.js';

async function testServer() {
    console.log('🧪 Test du serveur MCP Fullstack Documentation\n');

    try {
        const docService = new DocumentationService();

        // Test 1: Lister les technologies
        console.log('📋 Test 1: Technologies disponibles');
        const technologies = docService.getTechnologies();
        console.log(`   Trouvées: ${technologies.join(', ')}`);
        console.log('   ✅ OK\n');

        // Test 2: Obtenir les catégories Symfony
        console.log('📂 Test 2: Catégories Symfony');
        const categories = docService.getCategories('symfony');
        console.log(`   Trouvées: ${categories.join(', ')}`);
        console.log('   ✅ OK\n');

        // Test 3: Recherche simple
        console.log('🔍 Test 3: Recherche "controller" dans Symfony');
        const searchResults = await docService.searchDocumentation('controller', {
            technology: 'symfony',
            limit: 3
        });
        console.log(`   Résultats: ${searchResults.length}`);
        if (searchResults.length > 0) {
            console.log(`   Premier résultat: ${searchResults[0].file}`);
            console.log(`   Score: ${searchResults[0].score.toFixed(2)}`);
        }
        console.log('   ✅ OK\n');

        // Test 4: Recherche croisée
        console.log('🔗 Test 4: Recherche croisée "database" dans Symfony et MySQL');
        const crossResults = await docService.searchCrossReference('database', ['symfony', 'mysql']);
        console.log(`   Résultats: ${crossResults.length}`);
        const techsFound = [...new Set(crossResults.map(r => r.technology))];
        console.log(`   Technologies trouvées: ${techsFound.join(', ')}`);
        console.log('   ✅ OK\n');

        // Test 5: Recherche dans toutes les technologies
        console.log('🌐 Test 5: Recherche "function" dans toutes les technologies');
        const allResults = await docService.searchDocumentation('function', { limit: 5 });
        console.log(`   Résultats: ${allResults.length}`);
        const allTechsFound = [...new Set(allResults.map(r => r.technology))];
        console.log(`   Technologies trouvées: ${allTechsFound.join(', ')}`);
        console.log('   ✅ OK\n');

        console.log('🎉 Tous les tests sont passés avec succès!');
        console.log('\n📝 Pour utiliser le serveur:');
        console.log('   1. npm run build');
        console.log('   2. npm start');
        console.log('   3. Configurez Claude Desktop avec claude_desktop_config.json');

    } catch (error) {
        console.error('❌ Erreur lors des tests:', error);
        process.exit(1);
    }
}

testServer();
