import * as vscode from 'vscode';
import { DocumentationService } from './services/documentationService.js';

export class FullstackDocsProvider implements vscode.InlineCompletionItemProvider {
    private docService: DocumentationService;
    private isEnabled: boolean = true;

    constructor() {
        this.docService = new DocumentationService();
    }

    async provideInlineCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.InlineCompletionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.InlineCompletionItem[] | vscode.InlineCompletionList | null> {
        
        if (!this.isEnabled) return null;

        const lineText = document.lineAt(position).text;
        const beforeCursor = lineText.substring(0, position.character);
        
        // Détecter le contexte de programmation
        const language = document.languageId;
        const technology = this.detectTechnology(language, document.fileName);
        
        if (!technology) return null;

        // Extraire les mots-clés du contexte
        const keywords = this.extractKeywords(beforeCursor, lineText);
        
        if (keywords.length === 0) return null;

        try {
            // Rechercher dans la documentation
            const searchQuery = keywords.join(' ');
            const results = await this.docService.searchDocumentation(searchQuery, {
                technology,
                limit: 3
            });

            if (results.length === 0) return null;

            // Créer des suggestions basées sur la documentation
            const completions = this.createCompletions(results, beforeCursor, position);
            
            return completions;
            
        } catch (error) {
            console.error('Erreur lors de la recherche dans la documentation:', error);
            return null;
        }
    }

    private detectTechnology(language: string, fileName: string): string | null {
        const mapping: Record<string, string> = {
            'php': 'php',
            'javascript': 'javascript',
            'typescript': 'javascript',
            'html': 'html',
            'css': 'css',
            'scss': 'css',
            'sass': 'css',
            'sql': 'mysql',
            'yaml': fileName.includes('webpack') ? 'webpack' : 'symfony',
            'json': fileName.includes('webpack') ? 'webpack' : null
        };

        if (mapping[language]) {
            return mapping[language];
        }

        // Détecter Symfony dans les fichiers PHP
        if (language === 'php' && (
            fileName.includes('Controller') ||
            fileName.includes('Entity') ||
            fileName.includes('Repository') ||
            fileName.includes('Service')
        )) {
            return 'symfony';
        }

        return null;
    }

    private extractKeywords(beforeCursor: string, lineText: string): string[] {
        const keywords: string[] = [];
        
        // Mots-clés PHP/Symfony
        const phpPatterns = [
            /class\s+(\w+)/i,
            /function\s+(\w+)/i,
            /\$this->(\w+)/i,
            /#\[Route\(/i,
            /use\s+[\w\\]+\\(\w+)/i
        ];

        // Mots-clés JavaScript
        const jsPatterns = [
            /function\s+(\w+)/i,
            /const\s+(\w+)/i,
            /let\s+(\w+)/i,
            /\.(\w+)\(/i
        ];

        // Mots-clés CSS
        const cssPatterns = [
            /\.(\w+)\s*{/i,
            /#(\w+)\s*{/i,
            /(\w+):\s*/i
        ];

        const allPatterns = [...phpPatterns, ...jsPatterns, ...cssPatterns];
        
        for (const pattern of allPatterns) {
            const match = beforeCursor.match(pattern) || lineText.match(pattern);
            if (match && match[1]) {
                keywords.push(match[1]);
            }
        }

        // Ajouter des mots-clés contextuels
        if (beforeCursor.includes('Route')) keywords.push('routing');
        if (beforeCursor.includes('Controller')) keywords.push('controller');
        if (beforeCursor.includes('Entity')) keywords.push('entity');
        if (beforeCursor.includes('Repository')) keywords.push('repository');
        if (beforeCursor.includes('Service')) keywords.push('service');

        return keywords;
    }

    private createCompletions(
        results: any[], 
        beforeCursor: string, 
        position: vscode.Position
    ): vscode.InlineCompletionItem[] {
        const completions: vscode.InlineCompletionItem[] = [];

        for (const result of results) {
            // Extraire des exemples de code du contenu
            const codeBlocks = this.extractCodeBlocks(result.content);
            
            for (const codeBlock of codeBlocks) {
                const relevantLines = this.findRelevantLines(codeBlock, beforeCursor);
                
                if (relevantLines.length > 0) {
                    const completion = new vscode.InlineCompletionItem(
                        relevantLines.join('\n'),
                        new vscode.Range(position, position)
                    );
                    
                    completion.sortText = `${result.score}`;
                    completions.push(completion);
                }
            }
        }

        return completions.slice(0, 3); // Limiter à 3 suggestions
    }

    private extractCodeBlocks(content: string): string[] {
        const codeBlocks: string[] = [];
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)\n```/g;
        let match;

        while ((match = codeBlockRegex.exec(content)) !== null) {
            codeBlocks.push(match[1]);
        }

        return codeBlocks;
    }

    private findRelevantLines(codeBlock: string, beforeCursor: string): string[] {
        const lines = codeBlock.split('\n');
        const relevantLines: string[] = [];

        // Logique simple pour trouver les lignes pertinentes
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line && !line.startsWith('//') && !line.startsWith('*')) {
                // Si la ligne semble compléter le contexte
                if (this.isRelevantLine(line, beforeCursor)) {
                    relevantLines.push(line);
                    
                    // Ajouter quelques lignes de contexte
                    for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
                        const nextLine = lines[j].trim();
                        if (nextLine && !nextLine.startsWith('//')) {
                            relevantLines.push(nextLine);
                        }
                    }
                    break;
                }
            }
        }

        return relevantLines;
    }

    private isRelevantLine(line: string, beforeCursor: string): boolean {
        // Logique pour déterminer si une ligne est pertinente
        const lastWord = beforeCursor.trim().split(/\s+/).pop() || '';
        
        return line.toLowerCase().includes(lastWord.toLowerCase()) ||
               line.includes('public function') ||
               line.includes('private function') ||
               line.includes('class ') ||
               line.includes('const ') ||
               line.includes('let ') ||
               line.includes('function ');
    }

    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }
}
