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
	//console.log(`type: ${type}, tc: ${tc}`);
	if (tc === '_' || tc === type) {
		return true;
	} else if (Array.isArray(tc) && Array.isArray(type) && tc.length === type.length) {
		if (tc.length === 0) {
			return true;
		}
		return R.all(p => _matchP(p[1], p[0]), R.zip(tc, type));
	} else if (typeof type === tc || safeInstanceOf(type, tc)) {
		return true;
	} else if (typeof tc === 'function' && safeCall(tc, type) === true) {
		return true;
	} else {
		return false;
	}
}

const _matchC = function(type, hasType = false) {

	const when = (tc, f) => {
		if (hasType) {
			return _matchC(type, true);
		}

		if (_matchP(type, tc)) {
                     	return _matchC(f(type), true);
		} else {
			return _matchC(type, false);
		}
	};

	const otherwise = (f) => {
		if (hasType) {
			return type;
		}
		return f(type);
	}
	
	return { when, otherwise };
}

module.exports = (t) => _matchC(t);
