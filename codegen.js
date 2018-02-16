const _ = require('lodash'); 
const Observable = require('rxjs/Rx').Observable;
const codeGenerator = require('./code.gen.algorithm');
const DEF_SEED = '111111111';

let seed;

module.exports = function codegen() {
	let entity = this.make$('seed');

	this.add('count:*', (msg, reply) => {
		if (!seed) {
			initializeDb()
				.subscribe(seed => { 
					doReply(codeGenerator(seed, msg.count), reply);
				});
		}
		else {
			doReply(codeGenerator(seed, msg.count), reply);
		}
	});
	
	function doReply(codes, reply) {
		seed = _.last(codes);
		entity.text = seed;
		entity.save$((err, entity) => { 
			if (err) {
				console.error(err);
				return;
			}
			reply(null, codes);
		});
	}
	
	function initializeDb() {
		let entityListObservable = Observable.bindNodeCallback(entity.$list);
	
		return entityListObservable({})
			.map(res => {
				return res.length > 0 ? res[0].text : DEF_SEED;
			});
	}
};
