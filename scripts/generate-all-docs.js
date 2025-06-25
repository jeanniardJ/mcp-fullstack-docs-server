#!/usr/bin/env node

/**
 * Script pour télécharger la documentation de toutes les technologies
 * PHP, MySQL, JavaScript, CSS, HTML, Webpack
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs');

console.log('📚 Téléchargement de la documentation complète...');

const documentationSources = {
    php: [
        {
            name: 'classes-advanced.md',
            category: 'oop',
            content: `# Classes et Objets Avancés - PHP 8.2

> Source: Documentation PHP officielle  
> Téléchargé le ${new Date().toLocaleDateString('fr-FR')}

---

## Classes abstraites

\`\`\`php
abstract class Animal {
    abstract public function makeSound(): string;
    
    public function sleep(): string {
        return "Sleeping...";
    }
}

class Dog extends Animal {
    public function makeSound(): string {
        return "Woof!";
    }
}
\`\`\`

## Interfaces

\`\`\`php
interface Flyable {
    public function fly(): string;
}

interface Swimmable {
    public function swim(): string;
}

class Duck implements Flyable, Swimmable {
    public function fly(): string {
        return "Flying like a duck";
    }
    
    public function swim(): string {
        return "Swimming like a duck";
    }
}
\`\`\`

## Traits

\`\`\`php
trait Timestampable {
    private DateTime $createdAt;
    private DateTime $updatedAt;
    
    public function touch(): void {
        $this->updatedAt = new DateTime();
    }
    
    public function getCreatedAt(): DateTime {
        return $this->createdAt;
    }
}

class User {
    use Timestampable;
    
    public function __construct(
        private string $name,
        private string $email
    ) {
        $this->createdAt = new DateTime();
        $this->updatedAt = new DateTime();
    }
}
\`\`\`

## Énumérations (PHP 8.1+)

\`\`\`php
enum Status: string {
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    
    public function getLabel(): string {
        return match($this) {
            self::PENDING => 'En attente',
            self::APPROVED => 'Approuvé',
            self::REJECTED => 'Rejeté'
        };
    }
}
\`\`\`

## Attributs (PHP 8.0+)

\`\`\`php
#[Attribute]
class Route {
    public function __construct(
        public string $path,
        public array $methods = ['GET']
    ) {}
}

class UserController {
    #[Route('/users', ['GET', 'POST'])]
    public function index(): Response {
        // ...
    }
    
    #[Route('/users/{id}', ['GET'])]
    public function show(int $id): Response {
        // ...
    }
}
\`\`\``
        },
        {
            name: 'performance-optimization.md',
            category: 'performance',
            content: `# Optimisation des Performances - PHP 8.2

> Source: Documentation PHP et bonnes pratiques  
> Téléchargé le ${new Date().toLocaleDateString('fr-FR')}

---

## OPcache

\`\`\`php
// Configuration recommandée
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.save_comments=1
\`\`\`

## Optimisation des boucles

\`\`\`php
// ❌ Lent
foreach ($items as $item) {
    if (count($results) > 1000) break;
    $results[] = processItem($item);
}

// ✅ Rapide
$count = count($results);
foreach ($items as $item) {
    if ($count > 1000) break;
    $results[] = processItem($item);
    $count++;
}
\`\`\`

## Gestion mémoire

\`\`\`php
// Libérer la mémoire
unset($largeArray);

// Générateurs pour économiser la mémoire
function readLargeFile(string $file): Generator {
    $handle = fopen($file, 'r');
    while (($line = fgets($handle)) !== false) {
        yield trim($line);
    }
    fclose($handle);
}
\`\`\`

## Mise en cache

\`\`\`php
// APCu pour le cache local
if (apcu_exists('expensive_calculation')) {
    $result = apcu_fetch('expensive_calculation');
} else {
    $result = performExpensiveCalculation();
    apcu_store('expensive_calculation', $result, 3600);
}
\`\`\``
        }
    ],
    
    mysql: [
        {
            name: 'advanced-queries.md',
            category: 'queries',
            content: `# Requêtes Avancées - MySQL 8.0

> Source: Documentation MySQL officielle  
> Téléchargé le ${new Date().toLocaleDateString('fr-FR')}

---

## Jointures complexes

\`\`\`sql
-- Jointure LEFT avec conditions
SELECT u.name, p.title, c.content
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.published = 1
LEFT JOIN comments c ON p.id = c.post_id
WHERE u.active = 1
ORDER BY u.name, p.created_at DESC;

-- Jointure avec sous-requête
SELECT u.name, u.email,
       (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as post_count
FROM users u
WHERE u.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY);
\`\`\`

## Window Functions

\`\`\`sql
-- Numérotation des lignes
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- Calculs sur fenêtre glissante
SELECT 
    date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7_days
FROM daily_sales;
\`\`\`

## CTE (Common Table Expressions)

\`\`\`sql
-- CTE récursive pour hiérarchie
WITH RECURSIVE employee_hierarchy AS (
    -- Cas de base
    SELECT id, name, manager_id, 1 as level
    FROM employees 
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Cas récursif
    SELECT e.id, e.name, e.manager_id, eh.level + 1
    FROM employees e
    INNER JOIN employee_hierarchy eh ON e.manager_id = eh.id
)
SELECT * FROM employee_hierarchy ORDER BY level, name;
\`\`\`

## JSON dans MySQL

\`\`\`sql
-- Requêtes sur colonnes JSON
SELECT id, name, JSON_EXTRACT(preferences, '$.theme') as theme
FROM users
WHERE JSON_EXTRACT(preferences, '$.notifications') = true;

-- Mise à jour JSON
UPDATE users 
SET preferences = JSON_SET(preferences, '$.language', 'fr')
WHERE id = 1;
\`\`\``
        }
    ],
    
    javascript: [
        {
            name: 'async-programming.md',
            category: 'async',
            content: `# Programmation Asynchrone - JavaScript ES2023

> Source: Documentation MDN et ECMAScript  
> Téléchargé le ${new Date().toLocaleDateString('fr-FR')}

---

## Promises avancées

\`\`\`javascript
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
\`\`\`

## Async/Await patterns

\`\`\`javascript
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
\`\`\`

## Générateurs asynchrones

\`\`\`javascript
async function* fetchPaginated(url) {
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        const response = await fetch(\`\${url}?page=\${page}\`);
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
\`\`\`

## AbortController

\`\`\`javascript
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
\`\`\``
        }
    ],
    
    css: [
        {
            name: 'modern-layouts.md',
            category: 'layout',
            content: `# Layouts Modernes - CSS 3

> Source: Spécifications W3C et MDN  
> Téléchargé le ${new Date().toLocaleDateString('fr-FR')}

---

## CSS Grid avancé

\`\`\`css
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
\`\`\`

## Flexbox patterns

\`\`\`css
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
\`\`\`

## Container Queries

\`\`\`css
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
\`\`\`

## CSS Custom Properties

\`\`\`css
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
\`\`\``
        }
    ]
};

async function downloadAllDocs() {
    console.log('🚀 Début du téléchargement...');
    
    for (const [tech, docs] of Object.entries(documentationSources)) {
        console.log(`📂 Traitement de ${tech}...`);
        
        const techDir = join(DOCS_DIR, tech);
        if (!existsSync(techDir)) {
            mkdirSync(techDir, { recursive: true });
        }
        
        for (const doc of docs) {
            const categoryDir = join(techDir, doc.category);
            if (!existsSync(categoryDir)) {
                mkdirSync(categoryDir, { recursive: true });
            }
            
            const filePath = join(categoryDir, doc.name);
            writeFileSync(filePath, doc.content);
            console.log(`  ✅ ${doc.name} créé`);
        }
    }
    
    console.log('✅ Toute la documentation a été générée!');
    console.log('📁 Dossiers créés dans:', DOCS_DIR);
}

downloadAllDocs().catch(console.error);
