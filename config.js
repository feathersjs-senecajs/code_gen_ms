const connType = 'amqp';
const url = 'amqp://192.168.20.182:3132';

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