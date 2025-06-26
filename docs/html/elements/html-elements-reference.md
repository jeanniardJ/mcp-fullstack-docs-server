# Référence des éléments HTML

> **Source:** Documentation créée pour le serveur MCP  
> **Catégorie:** elements  
> **Type:** Guide HTML5

---

# Référence des éléments HTML

## Éléments de structure de base

### `<html>`
Élément racine d'un document HTML.
```html
<html lang="fr">
  <!-- contenu -->
</html>
```

### `<head>`
Contient les métadonnées du document.
```html
<head>
  <meta charset="UTF-8">
  <title>Titre de la page</title>
</head>
```

### `<body>`
Contient le contenu visible de la page.
```html
<body>
  <h1>Contenu principal</h1>
</body>
```

## Titres

### `<h1>` à `<h6>`
Titres hiérarchiques du plus important (`<h1>`) au moins important (`<h6>`).
```html
<h1>Titre principal</h1>
<h2>Titre de section</h2>
<h3>Sous-titre</h3>
```

## Texte

### `<p>`
Paragraphe de texte.
```html
<p>Ceci est un paragraphe.</p>
```

### `<a>`
Lien hypertexte.
```html
<a href="https://example.com">Texte du lien</a>
<a href="#section">Lien interne</a>
<a href="mailto:contact@example.com">E-mail</a>
```

### `<strong>` et `<b>`
Texte important ou en gras.
```html
<strong>Texte important</strong>
<b>Texte en gras</b>
```

### `<em>` et `<i>`
Texte emphasized ou en italique.
```html
<em>Texte emphasized</em>
<i>Texte en italique</i>
```

## Listes

### `<ul>` et `<li>`
Liste non ordonnée.
```html
<ul>
  <li>Premier élément</li>
  <li>Deuxième élément</li>
</ul>
```

### `<ol>` et `<li>`
Liste ordonnée.
```html
<ol>
  <li>Premier élément</li>
  <li>Deuxième élément</li>
</ol>
```

### `<dl>`, `<dt>`, `<dd>`
Liste de définitions.
```html
<dl>
  <dt>Terme</dt>
  <dd>Définition du terme</dd>
</dl>
```

## Images et médias

### `<img>`
Image.
```html
<img src="image.jpg" alt="Description de l'image" width="300" height="200">
```

### `<figure>` et `<figcaption>`
Figure avec légende.
```html
<figure>
  <img src="chart.png" alt="Graphique">
  <figcaption>Figure 1: Évolution des ventes</figcaption>
</figure>
```

### `<video>`
Vidéo.
```html
<video controls width="400">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Votre navigateur ne supporte pas la vidéo.
</video>
```

### `<audio>`
Audio.
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Votre navigateur ne supporte pas l'audio.
</audio>
```

## Tableaux

### `<table>`, `<tr>`, `<td>`, `<th>`
Tableau.
```html
<table>
  <thead>
    <tr>
      <th>Nom</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>25</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>30</td>
    </tr>
  </tbody>
</table>
```


---

## 📚 Complément

Cette documentation est un guide pratique. Pour une référence complète :
- [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTML)
- [W3C HTML Specification](https://www.w3.org/TR/html52/)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)

---
*Documentation générée le 25/06/2025*
