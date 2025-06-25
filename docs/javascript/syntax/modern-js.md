# JavaScript Moderne

## Fonctions fléchées

```javascript
// Fonction traditionnelle
function add(a, b) {
    return a + b;
}

// Fonction fléchée
const add = (a, b) => a + b;

// Avec un seul paramètre
const square = x => x * x;

// Sans paramètres
const getTimestamp = () => Date.now();
```

## Déstructuration

### Arrays

```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]
```

### Objects

```javascript
const user = { name: 'John', age: 30, email: 'john@example.com' };
const { name, age } = user;

// Avec renommage
const { name: userName, age: userAge } = user;
```

## Async/Await

```javascript
// Avec Promise
function fetchUser(id) {
    return fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(user => user);
}

// Avec async/await
async function fetchUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`);
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}
```

## Modules ES6

```javascript
// export.js
export const PI = 3.14159;
export function calculate(radius) {
    return PI * radius * radius;
}
export default class Circle {
    constructor(radius) {
        this.radius = radius;
    }
}

// import.js
import Circle, { PI, calculate } from './export.js';
```

## Template literals

```javascript
const name = 'John';
const age = 30;

// Template literal
const message = `Hello ${name}, you are ${age} years old!`;

// Multilignes
const html = `
    <div>
        <h1>${name}</h1>
        <p>Age: ${age}</p>
    </div>
`;
```
