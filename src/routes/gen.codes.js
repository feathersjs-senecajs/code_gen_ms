const _ = require('lodash');
const codeGenerator = require('../engine/code.gen.algorithm');
const msgManager = require('../utils/ms.message.manager');

module.exports = function (options) {
	let replyPattern, msg;

	return function genCodesRoute(msMsg, reply) { 
		msg = msgManager.receiveMessage(msMsg);
		replyPattern = msg.reply;
		doReply(codeGenerator(options.seed, msg.count), reply);
	};

	function doReply(codes, reply) {
		options.seed = _.last(codes);
		options.entity
			.data$({ text: options.seed })
			.save$((err, entity) => {
				if (err) {
					return console.error(err);
				}
				options.entity = entity;
				msgManager.sendOneWayMessage(
					options.senecaClient,
					replyPattern,
					msg[msg.input],
					codes
				);
				reply();
			});
	}
};