export interface SearchResult {
  file: string;
  content: string;
  score: number;
  technology: string;
  category?: string;
  line?: number;
}

export interface TechConfig {
  name: string;
  version: string;
  docsPath: string;
  categories: string[];
  fileExtensions: string[];
}

export interface SearchOptions {
  technology?: string;
  category?: string;
  limit?: number;
  includeCode?: boolean;
}

export interface CrossReference {
  technologies: string[];
  topic: string;
  relevance: number;
  connections: Array<{
    tech1: string;
    tech2: string;
    relationship: string;
  }>;
}
