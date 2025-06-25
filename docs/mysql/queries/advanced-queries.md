# Requêtes Avancées - MySQL 8.0

> Source: Documentation MySQL officielle  
> Téléchargé le 25/06/2025

---

## Jointures complexes

```sql
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
```

## Window Functions

```sql
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
```

## CTE (Common Table Expressions)

```sql
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
```

## JSON dans MySQL

```sql
-- Requêtes sur colonnes JSON
SELECT id, name, JSON_EXTRACT(preferences, '$.theme') as theme
FROM users
WHERE JSON_EXTRACT(preferences, '$.notifications') = true;

-- Mise à jour JSON
UPDATE users 
SET preferences = JSON_SET(preferences, '$.language', 'fr')
WHERE id = 1;
```