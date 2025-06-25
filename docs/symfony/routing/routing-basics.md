# Système de routage Symfony

## Définition des routes

### Avec des attributs (PHP 8+)

```php
use Symfony\Component\Routing\Annotation\Route;

#[Route('/products/{id}', name: 'product_show', methods: ['GET'])]
public function show(int $id): Response
{
    // ...
}
```

### Avec annotations (legacy)

```php
/**
 * @Route("/products/{id}", name="product_show", methods={"GET"})
 */
public function show(int $id): Response
{
    // ...
}
```

### Avec YAML

```yaml
# config/routes.yaml
product_show:
    path: /products/{id}
    controller: App\Controller\ProductController::show
    methods: [GET]
```

## Paramètres de route

### Paramètres obligatoires

```php
#[Route('/user/{id}', name: 'user_show')]
public function show(int $id): Response {}
```

### Paramètres optionnels

```php
#[Route('/blog/{page}', name: 'blog_index', defaults: ['page' => 1])]
public function index(int $page): Response {}
```

### Contraintes sur les paramètres

```php
#[Route('/user/{id}', name: 'user_show', requirements: ['id' => '\d+'])]
public function show(int $id): Response {}
```

## Génération d'URLs

```php
// Dans un contrôleur
$url = $this->generateUrl('product_show', ['id' => 123]);

// Dans un service
$url = $this->router->generate('product_show', ['id' => 123]);
```

## Préfixes de routes

```php
#[Route('/admin')]
class AdminController extends AbstractController
{
    #[Route('/dashboard', name: 'admin_dashboard')]
    public function dashboard(): Response {} // URL: /admin/dashboard
}
```
