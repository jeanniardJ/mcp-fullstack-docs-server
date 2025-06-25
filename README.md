# 🚀 MCP Fullstack Documentation Server

> **Serveur MCP complet pour la documentation fullstack** - Symfony, PHP, Doctrine, MySQL, JavaScript, HTML, CSS, Webpack

[![GitHub](https://img.shields.io/badge/GitHub-jeanniardJ-blue?logo=github)](https://github.com/jeanniardJ)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-orange.svg)](https://modelcontextprotocol.io/)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-purple.svg)](https://code.visualstudio.com/)

**Serveur MCP (Model Context Protocol) complet pour la documentation des technologies fullstack modernes.**

Intégration native avec **GitHub Copilot** et **VS Code** pour accéder instantanément à la documentation de Symfony, PHP, Doctrine, MySQL, JavaScript, CSS, HTML et Webpack.

## ✨ Fonctionnalités

- 🔍 **Recherche intelligente** dans 8 technologies fullstack
- 📚 **Documentation officielle** téléchargée automatiquement  
- 🤖 **Intégration GitHub Copilot** native
- 🛠️ **Extension VS Code** avec auto-complétion
- ⚡ **Recherche croisée** entre technologies
- 🎯 **38+ fichiers** de documentation (845 KB)
- 🔄 **Mise à jour automatique** des sources

## 📚 Technologies supportées

| Technologie    | Version | Fichiers    | Status              |
| -------------- | ------- | ----------- | ------------------- |
| **Symfony**    | 7.1     | 21 fichiers | ✅ Officielle GitHub |
| **PHP**        | 8.2     | 3 fichiers  | ✅ Exemples avancés  |
| **MySQL**      | 8.0     | 8 fichiers  | ✅ Guide complet     |
| **JavaScript** | ES2023  | 2 fichiers  | ✅ MDN officiel      |
| **CSS**        | 3       | 2 fichiers  | ✅ Layouts modernes  |
| **HTML**       | 5       | À venir     | 🔄 En développement  |
| **Doctrine**   | 3.0     | 1 fichier   | ✅ ORM officiel      |
| **Webpack**    | 5.89    | 1 fichier   | ✅ Configuration     |

## 🚀 Installation rapide

```bash
# Installer les dépendances
npm install

# Télécharger toute la documentation
npm run docs:update

# Démarrer le serveur MCP
npm start
```

## 🎯 Utilisation avec GitHub Copilot

Dans le chat GitHub Copilot, utilisez directement les commandes MCP :

```
# Lister toutes les technologies
@mcp_fullstack-doc_list_technologies

# Rechercher dans une technologie
@mcp_fullstack-doc_search_docs query="routing" technology="symfony"

# Recherche croisée entre technologies  
@mcp_fullstack-doc_search_cross_reference query="cache" technologies=["symfony","mysql"]

# Voir les catégories disponibles
@mcp_fullstack-doc_get_categories technology="mysql"
```
```

## Utilisation

### Démarrage du serveur
```bash
npm start
```

### Mode développement
```bash
npm run dev
```

## Outils disponibles

### `search_docs`
Recherche dans la documentation d'une ou toutes les technologies.

```json
{
  "query": "controller",
  "technology": "symfony",
  "category": "controllers",
  "limit": 5
}
```

### `search_cross_reference`
Recherche croisée entre plusieurs technologies.

```json
{
  "query": "authentication",
  "technologies": ["symfony", "php", "mysql"]
}
```

### `list_technologies`
Liste toutes les technologies disponibles.

### `get_categories`
Obtient les catégories d'une technologie spécifique.

```json
{
  "technology": "symfony"
}
```

## Structure de la documentation

```
docs/
├── symfony/
│   ├── controllers/
│   ├── routing/
│   ├── forms/
│   └── security/
├── php/
│   ├── syntax/
│   ├── functions/
│   └── oop/
├── doctrine/
│   ├── orm/
│   ├── entities/
│   └── migrations/
└── ...
```

## Configuration

La configuration des technologies se trouve dans `src/config/technologies.json`.

## Contribution

1. Ajoutez votre documentation dans le dossier `docs/`
2. Modifiez la configuration si nécessaire
3. Testez avec les outils MCP

## License

MIT
