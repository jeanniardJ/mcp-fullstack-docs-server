# Sauvegarde et Restauration - MySQL 8.0

> Source: Documentation MySQL Administrative
> Généré le 25/06/2025

---

## Sauvegarde avec mysqldump

```bash
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
```

## Restauration

```bash
# Restauration complète
mysql -u root -p mydb < mydb_backup.sql

# Restauration avec création de base
mysql -u root -p -e "CREATE DATABASE mydb_restored;"
mysql -u root -p mydb_restored < mydb_backup.sql

# Restauration depuis un fichier compressé
gunzip < mydb_backup.sql.gz | mysql -u root -p mydb

# Restauration d'une table
mysql -u root -p mydb < users_backup.sql
```

## Réplication

```sql
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
SHOW SLAVE STATUSG;
```

## Maintenance et réparation

```sql
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
```