#!/usr/bin/env node

async function testServer() {
    console.log('🧪 Test complet du serveur MCP');
    console.log('='.repeat(40));
    
    try {
        // Test 1: Import du service
        console.log('1️⃣ Import du DocumentationService...');
        const { DocumentationService } = await import('./build/services/documentationService.js');
        console.log('   ✅ Import réussi');
        
        // Test 2: Création du service
        console.log('2️⃣ Création du service...');
        const docService = new DocumentationService();
        console.log('   ✅ Service créé');
        
        // Test 3: Vérification des technologies
        console.log('3️⃣ Vérification des technologies...');
        const technologies = docService.getTechnologies();
        console.log(`   ✅ ${technologies.length} technologies: ${technologies.join(', ')}`);
        
        // Test 4: Import des handlers
        console.log('4️⃣ Import des handlers...');
        const { ToolHandlers } = await import('./build/handlers/toolHandlers.js');
        const handlers = new ToolHandlers(docService);
        console.log('   ✅ Handlers créés');
        
        // Test 5: Test de recherche
        console.log('5️⃣ Test de recherche...');
        const searchResult = await handlers.handleSearchDocs({
            query: 'controller',
            technology: 'symfony',
            limit: 1
        });
        console.log('   ✅ Recherche fonctionnelle');
        
        console.log('='.repeat(40));
        console.log('🎉 Tous les tests passés! Le serveur est prêt.');
        
    } catch (error) {
        console.error('❌ Erreur détectée:');
        console.error('   Message:', error.message);
        console.error('   Stack:', error.stack);
        process.exit(1);
    }
}

testServer();
