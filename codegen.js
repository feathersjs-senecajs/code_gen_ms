const _ = require('lodash'); 
const Observable = require('rxjs/Rx').Observable;
const config = require('./config');
const codeGenerator = require('./code.gen.algorithm');
const msgManager = require('./ms.message.manager');

const DEF_SEED = '111111111';

module.exports = function codegen(options) {
	let seed, replyPattern, senecaClient, entity;

	this.add('role:codes,cmd:gen', (msg, reply) => {
		msg = msgManager.receiveMessage(msg);
		replyPattern = msg.reply;
		doReply(codeGenerator(seed, msg.count), reply);
	});
	
	function doReply(codes, reply) {
		seed = _.last(codes);
		entity
			.data$({ text: seed })
			.save$((err, entity) => {
				if (err) {
					return console.error(err);
				}
				entity = entity;
				msgManager
					.sendOneWayMessage(senecaClient, `${replyPattern}${JSON.stringify(codes)}`)
					.subscribe(console.info);
				reply(null, { msg: 'ok' });
			});
	}
	
	function initializeDb() {
		let entityListAsObservable = Observable.bindNodeCallback(entity.list$);
	
		return entityListAsObservable.call(entity, null)
			.map(res => res[0])
			.map(res => {
				return res.length > 0 ? res[0].text : DEF_SEED;
			})
			.catch(err => {
				console.error(err);
			});
	}

	this.add('init:codegen', (msg, reply) => {
		entity = this.make$('seed');
		senecaClient = options.seneca.client(config.conn);
		initializeDb().subscribe(res => { 
			seed = res;
			reply();
		});
	});
};
