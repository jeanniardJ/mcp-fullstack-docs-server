# Bonnes pratiques HTML

> **Source:** Documentation créée pour le serveur MCP  
> **Catégorie:** guides  
> **Type:** Guide HTML5

---

# Bonnes pratiques HTML

## Structure du document

### Doctype et langue
Toujours commencer par le doctype HTML5 et spécifier la langue.
```html
<!DOCTYPE html>
<html lang="fr">
```

### Métadonnées essentielles
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titre descriptif de la page</title>
  <meta name="description" content="Description de la page pour le SEO">
</head>
```

## Sémantique et accessibilité

### Utiliser les bons éléments
```html
<!-- ❌ Mauvais -->
<div class="title">Titre</div>
<div class="button" onclick="doSomething()">Cliquer</div>

<!-- ✅ Bon -->
<h1>Titre</h1>
<button onclick="doSomething()">Cliquer</button>
```

### Hiérarchie des titres
```html
<!-- ✅ Hiérarchie logique -->
<h1>Titre principal</h1>
  <h2>Section</h2>
    <h3>Sous-section</h3>
  <h2>Autre section</h2>
```

### Textes alternatifs pour les images
```html
<!-- ✅ Image informative -->
<img src="chart.png" alt="Graphique montrant une hausse de 20% des ventes">

<!-- ✅ Image décorative -->
<img src="decoration.png" alt="">

<!-- ✅ Image fonctionnelle -->
<button>
  <img src="search.png" alt="Rechercher">
</button>
```

## Formulaires

### Labels explicites
```html
<!-- ✅ Label associé -->
<label for="nom">Nom complet :</label>
<input type="text" id="nom" name="nom" required>

<!-- ✅ Label englobant -->
<label>
  E-mail :
  <input type="email" name="email" required>
</label>
```

### Validation côté client
```html
<input type="email" name="email" required 
       pattern="[^@]+@[^@]+\.[a-zA-Z]{2,}"
       title="Veuillez entrer une adresse e-mail valide">
```

### Messages d'erreur
```html
<label for="password">Mot de passe :</label>
<input type="password" id="password" name="password" 
       minlength="8" required aria-describedby="pwd-help">
<div id="pwd-help">Le mot de passe doit contenir au moins 8 caractères</div>
```

## Performance

### Optimisation des images
```html
<!-- ✅ Images responsives -->
<img src="image.jpg" 
     srcset="image-480.jpg 480w, image-800.jpg 800w, image-1200.jpg 1200w"
     sizes="(max-width: 480px) 480px, (max-width: 800px) 800px, 1200px"
     alt="Description" loading="lazy">

<!-- ✅ Formats modernes avec fallback -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description">
</picture>
```

### Chargement différé
```html
<!-- ✅ Images hors viewport -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- ✅ Scripts non critiques -->
<script src="analytics.js" defer></script>
```

## Sécurité

### Liens externes
```html
<!-- ✅ Liens sécurisés -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Lien externe
</a>
```

### Validation des données
```html
<!-- ✅ Validation stricte -->
<input type="tel" name="phone" pattern="[0-9]{10}" maxlength="10">
<input type="url" name="website" pattern="https://.*">
```

## SEO

### Métadonnées Open Graph
```html
<meta property="og:title" content="Titre de la page">
<meta property="og:description" content="Description de la page">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
```

### Données structurées
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Titre de l'article",
  "author": {
    "@type": "Person",
    "name": "Nom de l'auteur"
  },
  "datePublished": "2025-06-25"
}
</script>
```

## Code propre

### Indentation et lisibilité
```html
<!-- ✅ Code indenté et lisible -->
<article>
  <header>
    <h2>Titre</h2>
    <time datetime="2025-06-25">25 juin 2025</time>
  </header>
  <p>Contenu de l'article...</p>
</article>
```

### Commentaires utiles
```html
<!-- Navigation principale -->
<nav aria-label="Navigation principale">
  <!-- ... -->
</nav>

<!-- Contenu principal de la page -->
<main>
  <!-- ... -->
</main>

<!-- Fin du contenu principal -->
```

### Validation du code
- Utiliser le validateur W3C : https://validator.w3.org/
- Tester l'accessibilité avec des outils comme axe-core
- Vérifier la compatibilité navigateur

## Points de contrôle

### Avant publication
- [ ] Doctype HTML5 présent
- [ ] Langue spécifiée sur `<html>`
- [ ] Métadonnées de base (charset, viewport, title, description)
- [ ] Hiérarchie des titres logique
- [ ] Tous les `<img>` ont un attribut `alt`
- [ ] Tous les formulaires ont des labels
- [ ] Liens externes avec `rel="noopener"`
- [ ] Code validé par le W3C
- [ ] Tests d'accessibilité effectués
- [ ] Performance optimisée (images, chargement)


---

## 📚 Complément

Cette documentation est un guide pratique. Pour une référence complète :
- [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTML)
- [W3C HTML Specification](https://www.w3.org/TR/html52/)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)

---
*Documentation générée le 25/06/2025*
