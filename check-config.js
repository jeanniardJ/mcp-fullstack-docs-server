import { existsSync } from 'fs';
import { join } from 'path';

// Vérifications de base
const buildDir = './build';
const configFile = join(buildDir, 'config', 'technologies.json');
const mainFile = join(buildDir, 'index.js');
const docsDir = './docs';

console.log('🔍 Vérifications avant démarrage du serveur MCP');
console.log('='.repeat(50));

console.log('📁 Build directory:', existsSync(buildDir) ? '✅' : '❌');
console.log('⚙️  Config file:', existsSync(configFile) ? '✅' : '❌');
console.log('🚀 Main file:', existsSync(mainFile) ? '✅' : '❌');
console.log('📚 Docs directory:', existsSync(docsDir) ? '✅' : '❌');

if (existsSync(docsDir)) {
    const { readdirSync } = await import('fs');
    const subdirs = readdirSync(docsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    console.log('📚 Techs disponibles:', subdirs.join(', '));
}

console.log('='.repeat(50));

if (existsSync(configFile) && existsSync(mainFile)) {
    console.log('✅ Prêt pour le démarrage!');
    console.log('💡 Utilisez: npm start');
} else {
    console.log('❌ Configuration incomplète');
    console.log('💡 Utilisez: npm run build');
}
