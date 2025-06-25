# CSS Grid Layout

## Conteneur Grid

### Déclaration de base

```css
.grid-container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 20px;
    height: 100vh;
}
```

### Colonnes et lignes

```css
/* Colonnes avec tailles fixes */
.grid {
    grid-template-columns: 200px 300px 1fr;
}

/* Colonnes répétées */
.grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Lignes nommées */
.grid {
    grid-template-rows: [header] 80px [content] 1fr [footer] 60px;
}
```

## Placement des éléments

### Positionnement par ligne

```css
.grid-item {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 4;
}

/* Syntaxe courte */
.grid-item {
    grid-column: 1 / 3;
    grid-row: 2 / 4;
}

/* Syntaxe avec span */
.grid-item {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
}
```

### Zones nommées

```css
.grid-container {
    grid-template-areas: 
        "header header header"
        "sidebar content content"
        "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

## Alignement

### Alignement des éléments

```css
.grid-container {
    /* Alignement horizontal */
    justify-items: start | end | center | stretch;
    
    /* Alignement vertical */
    align-items: start | end | center | stretch;
    
    /* Raccourci */
    place-items: center;
}
```

### Alignement du contenu

```css
.grid-container {
    /* Alignement horizontal du grid */
    justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
    
    /* Alignement vertical du grid */
    align-content: start | end | center | stretch | space-around | space-between | space-evenly;
}
```

## Grid responsive

```css
.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

@media (max-width: 768px) {
    .responsive-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
}
```

## Exemple complet

```css
.layout {
    display: grid;
    grid-template-areas: 
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-columns: 250px 1fr;
    grid-template-rows: 80px 1fr 60px;
    min-height: 100vh;
    gap: 20px;
}

.header { 
    grid-area: header; 
    background: #333;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
}

.sidebar { 
    grid-area: sidebar; 
    background: #f5f5f5;
    padding: 20px;
}

.main { 
    grid-area: main; 
    padding: 20px;
}

.footer { 
    grid-area: footer; 
    background: #333;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}
```
