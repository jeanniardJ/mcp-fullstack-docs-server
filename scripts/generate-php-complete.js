#!/usr/bin/env node

/**
 * Script pour générer une documentation PHP complète et moderne
 * Couvre PHP 8.2+ avec toutes les fonctionnalités avancées
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '..', 'docs', 'php');

console.log('📚 Génération de la documentation PHP complète...');

const PHP_COMPLETE_DOCS = {
    // OOP Avancée
    oop: [
        {
            name: 'classes-advanced.md',
            title: 'Classes et Objets Avancés - PHP 8.2+',
            content: `# Classes et Objets Avancés - PHP 8.2+

## Classes abstraites et interfaces

### Classes abstraites
\`\`\`php
abstract class Vehicle {
    protected string $brand;
    
    public function __construct(string $brand) {
        $this->brand = $brand;
    }
    
    abstract public function start(): void;
    abstract public function stop(): void;
    
    public function getBrand(): string {
        return $this->brand;
    }
}

class Car extends Vehicle {
    private bool $isRunning = false;
    
    public function start(): void {
        $this->isRunning = true;
        echo "Car engine started\\n";
    }
    
    public function stop(): void {
        $this->isRunning = false;
        echo "Car engine stopped\\n";
    }
    
    public function isRunning(): bool {
        return $this->isRunning;
    }
}
\`\`\`

### Interfaces
\`\`\`php
interface Flyable {
    public function takeOff(): void;
    public function land(): void;
    public function getAltitude(): int;
}

interface Drivable {
    public function accelerate(): void;
    public function brake(): void;
    public function getSpeed(): int;
}

class FlyingCar extends Car implements Flyable, Drivable {
    private int $altitude = 0;
    private int $speed = 0;
    
    public function takeOff(): void {
        $this->altitude = 100;
        echo "Flying car takes off\\n";
    }
    
    public function land(): void {
        $this->altitude = 0;
        echo "Flying car lands\\n";
    }
    
    public function getAltitude(): int {
        return $this->altitude;
    }
    
    public function accelerate(): void {
        $this->speed += 10;
    }
    
    public function brake(): void {
        $this->speed = max(0, $this->speed - 15);
    }
    
    public function getSpeed(): int {
        return $this->speed;
    }
}
\`\`\`

## Traits

### Trait basique
\`\`\`php
trait Logger {
    private array $logs = [];
    
    public function log(string $message): void {
        $this->logs[] = [
            'message' => $message,
            'timestamp' => new DateTime(),
            'level' => 'INFO'
        ];
    }
    
    public function error(string $message): void {
        $this->logs[] = [
            'message' => $message,
            'timestamp' => new DateTime(),
            'level' => 'ERROR'
        ];
    }
    
    public function getLogs(): array {
        return $this->logs;
    }
}

trait Cacheable {
    private array $cache = [];
    
    public function cache(string $key, mixed $value): void {
        $this->cache[$key] = $value;
    }
    
    public function getFromCache(string $key): mixed {
        return $this->cache[$key] ?? null;
    }
    
    public function clearCache(): void {
        $this->cache = [];
    }
}

class UserService {
    use Logger, Cacheable;
    
    public function getUser(int $id): ?User {
        $cacheKey = "user_$id";
        
        if ($user = $this->getFromCache($cacheKey)) {
            $this->log("User $id loaded from cache");
            return $user;
        }
        
        $user = $this->loadUserFromDatabase($id);
        if ($user) {
            $this->cache($cacheKey, $user);
            $this->log("User $id loaded from database and cached");
        } else {
            $this->error("User $id not found");
        }
        
        return $user;
    }
    
    private function loadUserFromDatabase(int $id): ?User {
        // Simulation de chargement BDD
        return new User($id, "User $id");
    }
}
\`\`\`

### Résolution de conflits dans les traits
\`\`\`php
trait A {
    public function smallTalk(): string {
        return 'a';
    }
    
    public function bigTalk(): string {
        return 'A';
    }
}

trait B {
    public function smallTalk(): string {
        return 'b';
    }
    
    public function bigTalk(): string {
        return 'B';
    }
}

class Talker {
    use A, B {
        B::smallTalk insteadof A;
        A::bigTalk insteadof B;
        B::bigTalk as bigTalkFromB;
    }
}

$talker = new Talker();
echo $talker->smallTalk();    // 'b'
echo $talker->bigTalk();      // 'A'
echo $talker->bigTalkFromB(); // 'B'
\`\`\`

## Propriétés promues (PHP 8.0+)

\`\`\`php
class User {
    public function __construct(
        private int $id,
        private string $name,
        private string $email,
        private readonly DateTime $createdAt = new DateTime(),
        public bool $isActive = true
    ) {}
    
    public function getId(): int {
        return $this->id;
    }
    
    public function getName(): string {
        return $this->name;
    }
    
    public function getEmail(): string {
        return $this->email;
    }
    
    public function getCreatedAt(): DateTime {
        return $this->createdAt;
    }
    
    public function setName(string $name): void {
        $this->name = $name;
    }
    
    public function setEmail(string $email): void {
        $this->email = $email;
    }
}
\`\`\`

## Méthodes magiques avancées

\`\`\`php
class FlexibleObject {
    private array $data = [];
    
    public function __get(string $name): mixed {
        return $this->data[$name] ?? null;
    }
    
    public function __set(string $name, mixed $value): void {
        $this->data[$name] = $value;
    }
    
    public function __isset(string $name): bool {
        return isset($this->data[$name]);
    }
    
    public function __unset(string $name): void {
        unset($this->data[$name]);
    }
    
    public function __call(string $name, array $arguments): mixed {
        if (str_starts_with($name, 'get')) {
            $property = lcfirst(substr($name, 3));
            return $this->data[$property] ?? null;
        }
        
        if (str_starts_with($name, 'set')) {
            $property = lcfirst(substr($name, 3));
            $this->data[$property] = $arguments[0] ?? null;
            return $this;
        }
        
        throw new BadMethodCallException("Method $name does not exist");
    }
    
    public function __toString(): string {
        return json_encode($this->data);
    }
    
    public function __debugInfo(): array {
        return $this->data;
    }
}

$obj = new FlexibleObject();
$obj->name = 'John';
$obj->setAge(30);
echo $obj->getName(); // 'John'
echo $obj->getAge();  // 30
echo $obj;            // {"name":"John","age":30}
\`\`\`

## Late Static Binding

\`\`\`php
class Base {
    public static function who(): string {
        return __CLASS__;
    }
    
    public static function test(): void {
        echo static::who(); // Late Static Binding
    }
}

class Child extends Base {
    public static function who(): string {
        return __CLASS__;
    }
}

Base::test();  // 'Base'
Child::test(); // 'Child'
\`\`\`
`
        },
        {
            name: 'enums-attributes.md',
            title: 'Enums et Attributs - PHP 8.1+',
            content: `# Enums et Attributs - PHP 8.1+

## Enums

### Enum basique
\`\`\`php
enum Status {
    case PENDING;
    case APPROVED;
    case REJECTED;
    case CANCELLED;
}

class Order {
    public function __construct(
        private int $id,
        private Status $status = Status::PENDING
    ) {}
    
    public function approve(): void {
        $this->status = Status::APPROVED;
    }
    
    public function reject(): void {
        $this->status = Status::REJECTED;
    }
    
    public function getStatus(): Status {
        return $this->status;
    }
    
    public function isPending(): bool {
        return $this->status === Status::PENDING;
    }
}
\`\`\`

### Backed Enums (avec valeurs)
\`\`\`php
enum HttpStatus: int {
    case OK = 200;
    case NOT_FOUND = 404;
    case INTERNAL_ERROR = 500;
    case BAD_REQUEST = 400;
    case UNAUTHORIZED = 401;
    case FORBIDDEN = 403;
    
    public function message(): string {
        return match($this) {
            self::OK => 'Success',
            self::NOT_FOUND => 'Resource not found',
            self::INTERNAL_ERROR => 'Internal server error',
            self::BAD_REQUEST => 'Bad request',
            self::UNAUTHORIZED => 'Unauthorized',
            self::FORBIDDEN => 'Access forbidden'
        };
    }
    
    public function isError(): bool {
        return $this->value >= 400;
    }
    
    public function isSuccess(): bool {
        return $this->value >= 200 && $this->value < 300;
    }
}

class ApiResponse {
    public function __construct(
        private HttpStatus $status,
        private mixed $data = null
    ) {}
    
    public function toArray(): array {
        return [
            'status' => $this->status->value,
            'message' => $this->status->message(),
            'data' => $this->data
        ];
    }
}

$response = new ApiResponse(HttpStatus::OK, ['users' => []]);
print_r($response->toArray());
\`\`\`

### Enum avec interfaces
\`\`\`php
interface Colorable {
    public function getHexCode(): string;
    public function getRgb(): array;
}

enum Color: string implements Colorable {
    case RED = 'red';
    case GREEN = 'green';
    case BLUE = 'blue';
    case WHITE = 'white';
    case BLACK = 'black';
    
    public function getHexCode(): string {
        return match($this) {
            self::RED => '#FF0000',
            self::GREEN => '#00FF00',
            self::BLUE => '#0000FF',
            self::WHITE => '#FFFFFF',
            self::BLACK => '#000000'
        };
    }
    
    public function getRgb(): array {
        return match($this) {
            self::RED => [255, 0, 0],
            self::GREEN => [0, 255, 0],
            self::BLUE => [0, 0, 255],
            self::WHITE => [255, 255, 255],
            self::BLACK => [0, 0, 0]
        };
    }
    
    public static function fromHex(string $hex): ?self {
        return match($hex) {
            '#FF0000' => self::RED,
            '#00FF00' => self::GREEN,
            '#0000FF' => self::BLUE,
            '#FFFFFF' => self::WHITE,
            '#000000' => self::BLACK,
            default => null
        };
    }
}
\`\`\`

## Attributs (Annotations)

### Attributs basiques
\`\`\`php
#[Attribute]
class Route {
    public function __construct(
        public string $path,
        public array $methods = ['GET'],
        public ?string $name = null
    ) {}
}

#[Attribute]
class Middleware {
    public function __construct(
        public string $class,
        public array $parameters = []
    ) {}
}

#[Attribute(Attribute::TARGET_PROPERTY)]
class Validate {
    public function __construct(
        public array $rules
    ) {}
}

#[Route('/users', ['GET'], 'users.index')]
#[Middleware('AuthMiddleware')]
class UserController {
    #[Route('/users/{id}', ['GET'], 'users.show')]
    public function show(int $id): User {
        return User::find($id);
    }
    
    #[Route('/users', ['POST'], 'users.store')]
    #[Middleware('ValidateMiddleware', ['rules' => 'user.store'])]
    public function store(CreateUserRequest $request): User {
        return User::create($request->validated());
    }
}

class CreateUserRequest {
    #[Validate(['required', 'string', 'max:255'])]
    public string $name;
    
    #[Validate(['required', 'email', 'unique:users'])]
    public string $email;
    
    #[Validate(['required', 'string', 'min:8'])]
    public string $password;
}
\`\`\`

### Lecture des attributs avec Reflection
\`\`\`php
function getRoutes(string $controllerClass): array {
    $reflection = new ReflectionClass($controllerClass);
    $routes = [];
    
    // Attributs de la classe
    $classAttributes = $reflection->getAttributes(Route::class);
    foreach ($classAttributes as $attribute) {
        $route = $attribute->newInstance();
        $routes[] = [
            'path' => $route->path,
            'methods' => $route->methods,
            'name' => $route->name,
            'controller' => $controllerClass,
            'action' => null
        ];
    }
    
    // Attributs des méthodes
    foreach ($reflection->getMethods() as $method) {
        $methodAttributes = $method->getAttributes(Route::class);
        foreach ($methodAttributes as $attribute) {
            $route = $attribute->newInstance();
            $routes[] = [
                'path' => $route->path,
                'methods' => $route->methods,
                'name' => $route->name,
                'controller' => $controllerClass,
                'action' => $method->getName()
            ];
        }
    }
    
    return $routes;
}

$routes = getRoutes(UserController::class);
print_r($routes);
\`\`\`

### Système de validation avec attributs
\`\`\`php
#[Attribute(Attribute::TARGET_PROPERTY)]
class Required {
    public function __construct(
        public string $message = 'This field is required'
    ) {}
}

#[Attribute(Attribute::TARGET_PROPERTY)]
class Email {
    public function __construct(
        public string $message = 'Invalid email format'
    ) {}
}

#[Attribute(Attribute::TARGET_PROPERTY)]
class MinLength {
    public function __construct(
        public int $length,
        public string $message = 'Minimum length not met'
    ) {}
}

class Validator {
    public static function validate(object $object): array {
        $reflection = new ReflectionClass($object);
        $errors = [];
        
        foreach ($reflection->getProperties() as $property) {
            $property->setAccessible(true);
            $value = $property->getValue($object);
            
            foreach ($property->getAttributes() as $attribute) {
                $validator = $attribute->newInstance();
                
                if ($validator instanceof Required && empty($value)) {
                    $errors[$property->getName()][] = $validator->message;
                }
                
                if ($validator instanceof Email && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $errors[$property->getName()][] = $validator->message;
                }
                
                if ($validator instanceof MinLength && strlen($value) < $validator->length) {
                    $errors[$property->getName()][] = $validator->message;
                }
            }
        }
        
        return $errors;
    }
}

class RegisterForm {
    #[Required]
    #[MinLength(2, 'Name must be at least 2 characters')]
    public string $name = '';
    
    #[Required]
    #[Email]
    public string $email = '';
    
    #[Required]
    #[MinLength(8, 'Password must be at least 8 characters')]
    public string $password = '';
}

$form = new RegisterForm();
$form->name = 'J';
$form->email = 'invalid-email';
$form->password = '123';

$errors = Validator::validate($form);
print_r($errors);
\`\`\`
`
        },
        {
            name: 'types-advanced.md',
            title: 'Types Avancés et Union Types - PHP 8.0+',
            content: `# Types Avancés et Union Types - PHP 8.0+

## Union Types

### Union types basiques
\`\`\`php
function formatValue(int|float|string $value): string {
    return match(gettype($value)) {
        'integer' => "Integer: $value",
        'double' => "Float: " . number_format($value, 2),
        'string' => "String: '$value'",
        default => "Unknown type"
    };
}

echo formatValue(42);        // "Integer: 42"
echo formatValue(3.14);      // "Float: 3.14"
echo formatValue("hello");   // "String: 'hello'"
\`\`\`

### Union types avec classes
\`\`\`php
interface PaymentMethod {
    public function process(float $amount): bool;
}

class CreditCard implements PaymentMethod {
    public function __construct(
        private string $number,
        private string $expiryDate
    ) {}
    
    public function process(float $amount): bool {
        echo "Processing $$amount via Credit Card\\n";
        return true;
    }
}

class PayPal implements PaymentMethod {
    public function __construct(
        private string $email
    ) {}
    
    public function process(float $amount): bool {
        echo "Processing $$amount via PayPal\\n";
        return true;
    }
}

class BankTransfer implements PaymentMethod {
    public function __construct(
        private string $accountNumber
    ) {}
    
    public function process(float $amount): bool {
        echo "Processing $$amount via Bank Transfer\\n";
        return true;
    }
}

class PaymentProcessor {
    public function processPayment(
        CreditCard|PayPal|BankTransfer $method,
        float $amount
    ): bool {
        return $method->process($amount);
    }
    
    public function getPaymentType(
        CreditCard|PayPal|BankTransfer $method
    ): string {
        return match(true) {
            $method instanceof CreditCard => 'credit_card',
            $method instanceof PayPal => 'paypal',
            $method instanceof BankTransfer => 'bank_transfer'
        };
    }
}
\`\`\`

### Union types avec null
\`\`\`php
class UserRepository {
    private array $users = [];
    
    public function findById(int $id): User|null {
        return $this->users[$id] ?? null;
    }
    
    public function findByEmail(string $email): User|false {
        foreach ($this->users as $user) {
            if ($user->getEmail() === $email) {
                return $user;
            }
        }
        return false;
    }
    
    public function search(string $query): array|null {
        $results = array_filter($this->users, function($user) use ($query) {
            return str_contains($user->getName(), $query);
        });
        
        return empty($results) ? null : $results;
    }
}
\`\`\`

## Intersection Types (PHP 8.1+)

\`\`\`php
interface Loggable {
    public function log(string $message): void;
}

interface Cacheable {
    public function cache(string $key, mixed $value): void;
    public function getFromCache(string $key): mixed;
}

class Service implements Loggable, Cacheable {
    private array $cache = [];
    private array $logs = [];
    
    public function log(string $message): void {
        $this->logs[] = $message;
    }
    
    public function cache(string $key, mixed $value): void {
        $this->cache[$key] = $value;
    }
    
    public function getFromCache(string $key): mixed {
        return $this->cache[$key] ?? null;
    }
}

// Intersection type: doit implémenter les deux interfaces
function processWithLogging(Loggable&Cacheable $service): void {
    $data = $service->getFromCache('data');
    if ($data === null) {
        $data = 'some data';
        $service->cache('data', $data);
        $service->log('Data cached');
    } else {
        $service->log('Data loaded from cache');
    }
}

$service = new Service();
processWithLogging($service); // OK, Service implémente les deux
\`\`\`

## Types strictes avec déclaration

\`\`\`php
declare(strict_types=1);

class Calculator {
    public function add(float $a, float $b): float {
        return $a + $b;
    }
    
    public function divide(float $a, float $b): float {
        if ($b === 0.0) {
            throw new InvalidArgumentException('Division by zero');
        }
        return $a / $b;
    }
    
    public function power(float $base, int $exponent): float {
        return $base ** $exponent;
    }
}

$calc = new Calculator();
echo $calc->add(10.5, 20.3);     // OK
echo $calc->power(2.5, 3);       // OK
// echo $calc->add("10", "20");  // TypeError en mode strict
\`\`\`

## Types génériques avec DocBlocks

\`\`\`php
/**
 * @template T
 */
