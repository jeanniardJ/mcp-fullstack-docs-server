# Éléments sémantiques HTML5

> **Source:** Documentation créée pour le serveur MCP  
> **Catégorie:** semantic  
> **Type:** Guide HTML5

---

# Éléments sémantiques HTML5

## Structure de page

### `<header>`
En-tête de page ou de section.
```html
<header>
  <h1>Titre du site</h1>
  <nav>
    <ul>
      <li><a href="/">Accueil</a></li>
      <li><a href="/blog">Blog</a></li>
    </ul>
  </nav>
</header>
```

### `<nav>`
Navigation principale.
```html
<nav aria-label="Navigation principale">
  <ul>
    <li><a href="/" aria-current="page">Accueil</a></li>
    <li><a href="/produits">Produits</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

### `<main>`
Contenu principal unique de la page.
```html
<main>
  <h1>Titre principal de la page</h1>
  <p>Contenu principal...</p>
</main>
```

### `<section>`
Section thématique du contenu.
```html
<section>
  <h2>À propos de nous</h2>
  <p>Description de l'entreprise...</p>
</section>
```

### `<article>`
Contenu autonome et réutilisable.
```html
<article>
  <header>
    <h2>Titre de l'article</h2>
    <time datetime="2025-06-25">25 juin 2025</time>
  </header>
  <p>Contenu de l'article...</p>
  <footer>
    <p>Auteur: Jean Dupont</p>
  </footer>
</article>
```

### `<aside>`
Contenu complémentaire (sidebar).
```html
<aside>
  <h3>Articles liés</h3>
  <ul>
    <li><a href="/article-1">Article 1</a></li>
    <li><a href="/article-2">Article 2</a></li>
  </ul>
</aside>
```

### `<footer>`
Pied de page ou de section.
```html
<footer>
  <p>&copy; 2025 Mon Site. Tous droits réservés.</p>
  <nav>
    <a href="/mentions">Mentions légales</a>
    <a href="/confidentialite">Confidentialité</a>
  </nav>
</footer>
```

## Éléments de contenu

### `<time>`
Date ou heure.
```html
<time datetime="2025-06-25">25 juin 2025</time>
<time datetime="2025-06-25T14:30">Aujourd'hui à 14h30</time>
```

### `<address>`
Informations de contact.
```html
<address>
  <p>Contact: <a href="mailto:info@example.com">info@example.com</a></p>
  <p>Téléphone: <a href="tel:+33123456789">01 23 45 67 89</a></p>
</address>
```

### `<details>` et `<summary>`
Contenu pliable.
```html
<details>
  <summary>Cliquez pour voir plus</summary>
  <p>Contenu caché par défaut.</p>
</details>
```

### `<mark>`
Texte surligné.
```html
<p>Le mot <mark>important</mark> est surligné.</p>
```

## Structure complète recommandée

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titre de la page</title>
</head>
<body>
  <header>
    <h1>Nom du site</h1>
    <nav aria-label="Navigation principale">
      <ul>
        <li><a href="/" aria-current="page">Accueil</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section>
      <h1>Titre de la page</h1>
      <p>Contenu principal de la page...</p>
      
      <article>
        <header>
          <h2>Titre de l'article</h2>
          <time datetime="2025-06-25">25 juin 2025</time>
        </header>
        <p>Contenu de l'article...</p>
      </article>
    </section>
    
    <aside>
      <h2>Sidebar</h2>
      <p>Contenu complémentaire...</p>
    </aside>
  </main>
  
  <footer>
    <p>&copy; 2025 Mon Site</p>
    <address>
      <p>Contact: <a href="mailto:info@example.com">info@example.com</a></p>
    </address>
  </footer>
</body>
</html>
```

## Avantages des éléments sémantiques

### SEO (Référencement)
- Les moteurs de recherche comprennent mieux la structure
- Meilleur indexation du contenu
- Rich snippets dans les résultats

### Accessibilité
- Navigation plus facile avec les lecteurs d'écran
- Structure logique pour tous les utilisateurs
- Respect des standards WCAG

### Maintenance
- Code plus lisible et organisé
- Séparation claire des responsabilités
- Évolution plus facile du design


---

## 📚 Complément

Cette documentation est un guide pratique. Pour une référence complète :
- [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTML)
- [W3C HTML Specification](https://www.w3.org/TR/html52/)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)

---
*Documentation générée le 25/06/2025*
