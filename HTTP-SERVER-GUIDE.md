# 🌐 Guide des Serveurs MCP HTTP

## 🎯 Qu'est-ce qu'un serveur MCP HTTP ?

Un serveur MCP HTTP est une alternative au mode stdio traditionnel qui utilise le protocole HTTP avec Server-Sent Events (SSE) pour la communication en temps réel.

## 📊 Comparaison stdio vs HTTP

### Mode stdio (traditionnel)
```json
{
  "mcpServers": {
    "fullstack-docs": {
      "command": "node",
      "args": ["build/index.js"],
      "cwd": "."
    }
  }
}
```

**Avantages :**
- ✅ Simple à configurer
- ✅ Sécurisé (processus local)
- ✅ Léger en ressources
- ✅ Isolation complète

**Inconvénients :**
- ❌ Un processus par client
- ❌ Difficile à déboguer
- ❌ Pas d'accès distant
- ❌ Pas d'interface de diagnostic

### Mode HTTP + SSE
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

**Avantages :**
- ✅ **Partage de serveur** - Un serveur pour tous les clients
- ✅ **Débogage facile** - Interface web de diagnostic
- ✅ **Accès distant** - Utilisable en réseau
- ✅ **API REST** - Tests faciles via curl/Postman
- ✅ **Monitoring** - Endpoints de santé
- ✅ **Performance** - Pas de création/destruction de processus

**Inconvénients :**
- ❌ Plus complexe à configurer
- ❌ Gestion de la sécurité réseau
- ❌ Point de défaillance unique

## 🚀 Démarrage du serveur HTTP

### 1. Construction
```bash
npm run build
```

### 2. Démarrage
```bash
# Port par défaut (3000)
node build/http-server.js

# Port personnalisé
node build/http-server.js 3001

# Ou via npm
npm run start:http
```

### 3. Vérification
- **Interface web** : http://localhost:3001
- **Health check** : http://localhost:3001/health
- **Endpoint MCP** : http://localhost:3001/mcp

## ⚙️ Configuration des clients

### Claude Desktop
Éditez `~/.config/claude-desktop/config.json` :

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

### VS Code (avec extension MCP)
Éditez `.vscode/settings.json` :

```json
{
  "mcp.servers": {
    "fullstack-docs": {
      "url": "http://localhost:3001/mcp",
      "type": "sse"
    }
  }
}
```

## 🔧 API REST pour tests

### Endpoints disponibles

#### GET /health
Status du serveur
```bash
curl http://localhost:3001/health
```

#### GET /api/technologies
Liste des technologies
```bash
curl http://localhost:3001/api/technologies
```

#### GET /api/search
Recherche dans la documentation
```bash
curl "http://localhost:3001/api/search?q=routing&tech=symfony"
```

## 🌊 Server-Sent Events (SSE)

### Qu'est-ce que SSE ?
SSE permet une communication **unidirectionnelle** en temps réel du serveur vers le client :
- Le client ouvre une connexion HTTP persistante
- Le serveur peut envoyer des données à tout moment
- Idéal pour les notifications, mises à jour en temps réel
- Plus simple que WebSockets pour ce cas d'usage

### Pourquoi SSE pour MCP ?
1. **Communication asymétrique** : Le client envoie des requêtes, le serveur répond
2. **Connexion persistante** : Évite la latence de reconnexion
3. **Support natif HTTP** : Fonctionne avec tous les proxies/firewalls
4. **Gestion d'erreur** : Reconnexion automatique côté client

### Exemple de communication SSE

**Client → Serveur** (via POST JSON) :
```json
{
  "method": "tools/list",
  "params": {}
}
```

**Serveur → Client** (via SSE) :
```
data: {"tools": [{"name": "search_docs", "description": "..."}]}

```

## 🔒 Sécurité

### Pour usage local
- Bind sur `localhost` uniquement
- Pas d'authentification nécessaire
- CORS désactivé

### Pour usage distant
```typescript
// Configuration sécurisée
app.use(cors({
  origin: ['https://your-allowed-domain.com'],
  credentials: true
}));

// Ajout d'authentification
app.use('/mcp', authenticateToken);
```

## 🎛️ Configuration avancée

### Variables d'environnement
```bash
PORT=3001                    # Port du serveur
MCP_DOCS_PATH=/custom/docs   # Chemin personnalisé vers la doc
NODE_ENV=production          # Mode production
CORS_ORIGIN=*               # Origine CORS autorisée
```

### Mode hybride (stdio + HTTP)
Vous pouvez faire tourner les deux en parallèle :

**stdio** pour l'usage local sécurisé :
```json
{
  "mcpServers": {
    "fullstack-docs-local": {
      "command": "node",
      "args": ["build/index.js"]
    }
  }
}
```

**HTTP** pour le développement et les tests :
```json
{
  "mcpServers": {
    "fullstack-docs-http": {
      "url": "http://localhost:3001/mcp",
      "type": "sse"
    }
  }
}
```

## 🧪 Tests et débogage

### Tests automatisés
```bash
# Test complet des fonctionnalités
npm run test:basic

# Test du serveur HTTP spécifiquement
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"q": "controller", "tech": "symfony"}'
```

### Débogage avec l'interface web
1. Ouvrez http://localhost:3001
2. Consultez le status et les technologies disponibles
3. Testez les endpoints directement
4. Vérifiez les logs serveur en temps réel

### Monitoring
- **Logs** : `console.error()` pour tous les événements
- **Métriques** : Nombre de requêtes par endpoint
- **Santé** : Endpoint `/health` avec status détaillé

## 🌍 Cas d'usage recommandés

### Utilisez stdio quand :
- ✅ Usage personnel uniquement
- ✅ Sécurité maximale requise
- ✅ Resources limitées
- ✅ Intégration simple

### Utilisez HTTP quand :
- ✅ Développement et tests
- ✅ Équipe utilisant le serveur
- ✅ Débogage et monitoring nécessaires
- ✅ Intégration avec d'autres services
- ✅ Déploiement sur serveur distant

## 🎉 Résumé

Les serveurs MCP HTTP apportent une **flexibilité énorme** pour le développement, les tests et le déploiement à grande échelle, tout en conservant la **simplicité du protocole MCP**. Le choix entre stdio et HTTP dépend de vos besoins spécifiques en termes de sécurité, de facilité de développement et d'architecture.
