#!/usr/bin/env node

/**
 * Script pour créer une documentation HTML de base
 * Version simplifiée qui ne dépend pas du téléchargement du dépôt MDN
 */

import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs', 'html');

// 🎨 Système de statuts
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function logStatus(status, message) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const icons = { start: '🚀', success: '✅', info: 'ℹ️' };
    const statusColors = { start: colors.blue, success: colors.green, info: colors.cyan };
    
    const icon = icons[status] || '📄';
    const color = statusColors[status] || colors.reset;
    
    console.log(`${color}[${timestamp}] ${icon} ${message}${colors.reset}`);
}

/**
 * Crée la documentation HTML complète
 */
function createHtmlDocs() {
    logStatus('start', 'Création de la documentation HTML5...');
    
    const docs = [
        // Éléments de base
        {
            category: 'elements',
            name: 'html-elements-reference.md',
            title: 'Référence des éléments HTML',
            content: `# Référence des éléments HTML

## Éléments de structure de base

### \`<html>\`
Élément racine d'un document HTML.
\`\`\`html
<html lang="fr">
  <!-- contenu -->
</html>
\`\`\`

### \`<head>\`
Contient les métadonnées du document.
\`\`\`html
<head>
  <meta charset="UTF-8">
  <title>Titre de la page</title>
</head>
\`\`\`

### \`<body>\`
Contient le contenu visible de la page.
\`\`\`html
<body>
  <h1>Contenu principal</h1>
</body>
\`\`\`

## Titres

### \`<h1>\` à \`<h6>\`
Titres hiérarchiques du plus important (\`<h1>\`) au moins important (\`<h6>\`).
\`\`\`html
<h1>Titre principal</h1>
<h2>Titre de section</h2>
<h3>Sous-titre</h3>
\`\`\`

## Texte

### \`<p>\`
Paragraphe de texte.
\`\`\`html
<p>Ceci est un paragraphe.</p>
\`\`\`

### \`<a>\`
Lien hypertexte.
\`\`\`html
<a href="https://example.com">Texte du lien</a>
<a href="#section">Lien interne</a>
<a href="mailto:contact@example.com">E-mail</a>
\`\`\`

### \`<strong>\` et \`<b>\`
Texte important ou en gras.
\`\`\`html
<strong>Texte important</strong>
<b>Texte en gras</b>
\`\`\`

### \`<em>\` et \`<i>\`
Texte emphasized ou en italique.
\`\`\`html
<em>Texte emphasized</em>
<i>Texte en italique</i>
\`\`\`

## Listes

### \`<ul>\` et \`<li>\`
Liste non ordonnée.
\`\`\`html
<ul>
  <li>Premier élément</li>
  <li>Deuxième élément</li>
</ul>
\`\`\`

### \`<ol>\` et \`<li>\`
Liste ordonnée.
\`\`\`html
<ol>
  <li>Premier élément</li>
  <li>Deuxième élément</li>
</ol>
\`\`\`

### \`<dl>\`, \`<dt>\`, \`<dd>\`
Liste de définitions.
\`\`\`html
<dl>
  <dt>Terme</dt>
  <dd>Définition du terme</dd>
</dl>
\`\`\`

## Images et médias

### \`<img>\`
Image.
\`\`\`html
<img src="image.jpg" alt="Description de l'image" width="300" height="200">
\`\`\`

### \`<figure>\` et \`<figcaption>\`
Figure avec légende.
\`\`\`html
<figure>
  <img src="chart.png" alt="Graphique">
  <figcaption>Figure 1: Évolution des ventes</figcaption>
</figure>
\`\`\`

### \`<video>\`
Vidéo.
\`\`\`html
<video controls width="400">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Votre navigateur ne supporte pas la vidéo.
</video>
\`\`\`

### \`<audio>\`
Audio.
\`\`\`html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Votre navigateur ne supporte pas l'audio.
</audio>
\`\`\`

## Tableaux

### \`<table>\`, \`<tr>\`, \`<td>\`, \`<th>\`
Tableau.
\`\`\`html
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
\`\`\`
`
        },
        
        // Formulaires
        {
            category: 'forms',
            name: 'html-forms-complete.md',
            title: 'Guide complet des formulaires HTML',
            content: `# Guide complet des formulaires HTML

## Élément \`<form>\`

Structure de base d'un formulaire.
\`\`\`html
<form action="/submit" method="POST" enctype="multipart/form-data">
  <!-- Champs du formulaire -->
</form>
\`\`\`

**Attributs principaux:**
- \`action\`: URL de destination
- \`method\`: GET ou POST
- \`enctype\`: Type d'encodage (multipart/form-data pour les fichiers)

## Champs de saisie (\`<input>\`)

### Types de base
\`\`\`html
<!-- Texte -->
<input type="text" name="nom" placeholder="Votre nom">

<!-- E-mail -->
<input type="email" name="email" required>

<!-- Mot de passe -->
<input type="password" name="motdepasse">

<!-- Nombre -->
<input type="number" name="age" min="0" max="120">

<!-- Date -->
<input type="date" name="naissance">

<!-- Fichier -->
<input type="file" name="document" accept=".pdf,.doc">
\`\`\`

### Types pour mobile
\`\`\`html
<!-- Téléphone -->
<input type="tel" name="telephone">

<!-- URL -->
<input type="url" name="website">

<!-- Recherche -->
<input type="search" name="query">
\`\`\`

### Cases et boutons radio
\`\`\`html
<!-- Case à cocher -->
<input type="checkbox" id="newsletter" name="newsletter" value="oui">
<label for="newsletter">S'abonner à la newsletter</label>

<!-- Boutons radio -->
<input type="radio" id="homme" name="genre" value="homme">
<label for="homme">Homme</label>
<input type="radio" id="femme" name="genre" value="femme">
<label for="femme">Femme</label>
\`\`\`

### Boutons
\`\`\`html
<!-- Bouton de soumission -->
<input type="submit" value="Envoyer">

<!-- Bouton de reset -->
<input type="reset" value="Effacer">

<!-- Bouton personnalisé -->
<input type="button" value="Annuler" onclick="history.back()">
\`\`\`

## Zone de texte (\`<textarea>\`)

\`\`\`html
<textarea name="message" rows="4" cols="50" placeholder="Votre message...">
Contenu par défaut
</textarea>
\`\`\`

## Liste déroulante (\`<select>\`)

### Simple
\`\`\`html
<select name="pays">
  <option value="">-- Choisir un pays --</option>
  <option value="fr">France</option>
  <option value="be">Belgique</option>
  <option value="ch" selected>Suisse</option>
</select>
\`\`\`

### Multiple
\`\`\`html
<select name="langues[]" multiple>
  <option value="fr">Français</option>
  <option value="en">Anglais</option>
  <option value="es">Espagnol</option>
</select>
\`\`\`

### Avec groupes
\`\`\`html
<select name="ville">
  <optgroup label="France">
    <option value="paris">Paris</option>
    <option value="lyon">Lyon</option>
  </optgroup>
  <optgroup label="Belgique">
    <option value="bruxelles">Bruxelles</option>
    <option value="liege">Liège</option>
  </optgroup>
</select>
\`\`\`

## Étiquettes (\`<label>\`)

\`\`\`html
<!-- Méthode 1: for + id -->
<label for="nom">Nom:</label>
<input type="text" id="nom" name="nom">

<!-- Méthode 2: imbrication -->
<label>
  Nom:
  <input type="text" name="nom">
</label>
\`\`\`

## Groupement (\`<fieldset>\` et \`<legend>\`)

\`\`\`html
<fieldset>
  <legend>Informations personnelles</legend>
  <label for="prenom">Prénom:</label>
  <input type="text" id="prenom" name="prenom">
  
  <label for="nom">Nom:</label>
  <input type="text" id="nom" name="nom">
</fieldset>
\`\`\`

## Validation HTML5

### Attributs de validation
\`\`\`html
<!-- Obligatoire -->
<input type="text" name="nom" required>

<!-- Longueur -->
<input type="text" name="code" minlength="3" maxlength="10">

<!-- Valeurs numériques -->
<input type="number" name="prix" min="0" max="1000" step="0.01">

<!-- Pattern (regex) -->
<input type="text" name="code_postal" pattern="[0-9]{5}">

<!-- Message d'erreur personnalisé -->
<input type="email" name="email" required 
       title="Veuillez entrer une adresse e-mail valide">
\`\`\`

### Types avec validation automatique
\`\`\`html
<input type="email" name="email">        <!-- Valide les e-mails -->
<input type="url" name="website">        <!-- Valide les URLs -->
<input type="tel" name="telephone">      <!-- Optimisé pour mobile -->
\`\`\`

## Exemple complet

\`\`\`html
<form action="/contact" method="POST">
  <fieldset>
    <legend>Contact</legend>
    
    <div>
      <label for="nom">Nom *:</label>
      <input type="text" id="nom" name="nom" required>
    </div>
    
    <div>
      <label for="email">E-mail *:</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <div>
      <label for="sujet">Sujet:</label>
      <select id="sujet" name="sujet">
        <option value="info">Information</option>
        <option value="support">Support</option>
        <option value="autre">Autre</option>
      </select>
    </div>
    
    <div>
      <label for="message">Message *:</label>
      <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    
    <div>
      <input type="checkbox" id="rgpd" name="rgpd" required>
      <label for="rgpd">J'accepte le traitement de mes données *</label>
    </div>
    
    <div>
      <input type="submit" value="Envoyer">
      <input type="reset" value="Effacer">
    </div>
  </fieldset>
</form>
\`\`\`
`
        },
        
        // Éléments sémantiques
        {
            category: 'semantic',
            name: 'html-semantic-complete.md',
            title: 'Éléments sémantiques HTML5',
            content: `# Éléments sémantiques HTML5

## Structure de page

### \`<header>\`
En-tête de page ou de section.
\`\`\`html
<header>
  <h1>Titre du site</h1>
  <nav>
    <ul>
      <li><a href="/">Accueil</a></li>
      <li><a href="/blog">Blog</a></li>
    </ul>
  </nav>
</header>
\`\`\`

### \`<nav>\`
Navigation principale.
\`\`\`html
<nav aria-label="Navigation principale">
  <ul>
    <li><a href="/" aria-current="page">Accueil</a></li>
    <li><a href="/produits">Produits</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
\`\`\`

### \`<main>\`
Contenu principal unique de la page.
\`\`\`html
<main>
  <h1>Titre principal de la page</h1>
  <p>Contenu principal...</p>
</main>
\`\`\`

### \`<section>\`
Section thématique du contenu.
\`\`\`html
<section>
  <h2>À propos de nous</h2>
  <p>Description de l'entreprise...</p>
</section>
\`\`\`

### \`<article>\`
Contenu autonome et réutilisable.
\`\`\`html
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
\`\`\`

### \`<aside>\`
Contenu complémentaire (sidebar).
\`\`\`html
<aside>
  <h3>Articles liés</h3>
  <ul>
    <li><a href="/article-1">Article 1</a></li>
    <li><a href="/article-2">Article 2</a></li>
  </ul>
</aside>
\`\`\`

### \`<footer>\`
Pied de page ou de section.
\`\`\`html
<footer>
  <p>&copy; 2025 Mon Site. Tous droits réservés.</p>
  <nav>
    <a href="/mentions">Mentions légales</a>
    <a href="/confidentialite">Confidentialité</a>
  </nav>
</footer>
\`\`\`

## Éléments de contenu

### \`<time>\`
Date ou heure.
\`\`\`html
<time datetime="2025-06-25">25 juin 2025</time>
<time datetime="2025-06-25T14:30">Aujourd'hui à 14h30</time>
\`\`\`

### \`<address>\`
Informations de contact.
\`\`\`html
<address>
  <p>Contact: <a href="mailto:info@example.com">info@example.com</a></p>
  <p>Téléphone: <a href="tel:+33123456789">01 23 45 67 89</a></p>
</address>
\`\`\`

### \`<details>\` et \`<summary>\`
Contenu pliable.
\`\`\`html
<details>
  <summary>Cliquez pour voir plus</summary>
  <p>Contenu caché par défaut.</p>
</details>
\`\`\`

### \`<mark>\`
Texte surligné.
\`\`\`html
<p>Le mot <mark>important</mark> est surligné.</p>
\`\`\`

## Structure complète recommandée

\`\`\`html
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
\`\`\`

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
`
        },
        
        // Attributs
        {
            category: 'attributes',
            name: 'html-attributes-reference.md',
            title: 'Référence des attributs HTML',
            content: `# Référence des attributs HTML

## Attributs globaux

Ces attributs peuvent être utilisés sur tous les éléments HTML.

### \`id\`
Identifiant unique de l'élément.
\`\`\`html
<div id="main-content">Contenu principal</div>
\`\`\`

### \`class\`
Classes CSS pour styliser l'élément.
\`\`\`html
<p class="important highlight">Texte important</p>
\`\`\`

### \`title\`
Information supplémentaire (tooltip).
\`\`\`html
<abbr title="HyperText Markup Language">HTML</abbr>
\`\`\`

### \`lang\`
Langue du contenu de l'élément.
\`\`\`html
<p lang="en">This text is in English</p>
\`\`\`

### \`dir\`
Direction du texte (ltr, rtl, auto).
\`\`\`html
<p dir="rtl">النص بالعربية</p>
\`\`\`

### \`hidden\`
Cache l'élément.
\`\`\`html
<div hidden>Contenu caché</div>
\`\`\`

### \`tabindex\`
Ordre de navigation au clavier.
\`\`\`html
<div tabindex="0">Élément focusable</div>
<div tabindex="-1">Focusable par script seulement</div>
\`\`\`

## Attributs d'accessibilité (ARIA)

### \`aria-label\`
Étiquette alternative pour les lecteurs d'écran.
\`\`\`html
<button aria-label="Fermer la fenêtre">×</button>
\`\`\`

### \`aria-describedby\`
Référence à un élément qui décrit celui-ci.
\`\`\`html
<input type="password" aria-describedby="pwd-help">
<div id="pwd-help">Le mot de passe doit contenir 8 caractères</div>
\`\`\`

### \`aria-expanded\`
Indique si un élément pliable est ouvert.
\`\`\`html
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>...</ul>
\`\`\`

### \`aria-current\`
Indique l'élément actuel dans un ensemble.
\`\`\`html
<a href="/accueil" aria-current="page">Accueil</a>
\`\`\`

## Attributs spécifiques aux liens (\`<a>\`)

### \`href\`
URL de destination.
\`\`\`html
<a href="https://example.com">Lien externe</a>
<a href="/page">Lien interne</a>
<a href="#section">Ancre</a>
<a href="mailto:contact@example.com">E-mail</a>
<a href="tel:+33123456789">Téléphone</a>
\`\`\`

### \`target\`
Fenêtre de destination.
\`\`\`html
<a href="https://example.com" target="_blank">Nouvel onglet</a>
<a href="/page" target="_self">Même fenêtre</a>
\`\`\`

### \`rel\`
Relation avec la ressource liée.
\`\`\`html
<a href="https://example.com" rel="noopener noreferrer">Lien sécurisé</a>
<a href="/page-suivante" rel="next">Page suivante</a>
\`\`\`

### \`download\`
Force le téléchargement.
\`\`\`html
<a href="document.pdf" download="mon-document.pdf">Télécharger</a>
\`\`\`

## Attributs spécifiques aux images (\`<img>\`)

### \`src\`
Source de l'image.
\`\`\`html
<img src="image.jpg" alt="Description">
\`\`\`

### \`alt\`
Texte alternatif (obligatoire).
\`\`\`html
<img src="logo.png" alt="Logo de l'entreprise">
<img src="decoration.png" alt="">  <!-- Image décorative -->
\`\`\`

### \`width\` et \`height\`
Dimensions de l'image.
\`\`\`html
<img src="photo.jpg" width="400" height="300" alt="Photo">
\`\`\`

### \`loading\`
Chargement différé.
\`\`\`html
<img src="image.jpg" loading="lazy" alt="Image">
\`\`\`

### \`srcset\` et \`sizes\`
Images responsives.
\`\`\`html
<img src="image.jpg" 
     srcset="image-480.jpg 480w, image-800.jpg 800w"
     sizes="(max-width: 600px) 480px, 800px"
     alt="Image responsive">
\`\`\`

## Attributs de formulaire

### \`name\`
Nom du champ pour l'envoi.
\`\`\`html
<input type="text" name="nom">
\`\`\`

### \`value\`
Valeur du champ.
\`\`\`html
<input type="text" name="nom" value="Valeur par défaut">
\`\`\`

### \`placeholder\`
Texte d'aide.
\`\`\`html
<input type="email" placeholder="votre@email.com">
\`\`\`

### \`required\`
Champ obligatoire.
\`\`\`html
<input type="text" name="nom" required>
\`\`\`

### \`disabled\`
Champ désactivé.
\`\`\`html
<input type="text" name="nom" disabled>
\`\`\`

### \`readonly\`
Champ en lecture seule.
\`\`\`html
<input type="text" name="code" readonly value="ABC123">
\`\`\`

### \`autocomplete\`
Autocomplétion.
\`\`\`html
<input type="email" name="email" autocomplete="email">
<input type="password" name="password" autocomplete="current-password">
\`\`\`

## Attributs de validation

### \`pattern\`
Expression régulière de validation.
\`\`\`html
<input type="text" name="code" pattern="[A-Z]{3}[0-9]{3}">
\`\`\`

### \`min\`, \`max\`, \`step\`
Valeurs numériques.
\`\`\`html
<input type="number" name="prix" min="0" max="1000" step="0.01">
<input type="range" name="volume" min="0" max="100" step="5">
\`\`\`

### \`minlength\`, \`maxlength\`
Longueur du texte.
\`\`\`html
<input type="text" name="nom" minlength="2" maxlength="50">
\`\`\`

## Attributs multimédias

### \`controls\`
Affiche les contrôles.
\`\`\`html
<video src="video.mp4" controls></video>
<audio src="audio.mp3" controls></audio>
\`\`\`

### \`autoplay\`
Lecture automatique.
\`\`\`html
<video src="video.mp4" autoplay muted></video>
\`\`\`

### \`loop\`
Lecture en boucle.
\`\`\`html
<video src="video.mp4" loop></video>
\`\`\`

### \`muted\`
Son coupé par défaut.
\`\`\`html
<video src="video.mp4" muted></video>
\`\`\`

### \`poster\`
Image de prévisualisation pour les vidéos.
\`\`\`html
<video src="video.mp4" poster="preview.jpg" controls></video>
\`\`\`
`
        },
        
        // Guide pratique
        {
            category: 'guides',
            name: 'html-best-practices.md',
            title: 'Bonnes pratiques HTML',
            content: `# Bonnes pratiques HTML

## Structure du document

### Doctype et langue
Toujours commencer par le doctype HTML5 et spécifier la langue.
\`\`\`html
<!DOCTYPE html>
<html lang="fr">
\`\`\`

### Métadonnées essentielles
\`\`\`html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titre descriptif de la page</title>
  <meta name="description" content="Description de la page pour le SEO">
</head>
\`\`\`

## Sémantique et accessibilité

### Utiliser les bons éléments
\`\`\`html
<!-- ❌ Mauvais -->
<div class="title">Titre</div>
<div class="button" onclick="doSomething()">Cliquer</div>

<!-- ✅ Bon -->
<h1>Titre</h1>
<button onclick="doSomething()">Cliquer</button>
\`\`\`

### Hiérarchie des titres
\`\`\`html
<!-- ✅ Hiérarchie logique -->
<h1>Titre principal</h1>
  <h2>Section</h2>
    <h3>Sous-section</h3>
  <h2>Autre section</h2>
\`\`\`

### Textes alternatifs pour les images
\`\`\`html
<!-- ✅ Image informative -->
<img src="chart.png" alt="Graphique montrant une hausse de 20% des ventes">

<!-- ✅ Image décorative -->
<img src="decoration.png" alt="">

<!-- ✅ Image fonctionnelle -->
<button>
  <img src="search.png" alt="Rechercher">
</button>
\`\`\`

## Formulaires

### Labels explicites
\`\`\`html
<!-- ✅ Label associé -->
<label for="nom">Nom complet :</label>
<input type="text" id="nom" name="nom" required>

<!-- ✅ Label englobant -->
<label>
  E-mail :
  <input type="email" name="email" required>
</label>
\`\`\`

### Validation côté client
\`\`\`html
<input type="email" name="email" required 
       pattern="[^@]+@[^@]+\\.[a-zA-Z]{2,}"
       title="Veuillez entrer une adresse e-mail valide">
\`\`\`

### Messages d'erreur
\`\`\`html
<label for="password">Mot de passe :</label>
<input type="password" id="password" name="password" 
       minlength="8" required aria-describedby="pwd-help">
<div id="pwd-help">Le mot de passe doit contenir au moins 8 caractères</div>
\`\`\`

## Performance

### Optimisation des images
\`\`\`html
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
\`\`\`

### Chargement différé
\`\`\`html
<!-- ✅ Images hors viewport -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- ✅ Scripts non critiques -->
<script src="analytics.js" defer></script>
\`\`\`

## Sécurité

### Liens externes
\`\`\`html
<!-- ✅ Liens sécurisés -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Lien externe
</a>
\`\`\`

### Validation des données
\`\`\`html
<!-- ✅ Validation stricte -->
<input type="tel" name="phone" pattern="[0-9]{10}" maxlength="10">
<input type="url" name="website" pattern="https://.*">
\`\`\`

## SEO

### Métadonnées Open Graph
\`\`\`html
<meta property="og:title" content="Titre de la page">
<meta property="og:description" content="Description de la page">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
\`\`\`

### Données structurées
\`\`\`html
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
\`\`\`

## Code propre

### Indentation et lisibilité
\`\`\`html
<!-- ✅ Code indenté et lisible -->
<article>
  <header>
    <h2>Titre</h2>
    <time datetime="2025-06-25">25 juin 2025</time>
  </header>
  <p>Contenu de l'article...</p>
</article>
\`\`\`

### Commentaires utiles
\`\`\`html
<!-- Navigation principale -->
<nav aria-label="Navigation principale">
  <!-- ... -->
</nav>

<!-- Contenu principal de la page -->
<main>
  <!-- ... -->
</main>

<!-- Fin du contenu principal -->
\`\`\`

### Validation du code
- Utiliser le validateur W3C : https://validator.w3.org/
- Tester l'accessibilité avec des outils comme axe-core
- Vérifier la compatibilité navigateur

## Points de contrôle

### Avant publication
- [ ] Doctype HTML5 présent
- [ ] Langue spécifiée sur \`<html>\`
- [ ] Métadonnées de base (charset, viewport, title, description)
- [ ] Hiérarchie des titres logique
- [ ] Tous les \`<img>\` ont un attribut \`alt\`
- [ ] Tous les formulaires ont des labels
- [ ] Liens externes avec \`rel="noopener"\`
- [ ] Code validé par le W3C
- [ ] Tests d'accessibilité effectués
- [ ] Performance optimisée (images, chargement)
`
        }
    ];
    
    // Créer la documentation
    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        const categoryDir = join(DOCS_DIR, doc.category);
        
        if (!existsSync(categoryDir)) {
            mkdirSync(categoryDir, { recursive: true });
        }
        
        const header = `# ${doc.title}

> **Source:** Documentation créée pour le serveur MCP  
> **Catégorie:** ${doc.category}  
> **Type:** Guide HTML5

---

`;

        const footer = `

---

## 📚 Complément

Cette documentation est un guide pratique. Pour une référence complète :
- [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTML)
- [W3C HTML Specification](https://www.w3.org/TR/html52/)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)

---
*Documentation générée le ${new Date().toLocaleDateString('fr-FR')}*
`;

        const fullContent = header + doc.content + footer;
        const filePath = join(categoryDir, doc.name);
        writeFileSync(filePath, fullContent);
        
        console.log(`  ✅ ${doc.category}/${doc.name}`);
    }
    
    return docs.length;
}

