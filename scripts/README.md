# 📥 Téléchargement de la documentation Symfony

Ce dossier contient des scripts pour télécharger automatiquement la documentation officielle de Symfony et l'intégrer dans votre serveur MCP.

## 🚀 Scripts disponibles

### 1. Script Node.js simplifié (Recommandé pour débuter)

```bash
npm run docs:download
```

- ✅ Compatible tous systèmes
- ✅ Télécharge les pages principales Symfony
- ✅ Conversion RST → Markdown automatique
- ✅ Gestion d'erreurs robuste

### 2. Téléchargement complet de toutes les technologies

```bash
npm run docs:download:all
```

- 🌟 **NOUVEAU** - Télécharge TOUT
- 📚 Symfony, Doctrine, Webpack depuis GitHub
- 🌐 JavaScript, CSS, HTML depuis MDN
- ⚡ Conversion automatique en Markdown
- 🔧 Mise à jour de la configuration

### 3. Script PowerShell (Windows)

```powershell
npm run docs:download:ps
# ou pour tout télécharger:
npm run docs:download:all:ps
```

- ✅ Optimisé pour Windows
- ✅ Utilise PowerShell natif
- ✅ Support des paramètres (-Force, -SkipGit)

### 4. Génération de documentation

```bash
# Générer doc pour PHP, MySQL, JavaScript, CSS
npm run docs:generate

# Générer uniquement MySQL (complet)
node scripts/generate-mysql-docs.js
```

- � Crée du contenu de qualité
- 🎯 Exemples pratiques et code
- 📖 Documentation structurée par catégories

### 5. Mise à jour complète

```bash
# Téléchargement + génération + compilation
npm run docs:update

# Génération rapide + compilation (sans téléchargement)
npm run docs:update:quick
```

## 📋 Documentation maintenant disponible

Après exécution des scripts, voici ce qui est téléchargé et généré :

### **Symfony** (téléchargée depuis GitHub officiel) 
- ✅ Controllers, Routing, Forms, Security
- ✅ Cache, Services, Validation, Serializer  
- ✅ Testing, Console, Events, Templates
- ✅ Configuration, Deployment

### **PHP 8.2** (générée avec exemples)
- ✅ Classes avancées, Traits, Enums, Attributs
- ✅ Interfaces, Héritage, Namespaces
- ✅ Fonctions, Exceptions, CLI
- ✅ Optimisation des performances

### **MySQL 8.0** (documentation complète)
- ✅ Requêtes de base et avancées
- ✅ Window Functions, CTE, sous-requêtes
- ✅ Index et optimisation
- ✅ Sécurité et gestion des utilisateurs
- ✅ Sauvegarde, restauration, réplication
- ✅ Opérations JSON complètes

### **JavaScript ES2023** (depuis MDN)
- ✅ Fonctions fléchées, async/await
- ✅ Promises, classes, modules
- ✅ Destructuring, template literals
- ✅ Import/export ES6+

### **CSS 3** (depuis MDN)
- ✅ Grid Layout avancé
- ✅ Flexbox moderne  
- ✅ Animations et transitions
- ✅ Media queries et responsive
- ✅ Custom properties (variables CSS)

### **HTML 5** (depuis MDN)
- ✅ Formulaires et validation
- ✅ Canvas et graphiques
- ✅ Audio/vidéo
- ✅ Attributs globaux et méta

### **Doctrine ORM** (depuis GitHub officiel)
- ✅ Mapping des entités
- ✅ Associations et relations
- ✅ Query Builder et DQL
- ✅ Gestion des objets
- ✅ Events et cache

### **Webpack** (depuis GitHub officiel)
- ✅ Concepts de base
- ✅ Configuration avancée
- ✅ Loaders et plugins
- ✅ Développement et production
- ✅ Code splitting et optimisation

## 🗂️ Structure après téléchargement

```
docs/symfony/
├── controller/
│   └── controllers-official.md
├── routing/
│   └── routing-official.md
├── forms/
│   └── forms-official.md
├── security/
│   └── security-official.md
├── cache/
│   └── cache-official.md
└── services/
    └── services-official.md
```

## ⚙️ Configuration automatique

Les scripts mettent automatiquement à jour :
- ✅ `src/config/technologies.json` - Nouvelles catégories
- ✅ `build/config/technologies.json` - Version compilée
- ✅ Version Symfony dans la configuration

## 🔧 Personnalisation

### Changer la version Symfony (PowerShell)
```powershell
scripts/download-symfony-docs.ps1 -Version "6.4"
```

### Forcer le téléchargement (PowerShell)
```powershell
scripts/download-symfony-docs.ps1 -Force
```

### Ajouter d'autres pages (Node.js)
Modifiez le tableau `docPages` dans `download-symfony-simple.js` :

```javascript
const docPages = [
    {
        url: 'https://raw.githubusercontent.com/symfony/symfony-docs/7.1/validation.rst',
        category: 'validation',
        name: 'validation-official.md'
    }
    // ... ajouter d'autres pages
];
```

## 🛠️ Dépannage

### Erreur de téléchargement
- Vérifiez votre connexion internet
- Certains fichiers peuvent ne pas exister pour toutes les versions
- Utilisez `-Force` pour remplacer les fichiers existants

### Erreur de conversion RST
- La conversion RST → Markdown est basique
- Certains éléments avancés peuvent nécessiter une correction manuelle
- Les fichiers sont sauvegardés même avec des erreurs mineures

### Permissions PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📚 Documentation supplémentaire

Après téléchargement, vous pouvez tester la documentation avec :

```bash
# Tester les nouvelles commandes MCP
npm run test

# Rechercher dans la nouvelle documentation  
npm run test:basic
```

## 🎯 Intégration avec le serveur MCP

La documentation téléchargée est automatiquement disponible via les commandes MCP :

- `mcp_fullstack-doc_search_docs` - Recherche dans la nouvelle documentation
- `mcp_fullstack-doc_get_categories` - Liste les nouvelles catégories
- `mcp_fullstack-doc_list_technologies` - Affiche Symfony avec la nouvelle version

---

**💡 Astuce :** Exécutez `npm run docs:update` après chaque mise à jour de Symfony pour maintenir votre documentation à jour !
