#!/usr/bin/env node

/**
 * Script pour télécharger plusieurs versions de la documentation Symfony
 * Supporte Symfony 6.4 et 7.3 avec documentation complète
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs');

console.log('📥 Téléchargement multi-versions de la documentation Symfony...');

// Configuration des versions Symfony
const SYMFONY_VERSIONS = [
    {
        version: '6.4',
        branch: '6.4',
        name: 'LTS',
        description: 'Version Long Term Support'
    },
    {
        version: '7.3',
        branch: '7.3', 
        name: 'Latest',
        description: 'Version stable la plus récente'
    }
];

// Pages de documentation à télécharger pour chaque version
const DOC_PAGES = [
    // Contrôleurs et routing
    { file: 'controller.rst', category: 'controller', name: 'controllers-basics.md' },
    { file: 'routing.rst', category: 'routing', name: 'routing-advanced.md' },
    { file: 'routing/requirements.rst', category: 'routing', name: 'routing-requirements.md' },
    { file: 'routing/custom_route_loader.rst', category: 'routing', name: 'routing-custom-loader.md' },
    
    // Formulaires
    { file: 'forms.rst', category: 'forms', name: 'forms-basics.md' },
    { file: 'forms/form_types.rst', category: 'forms', name: 'forms-types.md' },
    { file: 'forms/data_transformers.rst', category: 'forms', name: 'forms-transformers.md' },
    { file: 'forms/dynamic_form_modification.rst', category: 'forms', name: 'forms-dynamic.md' },
    
    // Sécurité
    { file: 'security.rst', category: 'security', name: 'security-basics.md' },
    { file: 'security/authentication.rst', category: 'security', name: 'security-authentication.md' },
    { file: 'security/authorization.rst', category: 'security', name: 'security-authorization.md' },
    { file: 'security/voters.rst', category: 'security', name: 'security-voters.md' },
    { file: 'security/user_providers.rst', category: 'security', name: 'security-user-providers.md' },
    
    // Cache
    { file: 'cache.rst', category: 'cache', name: 'cache-basics.md' },
    { file: 'cache/cache_pools.rst', category: 'cache', name: 'cache-pools.md' },
    
    // Services et DI
    { file: 'service_container.rst', category: 'services', name: 'service-container.md' },
    { file: 'service_container/autowiring.rst', category: 'services', name: 'services-autowiring.md' },
    { file: 'service_container/tags.rst', category: 'services', name: 'services-tags.md' },
    { file: 'service_container/service_decoration.rst', category: 'services', name: 'services-decoration.md' },
    
    // Configuration
    { file: 'configuration.rst', category: 'configuration', name: 'configuration-basics.md' },
    { file: 'configuration/environments.rst', category: 'configuration', name: 'configuration-environments.md' },
    { file: 'configuration/secrets.rst', category: 'configuration', name: 'configuration-secrets.md' },
    
    // Templates et Twig
    { file: 'templates.rst', category: 'templates', name: 'templates-basics.md' },
    { file: 'templating.rst', category: 'templates', name: 'templating-advanced.md' },
    
    // Console et commandes
    { file: 'console.rst', category: 'console', name: 'console-basics.md' },
    { file: 'console/commands.rst', category: 'commands', name: 'commands-custom.md' },
    
    // Events et listeners
    { file: 'event_dispatcher.rst', category: 'events', name: 'events-basics.md' },
    { file: 'event_dispatcher/method_behavior.rst', category: 'events', name: 'events-method-behavior.md' },
    
    // Tests
    { file: 'testing.rst', category: 'testing', name: 'testing-basics.md' },
    { file: 'testing/functional.rst', category: 'testing', name: 'testing-functional.md' },
    { file: 'testing/database.rst', category: 'testing', name: 'testing-database.md' },
    
    // Validation
    { file: 'validation.rst', category: 'validation', name: 'validation-basics.md' },
    { file: 'validation/custom_constraint.rst', category: 'validation', name: 'validation-custom.md' },
    
    // Serializer
    { file: 'serializer.rst', category: 'serializer', name: 'serializer-basics.md' },
    { file: 'serializer/custom_encoders.rst', category: 'serializer', name: 'serializer-encoders.md' },
    
    // Déploiement
    { file: 'deployment.rst', category: 'deployment', name: 'deployment-basics.md' },
    { file: 'deployment/proxies.rst', category: 'deployment', name: 'deployment-proxies.md' }
];

/**
 * Convertit le contenu RST en Markdown basique
 */
function convertRstToMarkdown(content) {
    return content
        // Titres
        .replace(/^=+$/gm, '')
        .replace(/^-+$/gm, '')
        .replace(/^~+$/gm, '')
        .replace(/^(.+)\n=+$/gm, '# $1')
        .replace(/^(.+)\n-+$/gm, '## $1')
        .replace(/^(.+)\n~+$/gm, '### $1')
        
        // Code blocks
        .replace(/\.\. code-block:: (\w+)/g, '```$1')
        .replace(/\.\. code-block::/g, '```')
        
        // Links
        .replace(/:doc:`([^`]+)`/g, '[$1]')
        .replace(/:ref:`([^`]+)`/g, '[$1]')
        
        // Notes et warnings
        .replace(/\.\. note::/g, '> **Note:**')
        .replace(/\.\. warning::/g, '> **⚠️ Attention:**')
        .replace(/\.\. tip::/g, '> **💡 Astuce:**')
        
        // Directives
        .replace(/\.\. _[^:]+:/g, '')
        .replace(/\.\. include::/g, '')
        
        // Nettoyer les espaces
        .replace(/\n\n\n+/g, '\n\n')
        .trim();
}

