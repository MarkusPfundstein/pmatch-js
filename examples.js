const match = require('./match');

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
	.otherwise(_ => { throw new Error('error') });

const mapT = (f, t) => match(t)
	.when(Node, v => N(f(v.value)))
	.when(Tree, t => T(mapT(f, t.left), mapT(f, t.right)))
	.otherwise(_ => { throw new Error('error') });

const pow = v => Math.pow(v, 2);
console.log('mapT example');
const mapped = mapT(pow, T(T(N(5), T(N(7), N(1))), T(N(-1), N(8))));
walkT(mapped);

console.log('fibonacci');

const fibbonacci = n => {
	const go = (n, a, b) => match(n)
		.when(0, a)
		.otherwise(_ => go(n - 1, b, a +b));

	return go(n, 0, 1);
}

console.log(fibbonacci(25));

console.log('factorial');

const factorial = n => match(n)
	.when(0, 1)
	.otherwise(n => n * factorial(n - 1));

console.log(factorial(10))


const tail = ([_, ...xs]) => xs;
const head = ([x, ..._]) => x;

console.log('count');

const count = c => match(c)
	.when([], 0)
	.otherwise(xs => 1 + count(tail(xs)));

console.log(count([1,2,3,4,5]));

console.log('map');

const map = (f, xs) => match(xs)
	.when([], [])
	.otherwise(([x, ...xs]) => [f(x), ...map(f, xs)]);

console.log(map(Number, ['1', '2', '3', '4', '5']));

const zipWith = (f, lst1, lst2) => match([lst1, lst2])
	.when([[], '_'], [])
	.when(['_', []], [])
	.otherwise(([[x, ...xs], [y, ...ys]]) => [f(x, y)].concat(zipWith(f, xs, ys)));

console.log(zipWith((a, b) => a + b, [4,2,5,6], [2,6,2,3]));

console.log(zipWith((a, b) => `${a} ${b}`, ['foo', 'bar', 'baz'], ['fighters', 'hoppers', 'aldrin']));

console.log(zipWith(Math.max, [6,3,2,1], [7,3,1,5]));