class Collection {
    /**
     * @var T[]
     */
    private array $items = [];
    
    /**
     * @param T $item
     */
    public function add(mixed $item): void {
        $this->items[] = $item;
    }
    
    /**
     * @return T|null
     */
    public function get(int $index): mixed {
        return $this->items[$index] ?? null;
    }
    
    /**
     * @return T[]
     */
    public function all(): array {
        return $this->items;
    }
    
    /**
     * @param callable(T): bool $predicate
     * @return T[]
     */
    public function filter(callable $predicate): array {
        return array_filter($this->items, $predicate);
    }
    
    /**
     * @template U
     * @param callable(T): U $mapper
     * @return Collection<U>
     */
    public function map(callable $mapper): self {
        $collection = new self();
        foreach ($this->items as $item) {
            $collection->add($mapper($item));
        }
        return $collection;
    }
}

/** @var Collection<User> $users */
$users = new Collection();
$users->add(new User(1, 'John'));
$users->add(new User(2, 'Jane'));

/** @var Collection<string> $names */
$names = $users->map(fn(User $user) => $user->getName());
\`\`\`

## Covariance et Contravariance

\`\`\`php
class Animal {
    public function getName(): string {
        return 'Animal';
    }
}

class Dog extends Animal {
    public function getName(): string {
        return 'Dog';
    }
    
    public function bark(): string {
        return 'Woof!';
    }
}

class Cat extends Animal {
    public function getName(): string {
        return 'Cat';
    }
    
    public function meow(): string {
        return 'Meow!';
    }
}

// Covariance: type de retour peut être plus spécifique
abstract class AnimalFactory {
    abstract public function create(): Animal;
}

class DogFactory extends AnimalFactory {
    public function create(): Dog { // Covariance OK
        return new Dog();
    }
}

// Contravariance: paramètre peut être plus général
abstract class AnimalFeeder {
    abstract public function feed(Dog $animal): void;
}

class UniversalFeeder extends AnimalFeeder {
    public function feed(Animal $animal): void { // Contravariance OK
        echo "Feeding " . $animal->getName() . "\\n";
    }
}
\`\`\`
`
        }
    ],
    
    // Types et structures de données
    types: [
        {
            name: 'collections-iterators.md',
            title: 'Collections et Itérateurs',
            content: `# Collections et Itérateurs - PHP 8.2+

## SPL Collections

### ArrayObject avancé
\`\`\`php
class UserCollection extends ArrayObject {
    public function __construct(User ...$users) {
        parent::__construct($users);
    }
    
    public function addUser(User $user): void {
        $this->append($user);
    }
    
    public function findByEmail(string $email): ?User {
        foreach ($this as $user) {
            if ($user->getEmail() === $email) {
                return $user;
            }
        }
        return null;
    }
    
    public function getActiveUsers(): self {
        $active = new self();
        foreach ($this as $user) {
            if ($user->isActive()) {
                $active->addUser($user);
            }
        }
        return $active;
    }
    
    public function sortByName(): void {
        $this->uasort(fn(User $a, User $b) => $a->getName() <=> $b->getName());
    }
    
    public function toArray(): array {
        return array_map(fn(User $user) => $user->toArray(), (array) $this);
    }
}

$users = new UserCollection(
    new User(1, 'John', 'john@example.com'),
    new User(2, 'Jane', 'jane@example.com'),
    new User(3, 'Bob', 'bob@example.com')
);

$users->sortByName();
$john = $users->findByEmail('john@example.com');
\`\`\`

### SplObjectStorage
\`\`\`php
class EventManager {
    private SplObjectStorage $listeners;
    
    public function __construct() {
        $this->listeners = new SplObjectStorage();
    }
    
    public function addListener(object $listener, int $priority = 0): void {
        $this->listeners->attach($listener, $priority);
    }
    
    public function removeListener(object $listener): void {
        $this->listeners->detach($listener);
    }
    
    public function dispatch(string $event, array $data = []): void {
        // Trier par priorité
        $listeners = [];
        foreach ($this->listeners as $listener) {
            $priority = $this->listeners->getInfo();
            $listeners[$priority][] = $listener;
        }
        
        krsort($listeners); // Priorité décroissante
        
        foreach ($listeners as $priorityGroup) {
            foreach ($priorityGroup as $listener) {
                if (method_exists($listener, 'handle')) {
                    $listener->handle($event, $data);
                }
            }
        }
    }
}

class EmailListener {
    public function handle(string $event, array $data): void {
        if ($event === 'user.registered') {
            echo "Sending welcome email to {$data['email']}\\n";
        }
    }
}

class LogListener {
    public function handle(string $event, array $data): void {
        echo "Logging event: $event\\n";
    }
}

$eventManager = new EventManager();
$eventManager->addListener(new EmailListener(), 10);
$eventManager->addListener(new LogListener(), 5);

$eventManager->dispatch('user.registered', ['email' => 'user@example.com']);
\`\`\`

## Itérateurs personnalisés

### Iterator basique
\`\`\`php
class NumberRange implements Iterator {
    private int $current;
    private int $start;
    private int $end;
    private int $step;
    
    public function __construct(int $start, int $end, int $step = 1) {
        $this->start = $start;
        $this->end = $end;
        $this->step = $step;
        $this->current = $start;
    }
    
    public function current(): int {
        return $this->current;
    }
    
    public function key(): int {
        return ($this->current - $this->start) / $this->step;
    }
    
    public function next(): void {
        $this->current += $this->step;
    }
    
    public function rewind(): void {
        $this->current = $this->start;
    }
    
    public function valid(): bool {
        return $this->step > 0 ? 
            $this->current <= $this->end : 
            $this->current >= $this->end;
    }
}

foreach (new NumberRange(1, 10, 2) as $key => $number) {
    echo "[$key] $number\\n"; // [0] 1, [1] 3, [2] 5, [3] 7, [4] 9
}
\`\`\`

### IteratorAggregate
\`\`\`php
class FileLineReader implements IteratorAggregate {
    private string $filename;
    
    public function __construct(string $filename) {
        $this->filename = $filename;
    }
    
    public function getIterator(): Generator {
        $handle = fopen($this->filename, 'r');
        if (!$handle) {
            throw new RuntimeException("Cannot open file: {$this->filename}");
        }
        
        try {
            $lineNumber = 1;
            while (($line = fgets($handle)) !== false) {
                yield $lineNumber => rtrim($line);
                $lineNumber++;
            }
        } finally {
            fclose($handle);
        }
    }
    
    public function search(string $pattern): Generator {
        foreach ($this as $lineNumber => $line) {
            if (str_contains($line, $pattern)) {
                yield $lineNumber => $line;
            }
        }
    }
}

// Usage
$reader = new FileLineReader('log.txt');
foreach ($reader->search('ERROR') as $lineNumber => $line) {
    echo "Line $lineNumber: $line\\n";
}
\`\`\`

## Générateurs avancés

### Générateur avec send()
\`\`\`php
function processor(): Generator {
    $data = [];
    echo "Processor started\\n";
    
    while (true) {
        $input = yield count($data); // Retourne le count, reçoit l'input
        
        if ($input === null) {
            break;
        }
        
        $data[] = $input;
        echo "Processed: $input (total: " . count($data) . ")\\n";
    }
    
    return $data;
}

$gen = processor();
$gen->current(); // Démarre le générateur

echo "Count: " . $gen->send("first") . "\\n";   // Count: 1
echo "Count: " . $gen->send("second") . "\\n";  // Count: 2
echo "Count: " . $gen->send("third") . "\\n";   // Count: 3

$result = $gen->send(null); // Termine et récupère le return
print_r($result);
\`\`\`

### Générateur pour pagination
\`\`\`php
class PaginatedQuery {
    private PDO $pdo;
    private string $sql;
    private array $params;
    private int $pageSize;
    
    public function __construct(PDO $pdo, string $sql, array $params = [], int $pageSize = 100) {
        $this->pdo = $pdo;
        $this->sql = $sql;
        $this->params = $params;
        $this->pageSize = $pageSize;
    }
    
    public function getPages(): Generator {
        $offset = 0;
        
        do {
            $sql = $this->sql . " LIMIT {$this->pageSize} OFFSET $offset";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($this->params);
            
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (!empty($results)) {
                yield $results;
            }
            
            $offset += $this->pageSize;
        } while (count($results) === $this->pageSize);
    }
    
    public function getAllRecords(): Generator {
        foreach ($this->getPages() as $page) {
            foreach ($page as $record) {
                yield $record;
            }
        }
    }
}

// Usage
$query = new PaginatedQuery($pdo, "SELECT * FROM users WHERE active = ?", [1]);

foreach ($query->getAllRecords() as $user) {
    processUser($user);
    // Traite un utilisateur à la fois sans charger toute la table
}
\`\`\`

## Collections fonctionnelles

\`\`\`php
class FunctionalCollection implements IteratorAggregate {
    private array $items;
    
    public function __construct(array $items = []) {
        $this->items = $items;
    }
    
    public function map(callable $callback): self {
        return new self(array_map($callback, $this->items));
    }
    
    public function filter(callable $predicate): self {
        return new self(array_filter($this->items, $predicate));
    }
    
    public function reduce(callable $callback, mixed $initial = null): mixed {
        return array_reduce($this->items, $callback, $initial);
    }
    
    public function each(callable $callback): self {
        foreach ($this->items as $key => $item) {
            $callback($item, $key);
        }
        return $this;
    }
    
    public function chunk(int $size): self {
        return new self(array_chunk($this->items, $size));
    }
    
    public function flatten(): self {
        $result = [];
        array_walk_recursive($this->items, function($item) use (&$result) {
            $result[] = $item;
        });
        return new self($result);
    }
    
    public function unique(): self {
        return new self(array_unique($this->items));
    }
    
    public function sort(callable $callback = null): self {
        $items = $this->items;
        if ($callback) {
            usort($items, $callback);
        } else {
            sort($items);
        }
        return new self($items);
    }
    
    public function first(callable $predicate = null): mixed {
        if ($predicate === null) {
            return $this->items[0] ?? null;
        }
        
        foreach ($this->items as $item) {
            if ($predicate($item)) {
                return $item;
            }
        }
        
        return null;
    }
    
    public function count(): int {
        return count($this->items);
    }
    
    public function toArray(): array {
        return $this->items;
    }
    
    public function getIterator(): ArrayIterator {
        return new ArrayIterator($this->items);
    }
}

// Usage
$collection = new FunctionalCollection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

$result = $collection
    ->filter(fn($n) => $n % 2 === 0)  // Nombres pairs
    ->map(fn($n) => $n * $n)          // Carrés
    ->sort()                          // Tri
    ->toArray();

print_r($result); // [4, 16, 36, 64, 100]
\`\`\`
`
        }
    ],
    
    // Fonctionnalités modernes
    modern: [
        {
            name: 'fibers-async.md',
            title: 'Fibers et Programmation Asynchrone - PHP 8.1+',
            content: `# Fibers et Programmation Asynchrone - PHP 8.1+

## Introduction aux Fibers

### Fiber basique
\`\`\`php
$fiber = new Fiber(function(): void {
    echo "Fiber started\\n";
    
    $value = Fiber::suspend('suspended');
    echo "Fiber resumed with: $value\\n";
    
    $value2 = Fiber::suspend('suspended again');
    echo "Fiber resumed again with: $value2\\n";
    
    return 'fiber completed';
});

echo "Starting fiber\\n";
$result1 = $fiber->start();
echo "Got: $result1\\n";

echo "Resuming fiber\\n";
$result2 = $fiber->resume('hello');
echo "Got: $result2\\n";

echo "Resuming fiber again\\n";
$final = $fiber->resume('world');
echo "Final result: $final\\n";
\`\`\`

### Gestionnaire de tâches avec Fibers
\`\`\`php
class TaskScheduler {
    private array $tasks = [];
    private array $sleeping = [];
    
    public function addTask(callable $task): void {
        $fiber = new Fiber($task);
        $this->tasks[] = $fiber;
    }
    
    public function run(): void {
        while (!empty($this->tasks) || !empty($this->sleeping)) {
            // Traiter les tâches actives
            foreach ($this->tasks as $index => $fiber) {
                if ($fiber->isTerminated()) {
                    unset($this->tasks[$index]);
                    continue;
                }
                
                if (!$fiber->isStarted()) {
                    $result = $fiber->start();
                } else {
                    $result = $fiber->resume();
                }
                
                // Si la tâche demande à dormir
                if ($result instanceof SleepRequest) {
                    $this->sleeping[] = [
                        'fiber' => $fiber,
                        'wake_time' => time() + $result->seconds
                    ];
                    unset($this->tasks[$index]);
                }
            }
            
            // Réveiller les tâches qui ont fini de dormir
            foreach ($this->sleeping as $index => $sleep) {
                if (time() >= $sleep['wake_time']) {
                    $this->tasks[] = $sleep['fiber'];
                    unset($this->sleeping[$index]);
                }
            }
            
            $this->tasks = array_values($this->tasks);
            $this->sleeping = array_values($this->sleeping);
            
            // Petite pause pour éviter une boucle trop intensive
            usleep(1000);
        }
    }
}

class SleepRequest {
    public function __construct(public int $seconds) {}
}

function sleep_async(int $seconds): SleepRequest {
    return Fiber::suspend(new SleepRequest($seconds));
}

// Usage
$scheduler = new TaskScheduler();

$scheduler->addTask(function() {
    echo "Task 1 started\\n";
    sleep_async(2);
    echo "Task 1 after sleep\\n";
    sleep_async(1);
    echo "Task 1 completed\\n";
});

$scheduler->addTask(function() {
    echo "Task 2 started\\n";
    sleep_async(1);
    echo "Task 2 after sleep\\n";
    sleep_async(2);
    echo "Task 2 completed\\n";
});

$scheduler->run();
\`\`\`

## HTTP Client Asynchrone

\`\`\`php
class AsyncHttpClient {
    private TaskScheduler $scheduler;
    
    public function __construct() {
        $this->scheduler = new TaskScheduler();
    }
    
    public function get(string $url): Promise {
        $promise = new Promise();
        
        $this->scheduler->addTask(function() use ($url, $promise) {
            $context = stream_context_create([
                'http' => [
                    'method' => 'GET',
                    'timeout' => 30
                ]
            ]);
            
            $result = file_get_contents($url, false, $context);
            
            if ($result === false) {
                $promise->reject(new Exception("Failed to fetch $url"));
            } else {
                $promise->resolve($result);
            }
        });
        
        return $promise;
    }
    
    public function parallel(array $urls): array {
        $promises = [];
        foreach ($urls as $url) {
            $promises[$url] = $this->get($url);
        }
        
        $this->scheduler->run();
        
        $results = [];
        foreach ($promises as $url => $promise) {
            try {
                $results[$url] = $promise->wait();
            } catch (Exception $e) {
                $results[$url] = null;
            }
        }
        
        return $results;
    }
}

class Promise {
    private bool $resolved = false;
    private bool $rejected = false;
    private mixed $value = null;
    private ?Exception $error = null;
    
    public function resolve(mixed $value): void {
        if ($this->resolved || $this->rejected) {
            return;
        }
        
        $this->resolved = true;
        $this->value = $value;
    }
    
    public function reject(Exception $error): void {
        if ($this->resolved || $this->rejected) {
            return;
        }
        
        $this->rejected = true;
        $this->error = $error;
    }
    
    public function wait(): mixed {
        while (!$this->resolved && !$this->rejected) {
            usleep(1000);
        }
        
        if ($this->rejected) {
            throw $this->error;
        }
        
        return $this->value;
    }
    
    public function then(callable $onResolve, callable $onReject = null): self {
        $promise = new self();
        
        if ($this->resolved) {
            try {
                $promise->resolve($onResolve($this->value));
            } catch (Exception $e) {
                $promise->reject($e);
            }
        } elseif ($this->rejected && $onReject) {
            try {
                $promise->resolve($onReject($this->error));
            } catch (Exception $e) {
                $promise->reject($e);
            }
        }
        
        return $promise;
    }
}

// Usage
$client = new AsyncHttpClient();

$results = $client->parallel([
    'https://api.github.com/users/octocat',
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://httpbin.org/json'
]);

foreach ($results as $url => $content) {
    if ($content !== null) {
        echo "Success: $url (" . strlen($content) . " bytes)\\n";
    } else {
        echo "Failed: $url\\n";
    }
}
\`\`\`

## Pool de Workers avec Fibers

\`\`\`php
class WorkerPool {
    private array $workers = [];
    private array $queue = [];
    private int $maxWorkers;
    
    public function __construct(int $maxWorkers = 4) {
        $this->maxWorkers = $maxWorkers;
    }
    
    public function submit(callable $task): Promise {
        $promise = new Promise();
        $this->queue[] = ['task' => $task, 'promise' => $promise];
        $this->processQueue();
        return $promise;
    }
    
    private function processQueue(): void {
        while (!empty($this->queue) && count($this->workers) < $this->maxWorkers) {
            $job = array_shift($this->queue);
            $this->startWorker($job['task'], $job['promise']);
        }
    }
    
    private function startWorker(callable $task, Promise $promise): void {
        $worker = new Fiber(function() use ($task, $promise) {
            try {
                $result = $task();
                $promise->resolve($result);
            } catch (Exception $e) {
                $promise->reject($e);
            }
        });
        
        $this->workers[] = $worker;
        $worker->start();
        
        // Nettoyer les workers terminés
        $this->cleanupWorkers();
    }
    
    private function cleanupWorkers(): void {
        $this->workers = array_filter($this->workers, function($worker) {
            return !$worker->isTerminated();
        });
        
        // Traiter la queue après nettoyage
        $this->processQueue();
    }
    
    public function waitAll(): void {
        while (!empty($this->workers)) {
            $this->cleanupWorkers();
            usleep(1000);
        }
    }
}

// Usage
$pool = new WorkerPool(3);

$promises = [];
for ($i = 1; $i <= 10; $i++) {
    $promises[] = $pool->submit(function() use ($i) {
        // Simulation de travail
        sleep(rand(1, 3));
        return "Task $i completed";
    });
}

foreach ($promises as $index => $promise) {
    echo $promise->wait() . "\\n";
}

$pool->waitAll();
\`\`\`

## Event Loop Simple

\`\`\`php
class EventLoop {
    private array $readStreams = [];
    private array $writeStreams = [];
    private array $timers = [];
    private bool $running = false;
    
    public function addReadStream($stream, callable $callback): void {
        $this->readStreams[(int)$stream] = [$stream, $callback];
    }
    
    public function addWriteStream($stream, callable $callback): void {
        $this->writeStreams[(int)$stream] = [$stream, $callback];
    }
    
    public function removeStream($stream): void {
        $key = (int)$stream;
        unset($this->readStreams[$key], $this->writeStreams[$key]);
    }
    
    public function addTimer(float $interval, callable $callback): int {
        $id = count($this->timers);
        $this->timers[$id] = [
            'time' => microtime(true) + $interval,
            'callback' => $callback
        ];
        return $id;
    }
    
    public function removeTimer(int $id): void {
        unset($this->timers[$id]);
    }
    
    public function run(): void {
        $this->running = true;
        
        while ($this->running) {
            $this->tick();
            usleep(1000);
        }
    }
    
    public function stop(): void {
        $this->running = false;
    }
    
    private function tick(): void {
        // Traiter les timers
        $now = microtime(true);
        foreach ($this->timers as $id => $timer) {
            if ($now >= $timer['time']) {
                $timer['callback']();
                unset($this->timers[$id]);
            }
        }
        
        // Traiter les streams
        if (empty($this->readStreams) && empty($this->writeStreams)) {
            return;
        }
        
        $read = array_column($this->readStreams, 0);
        $write = array_column($this->writeStreams, 0);
        $except = [];
        
        if (stream_select($read, $write, $except, 0, 1000) > 0) {
            foreach ($read as $stream) {
                $key = (int)$stream;
                if (isset($this->readStreams[$key])) {
                    $this->readStreams[$key][1]($stream);
                }
            }
            
            foreach ($write as $stream) {
                $key = (int)$stream;
                if (isset($this->writeStreams[$key])) {
                    $this->writeStreams[$key][1]($stream);
                }
            }
        }
    }
}

// Usage
$loop = new EventLoop();

// Timer périodique
$counter = 0;
$loop->addTimer(1.0, function() use (&$counter, $loop) {
    $counter++;
    echo "Timer tick $counter\\n";
    
    if ($counter < 5) {
        $loop->addTimer(1.0, function() use (&$counter, $loop) {
            $counter++;
            echo "Timer tick $counter\\n";
        });
    } else {
        $loop->stop();
    }
});

$loop->run();
\`\`\`
`
        }
    ]
};

