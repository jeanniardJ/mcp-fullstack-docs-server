# Classes et Objets Avancés - PHP 8.2

> Source: Documentation PHP officielle  
> Téléchargé le 25/06/2025

---

## Classes abstraites

```php
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
```

## Interfaces

```php
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
```

## Traits

```php
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
```

## Énumérations (PHP 8.1+)

```php
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
```

## Attributs (PHP 8.0+)

```php
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
```