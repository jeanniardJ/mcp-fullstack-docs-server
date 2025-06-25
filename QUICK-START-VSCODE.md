# 🚀 Serveur MCP Fullstack Documentation - VS Code & GitHub Copilot

## ✅ Configuration terminée !

Votre serveur MCP pour la documentation fullstack est maintenant configuré pour fonctionner avec **VS Code** et **GitHub Copilot**.

## 🎯 Comment ça fonctionne

### 1. Auto-complétion intelligente
GitHub Copilot utilisera automatiquement votre documentation pour :
- Suggérer du code basé sur vos patterns d'équipe
- Proposer des exemples de votre documentation
- Appliquer vos conventions et bonnes pratiques

### 2. Recherche contextuelle
Le serveur analyse en temps réel :
- **Langage** du fichier (PHP, JS, CSS...)
- **Type de fichier** (Controller, Entity, Component...)
- **Contexte** (imports, classes, fonctions...)

### 3. Documentation personnalisée
Ajoutez vos propres docs dans :
```
docs/
├── symfony/
├── php/
├── javascript/
├── css/
└── custom/     ← Vos docs personnalisées
```

## 🛠️ Utilisation

### Commandes VS Code
Ouvrez la palette (`Ctrl+Shift+P`) :
- `Fullstack Docs: Rechercher` - Recherche manuelle
- `Fullstack Docs: Technologies` - Liste des techs
- `Fullstack Docs: Redémarrer` - Reset du serveur

### Auto-suggestions
Tapez votre code normalement :
```php
class UserController extends AbstractController
{
    // Copilot suggérera automatiquement des méthodes Symfony
    public function index(): Response
    {
        // Suggestions basées sur votre documentation
    }
}
```

### Recherche directe
Dans n'importe quel fichier :
1. Sélectionnez du texte
2. `Ctrl+Shift+P` → `Fullstack Docs: Rechercher`
3. Les résultats s'ouvrent dans un nouvel onglet

## 📚 Personnalisation

### Ajouter vos propres docs
1. Créez un fichier `.md` dans `docs/`
2. Utilisez cette structure :
```markdown
# Titre

## Description

Explication claire...

## Exemple

\`\`\`php
// Code d'exemple
\`\`\`

## Bonnes pratiques

1. Faites...
2. Évitez...
```

3. Le serveur indexe automatiquement

### Configurer les technologies
Éditez `src/config/technologies.json` :
```json
{
  "technologies": {
    "mon-framework": {
      "name": "Mon Framework",
      "version": "1.0",
      "docsPath": "docs/mon-framework",
      "categories": ["composants", "services"]
    }
  }
}
```

## 🔧 Commandes utiles

```bash
# Développement
npm run watch       # Mode développement avec rechargement
npm run build       # Compilation
npm test           # Test du serveur

# Production
npm start          # Démarrage du serveur
```

## 💡 Conseils d'utilisation

### Pour l'équipe
1. **Centralisez** les patterns dans `docs/custom/`
2. **Documentez** les conventions d'équipe
3. **Partagez** via Git
4. **Mettez à jour** régulièrement

### Pour les projets
1. **Adaptez** la config pour chaque projet
2. **Incluez** les spécificités métier
3. **Documentez** les APIs internes
4. **Maintenez** la cohérence

## 🐛 Dépannage

### Copilot ne voit pas la doc
1. Vérifiez que le serveur tourne : `npm start`
2. Redémarrez VS Code
3. Vérifiez les logs : `View > Output > MCP Servers`

### Pas de suggestions contextuelles
1. Vérifiez GitHub Copilot : `Ctrl+Shift+P` → `GitHub Copilot: Check Status`
2. Permissions du dossier `docs/`
3. Format des fichiers Markdown

### Performance lente
1. Réduisez le nombre de fichiers dans `docs/`
2. Utilisez des catégories spécifiques
3. Archivez l'ancienne documentation

## 🎉 Votre documentation est maintenant vivante !

GitHub Copilot utilisera automatiquement :
- ✅ Vos patterns d'équipe
- ✅ Vos conventions de code
- ✅ Vos bonnes pratiques
- ✅ Vos exemples documentés

**Bon développement ! 🚀**

---

💬 **Questions ?** Consultez `README-VSCODE.md` pour plus de détails.
