# Serveur MCP Fullstack Documentation pour VS Code & GitHub Copilot

## 🚀 Configuration pour VS Code et GitHub Copilot

Ce serveur MCP fournit une documentation intelligente pour votre stack full-stack directement dans VS Code, compatible avec GitHub Copilot.

### Technologies supportées
- **Symfony** 6.4 - Framework PHP
- **PHP** 8.2 - Langage backend
- **Doctrine** 2.17 - ORM
- **MySQL** 8.0 - Base de données
- **JavaScript** ES2023 - Frontend
- **HTML** 5 - Markup
- **CSS** 3 - Styling
- **Webpack** 5.89 - Build tool

## 📦 Installation

### Étape 1: Installation des dépendances
```bash
cd mcp-fullstack-docs-server
npm install
npm run build
```

### Étape 2: Configuration VS Code

1. **Installer l'extension MCP pour VS Code** (si disponible)
2. **Ou configurer manuellement dans VS Code settings:**

Ajoutez dans votre `settings.json` de VS Code :

```json
{
  "mcp.servers": {
    "fullstack-docs": {
      "command": "node",
      "args": ["./mcp-fullstack-docs-server/build/index.js"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### Étape 3: Activer l'intégration avec Copilot

Le serveur fonctionne automatiquement avec GitHub Copilot en fournissant du contexte documentaire.

## 🔧 Utilisation

### Commandes VS Code

Ouvrez la palette de commandes (`Ctrl+Shift+P`) et utilisez :

- **`Fullstack Docs: Rechercher dans la documentation`** - Recherche globale
- **`Fullstack Docs: Lister les technologies`** - Vue d'ensemble
- **`Fullstack Docs: Redémarrer le serveur MCP`** - Redémarrage

### Auto-complétion intelligente

Le serveur améliore automatiquement les suggestions de Copilot avec :

1. **Contexte spécifique à la technologie**
   ```php
   // En tapant dans un fichier PHP
   class UserController extends AbstractController
   {
       // Copilot suggérera des méthodes Symfony pertinentes
   ```

2. **Exemples de code documentés**
   ```javascript
   // En travaillant avec Webpack
   module.exports = {
       // Suggestions basées sur la documentation Webpack
   ```

3. **Bonnes pratiques intégrées**
   ```css
   .grid-container {
       /* Suggestions CSS Grid optimisées */
   ```

### Recherche contextuelle

Le serveur analyse automatiquement :
- Le langage du fichier actuel
- Les imports et namespaces
- Les patterns de code
- Les commentaires

## 📚 Ajout de documentation personnalisée

### Structure recommandée
```
docs/
├── symfony/
│   ├── controllers/
│   │   └── my-controller-patterns.md
│   ├── services/
│   └── security/
├── php/
│   ├── patterns/
│   └── best-practices/
└── custom/
    ├── team-conventions/
    └── project-specific/
```

### Format des fichiers

```markdown
# Titre de la documentation

## Description brève

Explication claire avec exemples.

## Code exemple

\`\`\`php
<?php
// Exemple commenté
class Example 
{
    public function method(): Response
    {
        return new Response('Hello');
    }
}
\`\`\`

## Bonnes pratiques

1. Utilisez...
2. Évitez...
3. Préférez...

## Liens connexes

- [Documentation officielle](https://example.com)
- Voir aussi: `autre-doc.md`
```

## ⚙️ Configuration avancée

### Personnalisation des technologies

Éditez `src/config/technologies.json` :

```json
{
  "technologies": {
    "mon-framework": {
      "name": "Mon Framework",
      "version": "1.0",
      "docsPath": "docs/mon-framework",
      "categories": ["components", "services"],
      "fileExtensions": [".md", ".mdx"]
    }
  }
}
```

### Poids de recherche

Ajustez les scores dans `technologies.json` :

```json
{
  "searchWeights": {
    "title": 3.0,
    "heading": 2.5,
    "code": 2.0,
    "content": 1.0,
    "filename": 1.5
  }
}
```

## 🐛 Dépannage

### Copilot ne voit pas la documentation

1. Vérifiez que le serveur MCP est démarré :
   ```bash
   npm run dev
   ```

2. Redémarrez VS Code

3. Vérifiez les logs VS Code (`View > Output > MCP Servers`)

### Pas de suggestions contextuelles

1. Vérifiez que GitHub Copilot est activé
2. Vérifiez les permissions du dossier `docs/`
3. Testez avec la commande de recherche manuelle

### Performance lente

1. Réduisez le nombre de fichiers dans `docs/`
2. Utilisez des catégories spécifiques
3. Optimisez les expressions régulières de recherche

## 📈 Intégration avec l'équipe

### Workflow recommandé

1. **Documentation centralisée** - Tous les patterns d'équipe dans `docs/`
2. **Revue de documentation** - Inclure dans les PRs
3. **Conventions de nommage** - Fichiers descriptifs
4. **Exemples pratiques** - Code utilisé en production

### Synchronisation

```bash
# Script de mise à jour de la documentation
git pull origin main
npm run build
# Le serveur MCP recharge automatiquement
```

## 🤝 Contribution

1. Ajoutez votre documentation dans `docs/`
2. Testez avec `npm test`
3. Vérifiez l'intégration VS Code
4. Partagez avec l'équipe

---

**Le serveur MCP rend votre documentation vivante dans VS Code ! 🎯**
