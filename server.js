var config = require('./config.json');
var fs = require('fs');

var respond = function (req, res) {
	res.writeHead(200);
	res.end("https response\n");
}

require('https')
	.createServer(
		{
			cert: fs.readFileSync(config.https.cert),
			key: fs.readFileSync(config.https.key)
		},
		respond
	)
	.listen(config.https.port);

require('ensure-https')
	.createServer({
		sslHost: config.https.port
	})
	.listen(config.http);
