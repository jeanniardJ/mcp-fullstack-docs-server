# Programmation Asynchrone - JavaScript ES2023

> Source: Documentation MDN et ECMAScript  
> Téléchargé le 25/06/2025

---

## Promises avancées

```javascript
// Promise.allSettled pour gérer les échecs
const results = await Promise.allSettled([
    fetch('/api/users'),
    fetch('/api/products'),
    fetch('/api/orders')
]);

const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);

// Promise avec timeout
function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
    );
    
    return Promise.race([promise, timeout]);
}
```

## Async/Await patterns

```javascript
// Traitement séquentiel vs parallèle
// ❌ Séquentiel (lent)
async function sequential() {
    const user = await fetchUser();
    const posts = await fetchPosts();
    const comments = await fetchComments();
    return { user, posts, comments };
}

// ✅ Parallèle (rapide)
async function parallel() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
    return { user, posts, comments };
}
```

## Générateurs asynchrones

```javascript
async function* fetchPaginated(url) {
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        const response = await fetch(`${url}?page=${page}`);
        const data = await response.json();
        
        yield data.items;
        
        hasMore = data.hasMore;
        page++;
    }
}

// Utilisation
for await (const items of fetchPaginated('/api/products')) {
    console.log('Page reçue:', items);
}
```

## AbortController

```javascript
// Annulation de requêtes
const controller = new AbortController();

setTimeout(() => controller.abort(), 5000); // Timeout 5s

try {
    const response = await fetch('/api/data', {
        signal: controller.signal
    });
    const data = await response.json();
} catch (error) {
    if (error.name === 'AbortError') {
        console.log('Requête annulée');
    }
}
```