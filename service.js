const seneca = require('seneca')()
	.use('jsonfile-store', {
		folder: '/'
	})
	.use('entity')
	.use('seneca-amqp-transport')
	.use('codegen')
	.listen({
		type: 'amqp',
		pin: 'role:codes,cmd:gen',
		url: 'amqp://localhost:5672'
	});