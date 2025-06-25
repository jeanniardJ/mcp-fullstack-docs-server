# Guide de configuration et d'utilisation

## Installation rapide

1. **Cloner et installer**
   ```bash
   cd mcp-fullstack-docs-server
   npm install
   npm run build
   ```

2. **Tester le serveur**
   ```bash
   node test-server.js
   ```

## Configuration avec Claude Desktop

### Étape 1: Localiser le fichier de configuration Claude

Le fichier de configuration se trouve généralement à :
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Étape 2: Ajouter le serveur MCP

Ajoutez cette configuration à votre fichier `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "fullstack-docs": {
      "command": "node",
      "args": ["CHEMIN_VERS/mcp-fullstack-docs-server/build/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

⚠️ **Important**: Remplacez `CHEMIN_VERS` par le chemin absolu vers votre dossier.

### Étape 3: Redémarrer Claude Desktop

Fermez complètement Claude Desktop et relancez-le.

## Utilisation

### Commandes disponibles

1. **search_docs** - Recherche dans la documentation
   ```
   Recherche "controller" dans Symfony
   ```

2. **search_cross_reference** - Recherche croisée
   ```
   Recherche "authentication" dans Symfony, PHP et MySQL
   ```

3. **list_technologies** - Liste des technologies
   ```
   Quelles technologies sont disponibles ?
   ```

4. **get_categories** - Catégories d'une technologie
   ```
   Quelles sont les catégories de Symfony ?
   ```

### Exemples d'utilisation

**Recherche simple :**
> Comment créer un contrôleur Symfony ?

**Recherche croisée :**
> Comment optimiser les performances avec Symfony, Doctrine et MySQL ?

**Recherche frontend :**
> Configuration Webpack pour JavaScript et CSS

## Ajout de documentation

### Structure des dossiers

```
docs/
├── symfony/
│   ├── controllers/
│   ├── routing/
│   ├── forms/
│   └── security/
├── php/
│   ├── syntax/
│   ├── oop/
│   └── functions/
└── ...
```

### Format des fichiers

- Utilisez **Markdown** (.md)
- Ajoutez des **exemples de code**
- Utilisez des **titres hiérarchiques** (##, ###)
- Incluez des **mots-clés** pertinents

### Exemple de documentation

```markdown
# Titre de la fonctionnalité

## Description

Explication claire de la fonctionnalité.

## Syntaxe

\`\`\`php
// Exemple de code
class Example {
    public function method() {
        return 'Hello World';
    }
}
\`\`\`

## Bonnes pratiques

1. Utilisez...
2. Évitez...
3. Préférez...
```

## Configuration avancée

### Modification des technologies

Éditez `src/config/technologies.json` :

```json
{
  "technologies": {
    "ma-techno": {
      "name": "Ma Technologie",
      "version": "1.0",
      "docsPath": "docs/ma-techno",
      "categories": ["installation", "usage"],
      "fileExtensions": [".md", ".rst"]
    }
  }
}
```

### Ajout de corrélations

```json
{
  "correlations": {
    "mon-sujet": ["techno1", "techno2", "techno3"]
  }
}
```

## Dépannage

### Erreur "Module not found"
```bash
npm install
npm run build
```

### Erreur "Path not found"
- Vérifiez les chemins dans `technologies.json`
- Assurez-vous que les dossiers `docs/` existent

### Serveur ne démarre pas
- Vérifiez que Node.js >= 18 est installé
- Vérifiez les permissions du fichier

### Claude ne voit pas le serveur
- Vérifiez le chemin dans `claude_desktop_config.json`
- Redémarrez Claude Desktop
- Vérifiez les logs de Claude

## Support

Pour des questions ou des problèmes :
1. Vérifiez la configuration
2. Testez avec `node test-server.js`
3. Consultez les logs de Claude Desktop
