const Observable = require('rxjs/Rx').Observable;
const config = require('./config');

const genCodesRoute = require('./src/routes/gen.codes');

module.exports = function codegen(options) {
	this.add('cmd:gen', genCodesRoute(options));
	
	this.add('init:codegen', (msg, reply) => {
		options.entity = this.make$('seed');
		options.senecaClient = options.seneca.client(config.clientConn);
		initializeDb().subscribe(res => { 
			options.seed = res;
			reply();
		});
	});

	function initializeDb() {
		let entityListAsObservable = Observable.bindNodeCallback(options.entity.list$);
	
		return entityListAsObservable.call(options.entity, null)
			.map(res => res[0])
			.map(res => {
				return res.length > 0 ? res[0].text : null;
			})
			.catch(err => {
				console.error(err);
			});
	}
};
