#!/usr/bin/env node

/**
 * Générateur de documentation MySQL complète
 * Inclut syntaxe SQL, optimisation, sécurité, administration
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MYSQL_DOCS_DIR = join(__dirname, '..', 'docs', 'mysql');

console.log('📚 Génération de la documentation MySQL complète...');

const mysqlDocumentation = {
    'queries': [
        {
            name: 'basic-queries.md',
            content: `# Requêtes de Base - MySQL 8.0

> Source: Documentation MySQL officielle et bonnes pratiques
> Généré le ${new Date().toLocaleDateString('fr-FR')}

---

## SELECT de base

\`\`\`sql
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
\`\`\`

## Jointures

\`\`\`sql
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
\`\`\`

## Sous-requêtes

\`\`\`sql
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
\`\`\`

## Opérations DML

\`\`\`sql
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
\`\`\``
        },
        {
            name: 'window-functions.md',
            content: `# Fonctions de Fenêtre - MySQL 8.0

> Source: Documentation MySQL 8.0
> Généré le ${new Date().toLocaleDateString('fr-FR')}

---

## Fonctions de rang

\`\`\`sql
-- ROW_NUMBER(): Numérotation unique
SELECT 
    name, 
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as rank_number
FROM employees;

-- RANK(): Rangs avec égalités
SELECT 
    name, 
    salary,
    RANK() OVER (ORDER BY salary DESC) as rank_position,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank
FROM employees;

-- Partition par département
SELECT 
    department,
    name, 
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
FROM employees;
\`\`\`

## Fonctions d'agrégation sur fenêtre

\`\`\`sql
-- SUM cumulatif
SELECT 
    order_date,
    amount,
    SUM(amount) OVER (
        ORDER BY order_date 
        ROWS UNBOUNDED PRECEDING
    ) as running_total
FROM orders;

-- Moyenne mobile sur 7 jours
SELECT 
    date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7_days
FROM daily_sales;

-- Comparaison avec valeurs précédentes/suivantes
SELECT 
    month,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY month) as prev_month,
    LEAD(revenue, 1) OVER (ORDER BY month) as next_month,
    revenue - LAG(revenue, 1) OVER (ORDER BY month) as month_diff
FROM monthly_sales;
\`\`\`

## Fonctions de valeur

\`\`\`sql
-- FIRST_VALUE et LAST_VALUE
SELECT 
    employee_id,
    department,
    salary,
    FIRST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
        ROWS UNBOUNDED PRECEDING
    ) as highest_salary_in_dept,
    LAST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as lowest_salary_in_dept
FROM employees;

-- NTILE pour créer des quartiles
SELECT 
    name,
    salary,
    NTILE(4) OVER (ORDER BY salary) as salary_quartile
FROM employees;
\`\`\`

## CTE avec Window Functions

\`\`\`sql
-- Analyse des ventes avec CTE
WITH sales_analysis AS (
    SELECT 
        product_id,
        month,
        sales,
        LAG(sales, 1) OVER (PARTITION BY product_id ORDER BY month) as prev_month_sales,
        AVG(sales) OVER (
            PARTITION BY product_id 
            ORDER BY month 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) as avg_3_months
    FROM product_sales
)
SELECT 
    product_id,
    month,
    sales,
    prev_month_sales,
    avg_3_months,
    CASE 
        WHEN sales > avg_3_months * 1.2 THEN 'Excellent'
        WHEN sales > avg_3_months THEN 'Good'
        ELSE 'Below Average'
    END as performance
FROM sales_analysis;
\`\`\``
        }
    ],
    
    'optimization': [
        {
            name: 'indexes.md',
            content: `# Index et Optimisation - MySQL 8.0

> Source: Documentation MySQL et bonnes pratiques
> Généré le ${new Date().toLocaleDateString('fr-FR')}

---

## Types d'index

\`\`\`sql
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
\`\`\`

## Analyse des performances

\`\`\`sql
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
\`\`\`

## Optimisation des requêtes

\`\`\`sql
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
\`\`\`

## Configuration et monitoring

\`\`\`sql
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
\`\`\``
        }
    ],
    
    'security': [
        {
            name: 'security-best-practices.md',
            content: `# Sécurité MySQL - Bonnes Pratiques

> Source: Guide de sécurité MySQL
> Généré le ${new Date().toLocaleDateString('fr-FR')}

---

## Gestion des utilisateurs

\`\`\`sql
-- Créer un utilisateur avec privilèges limités
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password_123!';

-- Accorder des privilèges spécifiques
GRANT SELECT, INSERT, UPDATE, DELETE ON myapp.* TO 'app_user'@'localhost';

-- Utilisateur en lecture seule
CREATE USER 'readonly'@'%' IDENTIFIED BY 'readonly_pass';
GRANT SELECT ON myapp.* TO 'readonly'@'%';

-- Révoquer des privilèges
REVOKE DELETE ON myapp.users FROM 'app_user'@'localhost';

-- Voir les privilèges
SHOW GRANTS FOR 'app_user'@'localhost';
\`\`\`

## Chiffrement et SSL

\`\`\`sql
-- Forcer SSL pour un utilisateur
CREATE USER 'secure_user'@'%' 
IDENTIFIED BY 'password' 
REQUIRE SSL;

-- Chiffrement au repos (dans my.cnf)
-- [mysqld]
-- innodb_encrypt_tables=ON
-- innodb_encrypt_log=ON

-- Vérifier le statut SSL
SHOW STATUS LIKE 'Ssl_cipher';
SHOW VARIABLES LIKE 'have_ssl';
\`\`\`

## Audit et logging

\`\`\`sql
-- Activer le log général (temporairement)
SET GLOBAL general_log = 'ON';
SET GLOBAL general_log_file = '/var/log/mysql/general.log';

-- Log des requêtes lentes
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Audit plugin (si installé)
SELECT * FROM mysql.audit_log 
WHERE timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR);
\`\`\`

## Validation et contraintes

\`\`\`sql
-- Contraintes de domaine
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    age INT CHECK (age >= 0 AND age <= 150),
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email),
    INDEX idx_status (status)
);

-- Triggers de validation
DELIMITER //
CREATE TRIGGER validate_email_before_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
END//
DELIMITER ;
\`\`\`

## Protection contre l'injection SQL

\`\`\`sql
-- ✅ Utiliser des requêtes préparées (exemple PHP)
-- $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? AND status = ?");
-- $stmt->execute([$userId, $status]);

-- ✅ Échapper les entrées utilisateur
-- $safe_input = mysqli_real_escape_string($connection, $user_input);

-- ❌ Éviter la concaténation directe
-- $query = "SELECT * FROM users WHERE name = '" . $_POST['name'] . "'";
\`\`\``
        }
    ],
    
    'administration': [
        {
            name: 'backup-restore.md',
            content: `# Sauvegarde et Restauration - MySQL 8.0

> Source: Documentation MySQL Administrative
> Généré le ${new Date().toLocaleDateString('fr-FR')}

---

## Sauvegarde avec mysqldump

\`\`\`bash
# Sauvegarde complète d'une base
mysqldump -u root -p --single-transaction --routines --triggers mydb > mydb_backup.sql

# Sauvegarde de toutes les bases
mysqldump -u root -p --all-databases --single-transaction > all_databases.sql

# Sauvegarde avec compression
mysqldump -u root -p --single-transaction mydb | gzip > mydb_backup.sql.gz

# Sauvegarde d'une table spécifique
mysqldump -u root -p mydb users > users_backup.sql

# Sauvegarde de la structure uniquement
mysqldump -u root -p --no-data mydb > mydb_structure.sql

# Sauvegarde des données uniquement
mysqldump -u root -p --no-create-info mydb > mydb_data.sql
\`\`\`

## Restauration

\`\`\`bash
# Restauration complète
mysql -u root -p mydb < mydb_backup.sql

# Restauration avec création de base
mysql -u root -p -e "CREATE DATABASE mydb_restored;"
mysql -u root -p mydb_restored < mydb_backup.sql

# Restauration depuis un fichier compressé
gunzip < mydb_backup.sql.gz | mysql -u root -p mydb

# Restauration d'une table
mysql -u root -p mydb < users_backup.sql
\`\`\`

## Réplication

\`\`\`sql
-- Configuration du serveur maître (my.cnf)
-- [mysqld]
-- server-id=1
-- log-bin=mysql-bin
-- binlog-format=ROW

-- Créer un utilisateur de réplication
CREATE USER 'replication'@'%' IDENTIFIED BY 'repl_password';
GRANT REPLICATION SLAVE ON *.* TO 'replication'@'%';

-- Obtenir la position du log binaire
SHOW MASTER STATUS;

-- Configuration du serveur esclave
-- [mysqld]
-- server-id=2
-- relay-log=mysql-relay-bin

-- Configurer l'esclave
CHANGE MASTER TO
    MASTER_HOST='master_server_ip',
    MASTER_USER='replication',
    MASTER_PASSWORD='repl_password',
    MASTER_LOG_FILE='mysql-bin.000001',
    MASTER_LOG_POS=154;

-- Démarrer la réplication
START SLAVE;

-- Vérifier le statut
SHOW SLAVE STATUS\G;
\`\`\`

## Maintenance et réparation

\`\`\`sql
-- Vérifier les tables
CHECK TABLE users;

-- Réparer une table
REPAIR TABLE users;

-- Optimiser une table
OPTIMIZE TABLE users;

-- Analyser une table
ANALYZE TABLE users;

-- Défragmenter (reconstruire)
ALTER TABLE users ENGINE=InnoDB;

-- Statistiques d'espace disque
SELECT 
    table_schema,
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'mydb'
ORDER BY (data_length + index_length) DESC;
\`\`\``
        }
    ],
    
    'json': [
        {
            name: 'json-operations.md',
            content: `# Opérations JSON - MySQL 8.0

> Source: Documentation MySQL JSON
> Généré le ${new Date().toLocaleDateString('fr-FR')}

---

## Création et insertion

\`\`\`sql
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
\`\`\`

## Extraction de données

\`\`\`sql
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
\`\`\`

## Recherche et filtrage

\`\`\`sql
-- Rechercher par valeur JSON
SELECT * FROM users WHERE preferences->'$.theme' = 'dark';
SELECT * FROM users WHERE JSON_EXTRACT(preferences, '$.notifications') = true;

-- Rechercher dans un tableau
SELECT * FROM users WHERE JSON_CONTAINS(preferences, '"admin"', '$.tags');

-- Rechercher par clé
SELECT * FROM users WHERE JSON_CONTAINS_PATH(preferences, 'one', '$.notifications');

-- Recherche avec expressions régulières
SELECT * FROM users WHERE preferences->'$.language' REGEXP '^(fr|en)$';
\`\`\`

## Modification de données JSON

\`\`\`sql
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
\`\`\`

## Fonctions d'agrégation JSON

\`\`\`sql
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
\`\`\`

## Index sur colonnes JSON

\`\`\`sql
-- Index fonctionnel sur expression JSON
CREATE INDEX idx_user_theme ON users ((preferences->'$.theme'));

-- Index sur colonne générée
ALTER TABLE users 
ADD COLUMN theme VARCHAR(20) GENERATED ALWAYS AS (preferences->'$.theme') STORED;

CREATE INDEX idx_theme ON users(theme);

-- Recherche optimisée
SELECT * FROM users WHERE theme = 'dark';
\`\`\`

## Validation JSON Schema

\`\`\`sql
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
\`\`\``
        }
    ]
};

async function generateMySQLDocs() {
    console.log('🚀 Génération en cours...');
    
    if (!existsSync(MYSQL_DOCS_DIR)) {
        mkdirSync(MYSQL_DOCS_DIR, { recursive: true });
    }
    
    for (const [category, docs] of Object.entries(mysqlDocumentation)) {
        console.log(`📂 Catégorie: ${category}`);
        
        const categoryDir = join(MYSQL_DOCS_DIR, category);
        if (!existsSync(categoryDir)) {
            mkdirSync(categoryDir, { recursive: true });
        }
        
        for (const doc of docs) {
            const filePath = join(categoryDir, doc.name);
            writeFileSync(filePath, doc.content);
            console.log(`  ✅ ${doc.name}`);
        }
    }
    
    console.log('✅ Documentation MySQL générée!');
    console.log(`📁 Fichiers dans: ${MYSQL_DOCS_DIR}`);
}

generateMySQLDocs().catch(console.error);
