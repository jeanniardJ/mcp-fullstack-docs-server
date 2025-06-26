# Guide complet des formulaires HTML

> **Source:** Documentation créée pour le serveur MCP  
> **Catégorie:** forms  
> **Type:** Guide HTML5

---

# Guide complet des formulaires HTML

## Élément `<form>`

Structure de base d'un formulaire.
```html
<form action="/submit" method="POST" enctype="multipart/form-data">
  <!-- Champs du formulaire -->
</form>
```

**Attributs principaux:**
- `action`: URL de destination
- `method`: GET ou POST
- `enctype`: Type d'encodage (multipart/form-data pour les fichiers)

## Champs de saisie (`<input>`)

### Types de base
```html
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
```

### Types pour mobile
```html
<!-- Téléphone -->
<input type="tel" name="telephone">

<!-- URL -->
<input type="url" name="website">

<!-- Recherche -->
<input type="search" name="query">
```

### Cases et boutons radio
```html
<!-- Case à cocher -->
<input type="checkbox" id="newsletter" name="newsletter" value="oui">
<label for="newsletter">S'abonner à la newsletter</label>

<!-- Boutons radio -->
<input type="radio" id="homme" name="genre" value="homme">
<label for="homme">Homme</label>
<input type="radio" id="femme" name="genre" value="femme">
<label for="femme">Femme</label>
```

### Boutons
```html
<!-- Bouton de soumission -->
<input type="submit" value="Envoyer">

<!-- Bouton de reset -->
<input type="reset" value="Effacer">

<!-- Bouton personnalisé -->
<input type="button" value="Annuler" onclick="history.back()">
```

## Zone de texte (`<textarea>`)

```html
<textarea name="message" rows="4" cols="50" placeholder="Votre message...">
Contenu par défaut
</textarea>
```

## Liste déroulante (`<select>`)

### Simple
```html
<select name="pays">
  <option value="">-- Choisir un pays --</option>
  <option value="fr">France</option>
  <option value="be">Belgique</option>
  <option value="ch" selected>Suisse</option>
</select>
```

### Multiple
```html
<select name="langues[]" multiple>
  <option value="fr">Français</option>
  <option value="en">Anglais</option>
  <option value="es">Espagnol</option>
</select>
```

### Avec groupes
```html
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
```

## Étiquettes (`<label>`)

```html
<!-- Méthode 1: for + id -->
<label for="nom">Nom:</label>
<input type="text" id="nom" name="nom">

<!-- Méthode 2: imbrication -->
<label>
  Nom:
  <input type="text" name="nom">
</label>
```

## Groupement (`<fieldset>` et `<legend>`)

```html
<fieldset>
  <legend>Informations personnelles</legend>
  <label for="prenom">Prénom:</label>
  <input type="text" id="prenom" name="prenom">
  
  <label for="nom">Nom:</label>
  <input type="text" id="nom" name="nom">
</fieldset>
```

## Validation HTML5

### Attributs de validation
```html
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
```

### Types avec validation automatique
```html
<input type="email" name="email">        <!-- Valide les e-mails -->
<input type="url" name="website">        <!-- Valide les URLs -->
<input type="tel" name="telephone">      <!-- Optimisé pour mobile -->
```

## Exemple complet

```html
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
```


---

## 📚 Complément

Cette documentation est un guide pratique. Pour une référence complète :
- [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTML)
- [W3C HTML Specification](https://www.w3.org/TR/html52/)
- [WHATWG HTML Living Standard](https://html.spec.whatwg.org/)

---
*Documentation générée le 25/06/2025*
