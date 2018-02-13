import { Observable } from 'rxjs/Observable';

const seneca = require('seneca')()
	.use('jsonfile-store', {
		folder: '/'
	})
	.use('entity')
	.use('seneca-amqp-transport')
	.listen({
		type: 'amqp',
		pin: 'cmd:get,count:*',
		url: 'amqp://localhost:5672'
	});
const _ = require('lodash'); 
const codeGenerator = require('./code-gen');
const DEF_SEED = '111111111';
const entity = seneca.make$('seed');

let seed;

seneca.add('cmd:get,count:*', (msg, reply) => {
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
