#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DocumentationService } from './services/documentationService.js';
import { ToolHandlers } from './handlers/toolHandlers.js';

class FullstackDocsServer {
  private server: Server;
  private docService: DocumentationService | null = null;
  private toolHandlers: ToolHandlers | null = null;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-fullstack-docs-server",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.setupHandlers();
    this.initializeServices();
  }

  private async initializeServices() {
    try {
      this.docService = new DocumentationService();
      this.toolHandlers = new ToolHandlers(this.docService);
      console.error("✅ Services MCP initialisés avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation:", error instanceof Error ? error.message : error);
      console.error("💡 Assurez-vous que 'npm run build' a été exécuté");
    }
  }

  private setupHandlers() {
    // Liste des outils disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "search_docs",
            description: "Recherche dans la documentation des technologies full-stack",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Terme de recherche"
                },
                technology: {
                  type: "string",
                  description: "Technologie spécifique (optionnel)",
                  enum: ["symfony", "php", "doctrine", "mysql", "javascript", "html", "css", "webpack"]
                },
                category: {
                  type: "string",
                  description: "Catégorie dans la technologie (optionnel)"
                },
                limit: {
                  type: "number",
                  description: "Nombre maximum de résultats (défaut: 10)",
                  default: 10
                }
              },
              required: ["query"]
            }
          },
          {
            name: "search_cross_reference",
            description: "Recherche croisée entre plusieurs technologies",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Terme de recherche"
                },
                technologies: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["symfony", "php", "doctrine", "mysql", "javascript", "html", "css", "webpack"]
                  },
                  description: "Liste des technologies à inclure dans la recherche"
                }
              },
              required: ["query", "technologies"]
            }
          },
          {
            name: "list_technologies",
            description: "Liste toutes les technologies disponibles",
            inputSchema: {
              type: "object",
              properties: {}
            }
          },
          {
            name: "get_categories",
            description: "Obtient les catégories disponibles pour une technologie",
            inputSchema: {
              type: "object",
              properties: {
                technology: {
                  type: "string",
                  description: "Nom de la technologie",
                  enum: ["symfony", "php", "doctrine", "mysql", "javascript", "html", "css", "webpack"]
                }
              },
              required: ["technology"]
            }
          }
        ]
      };
    });

    // Gestionnaire d'appel d'outils
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Vérifier que les services sont initialisés
      if (!this.toolHandlers) {
        return {
          content: [{
            type: "text",
            text: "❌ Services non initialisés. Vérifiez la configuration."
          }],
          isError: true
        };
      }

      try {
        switch (name) {
          case "search_docs":
            return await this.toolHandlers.handleSearchDocs(args);
          
          case "search_cross_reference":
            return await this.toolHandlers.handleSearchCrossRef(args);
          
          case "list_technologies":
            return await this.toolHandlers.handleListTechnologies();
          
          case "get_categories":
            return await this.toolHandlers.handleGetCategories(args);
          
          default:
            return {
              content: [{
                type: "text",
                text: `Outil inconnu: ${name}`
              }],
              isError: true
            };
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Erreur lors de l'exécution de l'outil ${name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          }],
          isError: true
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error("✅ Serveur MCP Fullstack Docs démarré");
    console.error("🔧 Technologies supportées: Symfony, PHP, Doctrine, MySQL, JavaScript, HTML, CSS, Webpack");
  }
}

// Démarrage du serveur
const server = new FullstackDocsServer();
server.run().catch(console.error);
