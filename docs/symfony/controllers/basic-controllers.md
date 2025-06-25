# Contrôleurs Symfony

## Introduction

Les contrôleurs sont au cœur de l'application Symfony. Ils reçoivent les requêtes HTTP et retournent des réponses.

## Création d'un contrôleur

### Contrôleur basique

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }
}
```

### Contrôleur avec paramètres

```php
#[Route('/user/{id}', name: 'app_user_show')]
public function show(int $id): Response
{
    // Logique pour récupérer l'utilisateur
    return $this->render('user/show.html.twig', [
        'user_id' => $id
    ]);
}
```

## Injection de dépendances

```php
public function __construct(
    private UserRepository $userRepository,
    private LoggerInterface $logger
) {}
```

## Bonnes pratiques

1. Gardez les contrôleurs légers
2. Utilisez l'injection de dépendances
3. Retournez toujours une Response
4. Utilisez les attributs pour les routes
