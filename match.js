const R = require('ramda');

const safeInstanceOf = (t, tc) => {
	try {
		return t instanceof tc;
	} catch (_) {
		return false;
	}
}

const safeCall = (f, t) => {
	try {
		return f(t);
	} catch (e) {
		return false;
	}
};

const _matchP = function(type, tc) {
	if (tc === '_' || tc === type) { // || R.equals(tc, type)
		return true;
	} else if (Array.isArray(tc) && Array.isArray(type) && tc.length === type.length) {
		return R.all(p => _matchP(p[1], p[0]), R.zip(tc, type));
	} else if (typeof type === tc || safeInstanceOf(type, tc)) {
		return true;
	} else if (typeof tc === 'function' && safeCall(tc, type) === true) {
		return true;
	} else if (!Array.isArray(tc) && typeof tc === 'object' && typeof type === 'object') {
		const tcKeys = R.keys(tc);
		const typeKeys = R.keys(type);
		if (tcKeys.length === typeKeys.length) {
			return R.all(k => {
				return tc[k] != null && _matchP(type[k], tc[k]);
			}, typeKeys);
		} 
		return false;
	} else {
		return false;
	}
}

const _matchC = function(type, hasType = false) {

	const applyF = f => {
		return (typeof f === 'function') ? f : _ => f;;
	}

	const when = (tc, f) => {
		//console.log(`${tc} = ${type}`);
		if (hasType) {
			return _matchC(type, true);
		}

		if (_matchP(type, tc)) {
			const g = applyF(f);
			//console.log(`done ${g(type)}`);
                     	return _matchC(g(type), true);
		} else {
			return _matchC(type, false);
		}
	};

	const otherwise = (f) => {
		if (hasType) {
			return type;
		}
		const g = applyF(f);
		return g(type);
	}
	
	return { when, otherwise };
}

module.exports = (t) => _matchC(t);
