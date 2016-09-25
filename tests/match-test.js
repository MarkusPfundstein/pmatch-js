const match = require('../match');

const {expect} = require('chai');
const R = require('ramda');

const L = console.log;

const expectT = v => expect(v).to.be.true;

describe('match.js', () => {

	it('matches based on typeof', () => {
		const m1 = match('Hello')
			.when('string', true)
			.when('number', false)
			.otherwise(false);
	
		expectT(m1);	
	});

	it('matches deep array', () => {

		const m2 = match(['Hello', 5])
			.when(['string', 'string'], false)
			.when(['string', 'number'], true)
			.otherwise(false);
		
		expectT(m2);

		const m3 = match(['Hello', 5, 100])
			.when(['string', 'string'], false)
			.when(['string', 'number', 'string'], false)
			.when(['string', 'number', 'number'], true)
			.when(['string', 'string', 'string'], false)
			.otherwise(false);

		expectT(m3);

		const m4 = match(['Hello', [5, 100], 100])
			.when(['string', 'string'], false)
			.when(['string', 'number', 'string'], false)
			.when(['string', 'string', 'string'], false)
			.when(['string', 'number', 'number'], false)
			.when(['string', ['number', 'number'], 'string'], false)
			.otherwise(true);
		
		expectT(m4);
	});

	it('matches based on values', () => {
		const m2 = match(['Hello', [100, 100], 100])
			.when(['Hello', [5, 5], '_'], false)
			.when(['Hello', [100, 100], p => p < 100], false)
			.when(['Goodbye', ['_', '_'], '_'], false)
			.when(['Hello', [100, 100], 100], true)
			.otherwise(false);

		expectT(m2);

		const m3 = match([[1,2], []])
			.when(['_', []], true)
			.otherwise(false);
		expectT(m3);
	});

	it('matches based on wildcards', () => {
		const m2 = match(['Hello', [100, 100], 100])
			.when(['Hello', [5, 5], '_'], false)
			.when(['Hello', [100, 100], p => p < 100], false)
			.when(['Goodbye', ['_', '_'], '_'], false)
			.when(['Hello', ['_', '_'], '_'], true)
			.otherwise(false);

		expectT(m2);
	});

	it('matches based on a function', () => {
		const m2 = match(['Hello', [100, 100], 100])
			.when(['Hello', [5, 5], '_'], false)
			.when(['Hello', [100, 100], p => p < 100], false)
			.when(['Goodbye', ['_', '_'], '_'], false)
			.when(['_', [100, 100], p => p === 100], true)
			.otherwise(false);

		expectT(m2);
	});


	it('matches based on instance type', () => {
		class ABox {
			constructor(v) {
				this.v = v;
			}
		}

		const m6 = match([new ABox(5), [new ABox(10), new ABox(20)]])
			.when([ABox, 5], false)
			.when([ABox, [ABox, ABox]], true)
			.otherwise(false);

		expectT(m6);
	});

	it('good match executes function', () => {
		class ABox {
			constructor(v) {
				this.v = v;
			}
		}

		const m6 = match([new ABox(5), [new ABox(10), new ABox(20)]])
			.when([ABox, 5], false)
			.when([ABox, [ABox, ABox]], R.pipe(R.flatten, R.map(R.prop('v'))))
			.otherwise(false);

		expect(m6).to.eql([5, 10, 20]); 
	});



	it('matches deep nested object', () => {
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
		
		expectT(m7);

		const m8 = match(anyObject)
			.when({a : 5}, false)
			.when({a : 5, b : { c : 3 }}, false)
			.when({b : { c : 4 }, a : 5}, true)
			.otherwise(false);

		expectT(m8);
	});

});
