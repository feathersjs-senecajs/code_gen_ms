const config = require('./config');

const genCodesRoute = require('./src/routes/gen.codes');

module.exports = function codegen(options) {
	this.add('cmd:gen', genCodesRoute(options));
	
	this.add('init:codegen', (msg, reply) => {
		options.senecaClient = options.seneca.client(config.clientConn);
		reply();
	});
};