/**
 * Génère la documentation PHP complète
 */
async function generateCompletePHPDocs() {
    console.log('🚀 Génération de la documentation PHP complète...\n');
    
    // Créer le dossier de destination
    if (!existsSync(DOCS_DIR)) {
        mkdirSync(DOCS_DIR, { recursive: true });
    }

    let totalFiles = 0;

    for (const [categoryName, docs] of Object.entries(PHP_COMPLETE_DOCS)) {
        console.log(`📁 Catégorie: ${categoryName}`);
        
        const categoryDir = join(DOCS_DIR, categoryName);
        if (!existsSync(categoryDir)) {
            mkdirSync(categoryDir, { recursive: true });
        }

        for (const doc of docs) {
            console.log(`  📄 ${doc.name}...`);
            
            const filePath = join(categoryDir, doc.name);
            const header = `# ${doc.title}

> **PHP 8.2+** - Documentation complète générée  
> **Catégorie:** ${categoryName}  
> **Généré le:** ${new Date().toLocaleDateString('fr-FR')}

---

`;
            
            writeFileSync(filePath, header + doc.content);
            totalFiles++;
        }
    }

    // Créer un fichier de résumé
    const summaryPath = join(DOCS_DIR, 'README.md');
    const summaryContent = `# Documentation PHP 8.2+ Complète

Documentation moderne et complète pour **PHP 8.2+** avec toutes les fonctionnalités avancées.

## 📊 Statistiques
- **Fichiers générés:** ${totalFiles}
- **Catégories:** ${Object.keys(PHP_COMPLETE_DOCS).length}
- **Version PHP:** 8.2+

## 📚 Catégories disponibles

${Object.entries(PHP_COMPLETE_DOCS).map(([cat, docs]) => {
    return `### ${cat}
${docs.map(d => `- [${d.title}](${cat}/${d.name})`).join('\n')}`;
}).join('\n\n')}

## 🆕 Fonctionnalités couvertes

### PHP 8.0+
- ✅ **Union Types** - Types multiples pour paramètres et retours
- ✅ **Propriétés promues** - Déclaration simplifiée dans le constructeur
- ✅ **Match expression** - Alternative moderne à switch
- ✅ **Opérateur nullsafe** - \`?->\` pour éviter les erreurs null
- ✅ **Attributs** - Métadonnées natives (annotations)

### PHP 8.1+
- ✅ **Enums** - Types énumérés natifs avec méthodes
- ✅ **Fibers** - Programmation asynchrone et concurrente
- ✅ **Intersection Types** - Types composés avec &
- ✅ **readonly properties** - Propriétés en lecture seule
- ✅ **new en initializers** - Objets par défaut dans paramètres

### PHP 8.2+
- ✅ **readonly classes** - Classes entièrement immutables
- ✅ **Disjunctive Normal Form Types** - Types complexes
- ✅ **Random extension** - Générateurs aléatoires améliorés
- ✅ **Sensitive parameter attribute** - Masquage de données sensibles

## 🎯 Utilisation avec MCP

Cette documentation est intégrée au serveur MCP et accessible via :
- \`mcp_fullstack-doc_search_docs\` avec technology="php"
- \`mcp_fullstack-doc_get_categories\` pour technology="php"
- \`mcp_fullstack-doc_search_cross_reference\` pour recherche croisée

## 📖 Exemples pratiques

Chaque fichier contient :
- 🔗 **Code examples** complets et fonctionnels
- 💡 **Best practices** modernes
- ⚡ **Performance tips** 
- 🛡️ **Type safety** avec types stricts
- 🧪 **Testing patterns**

---
*Documentation générée automatiquement le ${new Date().toLocaleString('fr-FR')}*
`;
    
    writeFileSync(summaryPath, summaryContent);
    
    console.log(`\n🎉 Génération PHP terminée !`);
    console.log(`📊 Résultat: ${totalFiles} fichiers générés`);
    console.log(`📁 Documentation disponible dans: docs/php/`);
    
    return { totalFiles, categories: Object.keys(PHP_COMPLETE_DOCS).length };
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    generateCompletePHPDocs().catch(console.error);
}

export { generateCompletePHPDocs };
