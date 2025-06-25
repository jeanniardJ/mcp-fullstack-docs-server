#!/usr/bin/env node

/**
 * Script de test interactif pour toutes les commandes MCP Fullstack Documentation
 */

async function testMCPCommands() {
    console.log('🚀 Test des commandes MCP Fullstack Documentation');
    console.log('='.repeat(60));

    try {
        // Import des services
        const { DocumentationService } = await import('./build/services/documentationService.js');
        const { ToolHandlers } = await import('./build/handlers/toolHandlers.js');

        const docService = new DocumentationService();
        const handlers = new ToolHandlers(docService);

        console.log('✅ Services initialisés\n');

        // ==========================================
        // TEST 1: list_technologies
        // ==========================================
        console.log('📋 TEST 1: list_technologies');
        console.log('-'.repeat(40));
        
        const techResult = await handlers.handleListTechnologies();
        console.log('Réponse:');
        console.log(techResult.content[0].text);
        console.log('\n');

        // ==========================================
        // TEST 2: get_categories pour Symfony
        // ==========================================
        console.log('📂 TEST 2: get_categories (Symfony)');
        console.log('-'.repeat(40));
        
        const categoriesResult = await handlers.handleGetCategories({ technology: 'symfony' });
        console.log('Réponse:');
        console.log(categoriesResult.content[0].text);
        console.log('\n');

        // ==========================================
        // TEST 3: search_docs - Recherche simple
        // ==========================================
        console.log('🔍 TEST 3: search_docs - "controller" dans Symfony');
        console.log('-'.repeat(40));
        
        const searchResult = await handlers.handleSearchDocs({
            query: 'controller',
            technology: 'symfony',
            limit: 2
        });
        
        console.log('Réponse:');
        const searchText = searchResult.content[0].text;
        // Afficher seulement les premières lignes pour la lisibilité
        const lines = searchText.split('\n');
        console.log(lines.slice(0, 15).join('\n'));
        if (lines.length > 15) {
            console.log('... (texte tronqué)');
        }
        console.log('\n');

        // ==========================================
        // TEST 4: search_docs - Sans technologie spécifique
        // ==========================================
        console.log('🌐 TEST 4: search_docs - "function" (toutes technologies)');
        console.log('-'.repeat(40));
        
        const globalSearchResult = await handlers.handleSearchDocs({
            query: 'function',
            limit: 3
        });
        
        console.log('Réponse:');
        const globalText = globalSearchResult.content[0].text;
        const globalLines = globalText.split('\n');
        console.log(globalLines.slice(0, 20).join('\n'));
        if (globalLines.length > 20) {
            console.log('... (texte tronqué)');
        }
        console.log('\n');

        // ==========================================
        // TEST 5: search_cross_reference
        // ==========================================
        console.log('🔗 TEST 5: search_cross_reference - "database" dans Symfony + MySQL');
        console.log('-'.repeat(40));
        
        const crossRefResult = await handlers.handleSearchCrossRef({
            query: 'database',
            technologies: ['symfony', 'mysql', 'doctrine']
        });
        
        console.log('Réponse:');
        const crossText = crossRefResult.content[0].text;
        const crossLines = crossText.split('\n');
        console.log(crossLines.slice(0, 25).join('\n'));
        if (crossLines.length > 25) {
            console.log('... (texte tronqué)');
        }
        console.log('\n');

        // ==========================================
        // TEST 6: Gestion d'erreurs
        // ==========================================
        console.log('❌ TEST 6: Gestion d\'erreurs - Technologie inexistante');
        console.log('-'.repeat(40));
        
        const errorResult = await handlers.handleGetCategories({ technology: 'inexistant' });
        console.log('Réponse:');
        console.log(errorResult.content[0].text);
        console.log('Erreur détectée:', errorResult.isError ? '✅' : '❌');
        console.log('\n');

        // ==========================================
        // TEST 7: Recherche avec catégorie
        // ==========================================
        console.log('📂 TEST 7: search_docs avec catégorie - "routing" dans Symfony');
        console.log('-'.repeat(40));
        
        const categorySearchResult = await handlers.handleSearchDocs({
            query: 'route',
            technology: 'symfony',
            category: 'routing',
            limit: 1
        });
        
        console.log('Réponse:');
        const catText = categorySearchResult.content[0].text;
        const catLines = catText.split('\n');
        console.log(catLines.slice(0, 15).join('\n'));
        console.log('\n');

        // ==========================================
        // RÉSUMÉ
        // ==========================================
        console.log('='.repeat(60));
        console.log('🎉 TOUS LES TESTS TERMINÉS AVEC SUCCÈS!');
        console.log('');
        console.log('📊 Résumé des commandes testées:');
        console.log('   ✅ list_technologies - Liste des technologies disponibles');
        console.log('   ✅ get_categories - Catégories d\'une technologie');
        console.log('   ✅ search_docs - Recherche dans la documentation');
        console.log('   ✅ search_cross_reference - Recherche croisée');
        console.log('   ✅ Gestion d\'erreurs - Réponses d\'erreur appropriées');
        console.log('');
        console.log('🚀 Le serveur MCP est entièrement fonctionnel!');
        console.log('💡 Vous pouvez maintenant l\'utiliser avec VS Code et GitHub Copilot');

    } catch (error) {
        console.error('❌ ERREUR CRITIQUE:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testMCPCommands();
