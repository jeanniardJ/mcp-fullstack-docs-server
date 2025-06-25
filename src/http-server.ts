#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DocumentationService } from './services/documentationService.js';
import { ToolHandlers } from './handlers/toolHandlers.js';
import express, { Request, Response } from 'express';
import cors from 'cors';

/**
 * Serveur MCP Fullstack Documentation - Version HTTP
 * 
 * Serveur MCP autonome accessible via HTTP/SSE :
 * - Port configurable (défaut: 3000)
 * - CORS activé pour développement
 * - API REST + Server-Sent Events
 * - Interface web de diagnostic
 * 
 * Usage:
 *   node build/http-server.js [port]
 * 
 * Configuration MCP (Claude Desktop HTTP):
 *   "fullstack-docs": {
 *     "url": "http://localhost:3000/mcp",
 *     "type": "sse"
 *   }
 */
class FullstackDocsHttpServer {
  private server: Server;
  private docService: DocumentationService | null = null;
  private toolHandlers: ToolHandlers | null = null;
  private app: express.Application;
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
    this.app = express();
    
    // Configuration Express
    this.app.use(cors());
    this.app.use(express.json());
    
    // Serveur MCP
    this.server = new Server({
      name: "mcp-fullstack-docs-server-http",
      version: "1.0.0"
    });

