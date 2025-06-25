import { existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Diagnostic du serveur MCP Fullstack Documentation');
console.log('='.repeat(60));

// Test 1: Vérification du répertoire de travail
console.log('📁 Répertoire de travail actuel:', process.cwd());
console.log('📁 Répertoire du fichier:', __dirname);

// Test 2: Vérification du fichier de configuration
const configPath = join(__dirname, 'src', 'config', 'technologies.json');
console.log('⚙️  Chemin config attendu:', configPath);
console.log('⚙️  Config existe:', existsSync(configPath));

if (!existsSync(configPath)) {
    // Chercher le fichier dans d'autres emplacements possibles
    const alternatives = [
        join(__dirname, '..', 'src', 'config', 'technologies.json'),
        join(__dirname, 'build', 'config', 'technologies.json'),
        join(process.cwd(), 'src', 'config', 'technologies.json')
    ];
    
    console.log('🔍 Recherche dans d\'autres emplacements:');
    for (const alt of alternatives) {
        console.log(`   ${alt}: ${existsSync(alt) ? '✅ TROUVÉ' : '❌ non trouvé'}`);
    }
}

// Test 3: Vérification des dossiers de documentation
const docsPath = join(__dirname, 'docs');
console.log('📚 Dossier docs:', docsPath);
console.log('📚 Docs existe:', existsSync(docsPath));

if (existsSync(docsPath)) {
    const { readdirSync } = await import('fs');
    const subdirs = readdirSync(docsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    console.log('📚 Sous-dossiers docs:', subdirs.join(', '));
}

// Test 4: Tentative d'import du service
try {
    console.log('🧪 Test d\'import du DocumentationService...');
    const { DocumentationService } = await import('./build/services/documentationService.js');
    
    // Essayer avec un chemin explicite
    const explicitConfigPath = join(__dirname, 'src', 'config', 'technologies.json');
    if (existsSync(explicitConfigPath)) {
        const service = new DocumentationService(explicitConfigPath);
        console.log('✅ Service créé avec succès!');
        console.log('🔧 Technologies disponibles:', service.getTechnologies().join(', '));
    } else {
        console.log('❌ Fichier de configuration introuvable');
    }
} catch (error) {
    console.error('❌ Erreur lors de l\'import:', error.message);
}

console.log('='.repeat(60));
console.log('✅ Diagnostic terminé');
