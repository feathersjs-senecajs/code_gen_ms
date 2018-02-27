const connType = 'amqp';
const url = 'amqp://localhost:5672';

module.exports = {
	conn: {
		type: connType,
		pin: 'role:codes',
		url: url
	},
	clientConn: {
		type: connType,
		pin: 'role:*',
		url: url
	}
};