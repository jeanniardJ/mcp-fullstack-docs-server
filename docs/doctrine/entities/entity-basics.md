# Entités Doctrine

## Création d'une entité

### Entité User basique

```php
<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'users')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private string $email;

    #[ORM\Column(type: 'string', length: 255)]
    private string $password;

    // Getters et setters...
}
```

## Relations

### OneToMany

```php
#[ORM\OneToMany(mappedBy: 'author', targetEntity: Article::class)]
private Collection $articles;

public function __construct()
{
    $this->articles = new ArrayCollection();
}
```

### ManyToOne

```php
#[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'articles')]
#[ORM\JoinColumn(nullable: false)]
private User $author;
```

### ManyToMany

```php
#[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'articles')]
#[ORM\JoinTable(name: 'article_tag')]
private Collection $tags;
```

## Validation

```php
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Column(type: 'string', length: 255)]
#[Assert\NotBlank]
#[Assert\Email]
private string $email;
```

## Callbacks

```php
#[ORM\PrePersist]
public function setCreatedAt(): void
{
    $this->createdAt = new \DateTime();
}
```
