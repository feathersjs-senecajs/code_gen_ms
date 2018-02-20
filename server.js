const config = require('./config');
const entities = require('seneca-entity');
const seneca = require('seneca')();
const senecaServer = seneca
	.use(entities)
	.use('jsonfile-store', {
		folder: './data'
	})
	.use('seneca-amqp-transport')
	.use('codegen', { seneca: seneca })
	.listen(config.conn);