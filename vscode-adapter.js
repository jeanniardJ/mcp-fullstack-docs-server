#!/usr/bin/env node

/**
 * Adaptateur VS Code pour le serveur MCP Fullstack Documentation
 * Fonctionne avec GitHub Copilot pour enrichir les suggestions
 */

import { DocumentationService } from './src/services/documentationService.js';

class VSCodeMCPAdapter {
    constructor() {
        this.docService = new DocumentationService();
        this.setupCopilotIntegration();
    }

    setupCopilotIntegration() {
        console.log('🔗 Adaptateur MCP pour VS Code démarré');
        console.log('📚 Technologies supportées:', this.docService.getTechnologies().join(', '));

        // Écouter les requêtes de VS Code/Copilot
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', async (data) => {
            try {
                const request = JSON.parse(data.trim());
                const response = await this.handleRequest(request);
                process.stdout.write(JSON.stringify(response) + '\n');
            } catch (error) {
                console.error('Erreur lors du traitement de la requête:', error);
            }
        });
    }

    async handleRequest(request) {
        const { method, params } = request;

        switch (method) {
            case 'search_context':
                return await this.searchContext(params);
            case 'get_completion_context':
                return await this.getCompletionContext(params);
            case 'list_technologies':
                return this.listTechnologies();
            default:
                return { error: `Méthode inconnue: ${method}` };
        }
    }

    async searchContext(params) {
        const { query, language, filename } = params;
        const technology = this.detectTechnology(language, filename);
        
        if (!technology) {
            return { results: [] };
        }

        const results = await this.docService.searchDocumentation(query, {
            technology,
            limit: 5
        });

        return {
            results: results.map(r => ({
                technology: r.technology,
                content: r.content,
                score: r.score,
                file: r.file,
                category: r.category
            }))
        };
    }

    async getCompletionContext(params) {
        const { currentLine, language, filename, cursorPosition } = params;
        
        // Extraire le contexte du code
        const keywords = this.extractKeywords(currentLine);
        const technology = this.detectTechnology(language, filename);
        
        if (!technology || keywords.length === 0) {
            return { context: null };
        }

        const searchQuery = keywords.join(' ');
        const results = await this.docService.searchDocumentation(searchQuery, {
            technology,
            limit: 3
        });

        return {
            context: {
                technology,
                keywords,
                suggestions: results.map(r => ({
                    content: this.extractCodeSnippets(r.content),
                    score: r.score
                }))
            }
        };
    }

    detectTechnology(language, filename) {
        const mapping = {
            'php': 'php',
            'javascript': 'javascript',
            'typescript': 'javascript',
            'html': 'html',
            'css': 'css',
            'scss': 'css',
            'sql': 'mysql',
            'yaml': 'symfony',
            'json': filename && filename.includes('webpack') ? 'webpack' : null
        };

        let tech = mapping[language];

        // Détection Symfony pour PHP
        if (language === 'php' && filename) {
            const symfonyPatterns = ['Controller', 'Entity', 'Repository', 'Service', 'Command'];
            if (symfonyPatterns.some(pattern => filename.includes(pattern))) {
                tech = 'symfony';
            }
        }

        return tech;
    }

    extractKeywords(line) {
        const keywords = [];
        
        // Patterns PHP/Symfony
        const patterns = [
            /class\s+(\w+)/i,
            /function\s+(\w+)/i,
            /\$this->(\w+)/i,
            /#\[Route\(/i,
            /use\s+[\w\\]+\\(\w+)/i,
            /const\s+(\w+)/i,
            /let\s+(\w+)/i,
            /\.(\w+)\(/i
        ];

        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match && match[1]) {
                keywords.push(match[1]);
            }
        }

        // Mots-clés contextuels
        const contextualKeywords = [
            'Route', 'Controller', 'Entity', 'Repository', 'Service',
            'function', 'class', 'const', 'let', 'var'
        ];

        for (const keyword of contextualKeywords) {
            if (line.includes(keyword) && !keywords.includes(keyword.toLowerCase())) {
                keywords.push(keyword.toLowerCase());
            }
        }

        return keywords;
    }

    extractCodeSnippets(content) {
        const codeBlocks = [];
        const regex = /```[\w]*\n([\s\S]*?)\n```/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            codeBlocks.push(match[1]);
        }

        return codeBlocks;
    }

    listTechnologies() {
        const technologies = this.docService.getTechnologies();
        return {
            technologies: technologies.map(tech => {
                const info = this.docService.getTechnologyInfo(tech);
                return {
                    name: tech,
                    displayName: info?.name || tech,
                    version: info?.version || 'N/A',
                    categories: info?.categories || []
                };
            })
        };
    }
}

// Démarrage de l'adaptateur
new VSCodeMCPAdapter();
