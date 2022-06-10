const productName = "httpProxy", version = "0.4.3"; 

const request = require ("request"); 
const davehttp = require ("davehttp"); 
const utils = require ("daveutils"); 

var config = {
	port: process.env.PORT || 5393,
	flLogToConsole: true,
	flAllowAccessFromAnywhere: true
	}

function handleHttpRequest (theRequest) {
	const params = theRequest.params, whenstart = new Date ();
	switch (theRequest.lowerpath) {
		case "/httpreadurl":
			request (params.url, function (err, response, body) {
				if (err) {
					theRequest.httpReturn (500, "text/plain", err.message);
					}
				else {
					theRequest.httpReturn (response.statusCode, "text/plain", body);
					}
				});
			break;
		case "/now":
			theRequest.httpReturn (200, "text/plain", new Date ());
			break;
		default:
			theRequest.httpReturn (404, "text/plain", "Not found.");
			break;
		}
	}

davehttp.start (config, handleHttpRequest);
