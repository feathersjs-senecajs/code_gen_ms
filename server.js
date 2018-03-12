const config = require('./config');
const entities = require('seneca-entity');
const seneca = require('seneca')();
const senecaServer = seneca
	.use(entities)
	.use('seneca-amqp-transport')
	.use('codegen', { seneca: seneca })
	.use('mongo-store', {
		name: 'codegendb',
		host: '192.168.20.182',
		port: 27017,
		options: {}
	})
	.listen(config.conn);