# Opérations JSON - MySQL 8.0

> Source: Documentation MySQL JSON
> Généré le 25/06/2025

---

## Création et insertion

```sql
-- Créer une table avec colonne JSON
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    preferences JSON,
    metadata JSON
);

-- Insérer des données JSON
INSERT INTO users (name, preferences, metadata) VALUES
('John', '{"theme": "dark", "language": "fr", "notifications": true}', '{"created": "2024-01-15", "source": "web"}'),
('Jane', '{"theme": "light", "language": "en", "notifications": false}', '{"created": "2024-01-16", "source": "mobile"}');

-- Utiliser JSON_OBJECT
INSERT INTO users (name, preferences) VALUES
('Bob', JSON_OBJECT('theme', 'auto', 'language', 'es', 'notifications', true));
```

## Extraction de données

```sql
-- Extraire une valeur avec JSON_EXTRACT ou ->
SELECT name, JSON_EXTRACT(preferences, '$.theme') as theme FROM users;
SELECT name, preferences->'$.theme' as theme FROM users;

-- Extraire sans guillemets avec ->>
SELECT name, preferences->>'$.theme' as theme FROM users;

-- Extraire des tableaux
INSERT INTO users (name, preferences) VALUES
('Alice', '{"theme": "dark", "tags": ["admin", "premium", "beta"]}');

SELECT name, JSON_EXTRACT(preferences, '$.tags[0]') as first_tag FROM users;
SELECT name, preferences->'$.tags[*]' as all_tags FROM users;
```

## Recherche et filtrage

```sql
-- Rechercher par valeur JSON
SELECT * FROM users WHERE preferences->'$.theme' = 'dark';
SELECT * FROM users WHERE JSON_EXTRACT(preferences, '$.notifications') = true;

-- Rechercher dans un tableau
SELECT * FROM users WHERE JSON_CONTAINS(preferences, '"admin"', '$.tags');

-- Rechercher par clé
SELECT * FROM users WHERE JSON_CONTAINS_PATH(preferences, 'one', '$.notifications');

-- Recherche avec expressions régulières
SELECT * FROM users WHERE preferences->'$.language' REGEXP '^(fr|en)$';
```

## Modification de données JSON

```sql
-- Mettre à jour une valeur
UPDATE users 
SET preferences = JSON_SET(preferences, '$.theme', 'light')
WHERE id = 1;

-- Ajouter une nouvelle clé
UPDATE users 
SET preferences = JSON_SET(preferences, '$.sidebar', 'collapsed')
WHERE name = 'John';

-- Supprimer une clé
UPDATE users 
SET preferences = JSON_REMOVE(preferences, '$.notifications')
WHERE id = 2;

-- Remplacer seulement si la clé existe
UPDATE users 
SET preferences = JSON_REPLACE(preferences, '$.theme', 'auto')
WHERE id = 1;

-- Insérer seulement si la clé n'existe pas
UPDATE users 
SET preferences = JSON_INSERT(preferences, '$.timezone', 'UTC')
WHERE id = 1;
```

## Fonctions d'agrégation JSON

```sql
-- Combiner des objets JSON
SELECT JSON_MERGE_PATCH(
    '{"theme": "dark"}',
    '{"language": "fr"}'
) as merged;

-- Créer un tableau d'objets
SELECT JSON_ARRAYAGG(
    JSON_OBJECT('name', name, 'theme', preferences->'$.theme')
) as users_themes
FROM users;

-- Créer un objet à partir de clés/valeurs
SELECT JSON_OBJECTAGG(name, preferences->'$.theme') as user_themes
FROM users;
```

## Index sur colonnes JSON

```sql
-- Index fonctionnel sur expression JSON
CREATE INDEX idx_user_theme ON users ((preferences->'$.theme'));

-- Index sur colonne générée
ALTER TABLE users 
ADD COLUMN theme VARCHAR(20) GENERATED ALWAYS AS (preferences->'$.theme') STORED;

CREATE INDEX idx_theme ON users(theme);

-- Recherche optimisée
SELECT * FROM users WHERE theme = 'dark';
```

## Validation JSON Schema

```sql
-- Contrainte CHECK avec JSON_VALID
CREATE TABLE settings (
    id INT PRIMARY KEY,
    config JSON,
    CONSTRAINT config_valid CHECK (JSON_VALID(config))
);

-- Validation plus stricte avec JSON Schema (MySQL 8.0.17+)
CREATE TABLE user_settings (
    id INT PRIMARY KEY,
    settings JSON,
    CONSTRAINT settings_schema CHECK (
        JSON_SCHEMA_VALID('{
            "type": "object",
            "properties": {
                "theme": {"type": "string", "enum": ["light", "dark", "auto"]},
                "notifications": {"type": "boolean"},
                "language": {"type": "string", "pattern": "^[a-z]{2}$"}
            },
            "required": ["theme"]
        }', settings)
    )
);
```