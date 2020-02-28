const Observable = require('rxjs/Rx').Observable;
const _ = require('lodash');
const codeGenerator = require('../engine/code.gen.algorithm');
const msgManager = require('../utils/ms.message.manager');

module.exports = function (options) {
	let replyPattern, msg, seed, seedEntity;

	return async function genCodesRoute(msMsg, reply) {
		getSeed().subscribe(res => {
			seed = res;
			msg = msgManager.receiveMessage(msMsg);
			replyPattern = msg.reply;
			doReply(codeGenerator(seed, msg.count), reply);
		}, err => {
			console.log(err);
		});
	};

	function getSeed() {
		const entity = options.seneca.make$('seed');
		let entityListAsObservable = Observable.bindNodeCallback(entity.list$);
	
		return entityListAsObservable.call(entity, {})
			.map(res => res[0])
			.map(res => {
				if (res.length > 0) {
					seedEntity = res[0];
					return res[0].text;
				}
				else {
					seedEntity = entity;
					return null;
				}
			});
	}

	function doReply(codes, reply) {
		seed = _.last(codes);
		seedEntity
			.data$({ text: seed })
			.save$((err, entity) => {
				if (err) {
					return console.error(err);
				}
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