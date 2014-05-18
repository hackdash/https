/*
** © 2012 by YOUSURE Tarifvegleich GmbH. Licensed under MIT License.
*/

var http = require('http');

function handle(req, res) {
  var options = this;
  var hostname = (options.forceHost || req.headers.host || options.host || 'localhost').split(':').shift();
  var location = 'https://'+[ hostname, (options.sslPort || 443) ].join(':') + req.url;
  var headers = {
    'Connection': 'close',
    'Location': location,
    'Server': options.serverName || 'ensure-https',
    'Date': (new Date()).toGMTString()
  };
  if (req.method !== 'HEAD') {
    headers['Content-Type'] = 'text/plain';
  }
  res.writeHead(options.statusCode || 301, 'Moved Permanently', headers);
  if (req.method !== 'HEAD') {
    res.write('Moved Permanently to '+location);
  }
  res.end();
}

exports.createServer = function createServer(options) {
  options = options || {};
  return http.createServer(handle.bind(options));
};
