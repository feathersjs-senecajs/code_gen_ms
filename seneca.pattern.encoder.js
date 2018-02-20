module.exports = {
	encode: (pattern) => {
		return pattern
			.replace(/\:/g, '-')
			.replace(/,/g, '_');
	},
	decode: (encodedPattern) => {
		return encodedPattern
			.replace(/-/g, ':')
			.replace(/_/g, ',');
	}
};