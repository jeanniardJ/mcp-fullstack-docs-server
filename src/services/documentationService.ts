import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, basename, relative, sep, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SearchResult, TechConfig, SearchOptions } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DocumentationService {
  private technologiesConfig: Record<string, TechConfig>;
  private correlations: Record<string, string[]>;
  private searchWeights: Record<string, number>;

  constructor(configPath?: string) {
    // Utiliser un chemin absolu basé sur la localisation du fichier
    const defaultConfigPath = join(__dirname, '..', 'config', 'technologies.json');
    const finalConfigPath = configPath || defaultConfigPath;
    
    if (!existsSync(finalConfigPath)) {
      throw new Error(`Configuration file not found: ${finalConfigPath}`);
    }
    
    const config = JSON.parse(readFileSync(finalConfigPath, 'utf-8'));
    this.technologiesConfig = config.technologies;
    this.correlations = config.correlations;
    this.searchWeights = config.searchWeights;
  }

  async searchDocumentation(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const technologies = options.technology ? [options.technology] : Object.keys(this.technologiesConfig);

    for (const tech of technologies) {
      if (!this.technologiesConfig[tech]) continue;

      const techResults = await this.searchInTechnology(query, tech, options);
      results.push(...techResults);
    }

    return this.rankResults(results, query).slice(0, options.limit || 10);
  }

  async searchCrossReference(query: string, technologies: string[]): Promise<SearchResult[]> {
    const allResults: SearchResult[] = [];

    for (const tech of technologies) {
      const results = await this.searchInTechnology(query, tech, {});
      allResults.push(...results);
    }

    // Groupe les résultats par pertinence croisée
    return this.correlateResults(allResults, query);
  }

  private async searchInTechnology(query: string, technology: string, options: SearchOptions): Promise<SearchResult[]> {
    const config = this.technologiesConfig[technology];
    if (!config) return [];

    const results: SearchResult[] = [];
    // Résoudre le chemin de documentation relative au répertoire du serveur
    const serverRoot = join(__dirname, '..', '..');
    const docsPath = resolve(serverRoot, config.docsPath);

    if (!existsSync(docsPath)) {
      console.warn(`Documentation path not found for ${technology}: ${docsPath}`);
      return [];
    }

    const files = this.getDocumentationFiles(docsPath, config.fileExtensions);

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const matches = this.findMatches(content, query, file, technology);
        
        if (options.category) {
          const categoryPath = join(docsPath, options.category);
          if (!file.startsWith(categoryPath)) continue;
        }

        results.push(...matches);
      } catch (error) {
        console.warn(`Error reading file ${file}:`, error);
      }
    }

    return results;
  }

  private getDocumentationFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    if (!existsSync(dir)) return files;

    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.getDocumentationFiles(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private findMatches(content: string, query: string, filePath: string, technology: string): SearchResult[] {
    const results: SearchResult[] = [];
    const lines = content.split('\n');
    const queryLower = query.toLowerCase();
    const config = this.technologiesConfig[technology];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLower = line.toLowerCase();

      if (lineLower.includes(queryLower)) {
        const context = this.extractContext(lines, i, 3);
        const score = this.calculateScore(line, query, filePath);
        
        const serverRoot = join(__dirname, '..', '..');
        const docsPath = resolve(serverRoot, config.docsPath);
        
        results.push({
          file: relative(docsPath, filePath),
          content: context,
          score,
          technology,
          line: i + 1,
          category: this.inferCategory(filePath, technology)
        });
      }
    }

    return results;
  }

  private extractContext(lines: string[], lineIndex: number, contextLines: number = 3): string {
    const start = Math.max(0, lineIndex - contextLines);
    const end = Math.min(lines.length, lineIndex + contextLines + 1);
    
    return lines.slice(start, end).join('\n');
  }

  private calculateScore(line: string, query: string, filePath: string): number {
    let score = 0;
    const lineLower = line.toLowerCase();
    const queryLower = query.toLowerCase();
    const fileName = basename(filePath).toLowerCase();

    // Score basé sur le type de contenu
    if (line.startsWith('#')) {
      score += this.searchWeights.heading;
    } else if (line.includes('```') || line.includes('`')) {
      score += this.searchWeights.code;
    } else {
      score += this.searchWeights.content;
    }

    // Bonus pour correspondance exacte
    if (lineLower.includes(queryLower)) {
      score += 1.0;
    }

    // Bonus pour nom de fichier pertinent
    if (fileName.includes(queryLower)) {
      score += this.searchWeights.filename;
    }

    // Bonus pour position dans le titre
    if (line.toLowerCase().includes(queryLower) && line.startsWith('#')) {
      score += this.searchWeights.title;
    }

    return score;
  }

  private rankResults(results: SearchResult[], query: string): SearchResult[] {
    return results.sort((a, b) => {
      // Tri par score décroissant
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      
      // En cas d'égalité, privilégier les résultats plus courts (plus précis)
      return a.content.length - b.content.length;
    });
  }

  private correlateResults(results: SearchResult[], query: string): SearchResult[] {
    // Groupe les résultats par sujet et trouve les corrélations
    const grouped = new Map<string, SearchResult[]>();
    
    for (const result of results) {
      const key = `${result.technology}_${result.category}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(result);
    }

    // Retourne les résultats corrélés avec score amélioré
    const correlatedResults: SearchResult[] = [];
    
    for (const [key, groupResults] of grouped) {
      const tech = key.split('_')[0];
      const relatedTechs = this.findRelatedTechnologies(tech, query);
      
      for (const result of groupResults) {
        if (relatedTechs.length > 0) {
          result.score *= 1.2; // Bonus pour corrélation
        }
        correlatedResults.push(result);
      }
    }

    return this.rankResults(correlatedResults, query);
  }

  private findRelatedTechnologies(technology: string, query: string): string[] {
    const related: string[] = [];
    
    for (const [topic, techs] of Object.entries(this.correlations)) {
      if (techs.includes(technology) && query.toLowerCase().includes(topic)) {
        related.push(...techs.filter(t => t !== technology));
      }
    }
    
    return [...new Set(related)];
  }

  private inferCategory(filePath: string, technology: string): string | undefined {
    const config = this.technologiesConfig[technology];
    if (!config) return undefined;

    const serverRoot = join(__dirname, '..', '..');
    const docsPath = resolve(serverRoot, config.docsPath);
    const relativePath = relative(docsPath, filePath);
    const pathParts = relativePath.split(sep);

    for (const category of config.categories) {
      if (pathParts.some((part: string) => part.toLowerCase().includes(category))) {
        return category;
      }
    }

    return undefined;
  }

  getTechnologies(): string[] {
    return Object.keys(this.technologiesConfig);
  }

  getCategories(technology: string): string[] {
    return this.technologiesConfig[technology]?.categories || [];
  }

  getTechnologyInfo(technology: string): TechConfig | undefined {
    return this.technologiesConfig[technology];
  }
}
