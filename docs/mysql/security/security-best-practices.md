# Sécurité MySQL - Bonnes Pratiques

> Source: Guide de sécurité MySQL
> Généré le 25/06/2025

---

## Gestion des utilisateurs

```sql
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
```

## Chiffrement et SSL

```sql
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
```

## Audit et logging

```sql
-- Activer le log général (temporairement)
SET GLOBAL general_log = 'ON';
SET GLOBAL general_log_file = '/var/log/mysql/general.log';

-- Log des requêtes lentes
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Audit plugin (si installé)
SELECT * FROM mysql.audit_log 
WHERE timestamp > DATE_SUB(NOW(), INTERVAL 1 HOUR);
```

## Validation et contraintes

```sql
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
    IF NEW.email NOT REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
END//
DELIMITER ;
```

## Protection contre l'injection SQL

```sql
-- ✅ Utiliser des requêtes préparées (exemple PHP)
-- $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? AND status = ?");
-- $stmt->execute([$userId, $status]);

-- ✅ Échapper les entrées utilisateur
-- $safe_input = mysqli_real_escape_string($connection, $user_input);

-- ❌ Éviter la concaténation directe
-- $query = "SELECT * FROM users WHERE name = '" . $_POST['name'] . "'";
```