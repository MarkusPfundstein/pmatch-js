# pmatch-js

Powerful pattern matching for js

## Install 

`npm install pmatch-js`

## Examples

```
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
```
