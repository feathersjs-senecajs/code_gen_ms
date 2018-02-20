const seneca = require('seneca')()
	.client({
		type: 'amqp',
		pin: 'role:*',
		url: 'amqp://localhost:5672'
	});

module.exports = function reply(pattern, data) {
	seneca.act(`${pattern},data:${data}`, (err, msg) => { 
		if (err) {
			return console.error(err);
		}
		console.log(msg);
	});
};