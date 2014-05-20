var config = require('./config.json');
var ensure_https_handle = require('ensure-https')
	.handle
	.bind({sslPort: config.https.port});
var fs = require('fs');
var rd = require('./lib/http/redirect-domain.js');

var root = 'http://'+config.domain.root+':'+config.http.port;
var subdomains = config.domain.root.split('.');
var request_domain = function(req){
	var host = req.headers.host || return false;
	return host.split(':')[0];
}

var respond = {};

respond.http = function(req, res){
	var domain = request_domain(req) || return respond.error('Host header missing.', req, res);
	var req_subdomains = domain.split('.').slice(0, -1 * subdomains.length);
	var subdomain = req_subdomains[0];

	// https for root and api domains
	if(!subdomain || (config.domain.api === domain)){
		return ensure_https_handle(req, res);
	}

	var www = rd.redirectWww(req, res);
	if(www) return;

	if(subdomain){
		return respond.subdomain_missing(req, res);
	}
	respond.notfound(req, res);
}

respond.https = function(req, res){
	var www = rd.redirectWww(req, res, true);
	if(www) return;

	var response_type = (req.url === '/') ? 'home' : 'notfound';
	respond[response_type](req, res);
}

respond.error = function (msg, req, res){
	res.writeHead(500);
	res.end('Error. '+msg);
	console.log('error: ', req.headers.host + req.url);
}

respond.notfound = function (req, res){
	res.writeHead(404);
	res.end("Not Found");
	console.log('not found: ', req.headers.host + req.url);
}

respond.home = function (req, res){
	res.writeHead(200);
	res.end("hackdash");
}

respond.subdomain_missing = function (req, res){
	res.writeHead(404);
	res.end(
		'<a href="'+root+'/?domain='+request_domain(req)+'">'
		+  'Subdomain available.'
		+'</a>'
	);
	// res.writeHead(302, 'Subdomain unregistered.');
	// res.setHeader('Location', root+'/?domain='+request_domain(req));
	// res.end();
}

require('http')
	.createServer(respond.http)
	.listen(config.http.port);
console.log('http://'+config.domain.root+':'+config.http.port+'/');
console.log('http://x.'+config.domain.root+':'+config.http.port+'/');

require('https')
	.createServer(
		{
			cert: fs.readFileSync(config.https.cert),
			key: fs.readFileSync(config.https.key)
		},
		respond.https
	)
	.listen(config.https.port);
console.log('https://api.'+config.domain.root+':'+config.https.port+'/');
console.log('https://'+config.domain.root+':'+config.https.port+'/');
