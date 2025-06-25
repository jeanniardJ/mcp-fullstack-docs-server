# Programmation Orientée Objet en PHP

## Classes et objets

### Déclaration d'une classe

```php
<?php

class User 
{
    private string $name;
    private string $email;
    private int $age;

    public function __construct(string $name, string $email, int $age)
    {
        $this->name = $name;
        $this->email = $email;
        $this->age = $age;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }
}
```

## Héritage

```php
class Admin extends User
{
    private array $permissions;

    public function __construct(string $name, string $email, int $age, array $permissions = [])
    {
        parent::__construct($name, $email, $age);
        $this->permissions = $permissions;
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions);
    }
}
```

## Interfaces

```php
interface PaymentInterface
{
    public function process(float $amount): bool;
    public function refund(string $transactionId): bool;
}

class StripePayment implements PaymentInterface
{
    public function process(float $amount): bool
    {
        // Logique de paiement Stripe
        return true;
    }

    public function refund(string $transactionId): bool
    {
        // Logique de remboursement
        return true;
    }
}
```

## Traits

```php
trait Timestampable
{
    private \DateTime $createdAt;
    private ?\DateTime $updatedAt = null;

    public function setCreatedAt(\DateTime $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function setUpdatedAt(\DateTime $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }
}

class Article
{
    use Timestampable;
    
    private string $title;
    private string $content;
}
```

## Propriétés et méthodes statiques

```php
class Config
{
    private static array $settings = [];

    public static function set(string $key, mixed $value): void
    {
        self::$settings[$key] = $value;
    }

    public static function get(string $key): mixed
    {
        return self::$settings[$key] ?? null;
    }
}

// Utilisation
Config::set('database.host', 'localhost');
$host = Config::get('database.host');
```
