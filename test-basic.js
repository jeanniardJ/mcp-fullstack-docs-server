#!/usr/bin/env node

// Test simple du serveur MCP
console.log('🚀 Test du serveur MCP Fullstack Documentation');

try {
    // Import du serveur
    const { DocumentationService } = await import('./build/services/documentationService.js');
    
    console.log('✅ Import réussi');
    
    // Création du service
    const docService = new DocumentationService();
    console.log('✅ Service créé');
    
    // Test des technologies
    const technologies = docService.getTechnologies();
    console.log('📚 Technologies:', technologies.join(', '));
    
    // Test de recherche simple
    const results = await docService.searchDocumentation('controller', {
        technology: 'symfony',
        limit: 1
    });
    
    console.log('🔍 Test de recherche:', results.length > 0 ? '✅ OK' : '⚠️ Pas de résultats');
    
    console.log('🎉 Tous les tests passés!');
    
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