/**
 * Télécharge la documentation pour une version spécifique
 */
async function downloadVersionDocs(version) {
    console.log(`\n🔄 Téléchargement Symfony ${version.version} (${version.name})...`);
    
    const versionDir = join(DOCS_DIR, `symfony-${version.version}`);
    if (!existsSync(versionDir)) {
        mkdirSync(versionDir, { recursive: true });
    }

    let successCount = 0;
    let errorCount = 0;

    for (const doc of DOC_PAGES) {
        const url = `https://raw.githubusercontent.com/symfony/symfony-docs/${version.branch}/${doc.file}`;
        const categoryDir = join(versionDir, doc.category);
        
        if (!existsSync(categoryDir)) {
            mkdirSync(categoryDir, { recursive: true });
        }

        const filePath = join(categoryDir, doc.name);
        
        try {
            console.log(`  📄 ${doc.name}...`);
            
            let content = '';
            try {
                // Essayer avec curl d'abord
                content = execSync(`curl -s "${url}"`, { encoding: 'utf-8' });
            } catch {
                try {
                    // Fallback vers Node.js fetch
                    const response = await fetch(url);
                    content = await response.text();
                } catch (fetchError) {
                    throw new Error(`Erreur de téléchargement: ${fetchError.message}`);
                }
            }

            // Vérifier si le contenu est valide (pas une erreur 404)
            if (content.includes('404: Not Found') || content.length < 100) {
                console.log(`    ⚠️  Fichier non trouvé ou vide: ${doc.file}`);
                errorCount++;
                continue;
            }

            // Convertir RST en Markdown
            const markdown = convertRstToMarkdown(content);
            
            // Ajouter un en-tête avec les métadonnées
            const header = `# ${doc.name.replace('.md', '').replace('-', ' ')}

> **Symfony ${version.version}** - ${version.description}  
> **Source:** [${doc.file}](${url})  
> **Catégorie:** ${doc.category}

---

`;

            writeFileSync(filePath, header + markdown);
            successCount++;
            
        } catch (error) {
            console.log(`    ❌ Erreur: ${error.message}`);
            errorCount++;
        }
    }

    console.log(`✅ Symfony ${version.version}: ${successCount} fichiers téléchargés, ${errorCount} erreurs`);
    
    // Créer un fichier de résumé pour cette version
    const summaryPath = join(versionDir, 'README.md');
    const summaryContent = `# Documentation Symfony ${version.version}

${version.description}

## 📊 Statistiques
- **Fichiers téléchargés:** ${successCount}
- **Erreurs:** ${errorCount}
- **Total:** ${DOC_PAGES.length}

## 📚 Catégories disponibles

${Array.from(new Set(DOC_PAGES.map(d => d.category)))
  .map(cat => `- **${cat}** - ${DOC_PAGES.filter(d => d.category === cat).length} fichiers`)
  .join('\n')}

## 🔗 Source
Documentation officielle téléchargée depuis: https://github.com/symfony/symfony-docs/tree/${version.branch}

---
*Généré automatiquement le ${new Date().toLocaleString('fr-FR')}*
`;
    
    writeFileSync(summaryPath, summaryContent);
    
    return { successCount, errorCount };
}

/**
 * Met à jour la configuration avec les nouvelles versions
 */
function updateConfig() {
    console.log('\n⚙️ Mise à jour de la configuration...');
    
    const configPath = join(__dirname, '..', 'src', 'config', 'technologies.json');
    const buildConfigPath = join(__dirname, '..', 'build', 'config', 'technologies.json');
    
    try {
        // Lire la config actuelle
        const config = JSON.parse(readFileSync(configPath, 'utf-8'));
        
        // Mettre à jour Symfony avec les versions multiples
        if (config.symfony) {
            config.symfony.versions = SYMFONY_VERSIONS.map(v => ({
                version: v.version,
                name: v.name,
                description: v.description,
                path: `symfony-${v.version}`
            }));
            
            config.symfony.description = "Framework PHP moderne - Versions 6.4 LTS et 7.3 Latest";
            config.symfony.lastUpdated = new Date().toISOString();
        }
        
        // Sauvegarder les configs
        writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        if (existsSync(buildConfigPath)) {
            writeFileSync(buildConfigPath, JSON.stringify(config, null, 2));
        }
        
        console.log('✅ Configuration mise à jour');
        
    } catch (error) {
        console.log(`⚠️ Erreur de mise à jour de la config: ${error.message}`);
    }
}

/**
 * Fonction principale
 */
async function main() {
    console.log('🚀 Début du téléchargement multi-versions Symfony...\n');
    
    let totalSuccess = 0;
    let totalErrors = 0;
    
    for (const version of SYMFONY_VERSIONS) {
        const result = await downloadVersionDocs(version);
        totalSuccess += result.successCount;
        totalErrors += result.errorCount;
    }
    
    // Mettre à jour la configuration
    updateConfig();
    
    console.log(`\n🎉 Téléchargement terminé !`);
    console.log(`📊 Total: ${totalSuccess} fichiers téléchargés, ${totalErrors} erreurs`);
    console.log(`📁 Documentation disponible dans: docs/symfony-6.4/ et docs/symfony-7.3/`);
    
    return { totalSuccess, totalErrors };
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { main as downloadSymfonyMultiVersions };
