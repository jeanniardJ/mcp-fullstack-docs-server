# Référence des attributs HTML

> **Source:** Documentation créée pour le serveur MCP  
> **Catégorie:** attributes  
> **Type:** Guide HTML5

---

# Référence des attributs HTML

## Attributs globaux

Ces attributs peuvent être utilisés sur tous les éléments HTML.

### `id`
Identifiant unique de l'élément.
```html
<div id="main-content">Contenu principal</div>
```

### `class`
Classes CSS pour styliser l'élément.
```html
<p class="important highlight">Texte important</p>
```

### `title`
Information supplémentaire (tooltip).
```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

### `lang`
Langue du contenu de l'élément.
```html
<p lang="en">This text is in English</p>
```

### `dir`
Direction du texte (ltr, rtl, auto).
```html
<p dir="rtl">النص بالعربية</p>
```

### `hidden`
Cache l'élément.
```html
<div hidden>Contenu caché</div>
```

### `tabindex`
Ordre de navigation au clavier.
```html
<div tabindex="0">Élément focusable</div>
<div tabindex="-1">Focusable par script seulement</div>
```

## Attributs d'accessibilité (ARIA)

### `aria-label`
Étiquette alternative pour les lecteurs d'écran.
```html
<button aria-label="Fermer la fenêtre">×</button>
```

### `aria-describedby`
Référence à un élément qui décrit celui-ci.
```html
<input type="password" aria-describedby="pwd-help">
<div id="pwd-help">Le mot de passe doit contenir 8 caractères</div>
```

### `aria-expanded`
Indique si un élément pliable est ouvert.
```html
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>...</ul>
```

### `aria-current`
Indique l'élément actuel dans un ensemble.
```html
<a href="/accueil" aria-current="page">Accueil</a>
```

## Attributs spécifiques aux liens (`<a>`)

### `href`
URL de destination.
```html
<a href="https://example.com">Lien externe</a>
<a href="/page">Lien interne</a>
<a href="#section">Ancre</a>
<a href="mailto:contact@example.com">E-mail</a>
<a href="tel:+33123456789">Téléphone</a>
```

### `target`
Fenêtre de destination.
```html
<a href="https://example.com" target="_blank">Nouvel onglet</a>
<a href="/page" target="_self">Même fenêtre</a>
```

### `rel`
Relation avec la ressource liée.
```html
<a href="https://example.com" rel="noopener noreferrer">Lien sécurisé</a>
<a href="/page-suivante" rel="next">Page suivante</a>
```

### `download`
Force le téléchargement.
```html
<a href="document.pdf" download="mon-document.pdf">Télécharger</a>
```

## Attributs spécifiques aux images (`<img>`)

### `src`
Source de l'image.
```html
<img src="image.jpg" alt="Description">
```

### `alt`
Texte alternatif (obligatoire).
```html
<img src="logo.png" alt="Logo de l'entreprise">
<img src="decoration.png" alt="">  <!-- Image décorative -->
```

### `width` et `height`
Dimensions de l'image.
```html
<img src="photo.jpg" width="400" height="300" alt="Photo">
```

### `loading`
Chargement différé.
```html
<img src="image.jpg" loading="lazy" alt="Image">
```

### `srcset` et `sizes`
Images responsives.
```html
<img src="image.jpg" 
     srcset="image-480.jpg 480w, image-800.jpg 800w"
     sizes="(max-width: 600px) 480px, 800px"
     alt="Image responsive">
```

## Attributs de formulaire

### `name`
Nom du champ pour l'envoi.
```html
<input type="text" name="nom">
```

### `value`
Valeur du champ.
```html
<input type="text" name="nom" value="Valeur par défaut">
```

### `placeholder`
Texte d'aide.
```html
<input type="email" placeholder="votre@email.com">
```

### `required`
Champ obligatoire.
```html
<input type="text" name="nom" required>
```

### `disabled`
Champ désactivé.
```html
<input type="text" name="nom" disabled>
```

### `readonly`
Champ en lecture seule.
```html
<input type="text" name="code" readonly value="ABC123">
```

### `autocomplete`
Autocomplétion.
```html
<input type="email" name="email" autocomplete="email">
<input type="password" name="password" autocomplete="current-password">
```

## Attributs de validation

### `pattern`
Expression régulière de validation.
```html
<input type="text" name="code" pattern="[A-Z]{3}[0-9]{3}">
```

### `min`, `max`, `step`
Valeurs numériques.
```html
<input type="number" name="prix" min="0" max="1000" step="0.01">
<input type="range" name="volume" min="0" max="100" step="5">
```

### `minlength`, `maxlength`
Longueur du texte.
```html
<input type="text" name="nom" minlength="2" maxlength="50">
```

## Attributs multimédias

### `controls`
Affiche les contrôles.
```html
<video src="video.mp4" controls></video>
<audio src="audio.mp3" controls></audio>
```

### `autoplay`
Lecture automatique.
```html
<video src="video.mp4" autoplay muted></video>
```

### `loop`
Lecture en boucle.
```html
<video src="video.mp4" loop></video>
```

### `muted`
Son coupé par défaut.
```html
<video src="video.mp4" muted></video>
```

### `poster`
Image de prévisualisation pour les vidéos.
```html
<video src="video.mp4" poster="preview.jpg" controls></video>
```


---

## 📚 Complément

Cette documentation est un guide pratique. Pour une référence complète :
- [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTML)
- [W3C HTML Specification](https://www.w3.org/TR/html52/)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)

---
*Documentation générée le 25/06/2025*
