var https = require('https');
var http = require('http');
exports.get = function(url, fns){
	https.get(url, function(res) {
		fns.successFn(res);
	  res.on('data', function(d) {
	    process.stdout.write(d);
	  });
	}).on('error', function(e) {
  	fns.errorFn(e);
	});
}
exports.post = function(host,path, fns){
	var options = {
	  hostname: host,
	  path: path,
	  method: 'POST'
	};
	var req = https.request(options, function(res) {
		console.log('-------------POST----------------');
	  console.log("statusCode: ", res.statusCode);
	  console.log("headers: ", res.headers);

	  res.on('data', function(d) {
	    process.stdout.write(d);
	  });
	});
	req.end();
	req.on('error', function(e) {
		console.log('-------------POST-ERROR---------------');
	  console.error(e);
	});
}