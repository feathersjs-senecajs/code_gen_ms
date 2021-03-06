const ribbon = '56D7C908A241FBE3';
const _ = require('lodash');

module.exports = function codeGenerator(seed, n) {
	seed = seed || firstSeed(9);

	const start = seed[seed.length - 1];
	let cursor = ribbon.indexOf(start) + 1;
	let result = [];
	let aux;

	for (let i = 0; i < n; i++) {
		if (cursor < ribbon.length) {
			result.push(`${seed.substr(0, seed.length - 1)}${ribbon[cursor++]}`);
		}
		else {
			seed = nextSeed(result[result.length - 1] || seed);
			cursor = 0;
		}
	}
	aux = [...
		result.slice(0, result.length - 1)
			.sort(() => {
				return Math.random() * 10 > 5 ? -1 : 1;
			}),
		result[result.length - 1]
	];
	return aux;
}

function firstSeed(length) {
	return _.repeat(ribbon[0], length);
}

function nextSeed(seed) {
	if (seed.length === 0) {
		return '';
	}
	
	let tail = seed[seed.length - 1];
	let cursor = ribbon.indexOf(tail);

	if (cursor < ribbon.length - 1) {
		return `${seed.substr(0, seed.length - 1)}${ribbon[cursor + 1]}`;
	}
	else {
		return `${nextSeed(seed.substr(0, seed.length - 1))}${ribbon[0]}`;
	}
}
