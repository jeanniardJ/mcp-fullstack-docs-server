# Requêtes de Base - MySQL 8.0

> Source: Documentation MySQL officielle et bonnes pratiques
> Généré le 25/06/2025

---

## SELECT de base

```sql
-- Sélection simple
SELECT id, name, email FROM users;

-- Avec conditions
SELECT * FROM users 
WHERE age >= 18 AND status = 'active';

-- Tri et limitation
SELECT name, salary FROM employees 
ORDER BY salary DESC 
LIMIT 10;

-- Groupement
SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary
FROM employees 
GROUP BY department
HAVING COUNT(*) > 5;
```

## Jointures

```sql
-- INNER JOIN
SELECT u.name, p.title, p.created_at
FROM users u
INNER JOIN posts p ON u.id = p.user_id;

-- LEFT JOIN avec NULL
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name;

-- Jointure multiple
SELECT u.name, p.title, c.content
FROM users u
JOIN posts p ON u.id = p.user_id
JOIN comments c ON p.id = c.post_id
WHERE p.published = 1;
```

## Sous-requêtes

```sql
-- Sous-requête dans WHERE
SELECT name FROM users 
WHERE id IN (
    SELECT DISTINCT user_id FROM orders 
    WHERE total > 1000
);

-- Sous-requête corrélée
SELECT name, salary,
    (SELECT AVG(salary) FROM employees e2 
     WHERE e2.department = e1.department) as dept_avg
FROM employees e1;

-- EXISTS
SELECT name FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.status = 'completed'
);
```

## Opérations DML

```sql
-- INSERT
INSERT INTO users (name, email, created_at) 
VALUES ('John Doe', 'john@example.com', NOW());

-- INSERT multiple
INSERT INTO products (name, price, category) VALUES
    ('Product 1', 29.99, 'Electronics'),
    ('Product 2', 39.99, 'Electronics'),
    ('Product 3', 19.99, 'Books');

-- UPDATE avec JOIN
UPDATE users u
JOIN user_profiles p ON u.id = p.user_id
SET u.last_login = NOW(), p.login_count = p.login_count + 1
WHERE u.id = 123;

-- DELETE avec sous-requête
DELETE FROM logs 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```