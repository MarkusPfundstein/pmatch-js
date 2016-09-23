const match = require('./match');
// its all good if all output lines have true in first tuple ;-)
const L = console.log;

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

const m3 = match(['Hello', 5, 100])
	.when(['string', 'string'], (a, b) => [false, a, b])
	.when(['string', 'number', 'string'], ([a, b, c]) => [false, a, b, c])
	.when(['string', 'string', 'string'], ([a, b, c]) => [false, a, b, c])
	.when(['string', 'number', 'number'], ([a, b, c]) => [true, a, b, c])
	.otherwise(_ => [false, 'no match'])

L(m3);

const m4 = match(['Hello', [5, 100], 100])
	.when(['string', 'string'], (a, b) => [false, a, b])
	.when(['string', 'number', 'string'], ([a, b, c]) => [false, a, b, c])
	.when(['string', 'string', 'string'], ([a, b, c]) => [false, a, b, c])
	.when(['string', 'number', 'number'], ([a, b, c]) => [false, a, b, c])
	.when(['string', ['number', 'number'], 'string'], ([a, b, c]) => [false, a, b, c])
	.otherwise(_ => [true, 'no match'])

L(m4);

const m5 = match(['Hello', [100, 100], 100])
	.when(['Hello', [5, 5], '_'], ([a, b, c]) => [false, a, b, c])
	.when(['Hello', [100, 100], p => p < 100], ([a, b, c]) => [false, a, b, c])
	.when(['Goodbye', ['_', '_'], '_'], ([a, b, c]) => [false, a, b, c])
	.when(['_', [100, 100], p => p === 100], ([a, b, c]) => [true, a, b, c])
	.otherwise(_ => [false, 'no match'])

L(m5);

class ABox {
	constructor(v) {
		this.v = v;
	}
}

const m6 = match([new ABox(5), [new ABox(10), new ABox(20)]])
	.when([ABox, 5], ([a, b]) => [false, a, b])
	.when([ABox, [ABox, ABox]], ([a, b]) => [true, a, b])
	.otherwise(_ => 'no match');

L(m6);
