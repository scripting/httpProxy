const productName = "httpProxy", version = "0.4.0";

const request = require ("request"); 
const davehttp = require ("davehttp"); 
const utils = require ("daveutils"); 

var config = {
	port: 5393,
	flLogToConsole: true,
	flAllowAccessFromAnywhere: true
	}

davehttp.start (config, function (theRequest) {
	switch (theRequest.lowerpath) {
		case "/httpreadurl":
			var url = theRequest.params.url, type = theRequest.params.type, whenstart = new Date ();
			request (url, function (err, response, body) {
				console.log ("url == " + url + ", code == " + response.statusCode + ", secs == " + utils.secondsSince (whenstart));
				if (err) {
					console.log ("err.message == " + err.message);
					}
				if (type === undefined) {
					type = response.headers ["content-type"];
					if (type === undefined) {
						type = "text/plain";
						}
					}
				theRequest.httpReturn (response.statusCode, type, body);
				});
			return;
		case "/now":
			theRequest.httpReturn (200, "text/plain", new Date ());
			return;
		}
	theRequest.httpReturn (404, "text/plain", "Not found.");
	});
