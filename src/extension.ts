import * as vscode from 'vscode';
import { FullstackDocsProvider } from './vscode/fullstackDocsProvider.js';
import { DocumentationService } from './services/documentationService.js';

let docsProvider: FullstackDocsProvider;
let docService: DocumentationService;

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension Fullstack Docs activée');

    // Initialiser les services
    docService = new DocumentationService();
    docsProvider = new FullstackDocsProvider();

    // Enregistrer le provider pour l'auto-complétion
    const provider = vscode.languages.registerInlineCompletionItemProvider(
        [
            { scheme: 'file', language: 'php' },
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'html' },
            { scheme: 'file', language: 'css' },
            { scheme: 'file', language: 'scss' },
            { scheme: 'file', language: 'sql' },
            { scheme: 'file', language: 'yaml' },
            { scheme: 'file', language: 'json' }
        ],
        docsProvider
    );

    // Commandes
    const searchCommand = vscode.commands.registerCommand('fullstackDocs.searchDocs', async () => {
        const query = await vscode.window.showInputBox({
            prompt: 'Rechercher dans la documentation',
            placeHolder: 'Ex: controller symfony, mysql optimization, css grid...'
        });

        if (query) {
            const results = await docService.searchDocumentation(query, { limit: 10 });
            showSearchResults(results, query);
        }
    });

    const listTechCommand = vscode.commands.registerCommand('fullstackDocs.listTechnologies', () => {
        const technologies = docService.getTechnologies();
        const techInfo = technologies.map(tech => {
            const info = docService.getTechnologyInfo(tech);
            return `${info?.name || tech} (${info?.version || 'N/A'})`;
        });

        vscode.window.showQuickPick(techInfo, {
            title: 'Technologies disponibles',
            canPickMany: false
        }).then(selected => {
            if (selected) {
                const techName = selected.split(' ')[0].toLowerCase();
                const categories = docService.getCategories(techName);
                vscode.window.showInformationMessage(
                    `Catégories pour ${selected}: ${categories.join(', ')}`
                );
            }
        });
    });

    const restartCommand = vscode.commands.registerCommand('fullstackDocs.restart', () => {
        // Réinitialiser les services
        docService = new DocumentationService();
        docsProvider = new FullstackDocsProvider();
        vscode.window.showInformationMessage('Serveur de documentation redémarré');
    });

    // Ajouter les disposables au contexte
    context.subscriptions.push(provider, searchCommand, listTechCommand, restartCommand);

    // Afficher un message de bienvenue
    vscode.window.showInformationMessage(
        'Documentation Fullstack activée! Utilisez Ctrl+Shift+P puis "Fullstack Docs" pour commencer.'
    );
}

export function deactivate() {
    console.log('Extension Fullstack Docs désactivée');
}

async function showSearchResults(results: any[], query: string) {
    if (results.length === 0) {
        vscode.window.showInformationMessage(`Aucun résultat trouvé pour "${query}"`);
        return;
    }

    // Créer un document temporaire avec les résultats
    const content = formatSearchResults(results, query);
    const doc = await vscode.workspace.openTextDocument({
        content,
        language: 'markdown'
    });
    
    await vscode.window.showTextDocument(doc);
}

function formatSearchResults(results: any[], query: string): string {
    let content = `# Résultats de recherche pour "${query}"\n\n`;
    content += `${results.length} résultat(s) trouvé(s).\n\n`;

    for (const result of results) {
        content += `## ${result.technology}`;
        if (result.category) {
            content += ` > ${result.category}`;
        }
        content += `\n\n`;
        
        content += `**Fichier:** \`${result.file}\``;
        if (result.line) {
            content += ` (ligne ${result.line})`;
        }
        content += `\n\n`;
        
        content += `**Score:** ${result.score.toFixed(2)}\n\n`;
        
        content += "```\n";
        content += result.content;
        content += "\n```\n\n";
        content += "---\n\n";
    }

    return content;
}
