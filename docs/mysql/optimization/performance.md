# Optimisation MySQL

## Index

### Création d'index

```sql
-- Index simple
CREATE INDEX idx_email ON users(email);

-- Index composé
CREATE INDEX idx_name_date ON users(last_name, created_at);

-- Index unique
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

### Types d'index

- **BTREE** : Index par défaut, optimal pour égalité et plages
- **HASH** : Optimal pour égalité uniquement
- **FULLTEXT** : Pour la recherche textuelle

## Requêtes optimisées

### EXPLAIN

```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

### Optimisation des JOIN

```sql
-- Bon
SELECT u.name, p.title 
FROM users u 
INNER JOIN posts p ON u.id = p.user_id 
WHERE u.active = 1;

-- Éviter
SELECT * FROM users, posts 
WHERE users.id = posts.user_id;
```

### LIMIT avec OFFSET

```sql
-- Efficace pour les petits OFFSET
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 0;

-- Pour les gros OFFSET, utiliser une condition
SELECT * FROM users WHERE id > 1000 ORDER BY id LIMIT 10;
```

## Cache de requêtes

```sql
-- Activer le cache de requêtes
SET GLOBAL query_cache_type = ON;
SET GLOBAL query_cache_size = 268435456; -- 256MB
```

## Configuration my.cnf

```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 256M
```
