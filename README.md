# pmatch-js

Powerful pattern matching for js

## Install 

`npm install pmatch-js`

## Examples

Notes: 
The otherwise call is *necessary* and must be the last call that you make. 

'_' acts as a wildcard. I liked the smiley :-)

Its implemented via recursion. Just that you know.

The standard examples:

Calculate fibonacci
```
const fibbonacci = n => {
        const go = (n, a, b) => match(n)
                .when(0, _ => a)
                .otherwise(_ => go(n - 1, b, a +b));

        return go(n, 0, 1);
}

console.log(fibbonacci(25));
```
Calculate factorial
```
const factorial = n => match(n)
        .when(0, _ => 1)
        .otherwise(n => n * factorial(n - 1));

console.log(factorial(10))
```
list length
```
const tail = ([_, ...xs]) => xs;
const head = ([x, ..._]) => x;

const count = c => match(c)
        .when([], _ => 0)
        .otherwise(xs => 1 + count(tail(xs)));

console.log(count([1,2,3,4,5]));
```
Map f over a list
```
const map = (f, xs) => match(xs)
        .when([], v => [])
        .otherwise(([x, ...xs]) => [f(x), ...map(f, xs)]);

console.log(map(Number, ['1', '2', '3', '4', '5']));
```

Walk-a-tree / map f over Tree
```
class Tree {
        constructor(left, right) {
                this.left = left;
                this.right = right;
        }
}

class Node {
        constructor(value) {
                this.value = value;
        }
}

const T = (l, r) => new Tree(l, r);
const N = v => new Node(v);

const walkT = t => match(t)
        .when(Node, v => console.log(v.value))
        .when(Tree, t => { walkT(t.left); walkT(t.right)})
        .otherwise(_ => 'error');
        
const mapT = (f, t) => match(t)
        .when(Node, v => N(f(v.value)))
        .when(Tree, t => T(mapT(f, t.left), mapT(f, t.right)))
        .otherwise(_ => { throw new Error('error') });

const pow = v => Math.pow(v, 2);

const mapped = mapT(pow, T(T(N(5), T(N(7), N(1))), T(N(-1), N(8))));

walkT(mapped);


walkT(T(T(N(5), T(N(7), N(1))), T(N(-1), N(8))))
```


Some deeper patterns:
Note: 'string' and 'number' are the `typeof's`. So we can match on those as well...
```
const m1 = match('Hello')
	.when('string', a => [true, a.toUpperCase()])
	.when('number', a => [false, a])
	.otherwise(_ => [false, 'no match'])

L(m1);

const m2 = match(['Hello', 5])
	.when(['string', 'string'], ([a, b]) => [false, a, b])
	.when(['string', 'number'], ([a, b]) => [true, a, b])
	.otherwise(_ => [false, 'no match'])

L(m2);
```

some more difficult ones:
```
const m5 = match(['Hello', [100, 100], 100])
	.when(['Hello', [5, 5], '_'], ([a, b, c]) => [false, a, b, c])
	.when(['Hello', [100, 100], p => p < 100], ([a, b, c]) => [false, a, b, c])
	.when(['Goodbye', ['_', '_'], '_'], ([a, b, c]) => [false, a, b, c])
	.when(['_', [100, 100], p => p === 100], ([a, b, c]) => [true, a, b, c])     //<- will match
	.otherwise(_ => [false, 'no match'])

L(m5);
```

Can also match own types in nested arrays:
```
class ABox {
	constructor(v) {
		this.v = v;
	}
}

const m6 = match([new ABox(5), [new ABox(10), new ABox(20)]])
	.when([ABox, 5], ([a, b]) => [false, a, b])
	.when([ABox, [ABox, ABox]], ([a, b]) => [true, a, b])         // <- will match
	.otherwise(_ => 'no match');

L(m6);
```