    this.setupHandlers();
    this.initializeServices();
    this.setupRoutes();
  }

  private setupHandlers() {
    // Gestionnaire de listing des outils
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      if (!this.toolHandlers) {
        throw new Error('Services non initialisés');
      }

      return {
        tools: [
          {
            name: 'mcp_fullstack-doc_list_technologies',
            description: 'Liste toutes les technologies disponibles dans la documentation',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false
            }
          },
          {
            name: 'mcp_fullstack-doc_get_categories',
            description: 'Obtient les catégories disponibles pour une technologie',
            inputSchema: {
              type: 'object',
              properties: {
                technology: {
                  type: 'string',
                  description: 'Nom de la technologie'
                }
              },
              required: ['technology'],
              additionalProperties: false
            }
          },
          {
            name: 'mcp_fullstack-doc_search_docs',
            description: 'Recherche dans la documentation des technologies full-stack',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Terme de recherche'
                },
                technology: {
                  type: 'string',
                  description: 'Technologie spécifique (optionnel)'
                },
                category: {
                  type: 'string',
                  description: 'Catégorie dans la technologie (optionnel)'
                },
                limit: {
                  type: 'number',
                  description: 'Nombre maximum de résultats (défaut: 10)',
                  default: 10
                }
              },
              required: ['query'],
              additionalProperties: false
            }
          },
          {
            name: 'mcp_fullstack-doc_search_cross_reference',
            description: 'Recherche croisée entre plusieurs technologies',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Terme de recherche'
                },
                technologies: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Liste des technologies à inclure dans la recherche'
                }
              },
              required: ['query', 'technologies'],
              additionalProperties: false
            }
          }
        ]
      };
    });

    // Gestionnaire d'appel d'outils
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (!this.toolHandlers) {
        throw new Error('Services non initialisés');
      }

      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'mcp_fullstack-doc_list_technologies':
            return await this.toolHandlers.handleListTechnologies();

          case 'mcp_fullstack-doc_get_categories':
            return await this.toolHandlers.handleGetCategories(args as { technology: string });

          case 'mcp_fullstack-doc_search_docs':
            return await this.toolHandlers.handleSearchDocs(args as {
              query: string;
              technology?: string;
              category?: string;
              limit?: number;
            });

          case 'mcp_fullstack-doc_search_cross_reference':
            return await this.toolHandlers.handleSearchCrossRef(args as {
              query: string;
              technologies: string[];
            });

          default:
            throw new Error(`Outil inconnu: ${name}`);
        }
      } catch (error) {
        console.error(`Erreur lors de l'exécution de l'outil ${name}:`, error);
        throw error;
      }
    });
  }

  private async initializeServices() {
    try {
      this.docService = new DocumentationService();
      this.toolHandlers = new ToolHandlers(this.docService);
      
      console.error("✅ Services MCP HTTP initialisés avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation des services MCP HTTP:", error);
      throw error;
    }
  }

  private setupRoutes() {
    // Route de santé
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        server: 'mcp-fullstack-docs-server-http',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        technologies: this.docService?.getTechnologies()?.length || 0
      });
    });

    // Interface de diagnostic
    this.app.get('/', (req, res) => {
      res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>MCP Fullstack Docs Server</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
        .status.ok { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .endpoint { background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0; }
        .code { background: #f1f3f4; padding: 10px; border-radius: 4px; font-family: monospace; }
        ul { padding-left: 20px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 MCP Fullstack Documentation Server</h1>
        
        <div class="status ok">
            ✅ Serveur HTTP actif sur le port ${this.port}
        </div>
        
        <h2>📡 Endpoints MCP</h2>
        <div class="endpoint">
            <strong>SSE Endpoint:</strong> <code>http://localhost:${this.port}/mcp</code><br>
            <small>Utilisez cet endpoint pour la configuration MCP Claude Desktop</small>
        </div>
        
        <h2>🔧 API REST</h2>
        <div class="endpoint">
            <strong>GET</strong> <code>/health</code> - État du serveur<br>
            <strong>GET</strong> <code>/api/technologies</code> - Liste des technologies<br>
            <strong>GET</strong> <code>/api/search?q=term&tech=symfony</code> - Recherche
        </div>
        
        <h2>📚 Technologies disponibles</h2>
        <ul>
            <li><strong>Symfony</strong> 6.4 LTS + 7.3 Latest</li>
            <li><strong>PHP</strong> 8.2+ avec Enums, Attributs, Fibers</li>
            <li><strong>HTML5</strong> complet depuis MDN Mozilla</li>
            <li><strong>MySQL</strong> 8.0, JavaScript ES2023, CSS3</li>
            <li><strong>Doctrine</strong> ORM, Webpack</li>
        </ul>
        
        <h2>⚙️ Configuration Claude Desktop</h2>
        <div class="code">
{
  "mcpServers": {
    "fullstack-docs": {
      "url": "http://localhost:${this.port}/mcp",
      "type": "sse"
    }
  }
}
        </div>
        
        <h2>🧪 Test rapide</h2>
        <p><a href="/health" target="_blank">Tester l'endpoint /health</a></p>
    </div>
</body>
</html>
      `);
    });

    // API REST pour tests
    this.app.get('/api/technologies', async (req, res) => {
      try {
        if (!this.toolHandlers) {
          return res.status(500).json({ error: 'Services non initialisés' });
        }
        
        const result = await this.toolHandlers.handleListTechnologies();
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erreur inconnue' });
      }
    });

    this.app.get('/api/search', async (req, res) => {
      try {
        if (!this.toolHandlers) {
          return res.status(500).json({ error: 'Services non initialisés' });
        }
        
        const { q: query, tech: technology, cat: category, limit } = req.query;
        
        if (!query) {
          return res.status(400).json({ error: 'Paramètre "q" requis' });
        }
        
        const result = await this.toolHandlers.handleSearchDocs({
          query: query as string,
          technology: technology as string,
          category: category as string,
          limit: limit ? parseInt(limit as string) : 10
        });
        
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message || 'Erreur inconnue' });
      }
    });

    // Endpoint MCP SSE
    this.app.get('/mcp', (req, res) => {
      const transport = new SSEServerTransport('/mcp', res);
      this.server.connect(transport);
    });
  }

  async start() {
    return new Promise<void>((resolve) => {
      this.app.listen(this.port, () => {
        console.error(`✅ Serveur MCP HTTP démarré sur http://localhost:${this.port}`);
        console.error(`🔧 Interface web: http://localhost:${this.port}`);
        console.error(`📡 Endpoint MCP: http://localhost:${this.port}/mcp`);
        console.error(`🔍 API Health: http://localhost:${this.port}/health`);
        console.error(`📚 Technologies supportées: Symfony, PHP, Doctrine, MySQL, JavaScript, HTML, CSS, Webpack`);
        resolve();
      });
    });
  }
}

// Démarrage du serveur HTTP
const port = parseInt(process.argv[2]) || 3000;
const server = new FullstackDocsHttpServer(port);
server.start().catch(console.error);
