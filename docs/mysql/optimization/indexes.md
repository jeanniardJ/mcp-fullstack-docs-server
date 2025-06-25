# Index et Optimisation - MySQL 8.0

> Source: Documentation MySQL et bonnes pratiques
> Généré le 25/06/2025

---

## Types d'index

```sql
-- Index simple
CREATE INDEX idx_user_email ON users(email);

-- Index composé
CREATE INDEX idx_user_status_created ON users(status, created_at);

-- Index unique
CREATE UNIQUE INDEX idx_user_username ON users(username);

-- Index partiel (avec condition)
CREATE INDEX idx_active_users ON users(created_at) 
WHERE status = 'active';

-- Index fonctionnel
CREATE INDEX idx_user_email_domain ON users((SUBSTRING_INDEX(email, '@', -1)));
```

## Analyse des performances

```sql
-- Utiliser EXPLAIN
EXPLAIN FORMAT=JSON
SELECT u.name, p.title 
FROM users u 
JOIN posts p ON u.id = p.user_id 
WHERE u.status = 'active' AND p.published = 1;

-- Analyser les requêtes lentes
SELECT * FROM mysql.slow_log 
WHERE start_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY query_time DESC;

-- Statistiques d'index
SELECT 
    table_name,
    index_name,
    cardinality,
    packed,
    nullable
FROM information_schema.statistics 
WHERE table_schema = 'mydb'
ORDER BY table_name, seq_in_index;
```

## Optimisation des requêtes

```sql
-- ❌ Mauvais: Fonction sur colonne indexée
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Bon: Utiliser les bornes
SELECT * FROM users 
WHERE created_at >= '2024-01-01' 
AND created_at < '2025-01-01';

-- ❌ Mauvais: SELECT *
SELECT * FROM users JOIN posts ON users.id = posts.user_id;

-- ✅ Bon: Colonnes spécifiques
SELECT users.name, posts.title 
FROM users JOIN posts ON users.id = posts.user_id;

-- Optimisation avec EXISTS vs IN
-- ✅ Meilleur pour grandes tables
SELECT name FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id
);
```

## Configuration et monitoring

```sql
-- Variables importantes
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'query_cache_size';
SHOW VARIABLES LIKE 'tmp_table_size';

-- Status de performance
SHOW STATUS LIKE 'Slow_queries';
SHOW STATUS LIKE 'Questions';
SHOW STATUS LIKE 'Uptime';

-- Performance Schema
SELECT * FROM performance_schema.events_statements_summary_by_digest
ORDER BY sum_timer_wait DESC LIMIT 10;
```