/**
 * Fonction principale
 */
function createHtmlDocumentation() {
    logStatus('start', 'Création de la documentation HTML5 complète...');
    
    // Créer le dossier de destination
    if (!existsSync(DOCS_DIR)) {
        mkdirSync(DOCS_DIR, { recursive: true });
    }
    
    // Créer la documentation
    const filesCreated = createHtmlDocs();
    
    // Créer le README
    const summaryPath = join(DOCS_DIR, 'README.md');
    const categories = ['elements', 'forms', 'semantic', 'attributes', 'guides'];
    
    const summaryContent = `# Documentation HTML5

Documentation HTML5 complète avec guides pratiques et références.

## 📊 Statistiques
- **Fichiers créés:** ${filesCreated}
- **Catégories:** ${categories.length}

## 📚 Catégories disponibles

${categories.map(cat => {
    const descriptions = {
        'elements': 'Référence complète des éléments HTML',
        'forms': 'Guide complet des formulaires',
        'semantic': 'Éléments sémantiques HTML5',
        'attributes': 'Référence des attributs HTML',
        'guides': 'Bonnes pratiques et guides'
    };
    return `- **${cat}** - ${descriptions[cat] || cat}`;
}).join('\n')}

## 🌐 Sources

Cette documentation combine :
- **Référence officielle** : Basée sur les standards W3C et WHATWG
- **Bonnes pratiques** : Recommandations de la communauté
- **Exemples pratiques** : Code prêt à utiliser

## 📖 Utilisation MCP

Cette documentation est accessible via :
- \`mcp_fullstack-doc_search_docs\` avec technology="html"
- \`mcp_fullstack-doc_get_categories\` pour technology="html"

## 🔗 Liens utiles

- [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTML)
- [W3C HTML Specification](https://www.w3.org/TR/html52/)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)
- [Validateur W3C](https://validator.w3.org/)

---
*Documentation générée automatiquement le ${new Date().toLocaleString('fr-FR')}*
`;
    
    writeFileSync(summaryPath, summaryContent);
    
    logStatus('success', `Documentation HTML créée avec succès !`);
    logStatus('info', `${filesCreated} fichiers dans ${categories.length} catégories`);
    logStatus('info', `Documentation disponible dans: docs/html/`);
    
    return {
        filesCreated,
        categories: categories.length
    };
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    createHtmlDocumentation();
}

export { createHtmlDocumentation };
