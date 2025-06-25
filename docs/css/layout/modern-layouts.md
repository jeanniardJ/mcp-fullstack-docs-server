# Layouts Modernes - CSS 3

> Source: Spécifications W3C et MDN  
> Téléchargé le 25/06/2025

---

## CSS Grid avancé

```css
/* Grille responsive avec auto-fit */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

/* Grille avec zones nommées */
.layout {
    display: grid;
    grid-template-areas: 
        "header header header"
        "sidebar main aside"
        "footer footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 250px 1fr 200px;
    min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

## Flexbox patterns

```css
/* Centre parfait */
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* Distribution équitable */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Colonnes égales */
.columns {
    display: flex;
    gap: 2rem;
}

.columns > * {
    flex: 1;
}
```

## Container Queries

```css
/* Responsive basé sur le conteneur */
.card-container {
    container-type: inline-size;
}

@container (min-width: 400px) {
    .card {
        display: flex;
        gap: 1rem;
    }
    
    .card img {
        width: 150px;
        height: 100px;
        object-fit: cover;
    }
}

@container (max-width: 399px) {
    .card {
        display: block;
    }
    
    .card img {
        width: 100%;
        height: 200px;
    }
}
```

## CSS Custom Properties

```css
:root {
    --primary-color: hsl(210, 100%, 50%);
    --primary-light: hsl(210, 100%, 60%);
    --primary-dark: hsl(210, 100%, 40%);
    
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
    --spacing-xl: 4rem;
}

/* Thème sombre */
[data-theme="dark"] {
    --primary-color: hsl(210, 80%, 60%);
    --bg-color: hsl(220, 15%, 10%);
    --text-color: hsl(220, 15%, 90%);
}

.button {
    background: var(--primary-color);
    padding: var(--spacing-sm) var(--spacing-md);
    color: white;
    border: none;
    border-radius: 4px;
}
```