const productName = "httpProxy", version = "0.4.4"; 

const request = require ("request"); 
const davehttp = require ("davehttp"); 
const utils = require ("daveutils"); 

var config = {
	port: process.env.PORT || 5393,
	flLogToConsole: true,
	flPostEnabled: true,
	flAllowAccessFromAnywhere: true
	}

function handleHttpRequest (theRequest) {
	const params = theRequest.params, whenstart = new Date ();
	function return404 () {
		theRequest.httpReturn (404, "text/plain", "Not found.");
		}
	function returnPlainText (data) {
		theRequest.httpReturn (200, "text/plain", data);
		}
	function returnData (jstruct) {
		if (jstruct === undefined) {
			jstruct = {};
			}
		theRequest.httpReturn (200, "application/json", utils.jsonStringify (jstruct));
		}
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
		}
	function httpReturn (err, jstruct) {
		if (err) {
			returnError (err);
			}
		else {
			returnData (jstruct);
			}
		}
	switch (theRequest.lowermethod) {
		case "get":
			switch (theRequest.lowerpath) {
				case "/": //5/19/25 by DW
					const options = {
						url: params.url,
						encoding: null
						};
					request (options, function (err, response, body) {
						if (err) {
							theRequest.httpReturn (500, "text/plain", err.message);
							}
						else {
							const type = response.headers ["content-type"];
							theRequest.httpReturn (response.statusCode, type, body);
							}
						});
					break;
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
					return404 ();
					break;
				}
			break;
		case "post":
			switch (theRequest.lowerpath) {
				case "/httppost": //6/26/23 by DW
					var myRequest = {
						method: "POST",
						url: params.url,
						followRedirect: true, 
						body: theRequest.postBody
						};
					request (myRequest, function (err, response, data) {
						if (err) {
							returnError (err);
							}
						else {
							if (response.statusCode == 200) {
								returnPlainText (data);
								}
							else {
								const message = "http response code == " + response.statusCode;
								returnError ({message});
								}
							}
						});
					return (true);
				default:
					return404 ();
					break;
				}
			break;
		}
	}

davehttp.start (config, handleHttpRequest);
