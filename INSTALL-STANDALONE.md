# 🚀 Installation Serveur MCP Standalone

Guide d'installation rapide pour utiliser le serveur MCP Fullstack Docs de manière autonome.

## ⚡ Installation Express

### 1. Prérequis
- Node.js 18+ installé
- Git installé

### 2. Installation automatique

```bash
# Cloner le projet
git clone https://github.com/jeanniardJ/mcp-fullstack-docs-server.git
cd mcp-fullstack-docs-server

# Installation et configuration automatique
npm install
npm run setup:standalone
```

### 3. Vérification

```bash
# Tester le serveur
npm run test:basic

# Voir le rapport de documentation
npm run docs:report
```

## 🔧 Configuration MCP

### Claude Desktop

Le script `npm run setup:standalone` configure automatiquement Claude Desktop.

**Configuration manuelle** (si nécessaire) :

1. Ouvrir le fichier de configuration Claude :
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux:** `~/.config/claude/claude_desktop_config.json`

2. Ajouter la configuration :

```json
{
  "mcpServers": {
    "fullstack-docs": {
      "command": "node",
      "args": ["/chemin/vers/mcp-fullstack-docs-server/build/index.js"],
      "cwd": "/chemin/vers/mcp-fullstack-docs-server",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

3. Redémarrer Claude Desktop

### VS Code (avec extension MCP)

Utiliser le fichier généré `vscode-mcp-config.json` ou ajouter dans `settings.json` :

```json
{
  "mcp.servers": {
    "fullstack-docs": {
      "command": "node",
      "args": ["/chemin/vers/build/index.js"],
      "cwd": "/chemin/vers/projet"
    }
  }
}
```

## 📚 Documentation Disponible

### Technologies supportées

- **🎯 Symfony** 6.4 LTS + 7.3 Latest (multi-versions)
- **⚡ PHP** 8.2+ avec Enums, Attributs, Fibers
- **🌐 HTML5** complet depuis MDN Mozilla
- **🛢️ MySQL** 8.0 (requêtes avancées, JSON, optimisation)
- **🎨 JavaScript** ES2023 + CSS3 modernes
- **📖 Doctrine** ORM + Webpack

### Commandes MCP disponibles

```
mcp_fullstack-doc_list_technologies
mcp_fullstack-doc_get_categories
mcp_fullstack-doc_search_docs
mcp_fullstack-doc_search_cross_reference
```

## 🎯 Utilisation

### Dans Claude Desktop

```
Quelles sont les nouveautés PHP 8.2 pour les enums ?

Comment configurer la sécurité dans Symfony 7.3 ?

Montre-moi des exemples de Fibers en PHP 8.1+
```

### Test en ligne de commande

```bash
# Démarrer le serveur directement
cd mcp-fullstack-docs-server
node build/index.js

# Le serveur attend des commandes MCP sur stdin
```

## 📦 Scripts Disponibles

```bash
# Configuration et démarrage
npm run setup:standalone      # Installation complète + config MCP
npm run configure:mcp         # Configuration MCP seulement
npm start                     # Démarrer le serveur

# Documentation
npm run docs:download:complete  # Télécharger toute la documentation
npm run docs:symfony:multi     # Symfony 6.4 + 7.3
npm run docs:html:mdn          # HTML complet MDN
npm run docs:php:complete      # PHP 8.2+ moderne

# Tests et validation
npm run test:basic            # Test rapide
npm run docs:report           # Rapport détaillé
```

## 🛠️ Développement

```bash
# Mode développement
npm run dev                   # Build + start
npm run watch                 # Watch mode TypeScript

# Build manuel
npm run build                 # Compilation TypeScript + config
```

## 🔍 Dépannage

### Erreur "Module not found"
```bash
npm run build  # Recompiler le projet
```

### Configuration Claude non prise en compte
1. Vérifier le chemin dans `claude_desktop_config.json`
2. Redémarrer Claude Desktop
3. Vérifier que Node.js est dans le PATH

### Serveur ne démarre pas
```bash
# Vérifier les dépendances
npm install

# Vérifier le build
npm run build

# Test direct
node build/index.js
```

## 📖 Documentation Complète

- **README principal:** [README.md](README.md)
- **Scripts de téléchargement:** [scripts/README.md](scripts/README.md)
- **Guide VS Code:** [README-VSCODE.md](README-VSCODE.md)
- **Guide rapide:** [QUICK-START-VSCODE.md](QUICK-START-VSCODE.md)

---

## 🌟 Fonctionnalités Clés

✅ **Serveur MCP autonome** - Fonctionne de manière indépendante  
✅ **Multi-versions Symfony** - 6.4 LTS + 7.3 Latest  
✅ **PHP moderne** - 8.2+ avec toutes les nouveautés  
✅ **Documentation riche** - 8 technologies complètes  
✅ **Configuration automatique** - Setup en une commande  
✅ **GitHub Copilot compatible** - Intégration native

**Votre serveur MCP fullstack est prêt !** 🎊
