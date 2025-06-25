import { DocumentationService } from '../services/documentationService.js';
import { SearchResult } from '../types/index.js';

export class ToolHandlers {
  constructor(private docService: DocumentationService) {}

  async handleSearchDocs(args: any) {
    try {
      const { query, technology, category, limit = 10 } = args;
      
      if (!query) {
        return {
          content: [{
            type: "text",
            text: "Erreur: Le paramètre 'query' est requis."
          }],
          isError: true
        };
      }

      const results = await this.docService.searchDocumentation(query, {
        technology,
        category,
        limit: parseInt(limit)
      });

      return {
        content: [{
          type: "text",
          text: this.formatSearchResults(results, query)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Erreur lors de la recherche: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        }],
        isError: true
      };
    }
  }

  async handleSearchCrossRef(args: any) {
    try {
      const { query, technologies } = args;
      
      if (!query) {
        return {
          content: [{
            type: "text",
            text: "Erreur: Le paramètre 'query' est requis."
          }],
          isError: true
        };
      }

      const techList = Array.isArray(technologies) ? technologies : [technologies];
      const results = await this.docService.searchCrossReference(query, techList);

      return {
        content: [{
          type: "text",
          text: this.formatCrossReferenceResults(results, query, techList)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Erreur lors de la recherche croisée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        }],
        isError: true
      };
    }
  }

  async handleListTechnologies() {
    try {
      const technologies = this.docService.getTechnologies();
      const techInfo = technologies.map(tech => {
        const info = this.docService.getTechnologyInfo(tech);
        return `- **${info?.name || tech}** (${info?.version || 'N/A'})`;
      }).join('\n');

      return {
        content: [{
          type: "text",
          text: `# Technologies disponibles\n\n${techInfo}\n\nUtilisez \`search_docs\` pour rechercher dans une technologie spécifique.`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Erreur lors de la récupération des technologies: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        }],
        isError: true
      };
    }
  }

  async handleGetCategories(args: any) {
    try {
      const { technology } = args;
      
      if (!technology) {
        return {
          content: [{
            type: "text",
            text: "Erreur: Le paramètre 'technology' est requis."
          }],
          isError: true
        };
      }

      const categories = this.docService.getCategories(technology);
      const techInfo = this.docService.getTechnologyInfo(technology);

      if (!techInfo) {
        return {
          content: [{
            type: "text",
            text: `Technologie '${technology}' non trouvée.`
          }],
          isError: true
        };
      }

      const categoriesList = categories.map(cat => `- ${cat}`).join('\n');

      return {
        content: [{
          type: "text",
          text: `# Catégories pour ${techInfo.name}\n\n${categoriesList}\n\nUtilisez ces catégories avec \`search_docs\` pour affiner votre recherche.`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Erreur lors de la récupération des catégories: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        }],
        isError: true
      };
    }
  }

  private formatSearchResults(results: SearchResult[], query: string): string {
    if (results.length === 0) {
      return `Aucun résultat trouvé pour "${query}".`;
    }

    let output = `# Résultats de recherche pour "${query}"\n\n`;
    output += `${results.length} résultat(s) trouvé(s).\n\n`;

    for (const result of results) {
      output += `## ${result.technology}`;
      if (result.category) {
        output += ` > ${result.category}`;
      }
      output += `\n\n`;
      
      output += `**Fichier:** \`${result.file}\``;
      if (result.line) {
        output += ` (ligne ${result.line})`;
      }
      output += `\n\n`;
      
      output += `**Score:** ${result.score.toFixed(2)}\n\n`;
      
      output += "```\n";
      output += result.content;
      output += "\n```\n\n";
      output += "---\n\n";
    }

    return output;
  }

  private formatCrossReferenceResults(results: SearchResult[], query: string, technologies: string[]): string {
    if (results.length === 0) {
      return `Aucun résultat trouvé pour "${query}" dans les technologies: ${technologies.join(', ')}.`;
    }

    let output = `# Recherche croisée pour "${query}"\n\n`;
    output += `Technologies: ${technologies.join(', ')}\n\n`;
    output += `${results.length} résultat(s) corrélé(s) trouvé(s).\n\n`;

    // Groupe par technologie
    const groupedResults = new Map<string, SearchResult[]>();
    for (const result of results) {
      if (!groupedResults.has(result.technology)) {
        groupedResults.set(result.technology, []);
      }
      groupedResults.get(result.technology)!.push(result);
    }

    for (const [tech, techResults] of groupedResults) {
      output += `## ${tech.toUpperCase()}\n\n`;
      
      for (const result of techResults.slice(0, 3)) { // Limite à 3 résultats par technologie
        output += `### ${result.file}`;
        if (result.line) {
          output += ` (ligne ${result.line})`;
        }
        output += `\n\n`;
        
        output += "```\n";
        output += result.content;
        output += "\n```\n\n";
      }
      
      output += "---\n\n";
    }

    return output;
  }
}
