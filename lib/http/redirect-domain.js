var redirectDomain = function(root, req, res){
	var location = root + req.url;
	var headers = {
		'Connection': 'close',
		'Location': location,
		'Server': req.headers.host,
		'Date': (new Date()).toGMTString()
	};
	if (req.method !== 'HEAD') {
		headers['Content-Type'] = 'text/plain';
		var body = 'Moved permanently to '+location;
	}
	res.writeHead(301, 'Moved Permanently', headers);
	if (body) {
		res.write(body);
	}
	res.end();
};

var redirectWww = function(req, res, secure){
	var host = req.headers.host;
	var isWww = 'www' === host.split('.')[0];
	if(isWww){
		redirectDomain(
			'http' + (secure ? 's' : '') + '://' + host.substring(4)
			, req, res);
	}
	return isWww;
}

exports.redirectDomain = redirectDomain;
exports.redirectWww = redirectWww;
