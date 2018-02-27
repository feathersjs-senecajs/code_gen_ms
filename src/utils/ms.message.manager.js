//todo: Turn this to npm package

const Observable = require('rxjs/Rx').Observable;

/*Request purpose*/
function sendMessage(senecaClient, msgPattern, data, replyPattern) {
	if (!replyPattern) {
		throw new Error('Invalid reply pattern');
	}
	const encodedReplyPattern = encode(replyPattern);

	for (const k in data) {
		msgPattern = `${msgPattern},${k}:${stringifyValue(data[k])}`;
	}
	const fullPattern = `${msgPattern},reply:${encodedReplyPattern}`;
	
	senecaClient.act(fullPattern);
}

function stringifyValue(value) {
	return typeof value === 'object' ?
		JSON.stringify(value) : value;
}

/*Response purpose*/
function sendOneWayMessage(senecaClient, msgPattern, input, result) {
	senecaClient.act(
		`${msgPattern}${stringifyValue(result)},input:${stringifyValue(input)}`
	);
}

function receiveMessage(msg) {
	if (msg.reply) {
		msg.reply = decode(msg.reply);
	}
	return msg;
}

function encode(pattern) {
	return pattern
		.replace(/\:/g, '-')
		.replace(/,/g, '_');
}

function decode(encodedPattern) {
	return encodedPattern
		.replace(/-/g, ':')
		.replace(/_/g, ',');
}

module.exports = {
	sendMessage: sendMessage,
	sendOneWayMessage: sendOneWayMessage,
	receiveMessage: receiveMessage
};