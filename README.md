# pmatch-js

Powerful pattern matching for js

## Install 

`npm install pmatch-js`

## Testing

Run `npm test` - requires chai and mocha

## Examples

Notes: 
* The otherwise call is *necessary* and must be the last call that you make. 
* '_' acts as a wildcard. I liked the smiley :-)
* Its implemented via recursion. Just that you know.

Calculate fibonacci
```
const fibbonacci = n => {
        const go = (n, a, b) => match(n)
                .when(0, a)
                .otherwise(_ => go(n - 1, b, a +b));

        return go(n, 0, 1);
}

console.log(fibbonacci(25));
// 75025
```
Calculate factorial
```
const factorial = n => match(n)
        .when(0, 1)
        .otherwise(n => n * factorial(n - 1));

console.log(factorial(10))
// 3628800
```
list length
```
const tail = ([_, ...xs]) => xs;
const head = ([x, ..._]) => x;

const count = c => match(c)
        .when([], 0)
        .otherwise(xs => 1 + count(tail(xs)));

console.log(count([1,2,3,4,5]));
// 5
```
Map f over a list
```
const map = (f, xs) => match(xs)
        .when([], [])
        .otherwise(([x, ...xs]) => [f(x), ...map(f, xs)]);

console.log(map(Number, ['1', '2', '3', '4', '5']));
[ 1, 2, 3, 4, 5 ]
```

Recursive zipWith
```
const zipWith = (f, lst1, lst2) => match([lst1, lst2])                                                           
        .when([[], '_'], [])                                                                                     
        .when(['_', []], [])                                                                                     
        .otherwise(([[x, ...xs], [y, ...ys]]) => [f(x, y)].concat(zipWith(f, xs, ys)));                          
                        
console.log(zipWith((a, b) => a + b, [4,2,5,6], [2,6,2,3]));                                                     
// [ 6, 8, 7, 9 ]
                        
console.log(zipWith((a, b) => `${a} ${b}`, ['foo', 'bar', 'baz'], ['fighters', 'hoppers', 'aldrin']));           
// [ 'foo fighters', 'bar hoppers', 'baz aldrin' ]
                
console.log(zipWith(Math.max, [6,3,2,1], [7,3,1,5]));
// [ 7, 3, 2, 5 ]]
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
// 25
// 49
// 1
// 1
// 64
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
/* -> */.when(['_', [100, 100], p => p === 100], ([a, b, c]) => [true, a, b, c])
	.otherwise(_ => [false, 'no match'])

L(m5);

const anyObject = {
	a: 5,
	b : {
		c: 4
	}
};

const m7 = match(anyObject)
	.when({a : 5}, false)
	.when({a : 5, b : { c : 3 }}, false)
	.when({a : 5, b : { c : '_' }}, true)
	.otherwise(false);
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
