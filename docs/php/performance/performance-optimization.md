# Optimisation des Performances - PHP 8.2

> Source: Documentation PHP et bonnes pratiques  
> Téléchargé le 25/06/2025

---

## OPcache

```php
// Configuration recommandée
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.save_comments=1
```

## Optimisation des boucles

```php
// ❌ Lent
foreach ($items as $item) {
    if (count($results) > 1000) break;
    $results[] = processItem($item);
}

// ✅ Rapide
$count = count($results);
foreach ($items as $item) {
    if ($count > 1000) break;
    $results[] = processItem($item);
    $count++;
}
```

## Gestion mémoire

```php
// Libérer la mémoire
unset($largeArray);

// Générateurs pour économiser la mémoire
function readLargeFile(string $file): Generator {
    $handle = fopen($file, 'r');
    while (($line = fgets($handle)) !== false) {
        yield trim($line);
    }
    fclose($handle);
}
```

## Mise en cache

```php
// APCu pour le cache local
if (apcu_exists('expensive_calculation')) {
    $result = apcu_fetch('expensive_calculation');
} else {
    $result = performExpensiveCalculation();
    apcu_store('expensive_calculation', $result, 3600);
}
```