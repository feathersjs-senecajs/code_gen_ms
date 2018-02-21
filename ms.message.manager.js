//todo: Turn this to npm package

const Observable = require('rxjs/Rx').Observable;

function sendMessage(senecaClient, msg, replyPattern) {
	if (!replyPattern) {
		throw new Error('Invalid reply pattern');
	}
	const encodedReplyPattern = encode(replyPattern);
	const fullPattern = `${msg},reply:${encodedReplyPattern}`;
	
	return Observable.bindNodeCallback(senecaClient.act)
		.call(senecaClient, fullPattern);
}

function sendOneWayMessage(senecaClient, msg) {
	return Observable.bindNodeCallback(senecaClient.act)
		.call(senecaClient, msg);
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