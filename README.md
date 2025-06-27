# 🚀 MCP Fullstack Documentation Server

> **Serveur MCP complet pour la documentation fullstack** - Symfony, PHP, Doctrine, MySQL, JavaScript, HTML, CSS, Webpack, NPM

[![GitHub](https://img.shields.io/badge/GitHub-jeanniardJ-blue?logo=github)](https://github.com/jeanniardJ)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-orange.svg)](https://modelcontextprotocol.io/)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-purple.svg)](https://code.visualstudio.com/)

**Serveur MCP (Model Context Protocol) complet pour la documentation des technologies fullstack modernes.**

Intégration native avec **GitHub Copilot** et **VS Code** pour accéder instantanément à la documentation de Symfony, PHP, Doctrine, MySQL, JavaScript, CSS, HTML et Webpack.

## ✨ Fonctionnalités

- 🔍 **Recherche intelligente** dans 9 technologies fullstack
- 📚 **Documentation 100% officielle** téléchargée exclusivement depuis les sources officielles  
- 🤖 **Intégration GitHub Copilot** native
- 🛠️ **Extension VS Code** avec auto-complétion
- ⚡ **Recherche croisée** entre technologies
- 🎯 **80+ fichiers** de documentation officielle (1.5 MB)
- 🔄 **Sources officielles uniquement** - aucun contenu généré
- 🌐 **Mode HTTP avec SSE** - Interface web et API REST
- 📡 **Mode stdio** traditionnel pour usage personnel

## 📚 Technologies supportées

| Technologie    | Version       | Fichiers    | Status                                    |
| -------------- | ------------- | ----------- | ----------------------------------------- |
| **Symfony**    | 6.4 LTS + 7.3 | 21 fichiers | ✅ GitHub officiel multi-versions          |
| **PHP**        | 8.2+          | 12 fichiers | ✅ Documentation officielle php.net        |
| **MySQL**      | 8.0           | 8 fichiers  | ✅ Documentation officielle dev.mysql.com  |
| **JavaScript** | ES2023        | 11 fichiers | ✅ MDN officiel GitHub                     |
| **CSS**        | 3             | 7 fichiers  | ✅ MDN officiel GitHub                     |
| **HTML**       | 5             | 5 fichiers  | ✅ MDN officiel GitHub                     |
| **Doctrine**   | 3.0           | 1 fichier   | ✅ GitHub officiel ORM                     |
| **Webpack**    | 5.89          | 9 fichiers  | ✅ GitHub officiel webpack.js.org          |
| **NPM**        | 10.x          | 8 fichiers  | ✅ Documentation officielle docs.npmjs.com |

### 📚 Versions Symfony supportées

Ce serveur MCP inclut la documentation pour **deux versions majeures** de Symfony :

- **Symfony 6.4 LTS** - Version Long Term Support (support jusqu'en novembre 2027)
- **Symfony 7.3** - Version Latest avec les dernières fonctionnalités

La documentation couvre tous les composants essentiels :
- Controllers, Routing, Forms, Security
- Cache, Services, Validation, Serializer
- Testing, Commands, Events, Templates
- Configuration et Deployment

> 💡 **Conseil** : Utilisez Symfony 6.4 LTS pour les projets de production long terme, et Symfony 7.3 pour découvrir les nouvelles fonctionnalités.

## 🚀 Installation rapide

```bash
# Installer les dépendances
npm install

# Télécharger toute la documentation
npm run docs:update

# Démarrer le serveur MCP
npm start
```

## 🚀 Démarrage rapide

### Mode stdio (recommandé pour usage personnel)
```bash
# 1. Installation et construction
npm install && npm run build

# 2. Téléchargement de la documentation
npm run docs:download:complete

# 3. Démarrage standalone
npm start
```

### Mode HTTP (recommandé pour développement/équipe)
```bash
# 1. Installation et construction
npm install && npm run build

# 2. Démarrage serveur HTTP
npm run start:http

# 3. Interface web disponible à http://localhost:3001
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

## 🌐 Modes de fonctionnement

Ce serveur MCP supporte **deux modes** de communication :

### 📡 Mode stdio (défaut)
- Communication via stdin/stdout
- Processus enfant pour chaque client
- Sécurisé et isolé
- Configuration : `mcp.json`

### 🌐 Mode HTTP + SSE  
- Communication via HTTP et Server-Sent Events
- Un serveur pour tous les clients
- Interface web de diagnostic
- API REST pour tests
- Configuration : `mcp-http-example.json`

> 📖 **Guide complet** : Voir [HTTP-SERVER-GUIDE.md](./HTTP-SERVER-GUIDE.md) pour tous les détails

## ⚙️ Configuration

La configuration des technologies se trouve dans `src/config/technologies.json`.

### Configuration Claude Desktop

**Mode stdio :**
```json
{
  "mcpServers": {
    "fullstack-docs": {
      "command": "node",
      "args": ["build/index.js"],
      "cwd": "/path/to/mcp-fullstack-docs-server"
    }
  }
}
```

**Mode HTTP :**
```json
{
  "mcpServers": {
    "fullstack-docs": {
      "url": "http://localhost:3001/mcp",
      "type": "sse"
    }
  }
}
```

## 🤝 Contribution

1. Ajoutez votre documentation dans le dossier `docs/`
2. Modifiez la configuration si nécessaire
3. Testez avec les outils MCP

## License

MIT

## 🆕 Nouveautés - Mode HTTP avec SSE

🎉 **Nouvelle fonctionnalité majeure** : Le serveur MCP supporte maintenant le **mode HTTP avec Server-Sent Events** !

### ✨ Avantages du mode HTTP :
- 🌐 **Interface web** de diagnostic sur `http://localhost:3001`
- 🔍 **API REST** pour tests (`/health`, `/api/technologies`, `/api/search`)
- 👥 **Serveur partagé** - Une instance pour toute l'équipe
- 🐛 **Débogage facile** - Logs centralisés et monitoring
- 🌍 **Accès distant** - Utilisable via réseau

### 🚀 Démarrage mode HTTP :
```bash
npm run start:http
# Interface disponible sur http://localhost:3001
```

> 💡 **Conseil** : Utilisez le mode stdio pour l'usage personnel, et le mode HTTP pour le développement en équipe ou les tests
